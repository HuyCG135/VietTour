const PHONE_REGEX = /^(0\d{9,10}|\+84\d{9,10})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PASSENGERS = 50;

export const validateBooking = (req, res, next) => {
    const { departure_id, adults, children = 0, contact_name, contact_phone, contact_email, passengers } = req.body;
    const errors = [];

    if (!departure_id || isNaN(departure_id)) {
        errors.push("ID lịch khởi hành không hợp lệ");
    }

    if (!adults || isNaN(adults) || adults < 1) {
        errors.push("Số người lớn phải từ 1 trở lên");
    } else if (adults > MAX_PASSENGERS) {
        errors.push(`Số người lớn không được vượt quá ${MAX_PASSENGERS}`);
    }

    if (children === undefined || children === null) {
        // children mặc định 0
    } else if (isNaN(children) || children < 0) {
        errors.push("Số trẻ em không hợp lệ");
    }

    const totalPax = (Number(adults) || 0) + (Number(children) || 0);
    if (totalPax < 1 || totalPax > MAX_PASSENGERS) {
        errors.push(`Tổng số hành khách phải từ 1 đến ${MAX_PASSENGERS}`);
    }

    if (!contact_name || !String(contact_name).trim()) {
        errors.push("Tên người liên hệ không được để trống");
    }

    if (!contact_phone || !PHONE_REGEX.test(String(contact_phone).trim())) {
        errors.push("Số điện thoại liên hệ không hợp lệ");
    }

    if (!contact_email || !EMAIL_REGEX.test(String(contact_email).trim())) {
        errors.push("Email liên hệ không hợp lệ");
    }

    if (passengers !== undefined && Array.isArray(passengers) && passengers.length > 0) {
        if (passengers.length !== totalPax) {
            errors.push(`Số lượng hành khách khai báo (${passengers.length}) không khớp tổng số người (${totalPax})`);
        }
        passengers.forEach((p, index) => {
            if (!p.name || !String(p.name).trim()) {
                errors.push(`Hành khách thứ ${index + 1} thiếu họ tên`);
            }
            if (!["adult", "child"].includes(p.type)) {
                errors.push(`Hành khách thứ ${index + 1} có loại không hợp lệ`);
            }
        });
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