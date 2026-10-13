import express from "express";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "./service.controller.js";
import { verifyToken, isTourStaff } from "../../../middlewares/auth.js";
import { validateService } from "./service.validate.js";

const router = express.Router();

router.get("/", verifyToken, isTourStaff, getAllServices);
router.get("/:id", verifyToken, isTourStaff, getServiceById);
router.post("/", verifyToken, isTourStaff, validateService, createService);
router.put("/:id", verifyToken, isTourStaff, validateService, updateService);
router.delete("/:id", verifyToken, isTourStaff, deleteService);

export default router;
