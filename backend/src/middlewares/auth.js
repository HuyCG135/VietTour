import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET chưa được cấu hình trong biến môi trường");
}

// ================= VERIFY TOKEN =================
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || typeof authHeader !== "string") {
            return res.status(401).json({
                success: false,
                message: "Không tìm thấy token. Vui lòng đăng nhập!",
            });
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "Định dạng token không hợp lệ. Sử dụng: Bearer <token>",
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ⚠️ QUAN TRỌNG: thêm is_verified
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            is_verified: decoded.is_verified,
            fullname: decoded.fullname,
            phone: decoded.phone,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token đã hết hạn. Vui lòng đăng nhập lại!",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
        });
    }
};

// ================= REQUIRE VERIFIED =================
export const requireVerified = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Vui lòng đăng nhập!",
            });
        }

        if (!req.user.is_verified) {
            return res.status(403).json({
                success: false,
                message: "Vui lòng xác thực email trước khi thực hiện chức năng này!",
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi khi kiểm tra xác thực email",
        });
    }
};

// ================= ROLE CHECK =================
export const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập lại!",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Chỉ admin mới được phép!",
        });
    }

    next();
};

export const isUser = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Vui lòng đăng nhập để tiếp tục!",
        });
    }

    next();
};

// ================= OWNER CHECK =================
export const isOwner = (paramName = "userId") => {
    return (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    message: "Vui lòng đăng nhập lại!",
                });
            }

            const resourceUserId = req.params[paramName] || req.body[paramName];

            if (!resourceUserId) {
                return res.status(400).json({
                    success: false,
                    message: `Thiếu thông tin ${paramName}`,
                });
            }

            // Admin truy cập mọi thứ
            if (req.user.role === "admin") {
                return next();
            }

            if (parseInt(resourceUserId) !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Bạn không có quyền truy cập tài nguyên này!",
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Lỗi khi kiểm tra quyền sở hữu",
            });
        }
    };
};
