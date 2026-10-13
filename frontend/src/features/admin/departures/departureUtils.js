// Tiện ích dùng chung cho màn hình quản lý điểm khởi hành.
// Tách riêng để cả bản hardcode lẫn bản nối API đều dùng lại được.

// Số ngày tối thiểu phải đặt trước khi khởi hành.
export const MIN_LEAD_DAYS = 3;

// Thứ trong tuần, bắt đầu từ Thứ 2 cho khớp lịch Việt Nam.
export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Màu sắc / nhãn theo trạng thái suy diễn.
export const STATUS_META = {
    open: {
        label: "Mở",
        dot: "bg-success",
        text: "text-success",
        soft: "bg-success/10",
        border: "border-success/30",
    },
    full: {
        label: "Đầy",
        dot: "bg-warning",
        text: "text-warning",
        soft: "bg-warning/10",
        border: "border-warning/30",
    },
    closed: {
        label: "Đóng",
        dot: "bg-slate-400",
        text: "text-muted",
        soft: "bg-slate-100",
        border: "border-slate-200",
    },
};

const pad2 = (value) => String(value).padStart(2, "0");

// Date -> "yyyy-mm-dd" theo giờ địa phương (không bị lệch ngày vì UTC).
export const toKey = (date) =>
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export const parseKey = (key) => new Date(`${key}T00:00:00`);

export const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

export const addMonths = (date, months) =>
    new Date(date.getFullYear(), date.getMonth() + months, 1);

export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const todayKey = () => toKey(new Date());

export const minAllowedKey = () => toKey(addDays(new Date(), MIN_LEAD_DAYS));

// Tiền tố "yyyy-mm" của một tháng, dùng để lọc theo tháng.
export const monthPrefix = (date) =>
    `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

// Trạng thái hiển thị = suy diễn từ ngày + cờ `closed` thủ công + số chỗ.
export const deriveStatus = (departure, today = todayKey()) => {
    if (!departure) return "open";
    if (departure.departure_date < today) return "closed";
    if (departure.status === "closed") return "closed";
    if (Number(departure.seats_available) <= 0) return "full";
    return "open";
};

// Danh sách chuyến -> map theo ngày. Mỗi ngày có thể có NHIỀU chuyến
// (cùng tour, khác điểm khởi hành) nên giá trị là mảng.
export const groupByDate = (departures) =>
    departures.reduce((acc, item) => {
        const key = item.departure_date;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

// Dựng lưới 6 tuần x 7 ngày (bắt đầu Thứ 2) cho một tháng.
export const buildMonthGrid = (monthDate) => {
    const first = startOfMonth(monthDate);
    const offset = (first.getDay() + 6) % 7; // CN=0 -> 6, T2=1 -> 0
    const start = addDays(first, -offset);

    return Array.from({ length: 6 }, (_, week) =>
        Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)),
    );
};

export const formatCurrency = (value) =>
    `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;

// Giá rút gọn cho ô lịch nhỏ (vd: 1.200.000 -> "1,2tr").
export const formatCompactCurrency = (value) => {
    const amount = Number(value) || 0;
    if (amount <= 0) return "0đ";
    if (amount >= 1_000_000) {
        const millions = amount / 1_000_000;
        const label = Number.isInteger(millions) ? String(millions) : millions.toFixed(1);
        return `${label.replace(".", ",")}tr`;
    }
    if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
    return `${amount}đ`;
};

export const formatMonthTitle = (date) =>
    `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;

export const formatDateVN = (key) => {
    const date = parseKey(key);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};
