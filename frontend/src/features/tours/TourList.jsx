import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import TourListCard from "./TourListCard";
import Pagination from "./Pagination";
import SearchBox from "../../components/SearchBox";
import Loading from "../../components/Loading";
import HeroCarousel from "./HeroCarousel";
import DepartureCalendar from "./DepartureCalendar";
import useAuth from "../../hooks/useAuth";
import { getTours, getTourFilters, getTourCalendar } from "./tour.api";
import { getFavoriteIds, addFavorite, removeFavorite } from "../user/favorites/favorite.api";

function normalizeParams(searchParams) {
    const services = (searchParams.get("services") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return {
        q: searchParams.get("q") || "",
        region: searchParams.get("region") || "",
        min_price: searchParams.get("min_price") || "",
        max_price: searchParams.get("max_price") || "",
        duration: searchParams.get("duration") || "",
        services,
        sort: searchParams.get("sort") || "",
        departure_date: searchParams.get("departure_date") || "",
        page: Number(searchParams.get("page")) || 1,
    };
}

function buildQueryString(params) {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.region) sp.set("region", params.region);
    if (params.min_price) sp.set("min_price", params.min_price);
    if (params.max_price) sp.set("max_price", params.max_price);
    if (params.duration) sp.set("duration", params.duration);
    if (params.services.length) sp.set("services", params.services.join(","));
    if (params.sort) sp.set("sort", params.sort);
    if (params.departure_date) sp.set("departure_date", params.departure_date);
    if (params.page > 1) sp.set("page", params.page);
    return sp.toString();
}

function formatShortDate(dateStr) {
    if (!dateStr) return "";
    const [, m, d] = dateStr.split("-");
    return `${d}/${m}`;
}

export default function TourList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isAuthenticated } = useAuth();

    const current = normalizeParams(searchParams);
    const [draft, setDraft] = useState(current);
    const [filters, setFilters] = useState(null);
    const [tours, setTours] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [calendarCounts, setCalendarCounts] = useState({});

    useEffect(() => {
        const loadFilters = async () => {
            const res = await getTourFilters();
            if (res?.success) setFilters(res.data);
        };
        loadFilters();
    }, []);

    useEffect(() => {
        const params = normalizeParams(searchParams);
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getTours(params);
                if (res?.success) {
                    setTours(res.data || []);
                    setPagination(res.pagination || null);
                } else {
                    setTours([]);
                    setPagination(null);
                    setError(res?.message || "Không thể tải danh sách tour");
                }
            } catch (err) {
                setTours([]);
                setPagination(null);
                setError(err?.message || "Lỗi kết nối đến server");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [searchParams]);

    useEffect(() => {
        const params = normalizeParams(searchParams);
        const load = async () => {
            const res = await getTourCalendar({
                q: params.q,
                region: params.region,
                min_price: params.min_price,
                max_price: params.max_price,
                duration: params.duration,
                services: params.services,
            });
            if (!res?.success) {
                setCalendarCounts({});
                return;
            }
            const map = {};
            (res.data || []).forEach((item) => {
                map[item.date] = item.count;
            });
            setCalendarCounts(map);
        };
        load();
    }, [searchParams]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const load = async () => {
            const res = await getFavoriteIds();
            if (res?.success) setFavoriteIds(res.data || []);
        };
        load();
    }, [isAuthenticated]);

    const commit = (params) => {
        setDraft(params);
        setSearchParams(buildQueryString(params), { replace: true });
    };

    const applyFilters = (next) => commit({ ...current, ...next, page: 1 });

    const clearFilters = () => {
        setDraft({ q: "", region: "", min_price: "", max_price: "", duration: "", services: [], sort: "", departure_date: "", page: 1 });
        setSearchParams({}, { replace: true });
    };

    const changePage = (page) => {
        if (page < 1 || (pagination && page > pagination.totalPages)) return;
        commit({ ...current, page });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearch = (value) => {
        commit({ ...current, q: value.trim(), page: 1 });
    };

    // Bấm 1 ngày trên lịch: chọn ngày đó; bấm lại ngày đang chọn → gỡ bộ lọc (toggle)
    const selectDate = (date) => {
        const next = date === current.departure_date ? "" : date;
        commit({ ...current, departure_date: next, page: 1 });
    };

    const toggleFavorite = async (tourId) => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }

        const isFav = favoriteIds.includes(tourId);
        const res = isFav ? await removeFavorite(tourId) : await addFavorite(tourId);

        if (res?.success) {
            setFavoriteIds((prev) =>
                isFav ? prev.filter((id) => id !== tourId) : [...prev, tourId],
            );
        }
    };

    // State cho view mode: "grid" hoặc "list"
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("viettour_view_mode") || "grid";
    });
    // State cho mobile filter drawer
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem("viettour_view_mode", mode);
    };

    // Kiểm tra có filter đang áp dụng không
    const activeFilterCount = [
        current.q,
        current.region,
        current.min_price || current.max_price,
        current.duration,
        current.departure_date,
        ...(current.services || []),
    ].filter(Boolean).length;

    const removeFilterKey = (key) => {
        if (key === "price") {
            commit({ ...current, min_price: "", max_price: "", page: 1 });
        } else if (key === "services") {
            commit({ ...current, services: [], page: 1 });
        } else {
            commit({ ...current, [key]: "", page: 1 });
        }
    };

    const removeServiceId = (id) => {
        const next = (current.services || []).filter((s) => s !== String(id));
        commit({ ...current, services: next, page: 1 });
    };

    return (
        <div className="bg-background min-h-screen pb-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
                <HeroCarousel />

                {/* Nút lọc cho Mobile */}
                <div className="flex justify-end mb-6 mt-6 sm:mt-8 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileFilterOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-50 cursor-pointer"
                    >
                        <i className="fa-solid fa-sliders text-primary" />
                        <span>Bộ lọc</span>
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="mt-0 lg:mt-8 flex flex-col lg:flex-row gap-6 items-start">                    {/* Sidebar filter cho Desktop (Sticky thông minh có scrollbar chống tràn) */}
                    <aside className="hidden lg:block w-[280px] xl:w-[310px] shrink-0 sticky top-[85px] max-h-[calc(100vh-100px)] overflow-y-auto pr-1 custom-scrollbar">
                        <FilterSidebar
                            filters={filters}
                            values={draft}
                            onChange={applyFilters}
                            onClear={clearFilters}
                        />
                    </aside>

                    {/* Mobile Drawer Filter Modal */}
                    {mobileFilterOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                                onClick={() => setMobileFilterOpen(false)}
                            />

                            {/* Drawer Content */}
                            <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-4 overflow-y-auto z-10 flex flex-col">
                                <FilterSidebar
                                    filters={filters}
                                    values={draft}
                                    onChange={applyFilters}
                                    onClear={clearFilters}
                                    onCloseMobile={() => setMobileFilterOpen(false)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Cột Nội dung bên phải */}
                    <div className="flex-1 min-w-0 w-full">
                        {/* Lịch khởi hành: chọn ngày để lọc */}
                        <div className="mb-5">
                            <DepartureCalendar
                                counts={calendarCounts}
                                selectedDate={current.departure_date}
                                onSelect={selectDate}
                            />
                        </div>

                        {/* Toolbar: Tìm kiếm, Số lượng kết quả, Sắp xếp & View Switcher */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-5">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                                {/* Search Bar */}
                                <div className="flex-1 max-w-xl">
                                    <SearchBox
                                        value={draft.q}
                                        onChange={(v) => setDraft({ ...draft, q: v })}
                                        onSearch={handleSearch}
                                        placeholder="Tìm tour theo tên, địa danh (Hà Giang, Đà Nẵng, Phú Quốc...)"
                                    />
                                </div>

                                {/* Controls: Sort + View Mode Switcher */}
                                <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap sm:flex-nowrap">
                                    {/* Sort Dropdown */}
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl text-xs sm:text-sm">
                                        <i className="fa-solid fa-arrow-down-short-wide text-slate-400" />
                                        <label htmlFor="sort" className="text-slate-500 font-medium whitespace-nowrap mb-0">
                                            Sắp xếp:
                                        </label>
                                        <select
                                            id="sort"
                                            value={current.sort}
                                            onChange={(e) => commit({ ...current, sort: e.target.value, page: 1 })}
                                            className="border-0 bg-transparent font-bold text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-primary/40 rounded-lg text-xs sm:text-sm"
                                        >
                                            <option value="">Phổ biến nhất</option>
                                            <option value="price_asc">Giá: Thấp đến cao</option>
                                            <option value="price_desc">Giá: Cao đến thấp</option>
                                        </select>
                                    </div>

                                    {/* View Mode Toggle (Grid / List) */}
                                    <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => handleViewModeChange("grid")}
                                            aria-label="Xem dạng lưới"
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                                viewMode === "grid"
                                                    ? "bg-white text-primary shadow-xs font-bold"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            <i className="fa-solid fa-border-all text-sm" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleViewModeChange("list")}
                                            aria-label="Xem dạng danh sách"
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                                                viewMode === "list"
                                                    ? "bg-white text-primary shadow-xs font-bold"
                                                    : "text-slate-500 hover:text-slate-800"
                                            }`}
                                        >
                                            <i className="fa-solid fa-list text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Hàng đếm số lượng kết quả & Active Filter Chips */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="text-xs sm:text-sm text-slate-500 font-medium">
                                    Tìm thấy <b className="text-slate-900 font-bold">{pagination?.total ?? tours.length}</b> tour phù hợp
                                </div>

                                {/* Các tag lọc đang active */}
                                {activeFilterCount > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="text-[11px] text-slate-500 font-medium mr-1">Đang lọc:</span>
                                        {current.q && (
                                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                                "{current.q}"
                                                <button
                                                    onClick={() => removeFilterKey("q")}
                                                    aria-label="Xóa bộ lọc tìm kiếm"
                                                    className="hover:text-primary-dark ml-0.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )}
                                        {current.region && (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                                {current.region}
                                                <button
                                                    onClick={() => removeFilterKey("region")}
                                                    aria-label="Xóa bộ lọc khu vực"
                                                    className="hover:text-slate-900 ml-0.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )}
                                        {current.max_price && (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                                ≤ {new Intl.NumberFormat("vi-VN").format(current.max_price)}đ
                                                <button
                                                    onClick={() => removeFilterKey("price")}
                                                    aria-label="Xóa bộ lọc giá"
                                                    className="hover:text-slate-900 ml-0.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )}
                                        {current.duration && (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                                {current.duration === "short" ? "1-3 ngày" : "4+ ngày"}
                                                <button
                                                    onClick={() => removeFilterKey("duration")}
                                                    aria-label="Xóa bộ lọc thời gian"
                                                    className="hover:text-slate-900 ml-0.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )}
                                        {current.departure_date && (
                                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                                                Khởi hành <b>{formatShortDate(current.departure_date)}</b>
                                                <button
                                                    onClick={() => removeFilterKey("departure_date")}
                                                    aria-label="Xóa bộ lọc ngày khởi hành"
                                                    className="hover:text-slate-900 ml-0.5 cursor-pointer"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        )}
                                        {current.services &&
                                            current.services.map((sid) => {
                                                const sObj = filters?.services?.find((x) => String(x.id) === String(sid));
                                                return (
                                                    <span
                                                        key={sid}
                                                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                                                    >
                                                        {sObj?.name || `Dịch vụ #${sid}`}
                                                        <button
                                                            onClick={() => removeServiceId(sid)}
                                                            aria-label={`Xóa dịch vụ ${sObj?.name || ""}`}
                                                            className="hover:text-slate-900 ml-0.5 cursor-pointer"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                );
                                            })}

                                        <button
                                            onClick={clearFilters}
                                            className="text-[11px] text-red-500 hover:text-red-700 font-bold ml-1 hover:underline cursor-pointer"
                                        >
                                            Đặt lại
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading && <Loading />}

                        {!loading && error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-4 text-center">
                                <p className="font-semibold">{error}</p>
                            </div>
                        )}

                        {!loading && !error && tours.length === 0 && (
                            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-3">
                                    <i className="fa-solid fa-compass" />
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-2">Không tìm thấy tour nào</h4>
                                <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
                                    Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với tiêu chí của bạn. Hãy thử nới lỏng khoảng giá hoặc chọn khu vực khác.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm cursor-pointer shadow-md shadow-primary/25 transition-all"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}

                        {!loading && !error && tours.length > 0 && (
                            <>
                                {/* Hiển thị danh sách tour theo Grid hoặc List */}
                                {viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {tours.map((tour) => (
                                            <TourListCard
                                                key={tour.id}
                                                tour={tour}
                                                layout="grid"
                                                isFavorite={favoriteIds.includes(tour.id)}
                                                onToggleFavorite={isAuthenticated ? () => toggleFavorite(tour.id) : undefined}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {tours.map((tour) => (
                                            <TourListCard
                                                key={tour.id}
                                                tour={tour}
                                                layout="list"
                                                isFavorite={favoriteIds.includes(tour.id)}
                                                onToggleFavorite={isAuthenticated ? () => toggleFavorite(tour.id) : undefined}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Phân trang */}
                                <div className="mt-8">
                                    <Pagination
                                        page={current.page}
                                        totalPages={pagination?.totalPages || 1}
                                        onChange={changePage}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}