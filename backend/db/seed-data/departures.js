// Bổ sung chuyến khởi hành cho seed, key theo slug tour (merge trong 02_tours.js).
//
// Quy tắc khi thêm chuyến (khớp departure.validate.js + migration tour_departures):
// - (tour_id, departure_date) là DUY NHẤT → KHÔNG trùng ngày với tours.js.
// - Ngày nên ở tương lai (>= hôm nay + 3 ngày) để khách còn đặt được.
// - seats_total >= 1; 0 <= seats_available <= seats_total.
// - price_moving / price_moving_child >= 0.
// - status chỉ nhận "open"/"closed"; KHÔNG ghi "full" (hệ thống tự suy ra khi hết chỗ).
// - Giá nên cùng mức với các chuyến sẵn có của tour để nhất quán.
export const EXTRA_DEPARTURES = {
    "tour-da-lat": [
        { departure_location: "TP.HCM", departure_date: "2026-11-25", price_moving: 500000, price_moving_child: 300000, seats_total: 25, seats_available: 25, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2026-12-20", price_moving: 800000, price_moving_child: 500000, seats_total: 25, seats_available: 20, status: "open" },
    ],
    "tour-da-nang-hoi-an-ba-na": [
        { departure_location: "Đà Nẵng", departure_date: "2026-12-05", price_moving: 700000, price_moving_child: 450000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-10", price_moving: 600000, price_moving_child: 400000, seats_total: 30, seats_available: 26, status: "open" },
    ],
    "tour-ha-noi-ha-long": [
        { departure_location: "Hà Nội", departure_date: "2026-12-15", price_moving: 300000, price_moving_child: 150000, seats_total: 35, seats_available: 35, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-20", price_moving: 300000, price_moving_child: 150000, seats_total: 35, seats_available: 30, status: "open" },
    ],
    "tour-nha-trang": [
        { departure_location: "TP.HCM", departure_date: "2026-12-20", price_moving: 1200000, price_moving_child: 800000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-15", price_moving: 700000, price_moving_child: 400000, seats_total: 30, seats_available: 24, status: "open" },
    ],
    "tour-phu-quoc": [
        { departure_location: "TP.HCM", departure_date: "2026-12-25", price_moving: 1500000, price_moving_child: 1000000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-20", price_moving: 800000, price_moving_child: 500000, seats_total: 30, seats_available: 30, status: "open" },
    ],
    "tour-ha-noi-sapa-fansipan": [
        { departure_location: "Hà Nội", departure_date: "2026-12-20", price_moving: 400000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-15", price_moving: 1200000, price_moving_child: 800000, seats_total: 25, seats_available: 18, status: "open" },
    ],
    "tour-hue-phong-nha": [
        { departure_location: "Huế", departure_date: "2026-12-18", price_moving: 400000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
        { departure_location: "Đà Nẵng", departure_date: "2027-01-22", price_moving: 200000, price_moving_child: 100000, seats_total: 25, seats_available: 25, status: "open" },
    ],
    "tour-ninh-binh-trang-an-tam-coc": [
        { departure_location: "Hà Nội", departure_date: "2026-12-15", price_moving: 900000, price_moving_child: 600000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-18", price_moving: 150000, price_moving_child: 80000, seats_total: 30, seats_available: 27, status: "open" },
    ],
    "tour-con-dao": [
        { departure_location: "TP.HCM", departure_date: "2026-12-22", price_moving: 500000, price_moving_child: 300000, seats_total: 20, seats_available: 20, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-25", price_moving: 500000, price_moving_child: 300000, seats_total: 20, seats_available: 16, status: "open" },
    ],
    "tour-moc-chau": [
        { departure_location: "Hà Nội", departure_date: "2026-12-10", price_moving: 300000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-28", price_moving: 300000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
    ],
    "tour-quy-nhon-phu-yen": [
        { departure_location: "TP.HCM", departure_date: "2026-11-20", price_moving: 600000, price_moving_child: 400000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-10", price_moving: 600000, price_moving_child: 400000, seats_total: 30, seats_available: 22, status: "open" },
    ],
    "tour-tay-ninh": [
        { departure_location: "TP.HCM", departure_date: "2026-12-20", price_moving: 100000, price_moving_child: 50000, seats_total: 40, seats_available: 40, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-15", price_moving: 100000, price_moving_child: 50000, seats_total: 40, seats_available: 35, status: "open" },
    ],
    "tour-can-tho": [
        { departure_location: "TP.HCM", departure_date: "2026-12-12", price_moving: 200000, price_moving_child: 100000, seats_total: 30, seats_available: 30, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-18", price_moving: 200000, price_moving_child: 100000, seats_total: 30, seats_available: 26, status: "open" },
    ],
    "tour-ha-giang": [
        { departure_location: "Hà Nội", departure_date: "2026-11-20", price_moving: 400000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
        { departure_location: "Hà Nội", departure_date: "2027-01-12", price_moving: 400000, price_moving_child: 200000, seats_total: 25, seats_available: 25, status: "open" },
    ],
    "tour-binh-ba": [
        { departure_location: "Nha Trang", departure_date: "2026-12-28", price_moving: 200000, price_moving_child: 100000, seats_total: 20, seats_available: 20, status: "open" },
        { departure_location: "Nha Trang", departure_date: "2027-01-30", price_moving: 200000, price_moving_child: 100000, seats_total: 20, seats_available: 18, status: "open" },
    ],
    "tour-son-doong": [
        { departure_location: "Đồng Hới", departure_date: "2026-12-05", price_moving: 0, price_moving_child: 0, seats_total: 10, seats_available: 10, status: "open" },
        { departure_location: "Đồng Hới", departure_date: "2027-01-05", price_moving: 0, price_moving_child: 0, seats_total: 10, seats_available: 8, status: "open" },
    ],
    "tour-vung-tau": [
        { departure_location: "TP.HCM", departure_date: "2026-11-25", price_moving: 100000, price_moving_child: 50000, seats_total: 45, seats_available: 45, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2026-12-25", price_moving: 100000, price_moving_child: 50000, seats_total: 45, seats_available: 45, status: "open" },
    ],
    "tour-gia-lai": [
        { departure_location: "TP.HCM", departure_date: "2026-12-20", price_moving: 500000, price_moving_child: 300000, seats_total: 20, seats_available: 20, status: "open" },
        { departure_location: "TP.HCM", departure_date: "2027-01-22", price_moving: 500000, price_moving_child: 300000, seats_total: 20, seats_available: 17, status: "open" },
    ],
};
