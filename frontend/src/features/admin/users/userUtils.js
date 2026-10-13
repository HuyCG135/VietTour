// ===== Metadata hiển thị vai trò (đồng bộ enum role trong DB) =====
export const ROLE_META = {
    admin: {
        label: "Admin",
        icon: "fa-solid fa-shield-halved",
        badge: "bg-accent/10 text-accent",
    },
    "tour-staff": {
        label: "NV Tour",
        icon: "fa-solid fa-map-location-dot",
        badge: "bg-success/10 text-success",
    },
    "booking-staff": {
        label: "NV Booking",
        icon: "fa-solid fa-calendar-check",
        badge: "bg-primary/10 text-primary",
    },
    customer: {
        label: "Khách hàng",
        icon: "fa-solid fa-user",
        badge: "bg-slate-100 text-muted",
    },
};

// ===== Metadata hiển thị trạng thái (status: 1 = hoạt động, 0 = đã khóa) =====
export const STATUS_META = {
    1: {
        label: "Hoạt động",
        badge: "bg-success/10 text-success",
        dot: "bg-success",
    },
    0: {
        label: "Đã khóa",
        badge: "bg-danger/10 text-danger",
        dot: "bg-danger",
    },
};

// Danh sách trạng thái để render select trong modal Sửa.
export const STATUS_OPTIONS = [
    { value: 1, label: STATUS_META[1].label },
    { value: 0, label: STATUS_META[0].label },
];

// Avatar trong bảng: chữ cái đầu của TÊN (từ cuối cùng trong fullname), in hoa.
export const getAvatarLetter = (fullname = "") => {
    const name = String(fullname ?? "").trim();
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    const last = parts[parts.length - 1];
    return (last?.[0] ?? "?").toUpperCase();
};

// ===== Validators (khớp luật backend + UI cũ) =====
export const validators = {
    // Họ tên: không trống, ít nhất 1 chữ cái (không cho toàn số).
    fullname: (value) => {
        const text = String(value ?? "").trim();
        return text.length > 0 && /[^\d\s]/.test(text);
    },
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim()),
    phone: (value) => /^0[0-9]{9}$/.test(String(value ?? "").trim()),
    password: (value) => String(value ?? "").length >= 6,
    confirmPassword: (password, confirm) => password === confirm,
};

// ===== Parse tìm kiếm thông minh (giữ nguyên hành vi dự án cũ) =====
// Thứ tự ưu tiên: vai trò -> trạng thái -> email -> số (phone/id) -> họ tên.
const ROLE_RULES = [
    { words: ["admin", "quản trị", "quan tri"], role: "admin" },
    {
        words: ["tour-staff", "nvtour", "nv tour", "nhân viên tour", "nhan vien tour", "tour staff"],
        role: "tour-staff",
    },
    {
        words: ["booking-staff", "nvbooking", "nv booking", "nhân viên booking", "nhan vien booking", "booking staff"],
        role: "booking-staff",
    },
    { words: ["customer", "khách hàng", "khach hang", "khách", "khach"], role: "customer" },
];

const LOCKED_WORDS = [
    "đã khóa", "da khoa", "khoá", "khóa", "khoa",
    "inactive", "locked", "closed", "blocked",
    "đóng", "dong", "ngưng", "ngung",
];

const ACTIVE_WORDS = [
    "đang hoạt động", "dang hoat dong", "hoạt động", "hoat dong",
    "active", "open", "kích hoạt", "kich hoat",
];

const matchRole = (lower) => {
    for (const rule of ROLE_RULES) {
        if (rule.words.some((word) => lower.includes(word))) return rule.role;
    }
    return null;
};

const matchStatus = (lower) => {
    if (LOCKED_WORDS.some((word) => lower.includes(word))) return 0;
    if (ACTIVE_WORDS.some((word) => lower.includes(word))) return 1;
    return undefined;
};

export const buildSearchFilters = (keyword = "") => {
    const text = String(keyword ?? "").trim();
    if (!text) return {};

    const lower = text.toLowerCase().replace(/\s+/g, " ").trim();

    const role = matchRole(lower);
    if (role) return { role };

    const status = matchStatus(lower);
    if (status !== undefined) return { status };

    if (validators.email(text)) return { email: text };

    // Toàn số: bắt đầu bằng 0 hoặc ≥10 chữ số -> số điện thoại, còn lại -> id.
    if (/^\d+$/.test(text)) {
        if (text.startsWith("0") || text.length >= 10) return { phone: text };
        return { id: text };
    }

    return { fullname: text };
};