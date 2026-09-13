import { useState } from "react";
import { changePassword } from "../user.api";
import { useToast } from "../../../context/ToastContext";

const PASSWORD_FIELDS = [
    {
        name: "currentPassword",
        label: "Mật khẩu hiện tại",
        placeholder: "Nhập mật khẩu hiện tại",
    },
    {
        name: "newPassword",
        label: "Mật khẩu mới",
        placeholder: "Tối thiểu 6 ký tự",
        helper: "Tối thiểu 6 ký tự, nên kết hợp chữ và số",
    },
    {
        name: "confirmPassword",
        label: "Xác nhận mật khẩu mới",
        placeholder: "Nhập lại mật khẩu mới",
    },
];

const inputClass =
    "w-full px-3.5 py-2.5 pr-11 border border-border rounded-xl text-sm text-foreground bg-surface placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-150";

export default function ChangePasswordForm() {
    const toast = useToast();
    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [visible, setVisible] = useState({});
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleVisible = (name) => {
        setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const validate = () => {
        if (!form.currentPassword) return "Vui lòng nhập mật khẩu hiện tại!";
        if (form.currentPassword === form.newPassword) return "Mật khẩu mới không được trùng với mật khẩu cũ!";
        if (form.newPassword.length < 6) return "Mật khẩu mới phải có ít nhất 6 ký tự!";
        if (form.newPassword !== form.confirmPassword) return "Mật khẩu mới và xác nhận không khớp!";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) {
            toast.danger(err);
            return;
        }

        setSaving(true);
        try {
            const res = await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });
            if (res.success) {
                setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setVisible({});
                toast.success(res.message || "Đổi mật khẩu thành công!");
            } else {
                const errorsText = Array.isArray(res.errors) ? res.errors.join("; ") : "";
                toast.danger(errorsText || res.message || "Đổi mật khẩu thất bại");
            }
        } catch {
            toast.danger("Lỗi kết nối, vui lòng thử lại");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                {PASSWORD_FIELDS.map((field) => (
                    <div key={field.name}>
                        <label htmlFor={field.name} className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                            {field.label}
                        </label>
                        <div className="relative">
                            <input
                                id={field.name}
                                name={field.name}
                                type={visible[field.name] ? "text" : "password"}
                                className={inputClass}
                                placeholder={field.placeholder}
                                value={form[field.name]}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => toggleVisible(field.name)}
                                aria-label={visible[field.name] ? `Ẩn ${field.label}` : `Hiện ${field.label}`}
                                title={visible[field.name] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <i className={visible[field.name] ? "fa-regular fa-eye-slash text-xs" : "fa-regular fa-eye text-xs"} />
                            </button>
                        </div>
                        {field.helper && (
                            <p className="text-[11px] text-muted mt-1 mb-0">{field.helper}</p>
                        )}
                    </div>
                ))}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-2.5 bg-primary hover:bg-primary-dark text-white transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    >
                        {saving ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin text-sm" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-key text-xs" />
                                <span>Đổi mật khẩu</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}