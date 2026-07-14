import Booking from "./booking.model.js";
import Tour from "../tour/tour.model.js";

export const createBooking = async (req, res) => {
    try {
        const { tour_id, booking_date, number_of_people } = req.body;
        const user_id = req.user.id;

        const tour = await Tour.getById(tour_id);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tour",
            });
        }

        const total_price = tour.price * number_of_people;

        const bookingId = await Booking.create({
            user_id,
            tour_id,
            booking_date,
            number_of_people,
            total_price,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Đặt tour thành công!",
            data: {
                id: bookingId,
                tour_name: tour.name,
                booking_date,
                number_of_people,
                total_price,
                status: "pending",
            },
        });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đặt tour",
            error: error.message,
        });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.getByUserId(userId);

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.error("Get my bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách đặt tour",
            error: error.message,
        });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;

        const booking = await Booking.getById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking",
            });
        }

        if (booking.user_id !== userId && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền hủy booking này",
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Chỉ có thể hủy booking đang chờ xác nhận",
            });
        }

        await Booking.updateStatus(bookingId, "cancelled");

        res.json({
            success: true,
            message: "Hủy booking thành công",
        });
    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi hủy booking",
            error: error.message,
        });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.getAll();

        res.json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        console.error("Get all bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách bookings",
            error: error.message,
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { status } = req.body;

        const validStatuses = ["pending", "confirmed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ. Chỉ chấp nhận: pending, confirmed, cancelled",
            });
        }

        const updated = await Booking.updateStatus(bookingId, status);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking",
            });
        }

        res.json({
            success: true,
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật trạng thái",
            error: error.message,
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const deleted = await Booking.delete(bookingId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy booking",
            });
        }

        res.json({
            success: true,
            message: "Xóa booking thành công",
        });
    } catch (error) {
        console.error("Delete booking error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa booking",
            error: error.message,
        });
    }
};
