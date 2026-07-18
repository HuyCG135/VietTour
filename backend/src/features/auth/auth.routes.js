import express from "express";
import { register, login, getProfile, updateProfile, changePassword, logout, verifyTokenStatus, verifyEmail, forgotPassword, resetPassword } from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.js";
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from "./auth.validate.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/verify", verifyToken, verifyTokenStatus);
router.get("/verify-email", verifyEmail);
router.post("/change-password", verifyToken, changePassword);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);
router.post("/logout", logout);

export default router;
