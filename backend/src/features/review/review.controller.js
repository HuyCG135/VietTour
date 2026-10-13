import {
    getMyReviewsService,
    createReviewService,
    updateReviewService,
    deleteReviewService,
} from "./review.service.js";

const handleError = (res, error, fallbackMessage) => {
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    console.error(`${fallbackMessage}:`, error);
    res.status(500).json({
        success: false,
        message: fallbackMessage,
        error: error.message,
    });
};

export const getMyReviews = async (req, res) => {
    try {
        const reviews = await getMyReviewsService(req.user.id);

        res.json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        handleError(res, error, "Lỗi khi lấy danh sách đánh giá");
    }
};

export const createReview = async (req, res) => {
    try {
        const review = await createReviewService(req.user.id, req.body);

        res.status(201).json({
            success: true,
            message: "Đánh giá thành công!",
            data: review,
        });
    } catch (error) {
        handleError(res, error, "Lỗi khi tạo đánh giá");
    }
};

export const updateReview = async (req, res) => {
    try {
        const review = await updateReviewService(req.user.id, req.params.id, req.body);

        res.json({
            success: true,
            message: "Cập nhật đánh giá thành công",
            data: review,
        });
    } catch (error) {
        handleError(res, error, "Lỗi khi cập nhật đánh giá");
    }
};

export const deleteReview = async (req, res) => {
    try {
        await deleteReviewService(req.user.id, req.params.id);

        res.json({
            success: true,
            message: "Xóa đánh giá thành công",
        });
    } catch (error) {
        handleError(res, error, "Lỗi khi xóa đánh giá");
    }
};