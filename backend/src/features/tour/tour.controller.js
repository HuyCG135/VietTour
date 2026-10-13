import {
    listToursService,
    getAllToursService,
    getTourFiltersService,
    getToursByRegionService,
    getTourByIdService,
    getCalendarService,
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
        const { q, region, min_price, max_price, duration, services, sort, page, limit, departure_date } = req.query;

        if (q || region || min_price || max_price || duration || services || sort || page || limit || departure_date) {
            const result = await listToursService({
                q, region, min_price, max_price, duration, services, sort, page, limit, departure_date,
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

        const tours = await getAllToursService();

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
        const filters = await getTourFiltersService();

        res.json({
            success: true,
            data: filters,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getCalendar = async (req, res) => {
    try {
        const { from, to, q, region, min_price, max_price, duration, services } = req.query;
        const data = await getCalendarService({ from, to, q, region, min_price, max_price, duration, services });

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getToursByRegion = async (req, res) => {
    try {
        const region = String(req.params.region || "").trim();
        const tours = await getToursByRegionService(region);

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
        const tour = await getTourByIdService(req.params.id);

        res.json({
            success: true,
            data: tour,
        });
    } catch (error) {
        handleError(res, error);
    }
};