import { useState } from "react";
import Modal from "../../../components/Modal";
import { STATUS_OPTIONS, validators } from "./userUtils";

const inputClass =
    "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";
const inputErrorClass = "border-danger focus-visible:border-danger focus-visible:ring-danger/30";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";
const errorClass = "mt-1 text-xs font-medium text-danger";

const buildForm = (user) => ({
    fullname: user?.fullname ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    status: String(user?.status ?? 1),
});

// Modal sửa user: fullname/email/phone + trạng thái (Hoạt động / Đã khóa).
// Không sửa vai trò (đúng hành vi backend). Parent key theo user.id để state luôn mới.
export default function EditUserModal({ user, onClose, onSubmit }) {
    const [form, setForm] = useState(() => buildForm(user));
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    const setField = (field) => (event) => {
        const value = event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const next = {};
        if (!validators.fullname(form.fullname)) {
            next.fullname = "Họ tên không được để trống hoặc chỉ chứa số";
        }
        if (!validators.email(form.email)) {
            next.email = "Email không hợp lệ";
        }
        if (!validators.phone(form.phone)) {
            next.phone = "Số điện thoại không hợp lệ (bắt đầu bằng 0, đủ 10 số)";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerErrors([]);
        if (!validate()) return;

        setSaving(true);
        try {
            await onSubmit({
                fullname: form.fullname.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                status: Number(form.status),
            });
        } catch (error) {
            setServerErrors(error?.messages?.length ? error.messages : [error.message || "Không thể cập nhật user."]);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open onClose={saving ? undefined : onClose} size="md" ariaLabel="Chỉnh sửa user">
            <form onSubmit={handleSubmit}>
                <div className="border-b border-border px-6 py-5">
                    <h3 className="text-lg font-bold text-foreground">Chỉnh sửa User</h3>
                    <p className="mt-0.5 text-sm text-muted">Cập nhật thông tin và trạng thái tài khoản.</p>
                </div>

                <div className="space-y-4 px-6 py-6">
                    <div>
                        <label className={labelClass} htmlFor="edit-fullname">
                            Họ và tên
                        </label>
                        <input
                            id="edit-fullname"
                            type="text"
                            value={form.fullname}
                            onChange={setField("fullname")}
                            className={`${inputClass} ${errors.fullname ? inputErrorClass : ""}`}
                        />
                        {errors.fullname && <p className={errorClass}>{errors.fullname}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="edit-email">
                            Email
                        </label>
                        <input
                            id="edit-email"
                            type="email"
                            value={form.email}
                            onChange={setField("email")}
                            className={`${inputClass} ${errors.email ? inputErrorClass : ""}`}
                        />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="edit-phone">
                            Số điện thoại
                        </label>
                        <input
                            id="edit-phone"
                            type="text"
                            value={form.phone}
                            onChange={setField("phone")}
                            className={`${inputClass} ${errors.phone ? inputErrorClass : ""}`}
                        />
                        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="edit-status">
                            Trạng thái
                        </label>
                        <select
                            id="edit-status"
                            value={form.status}
                            onChange={setField("status")}
                            className={`${inputClass} cursor-pointer`}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={String(option.value)}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {serverErrors.length > 0 && (
                        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                            <i className="fa-solid fa-circle-exclamation mr-1.5" />
                            {serverErrors.length === 1 ? (
                                serverErrors[0]
                            ) : (
                                <ul className="ml-4 list-disc space-y-0.5">
                                    {serverErrors.map((message, index) => (
                                        <li key={index}>{message}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-slate-50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving && <i className="fa-solid fa-spinner fa-spin" />}
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </Modal>
    );
}