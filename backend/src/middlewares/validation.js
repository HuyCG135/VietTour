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
