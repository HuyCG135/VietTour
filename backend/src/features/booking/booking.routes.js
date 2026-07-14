import express from "express";
import { createBooking, getMyBookings, cancelBooking, getAllBookings, updateStatus, deleteBooking } from "./booking.controller.js";
import { verifyToken, isAdmin, isUser } from "../../middlewares/auth.js";
import { validateBooking } from "../../middlewares/validation.js";

const router = express.Router();

router.post("/", verifyToken, isUser, validateBooking, createBooking);
router.get("/my-bookings", verifyToken, isUser, getMyBookings);
router.put("/:id/cancel", verifyToken, isUser, cancelBooking);

router.get("/", verifyToken, isAdmin, getAllBookings);
router.put("/:id/status", verifyToken, isAdmin, updateStatus);
router.delete("/:id", verifyToken, isAdmin, deleteBooking);

export default router;
