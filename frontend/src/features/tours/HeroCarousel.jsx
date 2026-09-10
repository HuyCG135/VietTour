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
        const timer = setInterval(() => setActive((prev) => (prev + 1) % SLIDES.length), 4000);
        return () => clearInterval(timer);
    }, []);

    const goTo = (index) => setActive((index + SLIDES.length) % SLIDES.length);

    return (
        <div className="relative w-full h-[220px] sm:h-[270px] lg:h-[290px] overflow-hidden">
            {SLIDES.map((slide, index) => (
                <img
                    key={slide.image}
                    src={slide.image}
                    alt={`Banner ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === active ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}

            <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-slate-900/40 to-slate-900/80" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
                <span className="inline-flex items-center gap-1.5 bg-primary/80 backdrop-blur-xs border border-white/20 px-3.5 py-1 rounded-full mb-2 font-semibold tracking-wider text-white text-[11px] sm:text-xs uppercase shadow-sm">
                    <i className="fa-solid fa-gem text-accent text-xs" /> VietTour Premium
                </span>
                <h1
                    className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase mb-2 tracking-wide leading-tight [text-shadow:0_3px_10px_rgba(0,0,0,0.6)]"
                >
                    Khám Phá Hành Trình Tuyệt Đỉnh
                </h1>
                <p
                    className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none [text-shadow:0_2px_4px_rgba(0,0,0,0.6)] font-light"
                >
                    Hàng trăm điểm đến độc đáo cùng dịch vụ đẳng cấp được tuyển chọn tinh tế, đồng hành trọn vẹn trên mọi cung đường của bạn.
                </p>
            </div>

            <button
                onClick={() => goTo(active - 1)}
                aria-label="Slide trước"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors cursor-pointer"
            >
                <i className="fa-solid fa-chevron-left" />
            </button>
            <button
                onClick={() => goTo(active + 1)}
                aria-label="Slide sau"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white transition-colors cursor-pointer"
            >
                <i className="fa-solid fa-chevron-right" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        aria-label={`Slide ${index + 1}`}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                            index === active ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/75"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}