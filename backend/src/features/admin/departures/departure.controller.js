import {
    createDepartureService,
    deleteDepartureService,
    getDepartureByIdService,
    listDeparturesService,
    listToursForSelectService,
    updateDepartureService,
    updateDepartureStatusService,
} from "./departure.service.js";

const handleError = (res, error) => {
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    res.status(500).json({
        success: false,
        message: error.message,
    });
};

export const getAllDepartures = async (req, res) => {
    try {
        const result = await listDeparturesService(req.query);

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

export const getDepartureById = async (req, res) => {
    try {
        const departure = await getDepartureByIdService(Number(req.params.id));

        res.json({
            success: true,
            data: departure,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const createDeparture = async (req, res) => {
    try {
        const departure = await createDepartureService(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo chuyến khởi hành thành công",
            data: departure,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateDeparture = async (req, res) => {
    try {
        const departure = await updateDepartureService(Number(req.params.id), req.body);

        res.json({
            success: true,
            message: "Cập nhật chuyến khởi hành thành công",
            data: departure,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateDepartureStatus = async (req, res) => {
    try {
        const departure = await updateDepartureStatusService(
            Number(req.params.id),
            req.body.status,
        );

        res.json({
            success: true,
            message:
                req.body.status === "closed"
                    ? "Đã đóng chuyến khởi hành"
                    : "Đã mở lại chuyến khởi hành",
            data: departure,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteDeparture = async (req, res) => {
    try {
        await deleteDepartureService(Number(req.params.id));

        res.json({
            success: true,
            message: "Xóa chuyến khởi hành thành công",
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getDepartureTours = async (req, res) => {
    try {
        const tours = await listToursForSelectService();

        res.json({
            success: true,
            data: tours,
        });
    } catch (error) {
        handleError(res, error);
    }
};