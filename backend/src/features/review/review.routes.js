import express from "express";
import {
    getMyReviews,
    createReview,
    updateReview,
    deleteReview,
} from "./review.controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import { validateReview } from "./review.validate.js";

const router = express.Router();

router.get("/my-reviews", verifyToken, getMyReviews);
router.post("/", verifyToken, validateReview, createReview);
router.put("/:id", verifyToken, validateReview, updateReview);
router.delete("/:id", verifyToken, deleteReview);

export default router;