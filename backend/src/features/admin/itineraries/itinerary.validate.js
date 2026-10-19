export const validateUpdateItinerary = (req, res, next) => {
    const { itineraries } = req.body || {};

    if (!Array.isArray(itineraries) || itineraries.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: ["Phải có ít nhất một ngày trong lịch trình"],
        });
    }

    const errors = [];
    const seenDays = new Set();

    itineraries.forEach((item, index) => {
        const day = Number(item?.day_number);
        const description = item?.description;

        if (!Number.isInteger(day) || day <= 0) {
            errors.push(`Ngày ở dòng ${index + 1} phải là số nguyên dương`);
        } else if (seenDays.has(day)) {
            errors.push(`Ngày ${day} bị trùng trong lịch trình`);
        } else {
            seenDays.add(day);
        }

        if (typeof description !== "string" || !description.trim()) {
            errors.push(`Nội dung chi tiết ở dòng ${index + 1} không được để trống`);
        }
    });

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors,
        });
    }

    next();
};