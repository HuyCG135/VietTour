import {
    getMyFavoritesService,
    getFavoriteIdsService,
    addFavoriteService,
    removeFavoriteService,
} from "./favorite.service.js";

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

export const getMyFavorites = async (req, res) => {
    try {
        const favorites = await getMyFavoritesService(req.user.id);

        res.json({
            success: true,
            count: favorites.length,
            data: favorites,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getFavoriteIds = async (req, res) => {
    try {
        const ids = await getFavoriteIdsService(req.user.id);

        res.json({
            success: true,
            data: ids,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const addFavorite = async (req, res) => {
    try {
        const result = await addFavoriteService(req.user.id, req.params.tourId);

        res.json({
            success: true,
            message: result.already ? "Tour da nam trong danh sach yeu thich" : "Da them vao danh sach yeu thich",
            data: { tourId: result.tourId },
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const removeFavorite = async (req, res) => {
    try {
        await removeFavoriteService(req.user.id, req.params.tourId);

        res.json({
            success: true,
            message: "Da xoa khoi danh sach yeu thich",
            data: { tourId: req.params.tourId },
        });
    } catch (error) {
        handleError(res, error);
    }
};