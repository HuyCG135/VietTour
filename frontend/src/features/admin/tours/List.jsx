import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllTours, deleteTour, getTourFilters } from "./tours.api";
import Pagination from "../../tours/Pagination";
import SearchBox from "../../../components/SearchBox";

const formatPrice = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);
const formatMoney = (value) => `${new Intl.NumberFormat("vi-VN").format(value || 0)}đ`;

const normalizeParams = (searchParams) => ({
    q: searchParams.get("q") ?? "",
    region: searchParams.get("region") ?? "",
    min_price: searchParams.get("min_price") ?? "",
    max_price: searchParams.get("max_price") ?? "",
    sort: searchParams.get("sort") ?? "newest",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
});

const buildQueryString = (params) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.region) sp.set("region", params.region);
    if (params.min_price) sp.set("min_price", params.min_price);
    if (params.max_price) sp.set("max_price", params.max_price);
    if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
    if (params.page > 1) sp.set("page", params.page);
    return sp.toString();
};

export default function TourList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const current = normalizeParams(searchParams);

    const [tours, setTours] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [deletingLoading, setDeletingLoading] = useState(false);
    const [filters, setFilters] = useState({ regions: [], priceRange: { min: 0, max: 0 } });
    const [draft, setDraft] = useState({ q: current.q, min_price: current.min_price, max_price: current.max_price });
    const [initialized, setInitialized] = useState(false);
    const priceTimer = useRef(null);
    const searchParamsRef = useRef(searchParams);

    useEffect(() => {
        searchParamsRef.current = searchParams;
    }, [searchParams]);

    useEffect(() => () => clearTimeout(priceTimer.current), []);

    useEffect(() => {
        let ignore = false;
        getTourFilters()
            .then((res) => {
                if (!ignore && res?.success) setFilters(res.data);
            })
            .catch(() => {});
        return () => { ignore = true; };
    }, []);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getAllTours(normalizeParams(searchParams));
                if (ignore) return;
                if (res?.success) {
                    setTours(res.data || []);
                    setPagination(res.pagination || null);
                } else {
                    setTours([]);
                    setPagination(null);
                    setError(res?.message || "Không thể tải danh sách tour");
                }
            } catch {
                if (ignore) return;
                setTours([]);
                setPagination(null);
                setError("Không thể kết nối đến máy chủ");
            } finally {
                if (!ignore) {
                    setLoading(false);
                    setInitialized(true);
                }
            }
        };

        load();
        return () => { ignore = true; };
    }, [searchParams]);

    const priceRange = filters.priceRange;
    const priceReady = priceRange.max > priceRange.min;
    const priceStep = priceReady ? Math.max(100000, Math.round((priceRange.max - priceRange.min) / 50)) : 100000;
    const pricePct = (value) => ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    const clampPrice = (value, min, max) => Math.min(Math.max(value, min), max);

    const lo = clampPrice(
        draft.min_price !== "" ? Number(draft.min_price) : priceRange.min,
        priceRange.min,
        priceRange.max,
    );
    const hi = clampPrice(
        draft.max_price !== "" ? Number(draft.max_price) : priceRange.max,
        priceRange.min,
        priceRange.max,
    );
    const sliderMin = Math.min(lo, hi);
    const sliderMax = Math.max(lo, hi);

    const commit = (params) => {
        setDraft({ q: params.q ?? "", min_price: params.min_price ?? "", max_price: params.max_price ?? "" });
        setSearchParams(buildQueryString(params), { replace: true });
    };

    const applyFilters = (next) => {
        commit({ ...current, ...next, page: 1 });
    };

    const changePage = (page) => {
        if (page < 1 || (pagination && page > pagination.totalPages)) return;
        commit({ ...current, page });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const updatePrice = (minValue, maxValue) => {
        const nextMin = Math.min(minValue, maxValue);
        const nextMax = Math.max(minValue, maxValue);

        setDraft((prev) => ({ ...prev, min_price: String(nextMin), max_price: String(nextMax) }));

        const nextMinParam = nextMin <= priceRange.min ? "" : String(nextMin);
        const nextMaxParam = nextMax >= priceRange.max ? "" : String(nextMax);

        clearTimeout(priceTimer.current);
        priceTimer.current = setTimeout(() => {
            const params = normalizeParams(searchParamsRef.current);
            const next = { ...params, min_price: nextMinParam, max_price: nextMaxParam, page: 1 };
            setSearchParams(buildQueryString(next), { replace: true });
            setDraft((prev) => ({
                ...prev,
                min_price: next.min_price,
                max_price: next.max_price,
            }));
        }, 300);
    };

    const handleMinChange = (value) => updatePrice(Math.min(Number(value), sliderMax), sliderMax);

    const handleMaxChange = (value) => updatePrice(sliderMin, Math.max(Number(value), sliderMin));

    const hasFilters = Boolean(current.q || current.region || current.min_price || current.max_price);

    const clearFilters = () => {
        clearTimeout(priceTimer.current);
        commit({ q: "", region: "", min_price: "", max_price: "", sort: "newest", page: 1 });
    };

    const handleDelete = () => {
        if (!deleting) return;
        setDeletingLoading(true);
        deleteTour(deleting.id)
            .then((data) => {
                setDeleting(null);
                if (data.success) {
                    setError("");
                    if (pagination && current.page > 1 && tours.length === 1) {
                        changePage(current.page - 1);
                    } else {
                        setSearchParams(buildQueryString(current), { replace: true });
                    }
                } else {
                    setError(data.message || "Không thể xóa tour");
                }
            })
            .catch(() => {
                setDeleting(null);
                setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => setDeletingLoading(false));
    };

    const refetching = loading && initialized;

    if (!initialized) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl mb-0">Quản lý Tour</h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/tours/new")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-plus mr-2" />
                    Thêm Tour
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="mb-4">
                    <SearchBox
                        value={draft.q}
                        onChange={(value) => setDraft((prev) => ({ ...prev, q: value }))}
                        onSearch={(value) => applyFilters({ q: value.trim() })}
                        placeholder="Tìm kiếm theo tên tour, địa điểm..."
                        className="search-group--full"
                    />
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Khoảng giá</span>
                        <span className="text-sm font-bold text-blue-600 tabular-nums">
                            {formatMoney(sliderMin)} – {formatMoney(sliderMax)}
                        </span>
                    </div>

                    <div className="dual-range">
                        <div className="dual-range__track" />
                        {priceReady && (
                            <div
                                className="dual-range__filled"
                                style={{ left: `${pricePct(sliderMin)}%`, right: `${100 - pricePct(sliderMax)}%` }}
                            />
                        )}
                        <input
                            type="range"
                            aria-label="Giá tối thiểu"
                            min={priceRange.min}
                            max={priceRange.max}
                            step={priceStep}
                            value={sliderMin}
                            disabled={!priceReady}
                            onChange={(e) => handleMinChange(e.target.value)}
                        />
                        <input
                            type="range"
                            aria-label="Giá tối đa"
                            min={priceRange.min}
                            max={priceRange.max}
                            step={priceStep}
                            value={sliderMax}
                            disabled={!priceReady}
                            onChange={(e) => handleMaxChange(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-1 tabular-nums">
                        <span>{formatMoney(priceRange.min)}</span>
                        <span>{formatMoney(priceRange.max)}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div>
                            <label htmlFor="tour-region" className="block text-xs font-medium text-gray-500 mb-1">Miền</label>
                            <select
                                id="tour-region"
                                value={current.region}
                                onChange={(e) => applyFilters({ region: e.target.value })}
                                className="w-full sm:w-44 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Tất cả miền</option>
                                {filters.regions.map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="tour-sort" className="block text-xs font-medium text-gray-500 mb-1">Sắp xếp</label>
                            <select
                                id="tour-sort"
                                value={current.sort}
                                onChange={(e) => applyFilters({ sort: e.target.value })}
                                className="w-full sm:w-40 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="name_asc">Tên A-Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                        <p className="text-sm text-gray-500">
                            Tìm thấy <b className="text-gray-800">{pagination?.total ?? tours.length}</b> tour
                            {refetching && (
                                <i className="fa-solid fa-spinner fa-spin text-blue-600 text-xs ml-1.5" aria-hidden="true" />
                            )}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                                <i className="fa-solid fa-rotate-left mr-1" />
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`transition-opacity duration-150 ${refetching ? "opacity-60 pointer-events-none" : ""}`}
            >

            {tours.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm text-center text-gray-500 py-16">
                    <i className="fa-solid fa-map text-blue-600 mb-3" style={{ fontSize: 40 }} />
                    <p>Không có tour nào phù hợp.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {tours.map((tour) => (
                            <div
                                key={tour.id}
                                className="bg-white rounded-xl shadow-sm p-3 flex flex-col sm:flex-row gap-4"
                            >
                                <div className="sm:w-72 shrink-0">
                                    {tour.cover_image ? (
                                        <img
                                            src={tour.cover_image}
                                            alt={tour.name}
                                            className="w-full h-40 sm:h-[150px] object-cover rounded-xl"
                                        />
                                    ) : (
                                        <div className="w-full h-40 sm:h-[150px] bg-gray-100 rounded-xl flex items-center justify-center">
                                            <i className="fa-solid fa-image text-gray-400" style={{ fontSize: 32 }} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 p-4 sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
                                                {tour.name}
                                            </h3>
                                            {tour.slug && (
                                                <div className="text-xs text-gray-400 mt-0.5">/{tour.slug}</div>
                                            )}
                                        </div>
                                        <div className="shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}
                                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleting(tour)}
                                                className="border border-red-500 text-red-500 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg text-sm ml-2 transition-colors cursor-pointer"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                        <span className="text-gray-600">
                                            <span className="text-gray-400">Miền:</span> {tour.region || "—"}
                                        </span>
                                        <span className="text-gray-600">
                                            <span className="text-gray-400">Địa điểm:</span> {tour.location || "—"}
                                        </span>
                                        <span className="text-gray-600">
                                            <span className="text-gray-400">Thời gian:</span> {tour.duration || "—"}
                                        </span>
                                        <span className="text-gray-600">
                                            <span className="text-gray-400">Giá người lớn:</span>{" "}
                                            <span className="font-semibold text-blue-600">
                                                {formatPrice(tour.price_default)} VNĐ
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && (
                        <Pagination page={current.page} totalPages={pagination.totalPages} onChange={changePage} />
                    )}
                </>
            )}
            </div>

            {deleting && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
                    onClick={() => !deletingLoading && setDeleting(null)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-lg text-red-600 flex items-center gap-2 mb-3">
                            <i className="fa-solid fa-triangle-exclamation" />
                            Xóa tour
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Quý khách chắc chắn muốn xóa tour{" "}
                            <b>“{deleting.name}”</b> không?
                        </p>
                        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">
                            <i className="fa-solid fa-circle-info mr-1.5" />
                            Tour và lịch trình, hình ảnh liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={deletingLoading}
                                onClick={() => setDeleting(null)}
                                className="border border-gray-200 text-gray-800 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Không, quay lại
                            </button>
                            <button
                                type="button"
                                disabled={deletingLoading}
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                            >
                                {deletingLoading && <i className="fa-solid fa-spinner fa-spin" />}
                                Chắc chắn xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}