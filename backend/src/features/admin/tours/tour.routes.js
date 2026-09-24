import express from "express";
import { getAllTours, getTourFilters, getTourById, createTour, updateTour, deleteTour } from "./tour.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/auth.js";
import { validateTour } from "./tour.validate.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllTours);
router.get("/filters", verifyToken, isAdmin, getTourFilters);
router.get("/:id", verifyToken, isAdmin, getTourById);

router.post("/", verifyToken, isAdmin, validateTour, createTour);
router.put("/:id", verifyToken, isAdmin, validateTour, updateTour);
router.delete("/:id", verifyToken, isAdmin, deleteTour);

export default router;