import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTourServices } from "./tour-services.api";
import { getTourFilters } from "../tours/tours.api";
import TourServiceFormModal from "./TourServiceFormModal";
import Pagination from "../../tours/Pagination";
import SearchBox from "../../../components/SearchBox";
import SelectMenu from "../../../components/SelectMenu";
import ImageLightbox from "../../../components/ImageLightbox";

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

const extractError = (res, fallback) => {
    if (Array.isArray(res?.errors) && res.errors.length) return res.errors.join(", ");
    return res?.message || fallback;
};

export default function TourServiceList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const current = normalizeParams(searchParams);

    const [tours, setTours] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [draft, setDraft] = useState({ q: current.q });
    const [initialized, setInitialized] = useState(false);
    const [activeTour, setActiveTour] = useState(null);
    const [preview, setPreview] = useState(null);
    const requestSeq = useRef(0);

    const loadTours = useCallback(async () => {
        const seq = ++requestSeq.current;
        setLoading(true);
        setError("");
        try {
            const res = await getTourServices(normalizeParams(searchParams));
            if (seq !== requestSeq.current) return;
            if (res?.success) {
                setTours(res.data || []);
                setPagination(res.pagination || null);
            } else {
                setTours([]);
                setPagination(null);
                setError(extractError(res, "Không thể tải danh sách tour"));
            }
        } catch {
            if (seq !== requestSeq.current) return;
            setTours([]);
            setPagination(null);
            setError("Không thể kết nối đến máy chủ");
        } finally {
            if (seq === requestSeq.current) {
                setLoading(false);
                setInitialized(true);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        loadTours();
    }, [loadTours]);

    useEffect(() => {
        let ignore = false;
        getTourFilters()
            .then((res) => {
                if (!ignore && res?.success) setRegions(res.data?.regions || []);
            })
            .catch(() => {});
        return () => { ignore = true; };
    }, []);

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

    const clearFilters = () => {
        commit({ q: "", region: "", sort: "newest", page: 1 });
    };

    const handleSaved = () => {
        setActiveTour(null);
        loadTours();
    };

    const hasFilters = Boolean(current.q || current.region);
    const refetching = loading && initialized;

    if (!initialized) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" role="status" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-bold text-foreground">Quản lý dịch vụ tour</h2>
                <p className="mt-1 text-sm text-muted">
                    Gắn dịch vụ đi kèm cho từng tour — bấm &quot;Chọn dịch vụ&quot; để mở popup chọn
                    nhanh.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {error}
                </div>
            )}

            <div className="rounded-2xl border border-border bg-surface p-4">
                <div className="mb-4">
                    <SearchBox
                        value={draft.q}
                        onChange={(value) => setDraft((prev) => ({ ...prev, q: value }))}
                        onSearch={(value) => applyFilters({ q: value.trim() })}
                        placeholder="Tìm kiếm theo tên tour hoặc mã tour..."
                        className="search-group--full"
                    />
                </div>

                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div>
                            <label htmlFor="tour-service-region" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Miền</label>
                            <SelectMenu
                                id="tour-service-region"
                                ariaLabel="Lọc theo miền"
                                icon="fa-solid fa-location-dot"
                                value={current.region}
                                onChange={(value) => applyFilters({ region: value })}
                                options={[
                                    { value: "", label: "Tất cả miền", icon: "fa-solid fa-earth-asia" },
                                    ...regions.map((region) => ({
                                        value: region,
                                        label: region,
                                        icon: "fa-solid fa-location-dot",
                                    })),
                                ]}
                                className="sm:w-48"
                            />
                        </div>

                        <div>
                            <label htmlFor="tour-service-sort" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Sắp xếp</label>
                            <SelectMenu
                                id="tour-service-sort"
                                ariaLabel="Sắp xếp danh sách tour"
                                icon="fa-solid fa-arrow-down-wide-short"
                                value={current.sort}
                                onChange={(value) => applyFilters({ sort: value })}
                                options={[
                                    { value: "newest", label: "Mới nhất", icon: "fa-solid fa-clock-rotate-left" },
                                    { value: "name_asc", label: "Tên A-Z", icon: "fa-solid fa-font" },
                                    { value: "name_desc", label: "Tên Z-A", icon: "fa-solid fa-arrow-down-z-a" },
                                ]}
                                className="sm:w-44"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                        <p className="text-sm text-muted">
                            Tìm thấy <b className="text-foreground">{pagination?.total ?? tours.length}</b> tour
                            {refetching && (
                                <i className="fa-solid fa-spinner fa-spin ml-1.5 text-xs text-primary" aria-hidden="true" />
                            )}
                        </p>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="cursor-pointer text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-dark"
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
                    <div className="rounded-2xl border border-border bg-surface py-16 text-center text-muted">
                        <i className="fa-solid fa-list-check mb-3 text-primary" style={{ fontSize: 40 }} />
                        <p>Không có tour nào phù hợp.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {tours.map((tour) => (
                                <div
                                    key={tour.id}
                                    className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-3 sm:flex-row"
                                >
                                    <div className="shrink-0 sm:w-72">
                                        {tour.cover_image ? (
                                            <button
                                                type="button"
                                                onClick={() => setPreview({ src: tour.cover_image, alt: tour.name, caption: tour.name })}
                                                title="Bấm để xem ảnh bìa"
                                                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                            >
                                                <img
                                                    src={tour.cover_image}
                                                    alt={tour.name}
                                                    className="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-105 sm:h-[150px]"
                                                />
                                                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-white opacity-0 transition-opacity duration-200 group-hover:bg-slate-950/35 group-hover:opacity-100">
                                                    <i className="fa-solid fa-magnifying-glass-plus" style={{ fontSize: 22 }} />
                                                </span>
                                            </button>
                                        ) : (
                                            <div className="flex h-40 w-full items-center justify-center rounded-xl bg-primary-50 sm:h-[150px]">
                                                <i className="fa-solid fa-image text-primary" style={{ fontSize: 32 }} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-1 text-xs text-muted">Mã tour #{tour.id}</div>
                                                <h3 className="line-clamp-2 text-base font-semibold text-foreground">
                                                    {tour.name}
                                                </h3>
                                            </div>
                                            <div className="shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTour(tour)}
                                                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                                >
                                                    <i className="fa-solid fa-list-check" />
                                                    Chọn dịch vụ
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <span className="text-muted">
                                                <span className="text-primary/70">Miền:</span>{" "}
                                                <span className="font-medium text-foreground">{tour.region || "—"}</span>
                                            </span>
                                            <span className="text-muted">
                                                <span className="text-primary/70">Thời gian:</span>{" "}
                                                <span className="font-medium text-foreground">{tour.duration || "—"}</span>
                                            </span>
                                            <span className="text-muted">
                                                <span className="text-primary/70">Địa điểm:</span>{" "}
                                                <span className="font-medium text-foreground">{tour.location || "—"}</span>
                                            </span>
                                            <span className="text-muted">
                                                <span className="text-primary/70">Số dịch vụ:</span>{" "}
                                                <span className="font-bold text-primary">{tour.service_count || 0}</span>
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

            {activeTour && (
                <TourServiceFormModal
                    tour={activeTour}
                    onClose={() => setActiveTour(null)}
                    onSaved={handleSaved}
                />
            )}

            {preview && (
                <ImageLightbox
                    src={preview.src}
                    alt={preview.alt}
                    caption={preview.caption}
                    onClose={() => setPreview(null)}
                />
            )}
        </div>
    );
}
