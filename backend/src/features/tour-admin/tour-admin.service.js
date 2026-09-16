import TourAdmin from "./tour-admin.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getAllToursAdminService = async () => {
    return TourAdmin.getAll();
};

export const getTourByIdAdminService = async (id) => {
    const tour = await TourAdmin.getById(id);
    if (!tour) {
        throw createHttpError(404, "Khong tim thay tour");
    }

    return tour;
};

export const createTourService = async (tourData) => {
    const tourId = await TourAdmin.create(tourData);
    return TourAdmin.getById(tourId);
};

export const updateTourService = async (id, tourData) => {
    const updated = await TourAdmin.update(id, tourData);
    if (!updated) {
        throw createHttpError(404, "Khong tim thay tour");
    }

    return TourAdmin.getById(id);
};

export const deleteTourService = async (id) => {
    const deleted = await TourAdmin.delete(id);
    if (!deleted) {
        throw createHttpError(404, "Khong tim thay tour");
    }
};