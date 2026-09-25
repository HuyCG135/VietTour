import ServiceRepository from "./service.repository.js";

const createHttpError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const slugify = (value) =>
    String(value || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const buildPayload = (data, current = {}) => {
    const name = cleanText(data.name ?? current.name);
    const slug = cleanText(data.slug) || slugify(name);
    const description = cleanText(data.description ?? current.description);
    const icon = cleanText(data.icon ?? current.icon);
    const status = data.status === undefined || data.status === null || data.status === ""
        ? Number(current.status ?? 1)
        : Number(data.status);

    return {
        name,
        slug: slug || null,
        description: description || null,
        icon: icon || null,
        status,
    };
};

const ensureUniqueSlug = async (slug, excludeId = null) => {
    if (!slug) return;

    const duplicate = await ServiceRepository.findBySlug(slug, excludeId);
    if (duplicate) {
        throw createHttpError(409, "Slug dịch vụ đã tồn tại, vui lòng chọn slug khác");
    }
};

export const listServicesAdminService = async (query = {}) => {
    return ServiceRepository.list({
        q: typeof query.q === "string" ? query.q.trim() : "",
        status: query.status,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const getServiceByIdAdminService = async (id) => {
    const service = await ServiceRepository.getById(id);
    if (!service) {
        throw createHttpError(404, "Không tìm thấy dịch vụ");
    }
    return service;
};

export const createServiceAdminService = async (serviceData) => {
    const payload = buildPayload(serviceData);
    await ensureUniqueSlug(payload.slug);

    const serviceId = await ServiceRepository.create(payload);
    return ServiceRepository.getById(serviceId);
};

export const updateServiceAdminService = async (id, serviceData) => {
    const current = await ServiceRepository.getById(id);
    if (!current) {
        throw createHttpError(404, "Không tìm thấy dịch vụ");
    }

    const payload = buildPayload(serviceData, current);
    await ensureUniqueSlug(payload.slug, id);

    const updated = await ServiceRepository.update(id, payload);
    if (!updated) {
        throw createHttpError(404, "Không tìm thấy dịch vụ");
    }

    return ServiceRepository.getById(id);
};

export const deleteServiceAdminService = async (id) => {
    const deleted = await ServiceRepository.delete(id);
    if (!deleted) {
        throw createHttpError(404, "Không tìm thấy dịch vụ");
    }
};
