import Tour from "./tour.repository.js";
import { uploadBuffer, destroyImage, CLOUDINARY_CONFIGURED } from "../../../config/cloudinary.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const listToursAdminService = async (query = {}) => {
    return Tour.list({
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        min_price: query.min_price,
        max_price: query.max_price,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getTourFiltersAdminService = async () => {
    return Tour.getFilterOptions();
};

export const getTourByIdAdminService = async (id) => {
    const tour = await Tour.getById(id);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    return tour;
};

export const createTourService = async (tourData) => {
    const tourId = await Tour.create(tourData);
    return Tour.getById(tourId);
};

export const updateTourService = async (id, tourData) => {
    const existing = await Tour.getById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const updated = await Tour.update(id, tourData);
    if (!updated) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    // Đã đổi ảnh bìa thì dọn ảnh cũ trên Cloudinary
    if (tourData.cover_image && tourData.cover_image !== existing.cover_image) {
        await cleanupOldCoverImage(existing.cover_image, tourData.cover_image);
    }

    return Tour.getById(id);
};

export const deleteTourService = async (id) => {
    const deleted = await Tour.delete(id);
    if (!deleted) {
        throw createHttpError(404, "Không tìm thấy tour");
    }
};

const slugifyFileName = (value) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
        .slice(0, 60);

/**
 * Tải ảnh bìa lên Cloudinary và trả về URL.
 * Không ghi DB — frontend lưu URL vào tours.cover_image khi submit form,
 * nhờ vậy dùng được cả khi đang tạo tour mới (tour chưa có id).
 */
export const uploadCoverImageService = async (file) => {
    if (!file || !file.buffer) {
        throw createHttpError(400, "Vui lòng chọn một ảnh để tải lên");
    }

    if (!CLOUDINARY_CONFIGURED) {
        throw createHttpError(
            500,
            "Cloudinary chưa được cấu hình. Vui lòng khai báo CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong backend/.env",
        );
    }

    const baseName = slugifyFileName(file.originalname?.replace(/\.[^.]+$/, "")) || "cover";

    try {
        const result = await uploadBuffer(file.buffer, {
            folder: "cover-images",
            filename: `${baseName}-${Date.now()}`,
        });
        return { cover_image: result.url, public_id: result.public_id };
    } catch (error) {
        throw createHttpError(500, `Tải ảnh bìa lên Cloudinary thất bại: ${error.message}`);
    }
};

/** Xóa ảnh bìa cũ khỏi Cloudinary sau khi đã thay bằng ảnh mới */
export const cleanupOldCoverImage = async (oldUrl, newUrl) => {
    if (!oldUrl || oldUrl === newUrl) return;
    await destroyImage(oldUrl);
};