import {
    listToursAdminService,
    getTourFiltersAdminService,
    getTourByIdAdminService,
    createTourService,
    updateTourService,
    deleteTourService,
} from "./tour.service.js";

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

export const getAllTours = async (req, res) => {
    try {
        const { q, region, min_price, max_price, sort, page, limit } = req.query;
        const result = await listToursAdminService({
            q, region, min_price, max_price, sort, page, limit,
        });

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

export const getTourFilters = async (req, res) => {
    try {
        const filters = await getTourFiltersAdminService();

        res.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await getTourByIdAdminService(req.params.id);

        res.json({
            success: true,
            data: tour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const createTour = async (req, res) => {
    try {
        const createdTour = await createTourService(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo tour thành công",
            data: createdTour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateTour = async (req, res) => {
    try {
        const updatedTour = await updateTourService(req.params.id, req.body);

        res.json({
            success: true,
            message: "Cập nhật tour thành công",
            data: updatedTour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteTour = async (req, res) => {
    try {
        await deleteTourService(req.params.id);

        res.json({
            success: true,
            message: "Xóa tour thành công",
        });
    } catch (error) {
        handleError(res, error);
    }
};