import jwt from "jsonwebtoken";
import User from "./auth.repository.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../../shared/mailService.js";

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

        const verifyToken = jwt.sign(
            { userId: newUser.id },
            process.env.VERIFY_EMAIL_SECRET,
            { expiresIn: "2h" },
        );

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

        await sendVerificationEmail({ email, verifyUrl });

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
                address: user.address || "",
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
        const { fullname, phone, address } = req.body;
        const userId = req.user.id;

        const updated = await User.update(userId, {
            fullname: fullname || req.user.fullname,
            phone: phone || req.user.phone,
            address: (address && address.trim()) || null,
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
                address: updatedUser.address || "",
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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email không tồn tại trong hệ thống!",
            });
        }

        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: "Tài khoản Google không thể đặt lại mật khẩu!",
            });
        }

        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.RESET_PASS_SECRET,
            { expiresIn: "15m" },
        );

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await sendResetPasswordEmail({ email, resetUrl });

        res.json({
            success: true,
            message: "Link đặt lại mật khẩu đã được gửi đến email của bạn!",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xử lý quên mật khẩu",
            error: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.RESET_PASS_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại!",
            });
        }

        await User.updatePassword(user.id, newPassword);

        res.json({
            success: true,
            message: "Đặt lại mật khẩu thành công!",
        });
    } catch (error) {
        console.error("Reset password error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                success: false,
                message: "Link đặt lại mật khẩu đã hết hạn!",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                success: false,
                message: "Link đặt lại mật khẩu không hợp lệ!",
            });
        }

        res.status(500).json({
            success: false,
            message: "Lỗi khi đặt lại mật khẩu",
            error: error.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
        }

        const decoded = jwt.verify(token, process.env.VERIFY_EMAIL_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
        }

        if (user.is_verified) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?verified=already`);
        }

        await User.verifyEmail(user.id);

        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
        console.error("Verify email error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
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
