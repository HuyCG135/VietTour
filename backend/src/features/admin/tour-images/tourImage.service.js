import TourImage from "./tourImage.repository.js";
import { uploadBuffer, destroyImage, CLOUDINARY_CONFIGURED } from "../../../config/cloudinary.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

/** Bỏ dấu tiếng Việt + ký tự đặc biệt để tạo tên file an toàn trên Cloudinary */
const slugify = (value) =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/gi, "d")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
        .slice(0, 60);

export const listTourImagesService = async (query = {}) => {
    return TourImage.listTours({
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getTourImagesService = async (tourId) => {
    const detail = await TourImage.getTourDetail(tourId);
    if (!detail) {
        throw createHttpError(404, "Không tìm thấy tour");
    }
    return detail;
};

/**
 * Upload ảnh từ thiết bị lên Cloudinary rồi lưu đường dẫn vào DB.
 * @param {string} tourId
 * @param {Array<{buffer: Buffer, originalname: string}>} files
 */
export const uploadTourImagesService = async (tourId, files) => {
    if (!files || files.length === 0) {
        throw createHttpError(400, "Vui lòng chọn ít nhất một ảnh để tải lên");
    }

    if (!CLOUDINARY_CONFIGURED) {
        throw createHttpError(
            500,
            "Cloudinary chưa được cấu hình. Vui lòng khai báo CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong backend/.env",
        );
    }

    const tour = await TourImage.getTourDetail(tourId);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const uploadedUrls = [];
    const failed = [];

    for (const file of files) {
        const baseName = slugify(file.originalname?.replace(/\.[^.]+$/, "")) || "tour-image";
        try {
            const result = await uploadBuffer(file.buffer, {
                filename: `${baseName}-${Date.now()}`,
            });
            uploadedUrls.push(result.url);
        } catch (error) {
            failed.push(`${file.originalname}: ${error.message}`);
        }
    }

    if (uploadedUrls.length === 0) {
        throw createHttpError(500, `Tải ảnh lên Cloudinary thất bại. ${failed[0] || ""}`.trim());
    }

    const created = await TourImage.createMany(tourId, uploadedUrls);

    return {
        created,
        failed,
        message:
            failed.length > 0
                ? `Đã tải lên ${created.length} ảnh, ${failed.length} ảnh bị lỗi`
                : `Đã tải lên ${created.length} ảnh thành công`,
    };
};

/** Xóa ảnh khỏi DB và xóa file trên Cloudinary (nếu thuộc cloud đang cấu hình) */
export const deleteTourImageService = async (tourId, imageId) => {
    const image = await TourImage.getByTourAndId(tourId, imageId);
    if (!image) {
        throw createHttpError(404, "Không tìm thấy ảnh thuộc tour này");
    }

    const deleted = await TourImage.delete(imageId);
    if (!deleted) {
        throw createHttpError(404, "Không tìm thấy ảnh");
    }

    await destroyImage(image.image);

    return { id: imageId, image: image.image };
};
