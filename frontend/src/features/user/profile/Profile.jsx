import { useState } from "react";
import EditableField from "./EditableField";
import ChangePasswordForm from "./ChangePasswordForm";

// Data mock — giai đoạn gắn backend sẽ thay bằng dữ liệu từ getUser() / GET profile
const MOCK_PROFILE = {
    fullname: "Nguyễn Minh Anh",
    email: "minhanh.nguyen@example.com",
    phone: "0912 345 678",
    address: "12 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
};

const FIELDS = [
    { id: "fullname", label: "Họ và tên", icon: "fa-regular fa-user" },
    { id: "email", label: "Email", icon: "fa-regular fa-envelope", editable: false, badge: "Cố định" },
    { id: "phone", label: "Số điện thoại", icon: "fa-solid fa-phone" },
    { id: "address", label: "Địa chỉ", icon: "fa-solid fa-location-dot" },
];

const primaryBtn =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-2.5 bg-primary hover:bg-primary-dark text-white transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

const secondaryBtn =
    "inline-flex items-center justify-center gap-2 font-bold rounded-xl px-5 py-2.5 border border-border text-foreground hover:bg-primary-50 hover:text-primary transition-colors duration-150 cursor-pointer text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2";

export default function Profile() {
    const [values, setValues] = useState(MOCK_PROFILE);
    const [editing, setEditing] = useState({});
    const [drafts, setDrafts] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const editingCount = Object.keys(editing).length;

    const toggleEdit = (id) => {
        if (editing[id]) {
            setEditing((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            setDrafts((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
            setMessage({ text: "", type: "" });
        } else {
            setEditing((prev) => ({ ...prev, [id]: true }));
            setDrafts((prev) => ({ ...prev, [id]: values[id] || "" }));
        }
    };

    const changeDraft = (id, draft) => setDrafts((prev) => ({ ...prev, [id]: draft }));

    const commitField = (id) => {
        setValues((prev) => ({ ...prev, [id]: (drafts[id] ?? "").trim() }));
        toggleEdit(id);
    };

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);
        setMessage({ text: "", type: "" });
        // Mock gọi API updateProfile — thay bằng user.api thật ở giai đoạn gắn backend
        await new Promise((r) => setTimeout(r, 800));
        setValues((prev) => {
            const next = { ...prev };
            Object.keys(editing).forEach((id) => {
                next[id] = (drafts[id] ?? "").trim();
            });
            return next;
        });
        setEditing({});
        setDrafts({});
        setSaving(false);
        setMessage({ text: "Cập nhật thông tin thành công!", type: "success" });
    };

    const handleCancelAll = () => {
        setEditing({});
        setDrafts({});
        setMessage({ text: "", type: "" });
    };

    const alertClass =
        message.type === "danger"
            ? "bg-danger/10 text-danger border-danger/30"
            : "bg-success/10 text-success border-success/30";

    return (
        <div className="space-y-6">
            {/* Header chung */}
            <div className="pb-5 border-b border-border">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-1">
                    Hồ sơ &amp; Bảo mật
                </h2>
                <p className="text-sm text-muted mb-0">
                    Quản lý thông tin liên hệ và thiết lập mật khẩu bảo vệ tài khoản
                </p>
            </div>

            {/* Grid 2 cột: Cột trái Thông tin cá nhân, Cột phải Đổi mật khẩu */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Cột 1: Thông tin cá nhân */}
                <section aria-labelledby="profile-title" className="lg:col-span-7">
                    <header className="flex items-center gap-3 mb-5">
                        <span className="w-9 h-9 shrink-0 rounded-xl bg-primary-100 text-primary flex items-center justify-center text-sm shadow-xs">
                            <i className="fa-regular fa-circle-user" />
                        </span>
                        <div>
                            <h3 id="profile-title" className="text-base font-bold text-foreground leading-tight mb-0.5">
                                Thông tin cá nhân
                            </h3>
                            <p className="text-xs text-muted mb-0">
                                Xem và cập nhật thông tin liên hệ của quý khách
                            </p>
                        </div>
                    </header>

                    {/* Alert thông báo */}
                    {message.text && (
                        <div role="alert" className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm mb-4 ${alertClass}`}>
                            <i className={message.type === "danger" ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check"} />
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Danh sách trường thông tin */}
                    <div className="space-y-2.5">
                        {FIELDS.map((field) => (
                            <EditableField
                                key={field.id}
                                id={field.id}
                                label={field.label}
                                icon={field.icon}
                                badge={field.badge}
                                value={values[field.id]}
                                editing={!!editing[field.id]}
                                draft={drafts[field.id]}
                                editable={field.editable !== false}
                                onToggleEdit={toggleEdit}
                                onDraftChange={changeDraft}
                                onCommit={commitField}
                            />
                        ))}
                    </div>

                    {/* Action buttons khi đang sửa */}
                    {editingCount > 0 && (
                        <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-border">
                            <button type="button" onClick={handleCancelAll} className={secondaryBtn}>
                                Hủy
                            </button>
                            <button type="button" onClick={handleSave} disabled={saving} className={primaryBtn}>
                                {saving && <i className="fa-solid fa-spinner fa-spin" />}
                                Lưu thay đổi ({editingCount})
                            </button>
                        </div>
                    )}
                </section>

                {/* Cột 2: Đổi mật khẩu */}
                <section
                    aria-labelledby="password-title"
                    className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8"
                >
                    <header className="flex items-center gap-3 mb-5">
                        <span className="w-9 h-9 shrink-0 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-sm shadow-xs">
                            <i className="fa-solid fa-key" />
                        </span>
                        <div>
                            <h3 id="password-title" className="text-base font-bold text-foreground leading-tight mb-0.5">
                                Đổi mật khẩu
                            </h3>
                            <p className="text-xs text-muted mb-0">
                                Cập nhật mật khẩu để bảo vệ tài khoản
                            </p>
                        </div>
                    </header>

                    <ChangePasswordForm />
                </section>
            </div>
        </div>
    );
}