function formatPrice(n) {
    if (!n && n !== 0) return "0đ";
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

const PRICE_PRESETS = [
    { label: "Tất cả", min: "", max: "" },
    { label: "< 2 triệu", min: "", max: 2000000 },
    { label: "2 - 5 triệu", min: 2000000, max: 5000000 },
    { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
    { label: "> 10 triệu", min: 10000000, max: "" },
];

export default function FilterSidebar({ filters, values, onChange, onClear, onCloseMobile }) {
    const regions = filters?.regions || [];
    const services = filters?.services || [];
    const priceRange = filters?.priceRange || { min: 0, max: 15000000 };

    const set = (key, value) => onChange({ ...values, [key]: value });

    const handlePresetPrice = (preset) => {
        onChange({
            ...values,
            min_price: preset.min,
            max_price: preset.max,
            page: 1,
        });
    };

    const hasActiveFilters = Boolean(
        values.q ||
        values.region ||
        values.min_price ||
        values.max_price ||
        values.duration ||
        (values.services && values.services.length > 0)
    );

    return (
        <div className="space-y-4">
            {/* Hộp bộ lọc chính */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                {/* Header bộ lọc */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm">
                            <i className="fa-solid fa-sliders" />
                        </span>
                        <span>Bộ lọc tìm kiếm</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="text-xs text-red-500 hover:text-red-700 font-medium hover:underline cursor-pointer transition-colors"
                            >
                                Xóa tất cả
                            </button>
                        )}
                        {onCloseMobile && (
                            <button
                                type="button"
                                onClick={onCloseMobile}
                                className="lg:hidden w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-xs cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Khoảng giá */}
                <div className="mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                            Mức ngân sách
                        </label>
                        {values.max_price && (
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                ≤ {formatPrice(values.max_price)}
                            </span>
                        )}
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {PRICE_PRESETS.slice(1).map((p) => {
                            const active =
                                String(values.min_price || "") === String(p.min) &&
                                String(values.max_price || "") === String(p.max);
                            return (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => handlePresetPrice(p)}
                                    className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all cursor-pointer border text-center ${
                                        active
                                            ? "bg-primary text-white border-primary shadow-xs"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                                    }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Slider */}
                    <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={Math.max(100000, Math.round((priceRange.max - priceRange.min) / 50))}
                        value={values.max_price || priceRange.max}
                        onChange={(e) => set("max_price", e.target.value)}
                        className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1.5">
                        <span>{formatPrice(priceRange.min)}</span>
                        <span>Đến {formatPrice(priceRange.max)}</span>
                    </div>
                </div>

                {/* Khu vực */}
                <div className="mb-5 pb-4 border-b border-slate-100">
                    <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                        Khu vực du lịch
                    </label>
                    <div className="relative">
                        <select
                            value={values.region || ""}
                            onChange={(e) => set("region", e.target.value)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl py-2.5 pl-9 pr-8 font-medium text-xs sm:text-sm cursor-pointer border border-slate-200 focus:border-primary focus:bg-white outline-none transition-all appearance-none"
                        >
                            <option value="">Tất cả khu vực (Toàn quốc)</option>
                            {regions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                        <i className="fa-solid fa-map-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-primary text-xs pointer-events-none" />
                        <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                    </div>
                </div>

                {/* Thời lượng */}
                <div className="mb-5 pb-4 border-b border-slate-100">
                    <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                        Thời gian chuyến đi
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                        {[
                            { value: "", label: "Tất cả" },
                            { value: "short", label: "1 - 3 ngày" },
                            { value: "long", label: "4+ ngày" },
                        ].map((opt) => {
                            const isSelected = (values.duration || "") === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => set("duration", opt.value)}
                                    className={`py-2 px-1 text-xs rounded-xl font-medium transition-all text-center border cursor-pointer ${
                                        isSelected
                                            ? "bg-primary text-white border-primary shadow-xs font-semibold"
                                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dịch vụ tiện ích */}
                {services.length > 0 && (
                    <div className="mb-5">
                        <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">
                            Tiện ích & Dịch vụ
                        </label>
                        <div className="flex flex-col gap-2.5">
                            {services.map((s) => {
                                const selected =
                                    Array.isArray(values.services) &&
                                    values.services.includes(String(s.id));
                                const toggle = () => {
                                    const next = selected
                                        ? values.services.filter((id) => id !== String(s.id))
                                        : [...(values.services || []), String(s.id)];
                                    set("services", next);
                                };
                                return (
                                    <label
                                        key={s.id}
                                        className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-medium cursor-pointer select-none hover:text-slate-900 group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={toggle}
                                            className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer transition-all"
                                        />
                                        <span className="group-hover:translate-x-0.5 transition-transform">
                                            {s.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Nút hành động */}
                <button
                    type="button"
                    onClick={() => {
                        onChange({ ...values, page: 1 });
                        onCloseMobile?.();
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary-dark shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                    <i className="fa-solid fa-magnifying-glass text-xs" /> Áp dụng bộ lọc
                </button>
            </div>
        </div>
    );
}