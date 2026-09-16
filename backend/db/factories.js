import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

// ==================== Dữ liệu Việt Nam ====================
// Icon dùng class FontAwesome 6 (frontend load qua CDN trong index.html)
const SERVICES = [
    { name: "Khách sạn 3 sao", icon: "fa-solid fa-hotel" },
    { name: "Khách sạn 4 sao", icon: "fa-solid fa-hotel" },
    { name: "Vé máy bay khứ hồi", icon: "fa-solid fa-plane" },
    { name: "Ăn uống full-board", icon: "fa-solid fa-utensils" },
    { name: "Hướng dẫn viên tiếng Việt", icon: "fa-solid fa-user-tie" },
    { name: "Hướng dẫn viên tiếng Anh", icon: "fa-solid fa-user-tie" },
    { name: "Bảo hiểm du lịch", icon: "fa-solid fa-shield-halved" },
    { name: "Vé tham quan", icon: "fa-solid fa-ticket" },
    { name: "Đưa đón sân bay", icon: "fa-solid fa-van-shuttle" },
    { name: "Wifi + sim du lịch", icon: "fa-solid fa-wifi" },
];
const LAST_NAMES = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô"];
const MIDDLE_NAMES = ["Văn", "Thị", "Hữu", "Công", "Minh", "Quốc", "Gia", "Hải", "Đức", "Thu"];
const FEMALE_FIRST = ["Hương", "Linh", "Mai", "Lan", "Trang", "Thảo", "Ngọc", "Anh", "Hà", "Thu"];
const MALE_FIRST = ["Minh", "Hùng", "Dũng", "Nam", "Long", "Tùng", "Hiếu", "Đạt", "Khoa", "Bảo"];

// ==================== Helpers ====================
const pick = (arr) => arr[faker.number.int({ min: 0, max: arr.length - 1 })];
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
export function makeService(index) {
    const service = pick(SERVICES);
    return {
        name: `${service.name} ${index}`,
        slug: `${slugify(service.name)}-${index}`,
        description: `Dịch vụ ${service.name.toLowerCase()} dành cho hành khách đi tour.`,
        icon: service.icon,
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
