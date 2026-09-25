import express from "express";
import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "./service.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/auth.js";
import { validateService } from "./service.validate.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllServices);
router.get("/:id", verifyToken, isAdmin, getServiceById);
router.post("/", verifyToken, isAdmin, validateService, createService);
router.put("/:id", verifyToken, isAdmin, validateService, updateService);
router.delete("/:id", verifyToken, isAdmin, deleteService);

export default router;
