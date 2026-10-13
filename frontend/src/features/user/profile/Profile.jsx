import { useState, useEffect } from "react";
import EditableField from "./EditableField";
import ChangePasswordForm from "./ChangePasswordForm";
import UserPageHeader from "../../../components/UserPageHeader";
import { getProfile, patchProfile } from "../user.api";
import { getUser, setUser } from "../../auth/auth.api.js";
import { useToast } from "../../../context/ToastContext";

const FIELDS = [
    { id: "fullname", label: "Họ và tên", icon: "fa-regular fa-user" },
    { id: "email", label: "Email", icon: "fa-regular fa-envelope", editable: false, badge: "Cố định" },
    { id: "phone", label: "Số điện thoại", icon: "fa-solid fa-phone" },
    { id: "address", label: "Địa chỉ", icon: "fa-solid fa-location-dot" },
];

export default function Profile() {
    const toast = useToast();
    const [values, setValues] = useState(() => {
        const user = getUser();
        return {
            fullname: user?.fullname || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
        };
    });
    const [editing, setEditing] = useState({});
    const [drafts, setDrafts] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await getProfile();
                if (!mounted) return;
                if (res.success && res.data) {
                    setValues({
                        fullname: res.data.fullname || "",
                        email: res.data.email || "",
                        phone: res.data.phone || "",
                        address: res.data.address || "",
                    });
                } else {
                    setLoadError(res.message || "Không thể tải thông tin cá nhân");
                }
            } catch {
                if (mounted) setLoadError("Lỗi khi tải thông tin cá nhân");
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const toggleEdit = (id) => {
        if (savingId) return;
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
        } else {
            setEditing((prev) => ({ ...prev, [id]: true }));
            setDrafts((prev) => ({ ...prev, [id]: values[id] || "" }));
        }
    };

    const changeDraft = (id, draft) => {
        if (savingId) return;
        setDrafts((prev) => ({ ...prev, [id]: draft }));
    };

    const commitField = async (id) => {
        if (savingId) return;
        const value = (drafts[id] ?? "").trim();
        setSavingId(id);
        try {
            const res = await patchProfile({ [id]: value });
            if (res.success) {
                const saved = res.data || {};
                const user = getUser() || {};
                setUser({ ...user, ...saved });
                setValues((prev) => ({
                    ...prev,
                    fullname: saved.fullname ?? prev.fullname,
                    phone: saved.phone ?? prev.phone,
                    address: saved.address ?? prev.address,
                }));
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
                toast.success(res.message || "Đã lưu thông tin!");
            } else {
                const errorsText = Array.isArray(res.errors) ? res.errors.join("; ") : "";
                toast.danger(errorsText || res.message || "Không thể cập nhật");
            }
        } catch {
            toast.danger("Lỗi kết nối, vui lòng thử lại");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <UserPageHeader
                title="Hồ sơ & Bảo mật"
                subtitle="Quản lý thông tin liên hệ và thiết lập mật khẩu bảo vệ tài khoản"
            />

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

                    {/* Alert tải profile lỗi */}
                    {loadError && (
                        <div role="alert" className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 text-danger px-4 py-3 text-sm mb-4">
                            <i className="fa-solid fa-circle-exclamation" />
                            <span>{loadError}</span>
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
                                saving={savingId === field.id}
                                onToggleEdit={toggleEdit}
                                onDraftChange={changeDraft}
                                onCommit={commitField}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-muted mt-4 mb-0">
                        Sửa thông tin rồi bấm ✓ để lưu, ✕ để hủy bỏ sửa đổi
                    </p>
                </section>

                {/* Cột 2: Đổi mật khẩu */}
                <section
                    aria-labelledby="password-title"
                    className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8"
                >
                    <header className="flex items-center gap-3 mb-5">
                        <span className="w-9 h-9 shrink-0 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-sm shadow-xs">
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