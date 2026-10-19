import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Folder lưu ảnh tour trên Cloudinary (không bắt buộc, có default)
const UPLOAD_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || "travel-website";

// Kích thước file tối đa cho phép upload (mặc định 5 MB)
const MAX_FILE_SIZE = Number(process.env.CLOUDINARY_MAX_FILE_SIZE) || 5 * 1024 * 1024;

// Số ảnh tối đa trong 1 lần upload
const MAX_FILES_PER_REQUEST = Number(process.env.CLOUDINARY_MAX_FILES) || 10;

const isConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isConfigured) {
    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET,
        secure: true,
    });
}

export const CLOUDINARY_CONFIGURED = isConfigured;
export const CLOUDINARY_FOLDER = UPLOAD_FOLDER;
export const CLOUDINARY_MAX_FILE_SIZE = MAX_FILE_SIZE;
export const CLOUDINARY_MAX_FILES = MAX_FILES_PER_REQUEST;

/**
 * Trích xuất public_id từ URL Cloudinary.
 * Ví dụ: https://res.cloudinary.com/<cloud>/image/upload/v123/travel-website/dalat.jpg
 *   -> "travel-website/dalat"
 * Trả về null nếu URL không thuộc cloud đang cấu hình (để không xóa nhầm ảnh ngoài hệ thống).
 */
export const getPublicIdFromUrl = (url) => {
    if (typeof url !== "string" || !CLOUD_NAME) return null;
    if (!url.includes(`res.cloudinary.com/${CLOUD_NAME}/`)) return null;

    const withoutQuery = url.split("?")[0];
    const segments = withoutQuery
        .split("/")
        .filter(Boolean)
        .map(decodeURIComponent);

    // Bỏ qua tiền tố host + "image/upload"
    const markerIndex = segments.indexOf("upload");
    if (markerIndex === -1) return null;

    const rest = segments.slice(markerIndex + 1);
    if (rest.length === 0) return null;

    // Bỏ qua version (v1234567890) nếu có
    const path = /^v\d+$/.test(rest[0]) ? rest.slice(1) : rest;
    if (path.length === 0) return null;

    // Bỏ đuôi file
    const last = path[path.length - 1];
    path[path.length - 1] = last.replace(/\.[^.]+$/, "");

    return path.join("/");
};


// Upload 1 buffer lên Cloudinary, trả về { url, public_id }.
export const uploadBuffer = (buffer, { folder = UPLOAD_FOLDER, filename } = {}) => {
    if (!isConfigured) {
        const err = new Error(
            "Cloudinary chưa được cấu hình. Vui lòng khai báo CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET trong backend/.env",
        );
        err.status = 500;
        throw err;
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                overwrite: false,
                ...(filename ? { public_id: filename } : {}),
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            },
        );
        stream.end(buffer);
    });
};

/**
 * Xóa ảnh trên Cloudinary. Không ném lỗi nếu ảnh không tồn tại.
 */
export const destroyImage = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (!isConfigured || !publicId) return false;

    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error("❌ Cloudinary destroy error:", error.message);
        return false;
    }
};

export default cloudinary;
