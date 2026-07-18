export const validateRegister = (req, res, next) => {
    const { fullname, phone, email, password } = req.body;
    const errors = [];

    if (!fullname || fullname.trim().length === 0) {
        errors.push("Họ và tên không được để trống");
    } else if (fullname.trim().length < 2) {
        errors.push("Họ và tên phải có ít nhất 2 ký tự");
    }

    if (!phone || phone.trim().length === 0) {
        errors.push("Số điện thoại không được để trống");
    } else if (!/^0[0-9]{9}$/.test(phone)) {
        errors.push("Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 chữ số)");
    }

    if (!email || email.trim().length === 0) {
        errors.push("Email không được để trống");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Email không hợp lệ");
        }
    }

    if (!password || password.trim().length === 0) {
        errors.push("Mật khẩu không được để trống");
    } else if (password.length < 6) {
        errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors,
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || username.trim().length === 0) {
        errors.push("Email hoặc số điện thoại không được để trống");
    }

    if (!password || password.trim().length === 0) {
        errors.push("Mật khẩu không được để trống");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng điền đầy đủ thông tin",
            errors: errors,
        });
    }

    next();
};

export const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;
    const errors = [];

    if (!email || email.trim().length === 0) {
        errors.push("Email không được để trống");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Email không hợp lệ");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors,
        });
    }

    next();
};

export const validateResetPassword = (req, res, next) => {
    const { token, newPassword } = req.body;
    const errors = [];

    if (!token || token.trim().length === 0) {
        errors.push("Token không hợp lệ");
    }

    if (!newPassword || newPassword.trim().length === 0) {
        errors.push("Mật khẩu mới không được để trống");
    } else if (newPassword.length < 6) {
        errors.push("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors,
        });
    }

    next();
};
