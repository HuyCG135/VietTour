import TourService from "./tour-service.repository.js";

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

export const listTourServicesAdminService = async (query = {}) => {
    return TourService.listTours({
        q: typeof query.q === "string" ? query.q.trim() : "",
        region: typeof query.region === "string" ? query.region.trim() : "",
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getTourServiceDetailAdminService = async (tourId) => {
    const detail = await TourService.getDetail(tourId);
    if (!detail) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    return detail;
};

export const updateTourServicesAdminService = async (tourId, serviceIds) => {
    if (!Array.isArray(serviceIds)) {
        throw createHttpError(400, "Danh sách dịch vụ không hợp lệ");
    }

    const detail = await TourService.getDetail(tourId);
    if (!detail) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const normalizedIds = [...new Set(serviceIds.map((id) => Number(id)))];
    const existingServices = await TourService.getExistingServices(normalizedIds);
    const existingIds = new Set(existingServices.map((service) => service.id));

    if (existingIds.size !== normalizedIds.length) {
        throw createHttpError(400, "Có dịch vụ không tồn tại");
    }

    const currentIds = new Set(
        detail.services.filter((service) => service.selected).map((service) => service.id),
    );
    const inactiveNewServices = existingServices.filter(
        (service) => service.status !== 1 && !currentIds.has(service.id),
    );

    if (inactiveNewServices.length > 0) {
        throw createHttpError(400, "Chỉ được thêm dịch vụ đang hoạt động vào tour");
    }

    await TourService.replaceServices(tourId, normalizedIds);
    return TourService.getDetail(tourId);
};
