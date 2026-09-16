const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

const validateRating = (value) => {
    const rating = Number(value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw createHttpError(400, "Điểm đánh giá phải là số nguyên từ 1 đến 5 sao");
    }
    return rating;
};

// Validate body cho POST / và PUT /:id
export const validateReview = (req, res, next) => {
    try {
        const { tour_id, rating, comment } = req.body ?? {};

        if (req.method === "POST") {
            const tourId = Number(tour_id);
            if (!tourId || !Number.isInteger(tourId)) {
                throw createHttpError(400, "Thiếu hoặc sai tour_id");
            }
            req.body.tour_id = tourId;
        }

        const validatedRating = validateRating(rating);
        if (comment !== undefined && typeof comment !== "string") {
            throw createHttpError(400, "Nội dung bình luận phải là chuỗi");
        }
        if (typeof comment === "string" && comment.trim().length > 2000) {
            throw createHttpError(400, "Nội dung bình luận tối đa 2000 ký tự");
        }

        // Chuẩn hóa dữ liệu cho service dùng tiếp
        req.body.rating = validatedRating;
        req.body.comment = typeof comment === "string" ? comment.trim().slice(0, 2000) : "";

        next();
    } catch (error) {
        next(error);
    }
};