import jwt from "jsonwebtoken";
import User from "./user.model.js";
import Otp from "./otp.model.js";
import { sendVerificationOtpEmail as sendMail } from "../../shared/mailService.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            role: user.role,
            is_verified: user.is_verified,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );
};

export const register = async (req, res) => {
    try {
        const { fullname, phone, email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email đã được sử dụng!",
            });
        }

        const existingPhone = await User.findByPhone(phone);
        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "Số điện thoại đã được sử dụng!",
            });
        }

        const userId = await User.create({
            fullname,
            phone,
            email,
            password,
            role: "customer",
            is_verified: false,
        });

        const newUser = await User.findById(userId);
        const otpCode = Math.floor(100000 + Math.random() * 900000);

        await Otp.create({
            userId,
            email,
            otp: otpCode,
            type: "VERIFY_EMAIL",
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await sendMail({ email, otp: otpCode });

        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
            data: {
                user: {
                    id: newUser.id,
                    fullname: newUser.fullname,
                    phone: newUser.phone,
                    email: newUser.email,
                    role: newUser.role,
                    is_verified: newUser.is_verified,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng ký",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findByEmailOrPhone(username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email hoặc số điện thoại không đúng!",
            });
        }

        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu không đúng!",
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: "Đăng nhập thành công! Đang chuyển hướng...",
            data: {
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    phone: user.phone,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đăng nhập",
            error: error.message,
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user",
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy thông tin profile",
            error: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, phone, email } = req.body;
        const userId = req.user.id;

        if (email && email !== req.user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== userId) {
                return res.status(409).json({
                    success: false,
                    message: "Email đã được sử dụng bởi user khác!",
                });
            }
        }

        const updated = await User.update(userId, {
            fullname: fullname || req.user.fullname,
            phone: phone || req.user.phone,
            email: email || req.user.email,
            role: req.user.role,
        });

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user",
            });
        }

        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            message: "Cập nhật profile thành công!",
            data: {
                id: updatedUser.id,
                fullname: updatedUser.fullname,
                phone: updatedUser.phone,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật profile",
            error: error.message,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
            });
        }

        const user = await User.findByEmail(req.user.email);

        const isPasswordValid = await User.comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Mật khẩu hiện tại không đúng!",
            });
        }

        await User.updatePassword(userId, newPassword);

        res.json({
            success: true,
            message: "Đổi mật khẩu thành công!",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi đổi mật khẩu",
            error: error.message,
        });
    }
};

export const logout = (req, res) => {
    res.json({
        success: true,
        message: "Đăng xuất thành công!",
    });
};

export const verifyTokenStatus = (req, res) => {
    res.json({
        success: true,
        message: "Token hợp lệ",
        data: {
            user: req.user,
        },
    });
};
