import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTourServiceDetail, updateTourServices } from "./tour-services.api";
import SearchBox from "../../../components/SearchBox";

export default function TourServiceForm() {
    const { tourId } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let ignore = false;

        getTourServiceDetail(tourId)
            .then((response) => {
                if (ignore) return;
                if (!response.success) {
                    setError(response.message || "Không thể tải thông tin dịch vụ tour");
                    return;
                }

                const detail = response.data;
                const serviceList = detail.services || [];
                setTour({
                    id: detail.id,
                    name: detail.name,
                    region: detail.region,
                    duration: detail.duration,
                });
                setServices(serviceList);
                setSelectedIds(new Set(
                    serviceList
                        .filter((service) => service.selected)
                        .map((service) => Number(service.id)),
                ));
            })
            .catch(() => {
                if (!ignore) setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => { ignore = true; };
    }, [tourId]);

    const visibleServices = services.filter((service) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return (
            service.name.toLowerCase().includes(keyword) ||
            (service.description || "").toLowerCase().includes(keyword)
        );
    });

    const toggleService = (service) => {
        const id = Number(service.id);
        const isSelected = selectedIds.has(id);
        if (Number(service.status) !== 1 && !isSelected) return;

        setSelectedIds((previous) => {
            const next = new Set(previous);
            if (isSelected) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        updateTourServices(tourId, [...selectedIds])
            .then((response) => {
                if (response.success) {
                    setSuccess(response.message || "Cập nhật dịch vụ tour thành công");
                    setTimeout(() => navigate("/admin/tour-services"), 800);
                } else {
                    const detail = Array.isArray(response.errors) ? response.errors.join(", ") : "";
                    setError(detail || response.message || "Không thể lưu dịch vụ tour");
                }
            })
            .catch(() => setError("Không thể kết nối đến máy chủ"))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl mb-0">Chọn dịch vụ cho tour</h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/tour-services")}
                    className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left mr-1.5" />
                    Quay lại
                </button>
            </div>

            {tour && (
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                    <span className="text-gray-400">Mã tour:</span>
                    <b className="text-gray-800">#{tour.id}</b>
                    <span className="text-gray-400">Tên tour:</span>
                    <b className="text-gray-800">{tour.name}</b>
                    <span className="text-gray-400">Miền:</span>
                    <b className="text-gray-800">{tour.region || "—"}</b>
                    <span className="text-gray-400">Thời gian:</span>
                    <b className="text-gray-800">{tour.duration || "—"}</b>
                </div>
            )}

            {error && (
                <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {error}
                </div>
            )}
            {success && (
                <div role="status" className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-check mr-1.5" />
                    {success}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                <i className="fa-solid fa-list-check text-blue-600 mr-2" />
                                Dịch vụ đi kèm tour
                            </h3>
                            <p className="text-sm text-gray-500">
                                Đã chọn <b className="text-gray-800">{selectedIds.size}</b> dịch vụ. Dịch vụ tạm ẩn chỉ được giữ lại nếu đang gắn với tour.
                            </p>
                        </div>
                        {selectedIds.size > 0 && (
                            <button
                                type="button"
                                onClick={() => setSelectedIds(new Set())}
                                className="shrink-0 text-sm text-red-500 hover:text-red-700 font-medium cursor-pointer"
                            >
                                Bỏ chọn tất cả
                            </button>
                        )}
                    </div>

                    <div className="mb-4">
                        <SearchBox
                            value={search}
                            onChange={setSearch}
                            onSearch={setSearch}
                            placeholder="Tìm kiếm dịch vụ theo tên hoặc mô tả..."
                            className="search-group--full"
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {visibleServices.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                            <i className="fa-solid fa-concierge-bell mb-3" style={{ fontSize: 36 }} />
                            <p className="text-sm">
                                {services.length === 0 ? "Chưa có dịch vụ nào trong hệ thống." : "Không tìm thấy dịch vụ phù hợp."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {visibleServices.map((service) => {
                                const id = Number(service.id);
                                const selected = selectedIds.has(id);
                                const disabled = Number(service.status) !== 1 && !selected;
                                return (
                                    <label
                                        key={id}
                                        className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                                            disabled
                                                ? "border-gray-100 bg-gray-50 opacity-60"
                                                : "border-gray-200 hover:border-blue-300 cursor-pointer"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            disabled={disabled}
                                            onChange={() => toggleService(service)}
                                            className="mt-1 h-4 w-4 accent-blue-600"
                                            aria-label={`Chọn dịch vụ ${service.name}`}
                                        />
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
                                            <i className={service.icon || "fa-solid fa-concierge-bell"} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <b className="text-sm text-gray-800">{service.name}</b>
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${Number(service.status) === 1 ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${Number(service.status) === 1 ? "bg-green-500" : "bg-gray-400"}`} />
                                                    {Number(service.status) === 1 ? "Đang hoạt động" : "Tạm ẩn"}
                                                </span>
                                            </span>
                                            {service.description && (
                                                <span className="block text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/tour-services")}
                        className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={saving || !tour}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {saving && <i className="fa-solid fa-spinner fa-spin" />}
                        Lưu dịch vụ
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}
