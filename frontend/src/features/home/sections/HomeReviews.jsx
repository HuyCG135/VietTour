import { useState } from "react";
import TestimonialCard from "../components/TestimonialCard";

const DEFAULT_BACKGROUND =
    "https://jupi.joinup.travel/AL3E4eDOAG66ulqHVjWIA_Px2sF-ZICXq43UAJCBLnY/q:85/f:webp/aHR0cHM6Ly9tZWRpYS5qb2ludXAudHJhdmVsL3N0b3JhZ2UvaG90ZWwvMTE5NjQvcGhvdG9zL0JlbG1hcmUtSG90ZWwtMTcuanBn";

const testimonials = [
    {
        name: "Nguyễn Tuấn Anh",
        role: "Tour Đà Nẵng - Hội An",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
        quote:
            "Chuyến đi tuyệt vời hơn cả mong đợi! Khách sạn view biển đẹp mê ly, lịch trình vừa vặn không bị mệt, hướng dẫn viên nhiệt tình và chu đáo từng bữa ăn.",
    },
    {
        name: "Lê Thu Hà",
        role: "Tour Phú Quốc 4N3Đ",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
        quote:
            "Gia đình mình có trải nghiệm cực kỳ đáng nhớ tại Phú Quốc. Đặt tour trên VietTour rất nhanh gọn, giá minh bạch và không phát sinh thêm chi phí nào.",
    },
    {
        name: "Trần Hoàng Nam",
        role: "Tour Khám Phá Sa Pa",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
        quote:
            "Cảnh đẹp Sa Pa hùng vĩ, dịch vụ đưa đón đúng giờ và chu đáo. Đặc biệt là các điểm dừng chân ăn uống đều rất ngon miệng và mang đậm hương vị bản địa.",
    },
    {
        name: "Phạm Minh Trang",
        role: "Tour Ninh Bình - Tràng An",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
        quote:
            "Từng khâu từ tư vấn đến khi kết thúc chuyến đi đều rất chuyên nghiệp. Mình ấn tượng nhất là bạn hướng dẫn viên am hiểu sâu sắc về văn hóa lịch sử.",
    },
    {
        name: "Đặng Quốc Bảo",
        role: "Tour Quy Nhơn - Phú Yên",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
        quote:
            "Biển Quy Nhơn trong xanh tuyệt đẹp, hải sản tươi ngon. Đội ngũ hỗ trợ 24/7 của VietTour phản hồi cực kỳ nhanh chóng khi đoàn mình cần đổi lịch trình.",
    },
];

const VISIBLE_COUNT = 3;

const HomeReviews = ({ backgroundImage = DEFAULT_BACKGROUND }) => {
    const [startIndex, setStartIndex] = useState(0);
    const total = testimonials.length;

    const visibleTestimonials = Array.from(
        { length: Math.min(VISIBLE_COUNT, total) },
        (_, i) => testimonials[(startIndex + i) % total]
    );

    const goPrev = () => setStartIndex((prev) => (prev - 1 + total) % total);
    const goNext = () => setStartIndex((prev) => (prev + 1) % total);

    return (
        <section className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[0.5px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-12 flex items-center justify-between sm:mb-14">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                            Ý kiến khách hàng
                        </span>
                        <h2 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                            Khách hàng nói gì về VietTour?
                        </h2>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Đánh giá trước"
                            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/25 active:scale-95 shadow-sm"
                        >
                            <i className="fa-solid fa-chevron-left text-base sm:text-lg" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Đánh giá tiếp theo"
                            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-white/25 active:scale-95 shadow-sm"
                        >
                            <i className="fa-solid fa-chevron-right text-base sm:text-lg" />
                        </button>
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
                    {visibleTestimonials.map((testimonial, i) => (
                        <TestimonialCard key={`${testimonial.name}-${i}`} {...testimonial} />
                    ))}
                </div>

                <div className="mt-10 sm:mt-12 flex justify-center items-center gap-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Chuyển đến đánh giá ${i + 1}`}
                            onClick={() => setStartIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === startIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeReviews;