const validateNumber = (value) => {
    return value !== undefined && value !== null && value !== "" && !isNaN(Number(value)) && Number(value) >= 0;
};

const validateRequiredText = (value) => {
    return value && typeof value === "string" && value.trim().length > 0;
};

export const validateTour = (req, res, next) => {
    const { name, location, region, duration, price_default, price_child, slug } = req.body;

    const errors = [];

    if (!validateRequiredText(name)) {
        errors.push("Tên tour không được để trống");
    }

    if (!validateRequiredText(location)) {
        errors.push("Địa điểm không được để trống");
    }

    if (!validateRequiredText(region)) {
        errors.push("Vùng miền không được để trống");
    }

    if (!validateRequiredText(duration)) {
        errors.push("Thời gian không được để trống");
    }

    if (!validateNumber(price_default)) {
        errors.push("Giá người lớn phải là số không âm");
    }

    if (!validateNumber(price_child)) {
        errors.push("Giá trẻ em phải là số không âm");
    }

    if (slug !== undefined && !validateRequiredText(slug)) {
        errors.push("Slug không được để trống");
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