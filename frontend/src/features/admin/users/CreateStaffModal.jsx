import { useState } from "react";
import Modal from "../../../components/Modal";
import { ROLE_META, validators } from "./userUtils";

// Vai trò được phép tạo + màu nhấn icon (giống dải màu bản cũ: booking xanh dương, tour xanh lá, admin hổ phách).
const STAFF_ROLES = ["booking-staff", "tour-staff", "admin"];
const ROLE_ACCENT = {
    "booking-staff": "text-primary",
    "tour-staff": "text-success",
    admin: "text-accent",
};

const inputClass =
    "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";
const inputErrorClass = "border-danger focus-visible:border-danger focus-visible:ring-danger/30";
const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";
const errorClass = "mt-1 text-xs font-medium text-danger";

const EMPTY_FORM = {
    role: "booking-staff",
    fullname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function CreateStaffModal({ onClose, onSubmit }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [serverErrors, setServerErrors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
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
        if (!validators.phone(form.phone)) {
            next.phone = "Số điện thoại không hợp lệ (bắt đầu bằng 0, đủ 10 số)";
        }
        if (!validators.email(form.email)) {
            next.email = "Email không hợp lệ";
        }
        if (!validators.password(form.password)) {
            next.password = "Mật khẩu tối thiểu 6 ký tự";
        }
        if (!validators.confirmPassword(form.password, form.confirmPassword)) {
            next.confirmPassword = "Mật khẩu xác nhận không khớp";
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
                role: form.role,
                fullname: form.fullname.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                password: form.password,
                confirmPassword: form.confirmPassword,
            });
        } catch (error) {
            setServerErrors(error?.messages?.length ? error.messages : [error.message || "Không thể tạo tài khoản."]);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open onClose={saving ? undefined : onClose} size="lg" ariaLabel="Tạo tài khoản nhân viên">
            <form onSubmit={handleSubmit}>
                <div className="border-b border-border bg-primary-50/60 px-6 py-5">
                    <h3 className="text-lg font-bold text-foreground">
                        <i className="fa-solid fa-user-tie mr-2 text-primary" />
                        Tạo tài khoản nhân viên
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                        Tài khoản mới sẽ được kích hoạt ngay và có thể đăng nhập được liền.
                    </p>
                </div>

                <div className="space-y-4 px-6 py-6">
                    {/* Vai trò */}
                    <div>
                        <span className={labelClass}>
                            Vị trí / Vai trò <span className="text-danger">*</span>
                        </span>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            {STAFF_ROLES.map((role) => {
                                const meta = ROLE_META[role];
                                const active = form.role === role;
                                return (
                                    <label
                                        key={role}
                                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-3 py-3.5 text-center text-sm font-semibold transition-colors duration-150 ${
                                            active
                                                ? "border-primary bg-primary-50 text-primary"
                                                : "border-border text-muted hover:border-primary/40 hover:text-foreground"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="staffRole"
                                            value={role}
                                            checked={active}
                                            onChange={() => setForm((prev) => ({ ...prev, role }))}
                                            className="sr-only"
                                        />
                                        <i className={`${meta.icon} text-xl ${ROLE_ACCENT[role]}`} />
                                        {meta.label}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Họ tên + SĐT */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass} htmlFor="staff-fullname">
                                Họ và tên <span className="text-danger">*</span>
                            </label>
                            <input
                                id="staff-fullname"
                                type="text"
                                value={form.fullname}
                                onChange={setField("fullname")}
                                placeholder="Nguyễn Văn A"
                                className={`${inputClass} ${errors.fullname ? inputErrorClass : ""}`}
                            />
                            {errors.fullname && <p className={errorClass}>{errors.fullname}</p>}
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="staff-phone">
                                Số điện thoại <span className="text-danger">*</span>
                            </label>
                            <input
                                id="staff-phone"
                                type="text"
                                value={form.phone}
                                onChange={setField("phone")}
                                placeholder="09xxxxxxxx"
                                className={`${inputClass} ${errors.phone ? inputErrorClass : ""}`}
                            />
                            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass} htmlFor="staff-email">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            id="staff-email"
                            type="email"
                            value={form.email}
                            onChange={setField("email")}
                            placeholder="nhanvien@vietravel.vn"
                            className={`${inputClass} ${errors.email ? inputErrorClass : ""}`}
                        />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    {/* Mật khẩu + xác nhận */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass} htmlFor="staff-password">
                                Mật khẩu <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="staff-password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={setField("password")}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className={`${inputClass} pr-10 ${errors.password ? inputErrorClass : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label="Hiện/ẩn mật khẩu"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-150 hover:text-primary"
                                >
                                    <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                                </button>
                            </div>
                            {errors.password && <p className={errorClass}>{errors.password}</p>}
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="staff-confirm">
                                Xác nhận mật khẩu <span className="text-danger">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="staff-confirm"
                                    type={showConfirm ? "text" : "password"}
                                    value={form.confirmPassword}
                                    onChange={setField("confirmPassword")}
                                    placeholder="Nhập lại mật khẩu"
                                    className={`${inputClass} pr-10 ${
                                        errors.confirmPassword ? inputErrorClass : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                    aria-label="Hiện/ẩn mật khẩu xác nhận"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors duration-150 hover:text-primary"
                                >
                                    <i className={showConfirm ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"} />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className={errorClass}>{errors.confirmPassword}</p>
                            )}
                        </div>
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
                        {saving ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-user-plus" />}
                        Tạo tài khoản
                    </button>
                </div>
            </form>
        </Modal>
    );
}