import Tour from "./tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const listToursAdminService = async (query = {}) => {
    return Tour.list({
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        min_price: query.min_price,
        max_price: query.max_price,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getTourFiltersAdminService = async () => {
    return Tour.getFilterOptions();
};

export const getTourByIdAdminService = async (id) => {
    const tour = await Tour.getById(id);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    return tour;
};

export const createTourService = async (tourData) => {
    const tourId = await Tour.create(tourData);
    return Tour.getById(tourId);
};

export const updateTourService = async (id, tourData) => {
    const updated = await Tour.update(id, tourData);
    if (!updated) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    return Tour.getById(id);
};

export const deleteTourService = async (id) => {
    const deleted = await Tour.delete(id);
    if (!deleted) {
        throw createHttpError(404, "Không tìm thấy tour");
    }
};