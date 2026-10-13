// DỮ LIỆU MOCK cho bản hardcode — sẽ thay bằng API ở bước nối backend.
// `departure_date` dạng "yyyy-mm-dd"; `status` chỉ lưu cờ thủ công "open" | "closed"
// (trạng thái "full" được suy diễn từ `seats_available`).

const pad2 = (value) => String(value).padStart(2, "0");

// Ngày cách hôm nay `days` ngày -> "yyyy-mm-dd".
const shift = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const MOCK_TOURS = [
    { id: 1, name: "Hà Nội – Hạ Long – Ninh Bình", region: "Miền Bắc", duration: "4 ngày 3 đêm" },
    { id: 2, name: "Đà Nẵng – Hội An – Bà Nà Hills", region: "Miền Trung", duration: "3 ngày 2 đêm" },
    { id: 3, name: "Phú Quốc – Vinpearl Safari", region: "Miền Nam", duration: "4 ngày 3 đêm" },
    { id: 4, name: "Đà Lạt mộng mơ", region: "Miền Nam", duration: "3 ngày 2 đêm" },
    { id: 5, name: "Sa Pa – Fansipan", region: "Miền Bắc", duration: "3 ngày 2 đêm" },
    { id: 6, name: "Hà Giang – Cao nguyên đá Đồng Văn", region: "Miền Bắc", duration: "4 ngày 3 đêm" },
    { id: 7, name: "Cát Bà – Vịnh Lan Hạ", region: "Miền Bắc", duration: "2 ngày 1 đêm" },
    { id: 8, name: "Huế – Đà Nẵng – Hội An", region: "Miền Trung", duration: "4 ngày 3 đêm" },
    { id: 9, name: "Nha Trang – Vinpearl Land", region: "Miền Trung", duration: "4 ngày 3 đêm" },
    { id: 10, name: "Quy Nhơn – Eo Gió – Kỳ Co", region: "Miền Trung", duration: "3 ngày 2 đêm" },
    { id: 11, name: "Phan Thiết – Mũi Né", region: "Miền Nam", duration: "3 ngày 2 đêm" },
    { id: 12, name: "Vũng Tàu – Côn Đảo", region: "Miền Nam", duration: "3 ngày 2 đêm" },
    { id: 13, name: "Cần Thơ – Chợ nổi Cái Răng", region: "Miền Nam", duration: "2 ngày 1 đêm" },
    { id: 14, name: "Tây Ninh – Núi Bà Đen", region: "Miền Nam", duration: "2 ngày 1 đêm" },
    { id: 15, name: "Mộc Châu – Đồi chè trái tim", region: "Miền Bắc", duration: "2 ngày 1 đêm" },
    { id: 16, name: "Nam Cát Tiên – Bàu Sấu", region: "Miền Nam", duration: "2 ngày 1 đêm" },
    { id: 17, name: "Du thuyền Hạ Long 5 sao", region: "Miền Bắc", duration: "2 ngày 1 đêm" },
    { id: 18, name: "Buôn Ma Thuột – Thác Dray Nur", region: "Miền Trung", duration: "3 ngày 2 đêm" },
];

export const MOCK_DEPARTURES = [
    // Tour 1 — Hà Nội / Hạ Long / Ninh Bình
    {
        id: 101,
        tour_id: 1,
        departure_location: "Sân bay Nội Bài, Hà Nội",
        departure_date: shift(3),
        price_moving: 4200000,
        price_moving_child: 3200000,
        seats_total: 30,
        seats_available: 18,
        status: "open",
    },
    {
        id: 102,
        tour_id: 1,
        departure_location: "Phố cổ Hà Nội",
        departure_date: shift(8),
        price_moving: 4200000,
        price_moving_child: 3200000,
        seats_total: 30,
        seats_available: 4,
        status: "open",
    },
    {
        id: 103,
        tour_id: 1,
        departure_location: "Bến xe Mỹ Đình",
        departure_date: shift(14),
        price_moving: 4500000,
        price_moving_child: 3400000,
        seats_total: 25,
        seats_available: 0,
        status: "open",
    },
    {
        id: 104,
        tour_id: 1,
        departure_location: "Sân bay Nội Bài, Hà Nội",
        departure_date: shift(21),
        price_moving: 4500000,
        price_moving_child: 3400000,
        seats_total: 25,
        seats_available: 25,
        status: "closed",
    },
    {
        id: 105,
        tour_id: 1,
        departure_location: "Khách sạn Hồng Hà, Hà Nội",
        departure_date: shift(27),
        price_moving: 4800000,
        price_moving_child: 3600000,
        seats_total: 20,
        seats_available: 20,
        status: "open",
    },
    {
        id: 106,
        tour_id: 1,
        departure_location: "Phố cổ Hà Nội",
        departure_date: shift(-6),
        price_moving: 4000000,
        price_moving_child: 3000000,
        seats_total: 30,
        seats_available: 2,
        status: "open",
    },
    {
        id: 107,
        tour_id: 1,
        departure_location: "Sân bay Nội Bài, Hà Nội",
        departure_date: shift(35),
        price_moving: 4800000,
        price_moving_child: 3600000,
        seats_total: 20,
        seats_available: 12,
        status: "open",
    },

    // Tour 2 — Đà Nẵng / Hội An / Bà Nà
    {
        id: 201,
        tour_id: 2,
        departure_location: "Sân bay Đà Nẵng",
        departure_date: shift(4),
        price_moving: 3600000,
        price_moving_child: 2700000,
        seats_total: 24,
        seats_available: 10,
        status: "open",
    },
    {
        id: 202,
        tour_id: 2,
        departure_location: "Trung tâm Hội An",
        departure_date: shift(11),
        price_moving: 3600000,
        price_moving_child: 2700000,
        seats_total: 24,
        seats_available: 0,
        status: "open",
    },
    {
        id: 203,
        tour_id: 2,
        departure_location: "Cầu Rồng, Đà Nẵng",
        departure_date: shift(19),
        price_moving: 3800000,
        price_moving_child: 2900000,
        seats_total: 24,
        seats_available: 24,
        status: "open",
    },

    // Tour 3 — Phú Quốc
    {
        id: 301,
        tour_id: 3,
        departure_location: "Sân bay Tân Sơn Nhất, TP.HCM",
        departure_date: shift(6),
        price_moving: 5400000,
        price_moving_child: 4100000,
        seats_total: 20,
        seats_available: 14,
        status: "open",
    },
    {
        id: 302,
        tour_id: 3,
        departure_location: "Cảng Bãi Vòng, Phú Quốc",
        departure_date: shift(16),
        price_moving: 5400000,
        price_moving_child: 4100000,
        seats_total: 20,
        seats_available: 6,
        status: "closed",
    },

    // Tour 4 — Đà Lạt
    {
        id: 401,
        tour_id: 4,
        departure_location: "Bến xe miền Đông, TP.HCM",
        departure_date: shift(5),
        price_moving: 3100000,
        price_moving_child: 2400000,
        seats_total: 28,
        seats_available: 22,
        status: "open",
    },
    {
        id: 402,
        tour_id: 4,
        departure_location: "Sân bay Liên Khương, Đà Lạt",
        departure_date: shift(13),
        price_moving: 3100000,
        price_moving_child: 2400000,
        seats_total: 28,
        seats_available: 1,
        status: "open",
    },

    // Tour 5 — Sa Pa
    {
        id: 501,
        tour_id: 5,
        departure_location: "Ga Hà Nội",
        departure_date: shift(3),
        price_moving: 2900000,
        price_moving_child: 2200000,
        seats_total: 26,
        seats_available: 16,
        status: "open",
    },
    {
        id: 502,
        tour_id: 5,
        departure_location: "Bến xe Lào Cai",
        departure_date: shift(17),
        price_moving: 2900000,
        price_moving_child: 2200000,
        seats_total: 26,
        seats_available: 0,
        status: "open",
    },

    // Tour 9 — Nha Trang
    {
        id: 901,
        tour_id: 9,
        departure_location: "Sân bay Cam Ranh, Nha Trang",
        departure_date: shift(9),
        price_moving: 4600000,
        price_moving_child: 3500000,
        seats_total: 30,
        seats_available: 20,
        status: "open",
    },

    // Tour 13 — Cần Thơ
    {
        id: 1301,
        tour_id: 13,
        departure_location: "Bến Ninh Kiều, Cần Thơ",
        departure_date: shift(4),
        price_moving: 1900000,
        price_moving_child: 1400000,
        seats_total: 24,
        seats_available: 18,
        status: "open",
    },
];
