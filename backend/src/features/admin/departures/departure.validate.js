// Số ngày tối thiểu phải đặt trước ngày khởi hành (quy tắc nghiệp vụ).
export const MIN_LEAD_DAYS = 3;

const pad2 = (value) => String(value).padStart(2, "0");
const toLocalKey = (date) =>
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const isRequiredText = (value) => typeof value === "string" && value.trim().length > 0;
const isPositiveInt = (value) => Number.isInteger(Number(value)) && Number(value) >= 1;
const isNonNegativeInt = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;
const isNonNegativeNumber = (value) => Number.isFinite(Number(value)) && Number(value) >= 0;

// Kiểm tra chuỗi ngày dạng "yyyy-mm-dd" là ngày thực (không chấp nhận 2026-13-45).
const isValidDateKey = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    return toLocalKey(date) === value;
};

// Ngày tối thiểu được tạo mới: hôm nay + MIN_LEAD_DAYS.
export const minDepartureKey = () => toLocalKey(addDays(new Date(), MIN_LEAD_DAYS));

// Kiểm tra một danh sách field. allRequired = true dùng cho tạo mới
// (bắt buộc đủ location/date/seats_total); false dùng cho sửa (chỉ rà field có mặt).
const validateDepartureFields = (fields, allRequired = false) => {
    const errors = [];
    const has = (key) => fields[key] !== undefined;

    // Điểm khởi hành
    if (!has("departure_location")) {
        if (allRequired) errors.push("Thiếu điểm khởi hành");
    } else if (!isRequiredText(fields.departure_location)) {
        errors.push("Điểm khởi hành không được để trống");
    } else if (fields.departure_location.trim().length > 100) {
        errors.push("Điểm khởi hành không được vượt quá 100 ký tự");
    }

    // Ngày khởi hành
    if (!has("departure_date")) {
        if (allRequired) errors.push("Thiếu ngày khởi hành");
    } else if (!isValidDateKey(fields.departure_date)) {
        errors.push("Ngày khởi hành không hợp lệ (định dạng yyyy-mm-dd)");
    } else if (fields.departure_date < minDepartureKey()) {
        errors.push(`Ngày khởi hành phải cách hôm nay ít nhất ${MIN_LEAD_DAYS} ngày`);
    }

    // Giá
    if (has("price_moving") && !isNonNegativeNumber(fields.price_moving)) {
        errors.push("Giá người lớn phải là số không âm");
    }
    if (has("price_moving_child") && !isNonNegativeNumber(fields.price_moving_child)) {
        errors.push("Giá trẻ em phải là số không âm");
    }

    // Số chỗ
    if (!has("seats_total")) {
        if (allRequired) errors.push("Thiếu tổng số chỗ");
    } else if (!isPositiveInt(fields.seats_total)) {
        errors.push("Tổng số chỗ phải là số nguyên dương");
    }

    if (has("seats_available")) {
        if (!isNonNegativeInt(fields.seats_available)) {
            errors.push("Số chỗ trống phải là số nguyên không âm");
        } else if (has("seats_total") && Number(fields.seats_available) > Number(fields.seats_total)) {
            errors.push("Số chỗ trống không được lớn hơn tổng số chỗ");
        }
    }

    // Cờ trạng thái thủ công
    if (has("status") && fields.status !== "open" && fields.status !== "closed") {
        errors.push("Trạng thái phải là open hoặc closed");
    }

    return errors;
};

const respondInvalid = (res, errors) =>
    res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors,
    });

export const validateCreateDeparture = (req, res, next) => {
    const fields = req.body || {};
    const errors = [];

    const tourId = Number(fields.tour_id);
    if (!Number.isInteger(tourId) || tourId < 1) {
        errors.push("Tour không hợp lệ");
    }

    errors.push(...validateDepartureFields(fields, true));

    if (errors.length > 0) {
        return respondInvalid(res, errors);
    }

    next();
};

export const validateUpdateDeparture = (req, res, next) => {
    const errors = validateDepartureFields(req.body || {}, false);

    if (errors.length > 0) {
        return respondInvalid(res, errors);
    }

    next();
};

export const validateStatus = (req, res, next) => {
    const { status } = req.body || {};

    if (status !== "open" && status !== "closed") {
        return respondInvalid(res, ["Trạng thái phải là open hoặc closed"]);
    }

    next();
};