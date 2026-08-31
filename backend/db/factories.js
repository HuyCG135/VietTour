import bcrypt from "bcryptjs";

const REGIONS = ["Bắc", "Trung", "Nam"];
const LOCATIONS = {
    Bắc: ["Hà Nội", "Hạ Long", "Sa Pa", "Ninh Bình", "Sapa"],
    Trung: ["Đà Nẵng", "Huế", "Hội An", "Nha Trang", "Quy Nhơn"],
    Nam: ["TP. Hồ Chí Minh", "Phú Quốc", "Cần Thơ", "Đà Lạt", "Mũi Né"],
};
const DURATIONS = ["2N1Đ", "3N2Đ", "4N3Đ", "5N4Đ"];
const SERVICES = ["Khách sạn", "Vé máy bay", "Ăn uống", "Hướng dẫn viên", "Bảo hiểm", "Tham quan"];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randomInt(0, arr.length - 1)];
const slugify = (s) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

export function makeTour(index) {
    const region = pick(REGIONS);
    const name = `Tour ${pick(LOCATIONS[region])} ${randomInt(1, 20)} ngày`;
    return {
        name,
        slug: `${slugify(name)}-${randomInt(1000, 9999)}`,
        description: `Tour du lịch ${region} chất lượng cao ${index}.`,
        location: pick(LOCATIONS[region]),
        region,
        duration: pick(DURATIONS),
        price_default: randomInt(1000000, 8000000) + 500,
        price_child: randomInt(500000, 4000000) + 500,
        cover_image: null,
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export function makeDeparture(tourId, offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + randomInt(7, 60) + offset * 14);
    const seats = randomInt(15, 40);
    return {
        tour_id: tourId,
        departure_location: "TP. Hồ Chí Minh",
        departure_date: d.toISOString().slice(0, 10),
        price_moving: randomInt(200000, 2000000) + 500,
        price_moving_child: randomInt(100000, 1000000) + 500,
        seats_total: seats,
        seats_available: randomInt(0, seats),
        status: "open",
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export function makeItinerary(tourId, dayNumber) {
    return {
        tour_id: tourId,
        day_number: dayNumber,
        description: `Ngày ${dayNumber}: tham quan và nghỉ dưỡng.`,
    };
}

export function makeService(index) {
    const name = pick(SERVICES);
    return {
        name: `${name} ${index}`,
        slug: `${slugify(pick(SERVICES))}-${index}`,
        description: `Dịch vụ ${pick(SERVICES)} cho tour.`,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export const makeUser = async (index, role = "customer") => {
    return {
        fullname: `Người dùng ${index}`,
        phone: `09${String(700000000 + index).slice(-8)}`,
        email: role === "admin" ? "admin@viettour.vn" : `user${index}@example.com`,
        password: await bcrypt.hash("123456", 10),
        role,
        status: 1,
        is_verified: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };
};
