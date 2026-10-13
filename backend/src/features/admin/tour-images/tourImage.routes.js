import express from "express";
import {
    getAllTourImages,
    getTourImageDetail,
    uploadTourImages,
    deleteTourImage,
} from "./tourImage.controller.js";
import { verifyToken, isTourStaff } from "../../../middlewares/auth.js";
import { uploadImages } from "../../../middlewares/upload.js";
import { validateTourImageIds } from "./tourImage.validate.js";

const router = express.Router();

// Danh sách tour kèm số lượng ảnh
router.get("/", verifyToken, isTourStaff, getAllTourImages);
// Tải ảnh lên Cloudinary (multipart/form-data, field "images")
router.post("/:tourId/images", verifyToken, isTourStaff, validateTourImageIds, uploadImages, uploadTourImages);
// Toàn bộ ảnh của 1 tour
router.get("/:tourId", verifyToken, isTourStaff, validateTourImageIds, getTourImageDetail);
// Xóa 1 ảnh khỏi tour (DB + Cloudinary)
router.delete("/:tourId/images/:imageId", verifyToken, isTourStaff, validateTourImageIds, deleteTourImage);

export default router;
