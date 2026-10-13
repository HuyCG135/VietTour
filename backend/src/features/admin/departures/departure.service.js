import Departure from "./departure.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

// Date -> "yyyy-mm-dd" local, dùng để so ngày hôm nay (tránh lệch UTC).
const toLocalDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export const listDeparturesService = async (query = {}) => {
    return Departure.list({
        q: typeof query.q === "string" ? query.q.trim() : "",
        tour_id: query.tour_id,
        status: query.status,
        from: query.from,
        to: query.to,
        sort: query.sort,
        page: query.page,
        limit: query.limit,
    });
};

export const listToursForSelectService = async () => {
    return Departure.listToursForSelect();
};

export const getDepartureByIdService = async (id) => {
    const departure = await Departure.getById(id);
    if (!departure) {
        throw createHttpError(404, "Không tìm thấy chuyến khởi hành");
    }
    return departure;
};

export const createDepartureService = async (payload) => {
    const tour = await Departure.getTourById(payload.tour_id);
    if (!tour) {
        throw createHttpError(404, "Không tìm thấy tour");
    }

    const duplicated = await Departure.findByTourAndDate(
        payload.tour_id,
        payload.departure_date,
    );
    if (duplicated) {
        throw createHttpError(409, "Tour này đã có chuyến khởi hành vào ngày đã chọn");
    }

    const id = await Departure.create(payload);
    return Departure.getById(id);
};

export const updateDepartureService = async (id, payload) => {
    const existing = await Departure.getById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy chuyến khởi hành");
    }

    const fields = { ...payload };

    // Đổi ngày khởi hành → phải check trùng (bỏ qua chính bản ghi đang sửa).
    if (fields.departure_date !== undefined && fields.departure_date !== existing.departure_date) {
        const duplicated = await Departure.findByTourAndDate(
            existing.tour_id,
            fields.departure_date,
            id,
        );
        if (duplicated) {
            throw createHttpError(409, "Tour này đã có chuyến khởi hành vào ngày đã chọn");
        }
    }

    // Kẹp seats_available ≤ seats_total: áp dụng cho tất cả trường hợp
    // (sửa tổng chỗ giảm đi, hoặc chỉ gửi một trong hai field).
    const seatsTotal =
        fields.seats_total !== undefined ? fields.seats_total : existing.seats_total;
    const seatsAvailable =
        fields.seats_available !== undefined
            ? fields.seats_available
            : existing.seats_available;
    if (Number(seatsAvailable) > Number(seatsTotal)) {
        fields.seats_available = seatsTotal;
    }

    await Departure.update(id, fields);
    return Departure.getById(id);
};

export const updateDepartureStatusService = async (id, status) => {
    const existing = await Departure.getById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy chuyến khởi hành");
    }

    // Chuyến đã qua ngày tự khóa → không cho mở lại.
    if (status === "open" && existing.departure_date < toLocalDate(new Date())) {
        throw createHttpError(400, "Chuyến đã qua ngày, không thể mở lại");
    }

    await Departure.updateStatus(id, status);
    return Departure.getById(id);
};

export const deleteDepartureService = async (id) => {
    const existing = await Departure.getById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy chuyến khởi hành");
    }

    // FK bookings.departure_id là ON DELETE RESTRICT → chặn trước cho thân thiện.
    const bookingCount = await Departure.countBookings(id);
    if (bookingCount > 0) {
        throw createHttpError(409, "Chuyến này đang có booking, không thể xóa");
    }

    await Departure.delete(id);
    return true;
};