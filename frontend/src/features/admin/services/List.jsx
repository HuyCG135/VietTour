import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteService, getAllServices } from "./services.api";
import Pagination from "../../tours/Pagination";
import SearchBox from "../../../components/SearchBox";

const normalizeParams = (searchParams) => ({
    q: searchParams.get("q") ?? "",
    status: searchParams.get("status") ?? "",
    sort: searchParams.get("sort") ?? "newest",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
});

const buildQueryString = (params) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.status !== undefined && params.status !== null && params.status !== "") {
        search.set("status", params.status);
    }
    if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
    if (params.page > 1) search.set("page", params.page);
    return search.toString();
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
};

export default function ServiceList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const current = normalizeParams(searchParams);
    const [services, setServices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState("");
    const [draft, setDraft] = useState({ q: current.q, status: current.status });
    const [deleting, setDeleting] = useState(null);
    const [deletingLoading, setDeletingLoading] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getAllServices(normalizeParams(searchParams));
                if (ignore) return;
                if (response.success) {
                    setServices(response.data || []);
                    setPagination(response.pagination || null);
                } else {
                    setServices([]);
                    setPagination(null);
                    setError(response.message || "Không thể tải danh sách dịch vụ");
                }
            } catch {
                if (ignore) return;
                setServices([]);
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
    }, [searchParams, reloadKey]);

    const commit = (params) => {
        setDraft({ q: params.q ?? "", status: params.status ?? "" });
        setSearchParams(buildQueryString(params), { replace: true });
    };

    const applyFilters = (next) => {
        commit({ ...current, ...next, page: 1 });
    };

    const clearFilters = () => {
        commit({ q: "", status: "", sort: "newest", page: 1 });
    };

    const changePage = (page) => {
        if (page < 1 || (pagination && page > pagination.totalPages)) return;
        commit({ ...current, page });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = () => {
        if (!deleting) return;

        setDeletingLoading(true);
        deleteService(deleting.id)
            .then((response) => {
                setDeleting(null);
                if (!response.success) {
                    setError(response.message || "Không thể xóa dịch vụ");
                    return;
                }

                setError("");
                if (pagination && current.page > 1 && services.length === 1) {
                    changePage(current.page - 1);
                } else {
                    setSearchParams(buildQueryString(current), { replace: true });
                }
            })
            .catch(() => {
                setDeleting(null);
                setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => setDeletingLoading(false));
    };

    const hasFilters = Boolean(current.q || current.status);
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
            <div className="flex items-center justify-between gap-3 mb-6">
                <h2 className="font-bold text-xl mb-0">Quản lý dịch vụ</h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/services/new")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                    <i className="fa-solid fa-plus" />
                    Thêm dịch vụ
                </button>
            </div>

            {error && (
                <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 flex items-center justify-between gap-3">
                    <span><i className="fa-solid fa-circle-exclamation mr-1.5" />{error}</span>
                    <button
                        type="button"
                        onClick={() => setReloadKey((value) => value + 1)}
                        className="shrink-0 underline font-medium cursor-pointer"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_180px_180px] gap-3">
                    <div>
                        <label htmlFor="service-search" className="sr-only">Tìm kiếm dịch vụ</label>
                        <SearchBox
                            value={draft.q}
                            onChange={(value) => setDraft((previous) => ({ ...previous, q: value }))}
                            onSearch={(value) => applyFilters({ q: value.trim() })}
                            placeholder="Tìm kiếm theo tên, slug hoặc mô tả..."
                            className="search-group--full"
                        />
                    </div>
                    <div>
                        <label htmlFor="service-status-filter" className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
                        <select
                            id="service-status-filter"
                            value={current.status}
                            onChange={(event) => applyFilters({ status: event.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="1">Đang hoạt động</option>
                            <option value="0">Tạm ẩn</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="service-sort" className="block text-xs font-medium text-gray-500 mb-1">Sắp xếp</label>
                        <select
                            id="service-sort"
                            value={current.sort}
                            onChange={(event) => applyFilters({ sort: event.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="updated_desc">Cập nhật gần đây</option>
                            <option value="name_asc">Tên A-Z</option>
                            <option value="name_desc">Tên Z-A</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                    <p>
                        Tìm thấy <b className="text-gray-800">{pagination?.total ?? services.length}</b> dịch vụ
                        {refetching && <i className="fa-solid fa-spinner fa-spin text-blue-600 text-xs ml-1.5" aria-hidden="true" />}
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

            <div className={`transition-opacity duration-150 ${refetching ? "opacity-60 pointer-events-none" : ""}`}>
                {services.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm text-center text-gray-500 py-16 px-4">
                        <i className="fa-solid fa-concierge-bell text-blue-600 mb-3 text-4xl" />
                        <h3 className="font-semibold text-gray-800 mb-1">Chưa có dịch vụ phù hợp</h3>
                        <p className="text-sm mb-5">Thử xóa bộ lọc hoặc thêm dịch vụ mới cho tour.</p>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/services/new")}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <i className="fa-solid fa-plus mr-1.5" />
                            Thêm dịch vụ
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {services.map((service) => {
                                const isActive = Number(service.status) === 1;
                                return (
                                    <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
                                                <i className={service.icon || "fa-solid fa-concierge-bell"} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-base text-gray-900 break-words">
                                                            {service.name}
                                                        </h3>
                                                        {service.slug && <p className="text-xs text-gray-400 mt-0.5 break-all">/{service.slug}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
                                                            {isActive ? "Đang hoạt động" : "Tạm ẩn"}
                                                        </span>
                                                    </div>
                                                </div>
                                                {service.description && (
                                                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{service.description}</p>
                                                )}
                                                <div className="mt-3 text-xs text-gray-400">
                                                    Cập nhật lần cuối: {formatDate(service.updated_at)}
                                                </div>
                                            </div>
                                            <div className="hidden sm:flex shrink-0 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleting(service)}
                                                    className="border border-red-500 text-red-500 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex sm:hidden gap-2 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                                className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleting(service)}
                                                className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 font-medium px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {pagination && <Pagination page={current.page} totalPages={pagination.totalPages} onChange={changePage} />}
                    </>
                )}
            </div>

            {deleting && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-service-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
                    onClick={() => !deletingLoading && setDeleting(null)}
                >
                    <div
                        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 id="delete-service-title" className="font-bold text-lg text-red-600 flex items-center gap-2 mb-3">
                            <i className="fa-solid fa-triangle-exclamation" />
                            Xóa dịch vụ
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Quý khách chắc chắn muốn xóa dịch vụ <b>“{deleting.name}”</b> không?
                        </p>
                        <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">
                            <i className="fa-solid fa-circle-info mr-1.5" />
                            Dịch vụ sẽ bị gỡ khỏi tất cả tour đang sử dụng và không thể khôi phục.
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
