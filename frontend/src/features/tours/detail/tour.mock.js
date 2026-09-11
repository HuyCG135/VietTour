// Dữ liệu MOCK — khớp hình dạng response API tương lai.
// Khi nâng backend (join images/itineraries/services/reviews) sẽ thay file này.

export const TOUR_MOCK = {
    id: 1,
    name: "Tour Đà Lạt 3N2Đ",
    slug: "tour-da-lat",
    description:
        "Chương trình du lịch Đà Lạt 3 ngày 2 đêm là hành trình nghỉ dưỡng kết hợp tham quan dành cho du khách yêu thích khí hậu mát mẻ, thiên nhiên xanh và không gian yên bình. Du khách sẽ tham quan hồ Xuân Hương, quảng trường Lâm Viên, thác Datanla và săn mây tại đồi chè Cầu Đất.",
    location: "Đà Lạt",
    region: "Miền Nam",
    duration: "3 ngày 2 đêm",
    price_default: 3200000,
    price_child: 2200000,
    cover_image:
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281041/travel-website/dalat.jpg",
    images: [
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281041/travel-website/dalat.jpg",
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281043/travel-website/dalat-2.jpg",
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281042/travel-website/dalat-3.jpg",
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281043/travel-website/dalat-4.jpg",
        "https://res.cloudinary.com/dtsroyjxz/image/upload/v1774281043/travel-website/dalat-5.jpg",
    ],
    itineraries: [
        {
            day: 1,
            description:
                "Đón khách tại sân bay/bến xe Đà Lạt, nhận phòng khách sạn. Tham quan Hồ Xuân Hương, quảng trường Lâm Viên, Thung lũng Tình Yêu. Buổi tối tự do khám phá chợ đêm Đà Lạt.",
        },
        {
            day: 2,
            description:
                "05:30 khởi hành đi đồi chè Cầu Đất săn mây đón bình minh. Trở về dùng bữa sáng, tham quan thác Datanla với máng trượt xuyên rừng, chùa Linh Phước.",
        },
        {
            day: 3,
            description:
                "Dùng bữa sáng, tham quan chợ Đà Lạt mua sắm đặc sản. Trả phòng, xe đưa ra sân bay/bến xe. Kết thúc chương trình.",
        },
    ],
    services: [
        { id: 1, name: "Khách sạn 3 sao trung tâm", icon: "fa-solid fa-hotel" },
        { id: 2, name: "Xe du lịch đời mới", icon: "fa-solid fa-car" },
        { id: 3, name: "Hướng dẫn viên tiếng Việt", icon: "fa-solid fa-user-tie" },
        { id: 4, name: "Ăn sáng buffet", icon: "fa-solid fa-utensils" },
        { id: 5, name: "Bảo hiểm du lịch trọn tour", icon: "fa-solid fa-shield-halved" },
    ],
    reviews: [
        {
            id: 1,
            user_name: "Nguyễn Thu Hà",
            avatar: "",
            rating: 5,
            comment: "Lịch trình rất hợp lý, đồi chè Cầu Đất săn mây sáng sớm đẹp không tả nổi!",
            created_at: "12/08/2026",
        },
        {
            id: 2,
            user_name: "Trần Quốc Bảo",
            avatar: "",
            rating: 5,
            comment: "Giá trọn gói đúng như trên web, không phát sinh thêm. Nhân viên nhiệt tình.",
            created_at: "03/08/2026",
        },
        {
            id: 3,
            user_name: "Lê Minh Anh",
            avatar: "",
            rating: 4,
            comment: "Khách sạn sạch sẽ, vị trí đẹp. Đề xuất nên có thêm giờ tự do buổi tối.",
            created_at: "27/07/2026",
        },
        {
            id: 4,
            user_name: "Phạm Ngọc Mai",
            avatar: "",
            rating: 5,
            comment: "Cả nhà mình có chuyến nghỉ dưỡng đáng nhớ. Sẽ ủng hộ VietTour các tour sau.",
            created_at: "15/07/2026",
        },
    ],
    avg_rating: 4.8,
    review_count: 24,
    status: "open",
    hotline: "1900 1234",
};