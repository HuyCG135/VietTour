import express from "express";
import { getAllItineraries, getItineraryDetail, updateItinerary } from "./itinerary.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/auth.js";
import { validateUpdateItinerary } from "./itinerary.validate.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllItineraries);
router.get("/:tourId", verifyToken, isAdmin, getItineraryDetail);
router.put("/:tourId", verifyToken, isAdmin, validateUpdateItinerary, updateItinerary);

export default router;