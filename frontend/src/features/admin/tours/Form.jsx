import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTourById, createTour, updateTour } from "./tours.api";

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"];

const slugify = (value) =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-colors";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function TourForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        slug: "",
        location: "",
        region: "",
        duration: "",
        price_default: "",
        price_child: "",
        cover_image: "",
        description: "",
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isEdit) return;

        getTourById(id)
            .then((data) => {
                if (!data.success) {
                    setError(data.message || "Không thể tải thông tin tour");
                    return;
                }
                const tour = data.data;
                setForm({
                    name: tour.name || "",
                    slug: tour.slug || "",
                    location: tour.location || "",
                    region: tour.region || "",
                    duration: tour.duration || "",
                    price_default: tour.price_default ?? "",
                    price_child: tour.price_child ?? "",
                    cover_image: tour.cover_image || "",
                    description: tour.description || "",
                });
            })
            .catch(() => setError("Không thể kết nối đến máy chủ"))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const updateField = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleAutoSlug = () => {
        setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!form.name.trim() || !form.location.trim() || !form.region.trim() || !form.duration.trim()) {
            setError("Vui lòng điền đầy đủ tên tour, địa điểm, vùng miền và thời gian");
            return;
        }

        if (form.price_default === "" || form.price_default === null || Number(form.price_default) < 0) {
            setError("Giá người lớn phải là số không âm");
            return;
        }

        if (form.price_child === "" || form.price_child === null || Number(form.price_child) < 0) {
            setError("Giá trẻ em phải là số không âm");
            return;
        }

        const payload = {
            ...form,
            price_default: Number(form.price_default),
            price_child: Number(form.price_child),
            slug: form.slug.trim() ? slugify(form.slug) : slugify(form.name),
        };

        setSaving(true);
        const request = isEdit ? updateTour(id, payload) : createTour(payload);

        request
            .then((data) => {
                if (data.success) {
                    setSuccess(data.message || (isEdit ? "Cập nhật tour thành công" : "Tạo tour thành công"));
                    setTimeout(() => navigate("/admin/tours"), 800);
                } else {
                    const detail = Array.isArray(data.errors) ? data.errors.join(", ") : "";
                    setError(detail || data.message || "Không thể lưu tour");
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
                <h2 className="font-bold text-xl mb-0">
                    {isEdit ? "Chỉnh sửa Tour" : "Thêm Tour"}
                </h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/tours")}
                    className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left mr-1.5" />
                    Quay lại
                </button>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-base mb-4">
                        <i className="fa-solid fa-circle-info text-blue-600 mr-2" />
                        Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Tên tour *</label>
                            <input
                                className={inputClass}
                                value={form.name}
                                onChange={updateField("name")}
                                placeholder="Ví dụ: Tour Đà Lạt 3N2Đ"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Slug</label>
                            <div className="flex gap-2">
                                <input
                                    className={inputClass}
                                    value={form.slug}
                                    onChange={updateField("slug")}
                                    placeholder="tour-da-lat"
                                />
                                <button
                                    type="button"
                                    onClick={handleAutoSlug}
                                    className="shrink-0 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                    title="Tạo slug tự động từ tên tour"
                                >
                                    <i className="fa-solid fa-wand-magic-sparkles" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Địa điểm *</label>
                            <input
                                className={inputClass}
                                value={form.location}
                                onChange={updateField("location")}
                                placeholder="Ví dụ: Đà Lạt"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Vùng miền *</label>
                            <select
                                className={inputClass}
                                value={form.region}
                                onChange={updateField("region")}
                            >
                                <option value="">Chọn vùng miền</option>
                                {REGIONS.map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Thời gian *</label>
                            <input
                                className={inputClass}
                                value={form.duration}
                                onChange={updateField("duration")}
                                placeholder="Ví dụ: 3 ngày 2 đêm"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Giá người lớn (VNĐ) *</label>
                            <input
                                className={inputClass}
                                type="number"
                                min="0"
                                step="any"
                                value={form.price_default}
                                onChange={updateField("price_default")}
                                placeholder="3200000"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Giá trẻ em (VNĐ) *</label>
                            <input
                                className={inputClass}
                                type="number"
                                min="0"
                                step="any"
                                value={form.price_child}
                                onChange={updateField("price_child")}
                                placeholder="2200000"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Ảnh bìa (URL)</label>
                            <input
                                className={inputClass}
                                value={form.cover_image}
                                onChange={updateField("cover_image")}
                                placeholder="https://.../cover.jpg"
                            />
                            {form.cover_image && (
                                <img
                                    src={form.cover_image}
                                    alt="Ảnh bìa"
                                    className="mt-2 h-32 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Mô tả</label>
                            <textarea
                                className={`${inputClass} min-h-[140px]`}
                                value={form.description}
                                onChange={updateField("description")}
                                placeholder="Giới thiệu về tour..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/tours")}
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
                        {isEdit ? "Lưu thay đổi" : "Tạo tour"}
                    </button>
                </div>
            </form>
        </div>
    );
}