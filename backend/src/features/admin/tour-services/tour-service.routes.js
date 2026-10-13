import express from "express";
import {
    getAllTourServices,
    getTourServiceDetail,
    updateTourServices,
} from "./tour-service.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/auth.js";
import { validateUpdateTourServices } from "./tour-service.validate.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllTourServices);
router.get("/:tourId", verifyToken, isAdmin, getTourServiceDetail);
router.put("/:tourId", verifyToken, isAdmin, validateUpdateTourServices, updateTourServices);

export default router;
