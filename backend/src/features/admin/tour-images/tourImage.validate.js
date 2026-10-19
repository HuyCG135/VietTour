/** Kiểm tra :tourId và :imageId là số nguyên dương */
export const validateTourImageIds = (req, res, next) => {
    const errors = [];

    const check = (value, label) => {
        const num = Number(value);
        if (!Number.isInteger(num) || num <= 0) {
            errors.push(`${label} không hợp lệ`);
        }
    };

    check(req.params.tourId, "Mã tour");
    if (req.params.imageId !== undefined) {
        check(req.params.imageId, "Mã ảnh");
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
