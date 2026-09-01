import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

// ==================== Dữ liệu Việt Nam ====================
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
