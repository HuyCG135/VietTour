import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItineraryDetail, updateItinerary } from "./itineraries.api";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors";

export default function ItineraryForm() {
    const { tourId } = useParams();
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const nextKey = useRef(1);

    useEffect(() => {
        let ignore = false;

        getItineraryDetail(tourId)
            .then((data) => {
                if (ignore) return;
                if (!data.success) {
                    setError(data.message || "Không thể tải thông tin lịch trình");
                    return;
                }
                const detail = data.data;
                setTour({
                    id: detail.id,
                    name: detail.name,
                    region: detail.region,
                    duration: detail.duration,
                });
                setRows(
                    (detail.itineraries || []).map((item) => ({
                        key: item.day_number,
                        day_number: item.day_number,
                        description: item.description,
                    })),
                );
            })
            .catch(() => {
                if (!ignore) setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => { ignore = true; };
    }, [tourId]);

    const addRow = () => {
        const maxDay = rows.reduce((max, row) => Math.max(max, Number(row.day_number) || 0), 0);
        setRows((prev) => [
            ...prev,
            { key: `${nextKey.current++}-${Date.now()}`, day_number: maxDay + 1, description: "" },
        ]);
    };

    const updateRow = (key, field, value) => {
        setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
    };

    const removeRow = (key) => {
        setRows((prev) => prev.filter((row) => row.key !== key));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const errors = [];
        const seenDays = new Set();

        if (rows.length === 0) {
            errors.push("Vui lòng thêm ít nhất một ngày trong lịch trình");
        }

        rows.forEach((row, index) => {
            const day = Number(row.day_number);
            if (!day || !Number.isInteger(day) || day <= 0) {
                errors.push(`Ngày ở dòng ${index + 1} phải là số nguyên dương`);
            } else if (seenDays.has(day)) {
                errors.push(`Ngày ${day} bị trùng trong lịch trình`);
            } else {
                seenDays.add(day);
            }

            if (!row.description.trim()) {
                errors.push(`Nội dung chi tiết ở dòng ${index + 1} không được để trống`);
            }
        });

        if (errors.length > 0) {
            setError(errors[0]);
            return;
        }

        setSaving(true);
        updateItinerary(
            tourId,
            rows.map((row) => ({
                day_number: Number(row.day_number),
                description: row.description.trim(),
            })),
        )
            .then((data) => {
                if (data.success) {
                    setSuccess(data.message || "Cập nhật lịch trình thành công");
                    setTimeout(() => navigate("/admin/itineraries"), 800);
                } else {
                    const detail = Array.isArray(data.errors) ? data.errors.join(", ") : "";
                    setError(detail || data.message || "Không thể lưu lịch trình");
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
                <h2 className="font-bold text-xl mb-0">Chỉnh sửa lịch trình</h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/itineraries")}
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
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-check mr-1.5" />
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-base mb-0">
                            <i className="fa-solid fa-route text-blue-600 mr-2" />
                            Chi tiết lịch trình từng ngày
                        </h3>
                        <button
                            type="button"
                            onClick={addRow}
                            className="shrink-0 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                        >
                            <i className="fa-solid fa-plus mr-1.5" />
                            Thêm ngày
                        </button>
                    </div>

                    {rows.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">
                            <i className="fa-regular fa-calendar-days mb-2" style={{ fontSize: 28 }} />
                            <p className="text-sm">Chưa có ngày nào trong lịch trình.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div key={row.key} className="border border-gray-200 rounded-xl p-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-24 shrink-0">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Ngày</label>
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={row.day_number}
                                                onChange={(e) => updateRow(row.key, "day_number", e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Nội dung chi tiết</label>
                                            <textarea
                                                rows={4}
                                                value={row.description}
                                                onChange={(e) => updateRow(row.key, "description", e.target.value)}
                                                placeholder={`Nội dung lịch trình ngày ${row.day_number || index + 1}...`}
                                                className={`${inputClass} min-h-[90px]`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeRow(row.key)}
                                            title="Xóa ngày này"
                                            className="shrink-0 mt-6 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 w-9 h-9 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <i className="fa-solid fa-trash" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/itineraries")}
                        className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {saving && <i className="fa-solid fa-spinner fa-spin" />}
                        Lưu lịch trình
                    </button>
                </div>
            </form>
        </div>
    );
}