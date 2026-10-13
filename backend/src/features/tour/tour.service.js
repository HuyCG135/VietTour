import Tour from "./tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getAllToursService = async () => {
    return Tour.getAll();
};

export const listToursService = async (query = {}) => {
    const services = typeof query.services === "string"
        ? query.services
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
            .map(Number)
        : Array.isArray(query.services)
            ? query.services.map(Number)
            : [];

    return Tour.list({
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        min_price: query.min_price !== "" ? query.min_price : undefined,
        max_price: query.max_price !== "" ? query.max_price : undefined,
        duration: query.duration,
        services: services.filter((id) => Number.isFinite(id)),
        sort: query.sort,
        page: query.page,
        limit: query.limit,
        departure_date: query.departure_date !== "" ? query.departure_date : undefined,
    });
};

export const getTourFiltersService = async () => {
    return Tour.getFilterOptions();
};

const toLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export const getCalendarService = async (query = {}) => {
    const services = typeof query.services === "string"
        ? query.services
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
            .map(Number)
        : Array.isArray(query.services)
            ? query.services.map(Number)
            : [];

    const today = new Date();
    const from = query.from || toLocalDate(today);
    const to = query.to || toLocalDate(new Date(today.getTime() + 29 * 86400000));

    return Tour.getCalendar({
        from,
        to,
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        min_price: query.min_price !== "" ? query.min_price : undefined,
        max_price: query.max_price !== "" ? query.max_price : undefined,
        duration: query.duration,
        services: services.filter((id) => Number.isFinite(id)),
    });
};

export const getToursByRegionService = async (region) => {
    return Tour.getByRegion(region);
};

export const getTourByIdService = async (id) => {
    const tour = await Tour.getDetailById(id);
    if (!tour) {
        throw createHttpError(404, "Khong tim thay tour");
    }

    return tour;
};