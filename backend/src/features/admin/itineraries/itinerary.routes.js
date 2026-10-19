import express from "express";
import { getAllItineraries, getItineraryDetail, updateItinerary } from "./itinerary.controller.js";
import { verifyToken, isTourStaff } from "../../../middlewares/auth.js";
import { validateUpdateItinerary } from "./itinerary.validate.js";

const router = express.Router();

router.get("/", verifyToken, isTourStaff, getAllItineraries);
router.get("/:tourId", verifyToken, isTourStaff, getItineraryDetail);
router.put("/:tourId", verifyToken, isTourStaff, validateUpdateItinerary, updateItinerary);

export default router;