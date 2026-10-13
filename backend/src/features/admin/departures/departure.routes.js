import express from "express";
import {
    createDeparture,
    deleteDeparture,
    getAllDepartures,
    getDepartureById,
    getDepartureTours,
    updateDeparture,
    updateDepartureStatus,
} from "./departure.controller.js";
import { validateCreateDeparture, validateStatus, validateUpdateDeparture } from "./departure.validate.js";
import { isTourStaff, verifyToken } from "../../../middlewares/auth.js";

const router = express.Router();

// Chú ý: "/tours" phải đặt TRƯỚC "/:id" để không bị nuốt thành id="tours".
router.get("/tours", verifyToken, isTourStaff, getDepartureTours);

router.get("/", verifyToken, isTourStaff, getAllDepartures);
router.get("/:id", verifyToken, isTourStaff, getDepartureById);

router.post("/", verifyToken, isTourStaff, validateCreateDeparture, createDeparture);
router.put("/:id", verifyToken, isTourStaff, validateUpdateDeparture, updateDeparture);
router.put("/:id/status", verifyToken, isTourStaff, validateStatus, updateDepartureStatus);
router.delete("/:id", verifyToken, isTourStaff, deleteDeparture);

export default router;