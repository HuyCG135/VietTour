import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTourFilters from "../../../hooks/useTourFilters";

const DEFAULT_BACKGROUND =
    "https://img.fitreisen.group/eyJidWNrZXQiOiJmaXRyZWlzZW4tY2RuLWltYWdlcyIsImtleSI6ImxvdHVzLXRyYXZlbC1jb20vcmVzb3VyY2VzcGFjZS82MDQwMyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTYwMCwiaGVpZ2h0Ijo1MDAsImZpdCI6ImNvdmVyIiwicG9zaXRpb24iOiJjZW50ZXIifX19?signature=7be11c7d9fcf9fee3b80d7e93ff4735a0b8b05034f2eaf85ad0e594608fe06f8";

const DURATION_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "short", label: "1 - 3 ngày" },
    { value: "long", label: "4+ ngày" },
];

const PRICE_OPTIONS = [
    { value: "", label: "Tất cả ngân sách" },
    { value: "max:5000000", label: "Dưới 5 triệu" },
    { value: "5000000:10000000", label: "5 - 10 triệu" },
    { value: "min:10000000", label: "Trên 10 triệu" },
];

function parsePriceOption(value) {
    if (!value) return {};
    if (value.startsWith("max:")) return { max_price: value.slice(4) };
    if (value.startsWith("min:")) return { min_price: value.slice(4) };
    const [min, max] = value.split(":");
    return { min_price: min, max_price: max };
}

function SearchSegment({ icon, label, children, className = "" }) {
    return (
        <div className={`flex min-w-0 flex-1 items-center gap-2.5 ${className}`}>
            <i className={`${icon} shrink-0 text-lg text-slate-400`} />
            <div className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-slate-800">
                    {label}
                </span>
                {children}
            </div>
        </div>
    );
}

const HomeHero = ({ backgroundImage = DEFAULT_BACKGROUND }) => {
    const navigate = useNavigate();
    const { filters } = useTourFilters();
    const regions = filters?.regions || [];

    const [q, setQ] = useState("");
    const [region, setRegion] = useState("");
    const [duration, setDuration] = useState("");
    const [priceKey, setPriceKey] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (region) params.set("region", region);
        if (duration) params.set("duration", duration);
        const price = parsePriceOption(priceKey);
        if (price.min_price) params.set("min_price", price.min_price);
        if (price.max_price) params.set("max_price", price.max_price);

        const qs = params.toString();
        navigate(`/tours${qs ? `?${qs}` : ""}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <section className="relative w-full pb-24">
            <div
                className="h-[420px] w-full bg-cover bg-center bg-sky-100"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            <div className="absolute bottom-0 left-1/2 w-[92%] max-w-[960px] -translate-x-1/2 rounded-[20px] bg-white px-9 pb-6 pt-8 shadow-[0_20px_45px_rgba(15,40,60,0.15)]">
                <h1 className="mb-1.5 text-[28px] font-bold text-primary">
                    VietTour welcome!
                </h1>
                <p className="mb-6 text-[15px] text-slate-600">
                    Khám phá những miền đẹp nhất Việt Nam cùng chúng tôi
                </p>

                <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 py-2 pl-5 pr-2 sm:flex-nowrap">
                    <SearchSegment
                        icon="fa-solid fa-magnifying-glass"
                        label="Tìm kiếm"
                        className="w-[45%] sm:w-auto sm:flex-[2]"
                    >
                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tên tour hoặc từ khóa..."
                            className="block w-full truncate bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-300"
                        />
                    </SearchSegment>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <SearchSegment
                        icon="fa-solid fa-map-location-dot"
                        label="Khu vực"
                        className="w-[45%] sm:w-auto sm:flex-1"
                    >
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="block w-full cursor-pointer bg-transparent text-xs text-slate-600 outline-none"
                        >
                            <option value="">Toàn quốc</option>
                            {regions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </SearchSegment>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <SearchSegment
                        icon="fa-regular fa-clock"
                        label="Thời lượng"
                        className="w-[45%] sm:w-auto sm:flex-1"
                    >
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="block w-full cursor-pointer bg-transparent text-xs text-slate-600 outline-none"
                        >
                            {DURATION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </SearchSegment>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <SearchSegment
                        icon="fa-solid fa-coins"
                        label="Ngân sách"
                        className="w-[45%] sm:w-auto sm:flex-1"
                    >
                        <select
                            value={priceKey}
                            onChange={(e) => setPriceKey(e.target.value)}
                            className="block w-full cursor-pointer bg-transparent text-xs text-slate-600 outline-none"
                        >
                            {PRICE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </SearchSegment>

                    <button
                        type="button"
                        aria-label="Tìm kiếm"
                        onClick={handleSearch}
                        className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark cursor-pointer"
                    >
                        <i className="fa-solid fa-magnifying-glass text-lg" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
