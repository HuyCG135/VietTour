import bcrypt from "bcryptjs";

// 3 tài khoản nội bộ — GIỮ NGUYÊN email đăng nhập như cũ để test phân quyền.
const STAFF = [
    {
        fullname: "Quản trị viên",
        email: "admin@viettour.vn",
        phone: "0901000001",
        role: "admin",
        address: "1 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        createdAt: "2025-01-05 09:00:00",
    },
    {
        fullname: "Nguyễn Thị Thu Trang",
        email: "tourstaff@viettour.vn",
        phone: "0901000002",
        role: "tour-staff",
        address: "2 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        createdAt: "2025-01-06 09:00:00",
    },
    {
        fullname: "Trần Văn Hùng",
        email: "bookingstaff@viettour.vn",
        phone: "0901000003",
        role: "booking-staff",
        address: "3 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
        createdAt: "2025-01-07 09:00:00",
    },
];

// Khách hàng: tên thật, email đặt theo tên thật (vd: nguyenvanan@gmail.com),
// số điện thoại + địa chỉ đầy đủ, ngày đăng ký trải đều để thống kê.
const CUSTOMERS = [
    { fullname: "Nguyễn Văn An", gender: "Nam", email: "nguyenvanan@gmail.com", phone: "0902345671", address: "12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-02-11 08:30:00" },
    { fullname: "Trần Thị Bích Ngọc", gender: "Nữ", email: "tranthibichngoc@gmail.com", phone: "0912345672", address: "45 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-02-19 20:15:00" },
    { fullname: "Lê Quang Huy", gender: "Nam", email: "lequanghuy@gmail.com", phone: "0987654323", address: "78 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh", createdAt: "2025-03-03 10:05:00" },
    { fullname: "Phạm Minh Tuấn", gender: "Nam", email: "phamminhtuan@gmail.com", phone: "0932123454", address: "23 Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-03-15 14:40:00" },
    { fullname: "Hoàng Thị Thu Hà", gender: "Nữ", email: "hoangthithuha@gmail.com", phone: "0903456785", address: "56 Nguyễn Trãi, Quận 5, TP. Hồ Chí Minh", createdAt: "2025-03-28 19:20:00" },
    { fullname: "Vũ Đức Long", gender: "Nam", email: "vuduclong@gmail.com", phone: "0978123456", address: "9 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2025-04-08 09:55:00" },
    { fullname: "Đặng Thùy Linh", gender: "Nữ", email: "dangthuylinh@gmail.com", phone: "0918765437", address: "31 Phan Xích Long, Quận Phú Nhuận, TP. Hồ Chí Minh", createdAt: "2025-04-21 21:10:00" },
    { fullname: "Bùi Văn Nam", gender: "Nam", email: "buivannam@gmail.com", phone: "0967345128", address: "88 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-05-06 11:25:00" },
    { fullname: "Đỗ Thị Mai Anh", gender: "Nữ", email: "dothimaianh@gmail.com", phone: "0905678129", address: "17 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-05-19 16:00:00" },
    { fullname: "Hồ Nhật Minh", gender: "Nam", email: "honhatminh@gmail.com", phone: "0934567830", address: "64 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh", createdAt: "2025-06-02 08:45:00" },
    { fullname: "Ngô Thị Kim Oanh", gender: "Nữ", email: "ngothikimoanh@gmail.com", phone: "0981234561", address: "102 Lý Thường Kiệt, Quận 10, TP. Hồ Chí Minh", createdAt: "2025-06-14 15:30:00" },
    { fullname: "Phan Quốc Bảo", gender: "Nam", email: "phanquocbao@gmail.com", phone: "0902345682", address: "5 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-06-27 10:50:00" },
    { fullname: "Dương Thị Hồng Nhung", gender: "Nữ", email: "duongthihongnhung@gmail.com", phone: "0913456793", address: "40 Trường Chinh, Quận Tân Bình, TP. Hồ Chí Minh", createdAt: "2025-07-09 18:05:00" },
    { fullname: "Trịnh Văn Thành", gender: "Nam", email: "trinhvanthanh@gmail.com", phone: "0984567104", address: "29 Hoàng Văn Thụ, Quận Tân Bình, TP. Hồ Chí Minh", createdAt: "2025-07-22 13:15:00" },
    { fullname: "Lý Thị Thanh Hương", gender: "Nữ", email: "lythithanhuong@gmail.com", phone: "0935671215", address: "73 Bà Huyện Thanh Quan, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-08-04 09:35:00" },
    { fullname: "Đinh Công Sơn", gender: "Nam", email: "dinhcongson@gmail.com", phone: "0906789126", address: "11 Phạm Ngọc Thạch, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-08-16 20:40:00" },
    { fullname: "Tạ Thị Ngọc Lan", gender: "Nữ", email: "tathingoclan@gmail.com", phone: "0917891237", address: "58 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-08-29 14:20:00" },
    { fullname: "Cao Minh Đức", gender: "Nam", email: "caominhduc@gmail.com", phone: "0989123458", address: "34 Lê Văn Sỹ, Quận Phú Nhuận, TP. Hồ Chí Minh", createdAt: "2025-09-10 11:00:00" },
    { fullname: "Lâm Thị Diễm Quỳnh", gender: "Nữ", email: "lamthidiemquynh@gmail.com", phone: "0931234569", address: "21 Nam Kỳ Khởi Nghĩa, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-09-23 17:45:00" },
    { fullname: "Trương Văn Kiên", gender: "Nam", email: "truongvankien@gmail.com", phone: "0904567890", address: "97 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2025-10-05 08:20:00" },
    { fullname: "Nguyễn Thị Bảo Trân", gender: "Nữ", email: "nguyenthibaotran@gmail.com", phone: "0915678901", address: "6 Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-10-18 19:55:00" },
    { fullname: "Võ Hoàng Phúc", gender: "Nam", email: "vohoangphuc@gmail.com", phone: "0986789012", address: "49 Cống Quỳnh, Quận 1, TP. Hồ Chí Minh", createdAt: "2025-10-30 10:10:00" },
    { fullname: "Phạm Thị Yến Nhi", gender: "Nữ", email: "phamthiyennhi@gmail.com", phone: "0937890123", address: "83 Nguyễn Thông, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-11-12 15:05:00" },
    { fullname: "Đoàn Văn Hòa", gender: "Nam", email: "doanvanhoa@gmail.com", phone: "0908901234", address: "15 Lý Chính Thắng, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-11-25 09:40:00" },
    { fullname: "Huỳnh Thị Ánh Tuyết", gender: "Nữ", email: "huynhthianhtuyet@gmail.com", phone: "0919012345", address: "60 Trần Quốc Thảo, Quận 3, TP. Hồ Chí Minh", createdAt: "2025-12-08 20:30:00" },
    { fullname: "Mai Xuân Trường", gender: "Nam", email: "maixuantruong@gmail.com", phone: "0982234561", address: "27 Nguyễn Kiệm, Quận Phú Nhuận, TP. Hồ Chí Minh", createdAt: "2025-12-20 13:50:00" },
    { fullname: "Nguyễn Thị Cẩm Vân", gender: "Nữ", email: "nguyenthicamvan@gmail.com", phone: "0901112233", address: "38 Phan Đăng Lưu, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2026-01-10 11:15:00" },
    { fullname: "Trần Đình Khoa", gender: "Nam", email: "trandinhkhoa@gmail.com", phone: "0912223344", address: "52 Ung Văn Khiêm, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2026-02-03 16:25:00" },
    { fullname: "Lê Thị Phương Thảo", gender: "Nữ", email: "lethiphuongthao@gmail.com", phone: "0983334455", address: "19 Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2026-03-14 09:05:00" },
    { fullname: "Bùi Minh Quân", gender: "Nam", email: "buiminhquan@gmail.com", phone: "0904445566", address: "70 Nguyễn Gia Trí, Quận Bình Thạnh, TP. Hồ Chí Minh", createdAt: "2026-05-22 18:45:00" },
];

export async function seed(knex) {
    // Mọi tài khoản dùng chung mật khẩu test 123456.
    const password = await bcrypt.hash("123456", 10);

    const rows = [...STAFF, ...CUSTOMERS].map((user) => {
        const createdAt = new Date(user.createdAt.replace(" ", "T"));
        return {
            fullname: user.fullname,
            phone: user.phone,
            email: user.email,
            password,
            address: user.address,
            role: user.role ?? "customer",
            status: 1,
            is_verified: 1,
            created_at: createdAt,
            updated_at: createdAt,
        };
    });

    await knex("users").insert(rows);
}
