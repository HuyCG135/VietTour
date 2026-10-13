import express from "express";
import { createStaff, deleteUser, getAllUsers, updateUser } from "./user.controller.js";
import { validateCreateStaff, validateUpdateUser } from "./user.validate.js";
import { isAdmin, verifyToken } from "../../../middlewares/auth.js";

const router = express.Router();

// Quản lý user chỉ dành cho admin (verifyToken + isAdmin).
router.get("/", verifyToken, isAdmin, getAllUsers);
router.post("/staff", verifyToken, isAdmin, validateCreateStaff, createStaff);
router.put("/:id", verifyToken, isAdmin, validateUpdateUser, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

export default router;