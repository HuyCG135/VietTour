import express from "express";
import { getAllTours, searchTours, getToursByRegion, getTourById, getTourFilters } from "./tour.controller.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/filters", getTourFilters);
router.get("/search", searchTours);
router.get("/region/:region", getToursByRegion);
router.get("/:id", getTourById);

export default router;