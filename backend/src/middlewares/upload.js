import multer from "multer";
import { CLOUDINARY_MAX_FILE_SIZE, CLOUDINARY_MAX_FILES } from "../config/cloudinary.js";

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

// Giữ file trong bộ nhớ để chuyển thẳng buffer lên Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        const error = new Error(`Định dạng file "${file.originalname}" không được hỗ trợ (chỉ nhận JPG, PNG, WEBP, GIF, AVIF)`);
        error.status = 400;
        return cb(error);
    }
    cb(null, true);
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: CLOUDINARY_MAX_FILE_SIZE,
        files: CLOUDINARY_MAX_FILES,
    },
}).array("images", CLOUDINARY_MAX_FILES);

const multerSingleUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: CLOUDINARY_MAX_FILE_SIZE,
        files: 1,
    },
}).single("cover");

const MULTER_MESSAGES = {
    LIMIT_FILE_SIZE: `Kích thước ảnh vượt quá giới hạn cho phép (${Math.round(CLOUDINARY_MAX_FILE_SIZE / 1024 / 1024)} MB)`,
    LIMIT_FILE_COUNT: `Chỉ được tải lên tối đa ${CLOUDINARY_MAX_FILES} ảnh mỗi lần`,
    LIMIT_UNEXPECTED_FILE: 'Field file không hợp lệ, vui lòng chọn ảnh qua ô "Chọn ảnh"',
};

// Bọc multer để trả lỗi 400 thay vì 500 khi vượt giới hạn
const handleMulterError = (error, res, next) => {
    if (!error) return next();

    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: MULTER_MESSAGES[error.code] || "Tải ảnh lên không thành công",
        });
    }

    return next(error);
};

/** Nhận nhiều ảnh, tên field là "images" */
export const uploadImages = (req, res, next) => {
    multerUpload(req, res, (error) => handleMulterError(error, res, next));
};

/** Nhận 1 ảnh, tên field là "cover" */
export const uploadCoverImage = (req, res, next) => {
    multerSingleUpload(req, res, (error) => handleMulterError(error, res, next));
};
