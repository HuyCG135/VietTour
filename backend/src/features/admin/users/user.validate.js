// Các role hợp lệ khi admin tạo tài khoản nhân viên (đồng bộ enum users.role).
export const STAFF_ROLES = ["booking-staff", "tour-staff", "admin"];

const isRequiredText = (value) => typeof value === "string" && value.trim().length > 0;
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isValidPhone = (value) => /^0[0-9]{9}$/.test(value.trim());
// Họ tên phải có ít nhất 1 chữ cái (không cho toàn số/trống).
const isValidFullname = (value) => /[^\d\s]/.test(value.trim());

const respondInvalid = (res, errors) =>
    res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors,
    });

// Tạo tài khoản nhân viên: bắt buộc đủ vai trò, họ tên, email, phone, mật khẩu.
export const validateCreateStaff = (req, res, next) => {
    const { fullname, email, phone, password, confirmPassword, role } = req.body || {};
    const errors = [];

    if (!STAFF_ROLES.includes(role)) {
        errors.push("Vai trò không hợp lệ. Chỉ chấp nhận: booking-staff, tour-staff, admin");
    }
    if (!isRequiredText(fullname) || !isValidFullname(fullname)) {
        errors.push("Họ tên không được để trống hoặc chỉ chứa số");
    }
    if (!isRequiredText(email)) {
        errors.push("Email không được để trống");
    } else if (!isValidEmail(email)) {
        errors.push("Email không hợp lệ");
    }
    if (!isRequiredText(phone)) {
        errors.push("Số điện thoại không được để trống");
    } else if (!isValidPhone(phone)) {
        errors.push("Số điện thoại không hợp lệ (bắt đầu bằng 0 và có đúng 10 chữ số)");
    }
    if (!password || password.length < 6) {
        errors.push("Mật khẩu phải có ít nhất 6 ký tự");
    }
    if (password !== confirmPassword) {
        errors.push("Mật khẩu và xác nhận mật khẩu không khớp");
    }

    if (errors.length > 0) {
        return respondInvalid(res, errors);
    }

    next();
};

// Cập nhật user: sửa fullname/email/phone/status, không sửa role.
export const validateUpdateUser = (req, res, next) => {
    const { fullname, email, phone, status } = req.body || {};
    const errors = [];

    if (fullname !== undefined && (!isRequiredText(fullname) || !isValidFullname(fullname))) {
        errors.push("Họ tên không được để trống hoặc chỉ chứa số");
    }
    if (email !== undefined) {
        if (!isRequiredText(email)) {
            errors.push("Email không được để trống");
        } else if (!isValidEmail(email)) {
            errors.push("Email không hợp lệ");
        }
    }
    if (phone !== undefined) {
        if (!isRequiredText(phone)) {
            errors.push("Số điện thoại không được để trống");
        } else if (!isValidPhone(phone)) {
            errors.push("Số điện thoại không hợp lệ (bắt đầu bằng 0 và có đúng 10 chữ số)");
        }
    }
    if (status !== undefined && String(status) !== "1" && String(status) !== "0") {
        errors.push("Trạng thái phải là 1 (hoạt động) hoặc 0 (đã khóa)");
    }

    if (errors.length > 0) {
        return respondInvalid(res, errors);
    }

    next();
};