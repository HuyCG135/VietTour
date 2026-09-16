import express from "express";
import { getAllTours, getTourById, createTour, updateTour, deleteTour } from "./tour-admin.controller.js";
import { verifyToken, isAdmin } from "../../middlewares/auth.js";
import { validateTour } from "./tour-admin.validate.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllTours);
router.get("/:id", verifyToken, isAdmin, getTourById);

router.post("/", verifyToken, isAdmin, validateTour, createTour);
router.put("/:id", verifyToken, isAdmin, validateTour, updateTour);
router.delete("/:id", verifyToken, isAdmin, deleteTour);

export default router;