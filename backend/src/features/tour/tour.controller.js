import Tour from "./tour.model.js";

export const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.getAll();
        res.json({
            success: true,
            data: tours,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const searchTours = async (req, res) => {
    try {
        const keyword = String(req.query.q || "").trim();

        if (!keyword) {
            return res.status(400).json({
                success: false,
                message: "Vui long nhap tu khoa tim kiem (q)",
            });
        }

        const tours = await Tour.search(keyword);
        res.json({
            success: true,
            count: tours.length,
            data: tours,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getToursByRegion = async (req, res) => {
    try {
        const region = String(req.params.region || "").trim();
        const tours = await Tour.getByRegion(region);

        res.json({
            success: true,
            count: tours.length,
            data: tours,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.getById(req.params.id);

        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay tour",
            });
        }

        res.json({
            success: true,
            data: tour,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const createTour = async (req, res) => {
    try {
        const tourId = await Tour.create(req.body);
        const createdTour = await Tour.getById(tourId);

        res.status(201).json({
            success: true,
            message: "Tao tour thanh cong",
            data: createdTour,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateTour = async (req, res) => {
    try {
        const updated = await Tour.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay tour",
            });
        }

        const updatedTour = await Tour.getById(req.params.id);
        res.json({
            success: true,
            message: "Cap nhat tour thanh cong",
            data: updatedTour,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteTour = async (req, res) => {
    try {
        const deleted = await Tour.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Khong tim thay tour",
            });
        }

        res.json({
            success: true,
            message: "Xoa tour thanh cong",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
