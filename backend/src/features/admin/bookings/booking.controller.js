import {
    getBookingDetailService,
    getStatsService,
    getTopPackagesService,
    getTripsOverviewService,
    listBookingsService,
    updateBookingStatusService,
} from "./booking.service.js";

const handleError = (res, error) => {
    // Lỗi nghiệp vụ có status (400/403/404) → trả thẳng message.
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    console.error("Lỗi admin booking:", error);
    res.status(500).json({
        success: false,
        message: error.message,
    });
};

// GET /api/admin/bookings — danh sách + search + lọc status + phân trang.
export const getAllBookings = async (req, res) => {
    try {
        const result = await listBookingsService(req.query);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: result.page,
                totalPages: Math.ceil(result.total / result.limit),
                total: result.total,
                limit: result.limit,
            },
        });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/admin/bookings/stats — số liệu 3 thẻ StatCards.
export const getStats = async (req, res) => {
    try {
        const data = await getStatsService();

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/admin/bookings/trips?range=12m — done/canceled theo thời gian.
export const getTripsOverview = async (req, res) => {
    try {
        const data = await getTripsOverviewService(req.query.range);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/admin/bookings/top-packages?range=12m&limit=5 — top tour.
export const getTopPackages = async (req, res) => {
    try {
        const data = await getTopPackagesService(req.query.range, req.query.limit);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// GET /api/admin/bookings/:id — chi tiết booking + passengers.
export const getBookingDetail = async (req, res) => {
    try {
        const data = await getBookingDetailService(Number(req.params.id));

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// PUT /api/admin/bookings/:id/status — đổi trạng thái (kèm hoàn/trừ ghế).
export const updateBookingStatus = async (req, res) => {
    try {
        const data = await updateBookingStatusService(
            Number(req.params.id),
            req.body.status,
        );

        res.json({
            success: true,
            message: "Cập nhật trạng thái booking thành công",
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};
