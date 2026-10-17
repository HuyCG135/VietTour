// Dữ liệu mẫu cho dashboard booking.
// Khi nối API thật (GET /api/bookings) chỉ cần thay nội dung các export này
// bằng dữ liệu fetch được, phần component con không cần đổi.

// Thẻ số liệu tổng quan (StatCards).
// icon: key trong map icon của StatCards (calendar | users | dollar).
// trend: "up" | "down" — quyết định màu + mũi tên. change là số có dấu (âm khi giảm).
// spark: mảng số cho biểu đồ mini (sparkline).
export const statsData = [
    {
        id: "bookings",
        icon: "calendar",
        title: "Total Booking",
        value: "1.284",
        change: 12.5,
        trend: "up",
        note: "so với kỳ trước",
        spark: [4, 6, 5, 8, 7, 10, 9, 12],
    },
    {
        id: "participants",
        icon: "users",
        title: "Participants",
        value: "3.542",
        change: 8.2,
        trend: "up",
        note: "so với kỳ trước",
        spark: [8, 7, 9, 8, 11, 10, 13, 12],
    },
    {
        id: "earnings",
        icon: "dollar",
        title: "Earnings",
        value: "2,4 tỷ",
        change: -4.0,
        trend: "down",
        note: "so với kỳ trước",
        spark: [12, 11, 13, 10, 9, 11, 8, 7],
    },
];

// Bộ lọc khoảng thời gian cho TripsOverview (chỉ đổi nhãn trên select).
export const tripsRangeOptions = ["Monthly", "Weekly", "Yearly"];

// Số liệu chuyến đi theo tháng cho biểu đồ TripsOverview.
// done/canceled: số chuyến hoàn thành / huỷ trong tháng.
export const tripsOverviewData = [
    { month: "Jan", done: 820, canceled: 210 },
    { month: "Feb", done: 940, canceled: 260 },
    { month: "Mar", done: 1180, canceled: 300 },
    { month: "Apr", done: 1020, canceled: 240 },
    { month: "May", done: 1420, canceled: 360 },
    { month: "Jun", done: 1280, canceled: 280 },
    { month: "Jul", done: 1680, canceled: 420 },
    { month: "Aug", done: 1520, canceled: 380 },
    { month: "Sep", done: 1840, canceled: 460 },
    { month: "Oct", done: 1720, canceled: 400 },
    { month: "Nov", done: 1960, canceled: 480 },
    { month: "Dec", done: 2100, canceled: 520 },
];

// Top tour được đặt nhiều nhất (donut + danh sách).
// items[].color dùng để tô lát donut và nền badge phần trăm.
export const topPackagesData = {
    period: "Monthly",
    totalParticipants: 3542,
    items: [
        { id: 1, name: "Đà Nẵng - Hội An 4N3Đ", percent: 32, participants: 1134, color: "#44a8f8" },
        { id: 2, name: "Phú Quốc 3N2Đ", percent: 26, participants: 921, color: "#2f80c4" },
        { id: 3, name: "Hà Nội - Hạ Long 3N2Đ", percent: 18, participants: 638, color: "#60a5fa" },
        { id: 4, name: "Sapa - Fansipan 3N2Đ", percent: 14, participants: 496, color: "#93c5fd" },
        { id: 5, name: "Nha Trang 4N3Đ", percent: 10, participants: 353, color: "#c7e2fb" },
    ],
};

// Bảng booking gần đây.
// status: "Confirmed" | "Pending" | "Completed" | "Cancelled" (khớp class status-* và nhãn hiển thị).
export const bookingsData = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        code: "BK-10231",
        package: "Đà Nẵng - Hội An 4N3Đ",
        duration: "4 Days / 3 Nights",
        date: "12/11/2026",
        price: 6400000,
        status: "Confirmed",
    },
    {
        id: 2,
        name: "Trần Thị Bích",
        code: "BK-10232",
        package: "Phú Quốc 3N2Đ",
        duration: "3 Days / 2 Nights",
        date: "15/11/2026",
        price: 11200000,
        status: "Pending",
    },
    {
        id: 3,
        name: "Lê Hoàng Cường",
        code: "BK-10233",
        package: "Hà Nội - Hạ Long 3N2Đ",
        duration: "3 Days / 2 Nights",
        date: "18/11/2026",
        price: 2950000,
        status: "Completed",
    },
    {
        id: 4,
        name: "Phạm Thu Dung",
        code: "BK-10234",
        package: "Sapa - Fansipan 3N2Đ",
        duration: "3 Days / 2 Nights",
        date: "20/11/2026",
        price: 8100000,
        status: "Cancelled",
    },
    {
        id: 5,
        name: "Võ Minh Đức",
        code: "BK-10235",
        package: "Nha Trang 4N3Đ",
        duration: "4 Days / 3 Nights",
        date: "22/11/2026",
        price: 14250000,
        status: "Confirmed",
    },
];

// Thông tin hiển thị ở chân bảng booking.
export const bookingsMeta = {
    pageSize: 10,
    total: 1284,
    totalPages: 129,
};
