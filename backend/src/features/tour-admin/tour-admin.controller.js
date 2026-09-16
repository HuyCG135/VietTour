import {
    getAllToursAdminService,
    getTourByIdAdminService,
    createTourService,
    updateTourService,
    deleteTourService,
} from "./tour-admin.service.js";

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
        const tours = await getAllToursAdminService();

        res.json({
            success: true,
            data: tours,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await getTourByIdAdminService(req.params.id);

        res.json({
            success: true,
            data: tour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const createTour = async (req, res) => {
    try {
        const createdTour = await createTourService(req.body);

        res.status(201).json({
            success: true,
            message: "Tao tour thanh cong",
            data: createdTour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const updateTour = async (req, res) => {
    try {
        const updatedTour = await updateTourService(req.params.id, req.body);

        res.json({
            success: true,
            message: "Cap nhat tour thanh cong",
            data: updatedTour,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteTour = async (req, res) => {
    try {
        await deleteTourService(req.params.id);

        res.json({
            success: true,
            message: "Xoa tour thanh cong",
        });
    } catch (error) {
        handleError(res, error);
    }
};