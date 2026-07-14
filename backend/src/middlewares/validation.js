// Validation cho đăng ký user
export const validateRegister = (req, res, next) => {
    const { fullname, phone, email, password } = req.body;
    const errors = [];

    // Kiểm tra fullname
    if (!fullname || fullname.trim().length === 0) {
        errors.push("Họ và tên không được để trống");
    } else if (fullname.trim().length < 2) {
        errors.push("Họ và tên phải có ít nhất 2 ký tự");
    }

    // Kiểm tra phone
    if (!phone || phone.trim().length === 0) {
        errors.push("Số điện thoại không được để trống");
    } else if (!/^0[0-9]{9}$/.test(phone)) {
        errors.push("Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 chữ số)");
    }

    // Kiểm tra email
    if (!email || email.trim().length === 0) {
        errors.push("Email không được để trống");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Email không hợp lệ");
        }
    }

    // Kiểm tra password
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

// Validation cho đăng nhập
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

// Validation cho tạo/cập nhật tour
export const validateTour = (req, res, next) => {
    const { name, description, price, region, duration, location } = req.body;
    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push("Tên tour không được để trống");
    }

    if (!description || description.trim().length === 0) {
        errors.push("Mô tả không được để trống");
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.push("Giá tour phải là số dương");
    }

    if (!region || region.trim().length === 0) {
        errors.push("Vùng miền không được để trống");
    }

    if (!duration || duration.trim().length === 0) {
        errors.push("Thời gian không được để trống");
    }

    if (!location || location.trim().length === 0) {
        errors.push("Địa điểm không được để trống");
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

// Validation cho tạo booking
export const validateBooking = (req, res, next) => {
    const { tour_id, booking_date, number_of_people } = req.body;
    const errors = [];

    if (!tour_id || isNaN(tour_id)) {
        errors.push("ID tour không hợp lệ");
    }

    if (!booking_date) {
        errors.push("Ngày đặt tour không được để trống");
    } else {
        const bookingDate = new Date(booking_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (bookingDate < today) {
            errors.push("Ngày đặt tour phải từ hôm nay trở đi");
        }
    }

    if (!number_of_people || isNaN(number_of_people) || number_of_people <= 0) {
        errors.push("Số người phải là số dương");
    } else if (number_of_people > 50) {
        errors.push("Số người không được vượt quá 50");
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
