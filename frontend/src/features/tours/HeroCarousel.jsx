import { useEffect, useState } from "react";

const SLIDES = [
    {
        image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068",
    },
    {
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
    },
    {
        image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=2070",
    },
];

export default function HeroCarousel() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (prefersReduced) return undefined;
        const timer = setInterval(() => setActive((prev) => (prev + 1) % SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const goTo = (index) => setActive((index + SLIDES.length) % SLIDES.length);

    return (
        <div className="relative w-full h-[280px] sm:h-[330px] lg:h-[390px] overflow-hidden rounded-2xl lg:rounded-3xl bg-slate-900">
            {SLIDES.map((slide, index) => (
                <img
                    key={slide.image}
                    src={slide.image}
                    alt={`Cảnh đẹp Việt Nam ${index + 1}`}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === active ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            {/* Vùng tối nhẹ dồn về phía dưới để chữ đọc rõ, không phủ trùm toàn khung */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-slate-900/25 to-slate-900/10" />

            <div className="absolute inset-x-0 bottom-0 z-10 px-6 sm:px-10 pb-16 sm:pb-20 max-w-3xl">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight [text-shadow:0_1px_3px_rgba(15,23,42,0.4)]">
                    Khám Phá Hành Trình Tuyệt Đỉnh
                </h1>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl [text-shadow:0_1px_2px_rgba(15,23,42,0.35)]">
                    Hàng trăm điểm đến được tuyển chọn, đồng hành trọn vẹn trên mọi cung đường của bạn.
                </p>
            </div>

            <button
                onClick={() => goTo(active - 1)}
                aria-label="Slide trước"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
                <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
                onClick={() => goTo(active + 1)}
                aria-label="Slide sau"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
                <i className="fa-solid fa-chevron-right text-xs" />
            </button>

            <div className="absolute bottom-5 right-6 sm:right-10 z-10 flex gap-2">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        aria-label={`Đi tới slide ${index + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            index === active ? "w-7 bg-white" : "w-3 bg-white/50 hover:bg-white/80"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}