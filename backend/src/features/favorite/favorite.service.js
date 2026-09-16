import Favorite from "./favorite.repository.js";
import Tour from "../tour/tour.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export const getMyFavoritesService = async (userId) => {
    return Favorite.getByUser(userId);
};

export const getFavoriteIdsService = async (userId) => {
    return Favorite.getIds(userId);
};

export const addFavoriteService = async (userId, tourId) => {
    const tour = await Tour.getById(tourId);
    if (!tour) {
        throw createHttpError(404, "Khong tim thay tour");
    }

    const exists = await Favorite.get(userId, tourId);
    if (exists) {
        return { already: true, tourId };
    }

    await Favorite.add(userId, tourId);
    return { already: false, tourId };
};

export const removeFavoriteService = async (userId, tourId) => {
    const deleted = await Favorite.remove(userId, tourId);
    if (!deleted) {
        throw createHttpError(404, "Tour khong nam trong danh sach yeu thich cua ban");
    }
};