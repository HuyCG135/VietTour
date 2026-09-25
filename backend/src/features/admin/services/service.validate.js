const isRequiredText = (value) => typeof value === "string" && value.trim().length > 0;
const isOptionalText = (value) => value === undefined || value === null || typeof value === "string";
const isValidStatus = (value) => value === undefined || value === null || value === "" || [0, 1, "0", "1"].includes(value);

export const validateService = (req, res, next) => {
    const { name, slug, description, icon, status } = req.body;
    const errors = [];

    if (!isRequiredText(name)) {
        errors.push("Tên dịch vụ không được để trống");
    } else if (name.trim().length > 255) {
        errors.push("Tên dịch vụ không được vượt quá 255 ký tự");
    }

    if (!isOptionalText(slug)) {
        errors.push("Slug phải là chuỗi");
    } else if (slug && slug.trim().length > 255) {
        errors.push("Slug không được vượt quá 255 ký tự");
    } else if (slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
        errors.push("Slug chỉ được chứa chữ thường, số và dấu gạch ngang");
    }

    if (!isOptionalText(description)) {
        errors.push("Mô tả phải là chuỗi");
    } else if (description && description.length > 10000) {
        errors.push("Mô tả không được vượt quá 10.000 ký tự");
    }

    if (!isOptionalText(icon)) {
        errors.push("Icon phải là chuỗi");
    } else if (icon && icon.trim().length > 100) {
        errors.push("Icon không được vượt quá 100 ký tự");
    } else if (icon && !/^[a-z0-9\s-]+$/i.test(icon.trim())) {
        errors.push("Icon chỉ được chứa chữ, số, khoảng trắng và dấu gạch ngang");
    }

    if (!isValidStatus(status)) {
        errors.push("Trạng thái dịch vụ không hợp lệ");
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors,
        });
    }

    next();
};
