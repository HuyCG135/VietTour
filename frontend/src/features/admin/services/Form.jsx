import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createService, getServiceById, updateService } from "./services.api";

const ICON_OPTIONS = [
    "fa-solid fa-concierge-bell",
    "fa-solid fa-hotel",
    "fa-solid fa-plane",
    "fa-solid fa-utensils",
    "fa-solid fa-user-tie",
    "fa-solid fa-shield-halved",
    "fa-solid fa-ticket",
    "fa-solid fa-van-shuttle",
    "fa-solid fa-wifi",
    "fa-solid fa-car",
    "fa-solid fa-ship",
    "fa-solid fa-mountain-sun",
];

const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

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

export default function ServiceForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        icon: "fa-solid fa-concierge-bell",
        status: 1,
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isEdit) return;

        let ignore = false;
        getServiceById(id)
            .then((data) => {
                if (ignore) return;
                if (!data.success) {
                    setError(data.message || "Không thể tải thông tin dịch vụ");
                    return;
                }
                const service = data.data;
                setForm({
                    name: service.name || "",
                    slug: service.slug || "",
                    description: service.description || "",
                    icon: service.icon || "fa-solid fa-concierge-bell",
                    status: Number(service.status ?? 1),
                });
            })
            .catch(() => {
                if (!ignore) setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => { ignore = true; };
    }, [id, isEdit]);

    const updateField = (key) => (event) => {
        setForm((previous) => ({ ...previous, [key]: event.target.value }));
    };

    const handleAutoSlug = () => {
        setForm((previous) => ({ ...previous, slug: slugify(previous.name) }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const name = form.name.trim();
        const slug = form.slug.trim() ? slugify(form.slug) : slugify(name);

        if (!name) {
            setError("Vui lòng nhập tên dịch vụ");
            return;
        }

        if (name.length > 255) {
            setError("Tên dịch vụ không được vượt quá 255 ký tự");
            return;
        }

        if (!slug) {
            setError("Vui lòng nhập slug hoặc nhập tên dịch vụ hợp lệ");
            return;
        }

        const payload = {
            name,
            slug,
            description: form.description.trim(),
            icon: form.icon.trim(),
            status: Number(form.status),
        };

        setSaving(true);
        const request = isEdit ? updateService(id, payload) : createService(payload);

        request
            .then((data) => {
                if (data.success) {
                    setSuccess(data.message || (isEdit ? "Cập nhật dịch vụ thành công" : "Tạo dịch vụ thành công"));
                    setTimeout(() => navigate("/admin/services"), 800);
                } else {
                    const detail = Array.isArray(data.errors) ? data.errors.join(", ") : "";
                    setError(detail || data.message || "Không thể lưu dịch vụ");
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

    const iconOptions = form.icon && !ICON_OPTIONS.includes(form.icon)
        ? [form.icon, ...ICON_OPTIONS]
        : ICON_OPTIONS;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl mb-0">
                    {isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}
                </h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/services")}
                    className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left mr-1.5" />
                    Quay lại
                </button>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-base mb-4">
                        <i className="fa-solid fa-circle-info text-blue-600 mr-2" />
                        Thông tin dịch vụ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="service-name" className={labelClass}>Tên dịch vụ *</label>
                            <input
                                id="service-name"
                                className={inputClass}
                                value={form.name}
                                onChange={updateField("name")}
                                placeholder="Ví dụ: Khách sạn 4 sao"
                                maxLength={255}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="service-slug" className={labelClass}>Slug</label>
                            <div className="flex gap-2">
                                <input
                                    id="service-slug"
                                    className={inputClass}
                                    value={form.slug}
                                    onChange={updateField("slug")}
                                    placeholder="khach-san-4-sao"
                                    maxLength={255}
                                />
                                <button
                                    type="button"
                                    onClick={handleAutoSlug}
                                    className="shrink-0 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                                    title="Tạo slug tự động từ tên dịch vụ"
                                    aria-label="Tạo slug tự động từ tên dịch vụ"
                                >
                                    <i className="fa-solid fa-wand-magic-sparkles" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">Dùng khi hiển thị định danh dịch vụ.</p>
                        </div>
                        <div>
                            <label htmlFor="service-status" className={labelClass}>Trạng thái</label>
                            <select
                                id="service-status"
                                className={`${inputClass} cursor-pointer`}
                                value={form.status}
                                onChange={updateField("status")}
                            >
                                <option value={1}>Đang hoạt động</option>
                                <option value={0}>Tạm ẩn</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1.5">Dịch vụ tạm ẩn sẽ không hiển thị với khách.</p>
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="service-description" className={labelClass}>Mô tả</label>
                            <textarea
                                id="service-description"
                                className={`${inputClass} min-h-[140px]`}
                                value={form.description}
                                onChange={updateField("description")}
                                placeholder="Mô tả ngắn gọn về dịch vụ..."
                                maxLength={10000}
                            />
                            <p className="text-xs text-gray-400 mt-1.5 text-right">{form.description.length}/10.000</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-base mb-4">
                        <i className="fa-solid fa-icons text-blue-600 mr-2" />
                        Biểu tượng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div>
                            <label htmlFor="service-icon" className={labelClass}>Icon Font Awesome</label>
                            <select
                                id="service-icon"
                                className={`${inputClass} cursor-pointer`}
                                value={form.icon}
                                onChange={updateField("icon")}
                            >
                                {iconOptions.map((icon) => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 min-h-[42px]">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                                <i className={form.icon || "fa-solid fa-concierge-bell"} />
                            </span>
                            <span className="text-sm text-gray-700">Xem trước biểu tượng</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/services")}
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
                        {isEdit ? "Lưu thay đổi" : "Tạo dịch vụ"}
                    </button>
                </div>
            </form>
        </div>
    );
}
