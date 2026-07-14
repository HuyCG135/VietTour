import express from "express";
import { register, login, getProfile, updateProfile, changePassword, logout, verifyTokenStatus } from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import { validateRegister, validateLogin } from "../../middlewares/validation.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);
router.post("/logout", logout);
router.get("/verify", verifyToken, verifyTokenStatus);

export default router;
