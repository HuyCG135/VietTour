import Review from "./review.repository.js";
import Tour from "../tour/tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getMyReviewsService = async (userId) => {
    return Review.getByUserId(userId);
};

export const createReviewService = async (userId, payload) => {
    const tourId = payload.tour_id;
    const rating = payload.rating;
    const comment = payload.comment;

    const tour = await Tour.getById(tourId);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const existing = await Review.findForUserAndTour(userId, tourId);
    if (existing) {
        throw createHttpError(400, "Bạn đã đánh giá tour này rồi");
    }

    const id = await Review.create({ user_id: userId, tour_id: tourId, rating, comment });
    return { id, tour_id: tourId, rating, comment };
};

export const updateReviewService = async (userId, reviewId, payload) => {
    const review = await Review.getById(reviewId);
    if (!review) {
        throw createHttpError(404, "Không tìm thấy đánh giá");
    }
    if (String(review.user_id) !== String(userId)) {
        throw createHttpError(403, "Bạn không có quyền sửa đánh giá này");
    }

    await Review.update(reviewId, { rating: payload.rating, comment: payload.comment });
    return { id: Number(reviewId), rating: payload.rating, comment: payload.comment };
};

export const deleteReviewService = async (userId, reviewId) => {
    const review = await Review.getById(reviewId);
    if (!review) {
        throw createHttpError(404, "Không tìm thấy đánh giá");
    }
    if (String(review.user_id) !== String(userId)) {
        throw createHttpError(403, "Bạn không có quyền xóa đánh giá này");
    }

    await Review.remove(reviewId);
}