import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

// ==================== Dữ liệu Việt Nam ====================
const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];
const LOCATIONS = {
    "Miền Bắc": ["Hà Nội", "Hạ Long", "Sa Pa", "Ninh Bình", "Mù Cang Chải", "Mộc Châu"],
    "Miền Trung": ["Đà Nẵng", "Huế", "Hội An", "Nha Trang", "Quy Nhơn", "Phong Nha"],
    "Miền Nam": ["TP. Hồ Chí Minh", "Phú Quốc", "Cần Thơ", "Đà Lạt", "Mũi Né", "Bến Tre"],
};
const DURATIONS = ["2N1Đ", "3N2Đ", "4N3Đ", "5N4Đ", "6N5Đ"];
const TOUR_ACTIVITIES = ["nghỉ dưỡng", "khám phá thiên nhiên", "văn hóa lịch sử", "ẩm thực", "check-in", "leo núi", "tắm biển"];
const TRANSPORTS = ["xe 45 chỗ", "xe 16 chỗ", "máy bay", "tàu cao tốc", "xe limousine"];
const SERVICES = [
    "Khách sạn 3 sao",
    "Khách sạn 4 sao",
    "Vé máy bay khứ hồi",
    "Ăn uống full-board",
    "Hướng dẫn viên tiếng Việt",
    "Hướng dẫn viên tiếng Anh",
    "Bảo hiểm du lịch",
    "Vé tham quan",
    "Đưa đón sân bay",
    "Wifi + sim du lịch",
];
const LAST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô"];
const MIDDLE_NAMES = ["Văn", "Thị", "Hữu", "Công", "Minh", "Quốc", "Gia", "Hải", "Đức", "Thu"];
const FEMALE_FIRST = ["Hương", "Linh", "Mai", "Lan", "Trang", "Thảo", "Ngọc", "Anh", "Hà", "Thu"];
const MALE_FIRST = ["Minh", "Hùng", "Dũng", "Nam", "Long", "Tùng", "Hiếu", "Đạt", "Khoa", "Bảo"];

// ==================== Helpers ====================
const pick = (arr) => arr[faker.number.int({ min: 0, max: arr.length - 1 })];
const randomPrice = (min, max) => Math.round((faker.number.float({ min, max }) / 50000)) * 50000;
const slugify = (s) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

const makeFullname = () => {
    const isFemale = faker.datatype.boolean();
    return `${pick(LAST_NAMES)} ${pick(MIDDLE_NAMES)} ${isFemale ? pick(FEMALE_FIRST) : pick(MALE_FIRST)}`;
};

const makeVietnamesePhone = () => {
    const prefix = pick(["090", "091", "092", "093", "094", "098", "096", "097", "089"]);
    return prefix + String(faker.number.int({ min: 1000000, max: 9999999 })).padStart(7, "0");
};

// ==================== Factories ====================
export function makeTour(index) {
    const region = pick(REGIONS);
    const location = pick(LOCATIONS[region]);
    const activity = pick(TOUR_ACTIVITIES);
    const name = `Tour ${location} ${activity}`;
    const slug = `${slugify(name)}-${faker.number.int({ min: 1000, max: 9999 })}`;
    return {
        name,
        slug,
        description: `${location} – điểm đến ${activity} hấp dẫn hàng đầu ${region.toLowerCase()}. Quỳnh đoàn chuyên nghiệp, ${pick(TRANSPORTS)}, phù hợp gia đình và nhóm bạn.`,
        location,
        region,
        duration: pick(DURATIONS),
        price_default: randomPrice(1500000, 12000000),
        price_child: randomPrice(800000, 7000000),
        cover_image: null,
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export function makeDeparture(tourId, offset = 0) {
    const d = faker.date.future({ refDate: new Date(), days: offset * 1 });
    d.setDate(d.getDate() + faker.number.int({ min: 7, max: 60 }));
    const seats = faker.number.int({ min: 15, max: 40 });
    return {
        tour_id: tourId,
        departure_location: pick(LOCATIONS["Miền Nam"]),
        departure_date: d.toISOString().slice(0, 10),
        price_moving: randomPrice(300000, 3000000),
        price_moving_child: randomPrice(150000, 1500000),
        seats_total: seats,
        seats_available: faker.number.int({ min: 0, max: seats }),
        status: "open",
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export function makeItinerary(tourId, dayNumber) {
    const location = pick(LOCATIONS[pick(REGIONS)]);
    const activity = pick(TOUR_ACTIVITIES);
    return {
        tour_id: tourId,
        day_number: dayNumber,
        description: `Ngày ${dayNumber}: Di chuyển đến ${location}, ${activity} và trải nghiệm ẩm thực địa phương.`,
    };
}

export function makeService(index) {
    return {
        name: `${pick(SERVICES)} ${index}`,
        slug: `${slugify(pick(SERVICES))}-${index}`,
        description: `Dịch vụ ${pick(SERVICES).toLowerCase()} dành cho hành khách đi tour.`,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };
}

export const makeUser = async (index, role = "customer") => {
    const fullname = role === "admin" ? "Quản trị viên" : makeFullname();
    const lastName = fullname.split(" ").at(-1).toLowerCase();
    return {
        fullname,
        phone: makeVietnamesePhone(),
        email: role === "admin" ? "admin@viettour.vn" : `${lastName}${faker.number.int({ min: 10, max: 99 })}@gmail.com`,
        password: await bcrypt.hash("123456", 10),
        role,
        status: 1,
        is_verified: 1,
        created_at: new Date(),
        updated_at: new Date(),
    };
};
