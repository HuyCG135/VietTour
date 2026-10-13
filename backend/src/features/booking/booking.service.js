import Booking from "./booking.repository.js";
import Tour from "../tour/tour.repository.js";
import jwt from "jsonwebtoken";
import { ProductCode, VnpLocale, dateFormat } from "vnpay";
import { sendBookingPaymentEmail } from "../../shared/mailService.js";
import { ROLE, BOOKING_MANAGEMENT } from "../../middlewares/auth.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const createBookingService = async (userId, role, payload) => {
    if (role !== ROLE.CUSTOMER && role !== ROLE.ADMIN) {
        throw createHttpError(403, "Chỉ tài khoản khách hàng mới có thể đặt tour");
    }

    const {
        departure_id,
        adults,
        children = 0,
        contact_name,
        contact_phone,
        contact_email,
        contact_dob,
        contact_gender,
        note,
        passengers,
    } = payload;

    const departure = await Booking.getDeparture(departure_id);
    if (!departure) {
        throw createHttpError(404, "Không tìm thấy lịch khởi hành");
    }

    if (
        departure.status === "closed" ||
        departure.status === "full" ||
        Number(departure.seats_available) <= 0
    ) {
        throw createHttpError(400, "Lịch khởi hành này hiện không nhận đặt chỗ");
    }

    // Chặn đặt tour đã đi qua ngày
    const depDate = new Date(departure.departure_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (depDate < today) {
        throw createHttpError(400, "Lịch khởi hành này đã qua ngày, không thể đặt tour");
    }

    const adultCount = Number(adults);
    const childCount = Number(children);
    const totalPax = adultCount + childCount;

    if (totalPax > departure.seats_available) {
        throw createHttpError(
            400,
            `Số lượng khách vượt quá chỗ trống còn lại (${departure.seats_available} chỗ)`,
        );
    }

    const tour = await Tour.getById(departure.tour_id);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    // Giá tính server-side: (giá tour + chi phí di chuyển) theo từng loại
    const adultUnitPrice =
        Number(tour.price_default) + Number(departure.price_moving || 0);
    const childUnitPrice =
        Number(tour.price_child) + Number(departure.price_moving_child || 0);
    const total_price = adultCount * adultUnitPrice + childCount * childUnitPrice;

    const bookingId = await Booking.createWithPassengers({
        user_id: userId,
        departure_id,
        adults: adultCount,
        children: childCount,
        total_price,
        contact_name: contact_name.trim(),
        contact_phone: contact_phone.trim(),
        contact_email: contact_email.trim(),
        contact_dob: contact_dob || null,
        contact_gender: contact_gender || null,
        note,
        passengers,
    });

    // Gửi email kèm link thanh toán (thanh toán ngay hoặc thanh toán sau từ email).
    // Gửi bất đồng bộ (fire-and-forget) để không làm chậm việc tạo đơn; lỗi gửi KHÔNG fail đơn.
    try {
        const token = jwt.sign(
            { bookingId, purpose: "booking_payment" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const paymentUrl = `${baseUrl}/payment/${bookingId}?token=${token}`;
        sendBookingPaymentEmail({
            email: contact_email.trim(),
            bookingId,
            amount: total_price,
            paymentUrl,
        }).catch((err) => console.error("Gửi email thanh toán thất bại (không ảnh hưởng đơn đặt tour):", err.message));
    } catch (err) {
        console.error("Không tạo được link thanh toán (không ảnh hưởng đơn đặt tour):", err.message);
    }

    return {
        id: bookingId,
        tour_name: tour.name,
        departure_id,
        departure_date: departure.departure_date,
        adults: adultCount,
        children: childCount,
        total_price,
        payment_status: "unpaid",
        status: "pending",
    };
};

export const getMyBookingsService = async (userId) => {
    return Booking.getByUserId(userId);
};

export const getBookingDetailService = async (userId, role, bookingId) => {
    const booking = await Booking.getDetailForUser(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    if (String(booking.user_id) !== String(userId) && !BOOKING_MANAGEMENT.includes(role)) {
        throw createHttpError(403, "Bạn không có quyền xem booking này");
    }

    const passengers = await Booking.getPassengersByBookingId(bookingId);
    return { ...booking, passengers };
};

export const getAllBookingsService = async () => {
    return Booking.getAll();
};

export const cancelBookingService = async (userId, role, bookingId) => {
    const booking = await Booking.getById(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    if (booking.user_id !== userId && !BOOKING_MANAGEMENT.includes(role)) {
        throw createHttpError(403, "Bạn không có quyền hủy booking này");
    }

    if (booking.status !== "pending") {
        throw createHttpError(400, "Chỉ có thể hủy booking đang chờ xác nhận");
    }

    await Booking.updateStatus(bookingId, "cancelled");

    // Hoàn trả ghế cho lịch khởi hành
    const totalPax = (booking.adults || 0) + (booking.children || 0);
    await Booking.restoreSeats(booking.departure_id, totalPax);
};

export const updateStatusService = async (bookingId, status) => {
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw createHttpError(400, "Trạng thái không hợp lệ. Chỉ chấp nhận: pending, confirmed, cancelled");
    }

    const updated = await Booking.updateStatus(bookingId, status);
    if (!updated) {
        throw createHttpError(404, "Không tìm thấy booking");
    }
};

export const deleteBookingService = async (bookingId) => {
    const deleted = await Booking.delete(bookingId);
    if (!deleted) {
        throw createHttpError(404, "Không tìm thấy booking");
    }
};

// ================= VNPay =================

// Dựng URL thanh toán VNPay (dùng chung cho thanh toán ngay & thanh toán từ email)
const buildVnpayUrl = async (booking, ipAddr, vnpay) => {
    const { VNP_RETURN_URL } = process.env;
    if (!VNP_RETURN_URL) {
        throw createHttpError(500, "Thiếu VNP_RETURN_URL trong cấu hình");
    }

    // Loại bỏ ký tự đặc biệt trong tên tour (VNPay dễ lỗi với ký tự lạ)
    const safeTourName = String(booking.tour_name || "").replace(/[^\w\s]/gi, "");
    const orderInfo = `Thanh toan tour ${safeTourName} BOK${booking.id}`.slice(0, 250);

    const uniqueStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const txnRef = `BOK${booking.id}_${Date.now()}_${uniqueStr}`;

    const expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes() + 30);

    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: Number(booking.total_price),
        vnp_IpAddr: ipAddr,
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: VNP_RETURN_URL,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(expireDate),
    });

    return typeof vnpayResponse === "string" ? vnpayResponse : vnpayResponse.url || vnpayResponse.paymentUrl;
};

const getClientIp = (req) =>
    req.headers?.["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "127.0.0.1";

// Kiểm tra token ký riêng cho phép thanh toán 1 booking cụ thể (link trong email)
const verifyPaymentToken = (bookingId, token) => {
    if (!token) {
        throw createHttpError(401, "Thiếu token thanh toán");
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        throw createHttpError(401, "Token thanh toán không hợp lệ hoặc đã hết hạn");
    }
    if (decoded.purpose !== "booking_payment" || String(decoded.bookingId) !== String(bookingId)) {
        throw createHttpError(403, "Token thanh toán không khớp đơn này");
    }
    return decoded;
};

// Tạo URL thanh toán cho booking đã tồn tại (đã tạo trước với payment_status = unpaid)
// Luồng: thanh toán ngay khi đang đăng nhập
export const createPaymentUrlService = async (req, bookingId, vnpay) => {
    if (!bookingId || isNaN(bookingId)) {
        throw createHttpError(400, "Thiếu booking_id");
    }

    const booking = await Booking.getByIdWithDeparture(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    // Kiểm tra quyền sở hữu
    if (String(booking.user_id) !== String(req.user.id) && !BOOKING_MANAGEMENT.includes(req.user.role)) {
        throw createHttpError(403, "Bạn không có quyền thanh toán booking này");
    }

    if (booking.payment_status === "paid") {
        throw createHttpError(400, "Booking này đã được thanh toán");
    }

    return buildVnpayUrl(booking, getClientIp(req), vnpay);
};

// Thông tin tóm tắt đơn cho trang thanh toán public (từ link email)
export const getPaymentSummaryService = async (bookingId, token) => {
    if (!bookingId || isNaN(bookingId)) {
        throw createHttpError(400, "Thiếu booking_id");
    }
    verifyPaymentToken(bookingId, token);

    const booking = await Booking.getByIdWithDeparture(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    return {
        id: booking.id,
        tour_name: booking.tour_name,
        departure_date: booking.departure_date,
        departure_location: booking.departure_location,
        adults: booking.adults,
        children: booking.children,
        total_price: booking.total_price,
        contact_name: booking.contact_name,
        payment_status: booking.payment_status,
        status: booking.status,
    };
};

// Tạo URL thanh toán từ link email (không cần đăng nhập, dựa trên token ký riêng)
export const payLaterService = async (bookingId, token, vnpay, req) => {
    if (!bookingId || isNaN(bookingId)) {
        throw createHttpError(400, "Thiếu booking_id");
    }
    verifyPaymentToken(bookingId, token);

    const booking = await Booking.getByIdWithDeparture(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    if (booking.payment_status === "paid") {
        throw createHttpError(400, "Đơn này đã được thanh toán");
    }

    if (booking.status === "cancelled") {
        throw createHttpError(400, "Đơn này đã bị hủy, không thể thanh toán");
    }

    return buildVnpayUrl(booking, getClientIp(req), vnpay);
};

// Xác nhận thanh toán thành công: payment_status -> paid, status -> confirmed
export const confirmPaymentService = async (bookingId) => {
    const booking = await Booking.getById(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    // Idempotent: nếu đã paid rồi thì không đổi gì thêm
    if (booking.payment_status === "paid") {
        return booking;
    }

    const updated = await Booking.markPaid(bookingId);
    if (!updated) {
        throw createHttpError(500, "Không thể cập nhật trạng thái thanh toán");
    }

    return booking;
};