export const validateUpdateTourServices = (req, res, next) => {
    const { service_ids: serviceIds } = req.body || {};

    if (!Array.isArray(serviceIds)) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: ["Danh sách dịch vụ phải là một mảng"],
        });
    }

    const errors = [];
    const seenIds = new Set();
    const normalizedIds = [];

    serviceIds.forEach((rawId, index) => {
        const validType = (typeof rawId === "number" || typeof rawId === "string") && String(rawId).trim() !== "";
        const id = Number(rawId);

        if (!validType || !Number.isInteger(id) || id <= 0) {
            errors.push(`Dịch vụ ở vị trí ${index + 1} không hợp lệ`);
            return;
        }

        if (seenIds.has(id)) {
            errors.push(`Dịch vụ #${id} bị chọn trùng`);
            return;
        }

        seenIds.add(id);
        normalizedIds.push(id);
    });

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors,
        });
    }

    req.body.service_ids = normalizedIds;
    next();
};
