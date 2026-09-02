import Booking from "./booking.repository.js";
import Tour from "../tour/tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const createBookingService = async (userId, payload) => {
    const { tour_id, booking_date, number_of_people } = payload;

    const tour = await Tour.getById(tour_id);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const total_price = tour.price * number_of_people;

    const bookingId = await Booking.create({
        user_id: userId,
        tour_id,
        booking_date,
        number_of_people,
        total_price,
        status: "pending",
    });

    return {
        id: bookingId,
        tour_name: tour.name,
        booking_date,
        number_of_people,
        total_price,
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