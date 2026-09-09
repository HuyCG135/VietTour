import * as tourService from "./tour.service.js";

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
        const { q, region, min_price, max_price, duration, services, sort, page, limit } = req.query;

        if (q || region || min_price || max_price || duration || services || sort || page || limit) {
            const result = await tourService.listToursService({
                q, region, min_price, max_price, duration, services, sort, page, limit,
            });

            return res.json({
                success: true,
                data: result.rows,
                pagination: {
                    currentPage: result.page,
                    totalPages: Math.ceil(result.total / result.limit),
                    total: result.total,
                    limit: result.limit,
                },
            });
        }

        const tours = await tourService.getAllToursService();

        res.json({
            success: true,
            data: tours,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getTourFilters = async (req, res) => {
    try {
        const filters = await tourService.getTourFiltersService();

        res.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getToursByRegion = async (req, res) => {
    try {
        const region = String(req.params.region || "").trim();
        const tours = await tourService.getToursByRegionService(region);

        res.json({
            success: true,
            count: tours.length,
            data: tours,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await tourService.getTourByIdService(req.params.id);

        res.json({
            success: true,
            data: tour,
        });
    } catch (error) {
        handleError(res, error);
    }
};