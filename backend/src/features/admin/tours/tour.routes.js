import express from "express";
import { getAllTours, getTourFilters, getTourById, createTour, updateTour, deleteTour, uploadTourCoverImage } from "./tour.controller.js";
import { verifyToken, isTourStaff } from "../../../middlewares/auth.js";
import { validateTour } from "./tour.validate.js";
import { uploadCoverImage } from "../../../middlewares/upload.js";

const router = express.Router();

router.get("/", verifyToken, isTourStaff, getAllTours);
router.get("/filters", verifyToken, isTourStaff, getTourFilters);
router.get("/:id", verifyToken, isTourStaff, getTourById);

router.post("/", verifyToken, isTourStaff, validateTour, createTour);
router.put("/:id", verifyToken, isTourStaff, validateTour, updateTour);
router.delete("/:id", verifyToken, isTourStaff, deleteTour);

// Tải ảnh bìa lên Cloudinary (multipart/form-data, field "cover")
// Không gắn :id vì dùng được cả khi đang tạo tour mới
router.post("/cover-image", verifyToken, isTourStaff, uploadCoverImage, uploadTourCoverImage);

export default router;