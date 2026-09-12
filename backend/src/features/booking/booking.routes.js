import express from "express";
import { createBooking, getMyBookings, cancelBooking, getAllBookings, updateStatus, deleteBooking } from "./booking.controller.js";
import { createVNPayUrl, vnpayReturn } from "./booking.payment.controller.js";
import { verifyToken, isAdmin, isUser } from "../../middlewares/auth.js";
import { validateBooking } from "./booking.validate.js";

const router = express.Router();

router.post("/", verifyToken, isUser, validateBooking, createBooking);
router.get("/my-bookings", verifyToken, isUser, getMyBookings);
router.put("/:id/cancel", verifyToken, isUser, cancelBooking);

router.get("/", verifyToken, isAdmin, getAllBookings);
router.put("/:id/status", verifyToken, isAdmin, updateStatus);
router.delete("/:id", verifyToken, isAdmin, deleteBooking);

// ============ VNPay ============
// Callback từ cổng VNPay - public, phải đặt trước route param
router.get("/vnpay-return", vnpayReturn);

// Tạo URL thanh toán VNPay cho booking đã tồn tại
router.post("/create-payment-url", verifyToken, isUser, createVNPayUrl);

export default router;