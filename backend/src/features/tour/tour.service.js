import Tour from "./tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getAllToursService = async () => {
    return Tour.getAll();
};

export const searchToursService = async (keyword) => {
    if (!keyword) {
        throw createHttpError(400, "Vui long nhap tu khoa tim kiem (q)");
    }

    return Tour.search(keyword);
};

export const getToursByRegionService = async (region) => {
    return Tour.getByRegion(region);
};

export const getTourByIdService = async (id) => {
    const tour = await Tour.getById(id);
    if (!tour) {
        throw createHttpError(404, "Khong tim thay tour");
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
        throw createHttpError(404, "Khong tim thay tour");
    }

    return Tour.getById(id);
};

export const deleteTourService = async (id) => {
    const deleted = await Tour.delete(id);
    if (!deleted) {
        throw createHttpError(404, "Khong tim thay tour");
    }
};