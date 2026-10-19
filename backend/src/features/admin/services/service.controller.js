import {
    listServicesAdminService,
    getServiceByIdAdminService,
    createServiceAdminService,
    updateServiceAdminService,
    deleteServiceAdminService,
} from "./service.service.js";

const handleError = (res, error) => {
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "Slug dịch vụ đã tồn tại, vui lòng chọn slug khác",
        });
    }

    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: "Không thể xử lý dịch vụ",
    });
};

export const getAllServices = async (req, res) => {
    try {
        const { q, status, sort, page, limit } = req.query;
        const result = await listServicesAdminService({ q, status, sort, page, limit });

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: result.page,
                totalPages: Math.ceil(result.total / result.limit),
                total: result.total,
                limit: result.limit,
            },
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getServiceById = async (req, res) => {
    try {
        const service = await getServiceByIdAdminService(req.params.id);
        res.json({ success: true, data: service });
    } catch (error) {
        handleError(res, error);
    }
};

export const createService = async (req, res) => {
    try {
        const service = await createServiceAdminService(req.body);
        res.status(201).json({
            success: true,
            message: "Tạo dịch vụ thành công",
            data: service,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await updateServiceAdminService(req.params.id, req.body);
        res.json({
            success: true,
            message: "Cập nhật dịch vụ thành công",
            data: service,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteService = async (req, res) => {
    try {
        await deleteServiceAdminService(req.params.id);
        res.json({ success: true, message: "Xóa dịch vụ thành công" });
    } catch (error) {
        handleError(res, error);
    }
};
