import express from "express";
import { getAllTours, getToursByRegion, getTourById, getTourFilters, getCalendar } from "./tour.controller.js";

const router = express.Router();

router.get("/", getAllTours);
router.get("/filters", getTourFilters);
router.get("/calendar", getCalendar);
router.get("/region/:region", getToursByRegion);
router.get("/:id", getTourById);

export default router;