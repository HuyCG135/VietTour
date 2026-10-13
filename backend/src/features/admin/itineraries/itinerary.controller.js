import {
    listItinerariesService,
    getItineraryDetailService,
    updateItineraryService,
} from "./itinerary.service.js";

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

export const getAllItineraries = async (req, res) => {
    try {
        const { q, id_tour, region, sort, page, limit } = req.query;
        const result = await listItinerariesService({ q, id_tour, region, sort, page, limit });

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

export const getItineraryDetail = async (req, res) => {
    try {
        const detail = await getItineraryDetailService(req.params.tourId);

        res.json({
            success: true,
            data: detail,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateItinerary = async (req, res) => {
    try {
        const detail = await updateItineraryService(req.params.tourId, req.body.itineraries);

        res.json({
            success: true,
            message: "Cập nhật lịch trình thành công",
            data: detail,
        });
    } catch (error) {
        handleError(res, error);
    }
};