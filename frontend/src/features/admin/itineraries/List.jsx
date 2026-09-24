import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getItineraries } from "./itineraries.api";
import { getTourFilters } from "../tours/tours.api";
import Pagination from "../../tours/Pagination";
import SearchBox from "../../../components/SearchBox";

const normalizeParams = (searchParams) => ({
    q: searchParams.get("q") ?? "",
    region: searchParams.get("region") ?? "",
    sort: searchParams.get("sort") ?? "newest",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
});

const buildQueryString = (params) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set("q", params.q);
    if (params.region) sp.set("region", params.region);
    if (params.sort && params.sort !== "newest") sp.set("sort", params.sort);
    if (params.page > 1) sp.set("page", params.page);
    return sp.toString();
};

export default function ItineraryList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const current = normalizeParams(searchParams);

    const [tours, setTours] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [regions, setRegions] = useState([]);
    const [draft, setDraft] = useState({ q: current.q });
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        let ignore = false;
        getTourFilters()
            .then((res) => {
                if (!ignore && res?.success) setRegions(res.data.regions || []);
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
                const res = await getItineraries(normalizeParams(searchParams));
                if (ignore) return;
                if (res?.success) {
                    setTours(res.data || []);
                    setPagination(res.pagination || null);
                } else {
                    setTours([]);
                    setPagination(null);
                    setError(res?.message || "Không thể tải danh sách lịch trình");
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

    const commit = (params) => {
        setDraft({ q: params.q ?? "" });
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

    const hasFilters = Boolean(current.q || current.region);

    const clearFilters = () => {
        commit({ q: "", region: "", sort: "newest", page: 1 });
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
                <h2 className="font-bold text-xl mb-0">Quản lý lịch trình</h2>
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
                        placeholder="Tìm kiếm theo tên tour hoặc mã tour..."
                        className="search-group--full"
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div>
                            <label htmlFor="itinerary-region" className="block text-xs font-medium text-gray-500 mb-1">Miền</label>
                            <select
                                id="itinerary-region"
                                value={current.region}
                                onChange={(e) => applyFilters({ region: e.target.value })}
                                className="w-full sm:w-44 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Tất cả miền</option>
                                {regions.map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="itinerary-sort" className="block text-xs font-medium text-gray-500 mb-1">Sắp xếp</label>
                            <select
                                id="itinerary-sort"
                                value={current.sort}
                                onChange={(e) => applyFilters({ sort: e.target.value })}
                                className="w-full sm:w-44 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="newest">Mới nhất</option>
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

            <div className={`transition-opacity duration-150 ${refetching ? "opacity-60 pointer-events-none" : ""}`}>
                {tours.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm text-center text-gray-500 py-16">
                        <i className="fa-solid fa-route text-blue-600 mb-3" style={{ fontSize: 40 }} />
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
                                                <div className="text-xs text-gray-400 mb-1">Mã tour #{tour.id}</div>
                                                <h3 className="font-semibold text-base text-gray-900 line-clamp-2">
                                                    {tour.name}
                                                </h3>
                                            </div>
                                            <div className="shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/admin/itineraries/${tour.id}/edit`)}
                                                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                                                >
                                                    <i className="fa-solid fa-pen-to-square mr-1.5" />
                                                    Chỉnh sửa lịch trình
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <span className="text-gray-600">
                                                <span className="text-gray-400">Miền:</span> {tour.region || "—"}
                                            </span>
                                            <span className="text-gray-600">
                                                <span className="text-gray-400">Thời gian:</span> {tour.duration || "—"}
                                            </span>
                                            <span className="text-gray-600">
                                                <span className="text-gray-400">Địa điểm:</span> {tour.location || "—"}
                                            </span>
                                            <span className="text-gray-600">
                                                <span className="text-gray-400">Số ngày lịch trình:</span>{" "}
                                                <span className="font-semibold text-blue-600">{tour.itinerary_days}</span>
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
        </div>
    );
}