import express from "express";
import { getAllTours, searchTours, getToursByRegion, getTourById, createTour, updateTour, deleteTour } from "./tour.controller.js";
import { verifyToken, isAdmin } from "../../middlewares/auth.js";
import { validateTour } from "./tour.validate.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/search", searchTours);
router.get("/region/:region", getToursByRegion);
router.get("/:id", getTourById);

router.post("/", verifyToken, isAdmin, validateTour, createTour);
router.put("/:id", verifyToken, isAdmin, validateTour, updateTour);
router.delete("/:id", verifyToken, isAdmin, deleteTour);

export default router;
