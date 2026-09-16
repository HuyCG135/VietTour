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