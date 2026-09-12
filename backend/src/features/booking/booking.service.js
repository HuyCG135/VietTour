import Booking from "./booking.repository.js";
import Tour from "../tour/tour.repository.js";
import { ProductCode, VnpLocale, dateFormat } from "vnpay";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const createBookingService = async (userId, role, payload) => {
    if (role !== "customer" && role !== "admin") {
        throw createHttpError(403, "Chỉ tài khoản khách hàng mới có thể đặt tour");
    }

    const {
        departure_id,
        adults,
        children = 0,
        contact_name,
        contact_phone,
        contact_email,
        note,
        passengers,
    } = payload;

    const departure = await Booking.getDeparture(departure_id);
    if (!departure) {
        throw createHttpError(404, "Không tìm thấy lịch khởi hành");
    }

    if (departure.status === "closed" || departure.status === "full") {
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
        note,
        passengers,
    });

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

export const getAllBookingsService = async () => {
    return Booking.getAll();
};

export const cancelBookingService = async (userId, role, bookingId) => {
    const booking = await Booking.getById(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    if (booking.user_id !== userId && role !== "admin") {
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

// Tạo URL thanh toán cho booking đã tồn tại (đã tạo trước với payment_status = unpaid)
export const createPaymentUrlService = async (req, bookingId, vnpay) => {
    if (!bookingId || isNaN(bookingId)) {
        throw createHttpError(400, "Thiếu booking_id");
    }

    const booking = await Booking.getByIdWithDeparture(bookingId);
    if (!booking) {
        throw createHttpError(404, "Không tìm thấy booking");
    }

    // Kiểm tra quyền sở hữu
    if (String(booking.user_id) !== String(req.user.id) && req.user.role !== "admin") {
        throw createHttpError(403, "Bạn không có quyền thanh toán booking này");
    }

    if (booking.payment_status === "paid") {
        throw createHttpError(400, "Booking này đã được thanh toán");
    }

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

    const ipAddr =
        req.headers?.["x-forwarded-for"] ||
        req.socket?.remoteAddress ||
        req.ip ||
        "127.0.0.1";

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