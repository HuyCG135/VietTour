import {
    listTourImagesService,
    getTourImagesService,
    uploadTourImagesService,
    deleteTourImageService,
} from "./tourImage.service.js";

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

export const getAllTourImages = async (req, res) => {
    try {
        const { q, region, sort, page, limit } = req.query;
        const result = await listTourImagesService({ q, region, sort, page, limit });

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

export const getTourImageDetail = async (req, res) => {
    try {
        const detail = await getTourImagesService(req.params.tourId);

        res.json({
            success: true,
            data: detail,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const uploadTourImages = async (req, res) => {
    try {
        const result = await uploadTourImagesService(req.params.tourId, req.files);

        res.status(201).json({
            success: true,
            message: result.message,
            data: result.created,
            errors: result.failed.length > 0 ? result.failed : undefined,
        });
    } catch (error) {
        handleError(res, error);
    }
};

export const deleteTourImage = async (req, res) => {
    try {
        await deleteTourImageService(req.params.tourId, req.params.imageId);

        res.json({
            success: true,
            message: "Xóa ảnh thành công",
        });
    } catch (error) {
        handleError(res, error);
    }
};
