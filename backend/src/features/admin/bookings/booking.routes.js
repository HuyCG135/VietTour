import express from "express";
import {
    getAllBookings,
    getBookingDetail,
    getStats,
    getTopPackages,
    getTripsOverview,
    updateBookingStatus,
} from "./booking.controller.js";
import {
    validateIdParam,
    validateListQuery,
    validateRangeQuery,
    validateStatusUpdate,
    validateTopPackagesQuery,
} from "./booking.validate.js";
import { isBookingStaff, verifyToken } from "../../../middlewares/auth.js";

const router = express.Router();

// Route tĩnh phải khai báo TRƯỚC "/:id" để không bị nuốt thành id.
router.get("/stats", verifyToken, isBookingStaff, getStats);
router.get("/trips", verifyToken, isBookingStaff, validateRangeQuery, getTripsOverview);
router.get(
    "/top-packages",
    verifyToken,
    isBookingStaff,
    validateTopPackagesQuery,
    getTopPackages,
);

router.get("/", verifyToken, isBookingStaff, validateListQuery, getAllBookings);
router.get("/:id", verifyToken, isBookingStaff, validateIdParam, getBookingDetail);
router.put(
    "/:id/status",
    verifyToken,
    isBookingStaff,
    validateStatusUpdate,
    updateBookingStatus,
);

export default router;
