import Itinerary from "./itinerary.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const listItinerariesService = async (query = {}) => {
    return Itinerary.listTours({
        q: typeof query.q === "string" ? query.q.trim() : "",
        id_tour: query.id_tour,
        region: typeof query.region === "string" ? query.region.trim() : "",
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getItineraryDetailService = async (tourId) => {
    const detail = await Itinerary.getDetail(tourId);
    if (!detail) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    return detail;
};

export const updateItineraryService = async (tourId, itineraries) => {
    const existing = await Itinerary.getDetail(tourId);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    await Itinerary.replaceItineraries(tourId, itineraries);

    return Itinerary.getDetail(tourId);
};