import {
    listTourServicesAdminService,
    getTourServiceDetailAdminService,
    updateTourServicesAdminService,
} from "./tour-service.service.js";

const handleError = (res, error) => {
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
            success: false,
            message: "Dữ liệu tham chiếu không tồn tại",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Không thể xử lý dịch vụ tour",
    });
};

export const getAllTourServices = async (req, res) => {
    try {
        const { q, region, sort, page, limit } = req.query;
        const result = await listTourServicesAdminService({ q, region, sort, page, limit });

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

export const getTourServiceDetail = async (req, res) => {
    try {
        const detail = await getTourServiceDetailAdminService(req.params.tourId);
        res.json({ success: true, data: detail });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateTourServices = async (req, res) => {
    try {
        const detail = await updateTourServicesAdminService(req.params.tourId, req.body.service_ids);
        res.json({
            success: true,
            message: "Cập nhật dịch vụ tour thành công",
            data: detail,
        });
    } catch (error) {
        handleError(res, error);
    }
};
