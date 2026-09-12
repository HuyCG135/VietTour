import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../features/auth/auth.api";

// Data mock fallback — khi chưa đăng nhập để preview giao diện
const MOCK_USER = { fullname: "Nguyễn Minh Anh", email: "minhanh.nguyen@example.com", role: "customer" };

const STAFF_ROLES = ["admin", "booking-staff", "tour-staff"];

const accountItems = [
    { to: "/user/profile", label: "Thông tin cá nhân", icon: "fa-regular fa-circle-user" },
];

const serviceItems = [
    { to: "/user/bookings", label: "Đơn đặt chỗ", icon: "fa-solid fa-ticket-simple" },
    { to: "/user/reviews", label: "Đánh giá của quý khách", icon: "fa-regular fa-comment-dots" },
    { to: "/user/favorite", label: "Yêu thích đã lưu", icon: "fa-solid fa-heart" },
];

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 no-underline w-full px-3 py-2.5 rounded-lg font-medium transition-colors duration-150 ${
        isActive ? "bg-primary text-white shadow-xs" : "text-muted hover:bg-primary-50 hover:text-primary"
    }`;

export default function UserSidebar() {
    const navigate = useNavigate();
    const user = getUser() || MOCK_USER;
    const isStaff = STAFF_ROLES.includes((user.role || "").toLowerCase());
    const initial = (user.fullname || "K").charAt(0).toUpperCase();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="bg-surface rounded-2xl border border-border shadow-[0_8px_28px_rgba(30,41,59,0.08)] py-5 px-4 flex flex-col justify-between h-full">
            <div>
                {/* User info mini header */}
                <div className="flex items-center gap-3 px-2 pb-5 mb-5 border-b border-border">
                    <div className="w-11 h-11 shrink-0 rounded-full bg-linear-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-base shadow-xs">
                        {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-bold text-foreground truncate text-sm">{user.fullname || "Khách"}</div>
                        <div className="text-xs text-muted truncate">{user.email || ""}</div>
                    </div>
                </div>

                {/* Nav items */}
                <div className="space-y-5">
                    <nav aria-label="Tài khoản">
                        <div className="flex items-center gap-2 px-2 mb-2">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-primary-100 text-primary text-[11px]">
                                <i className="fa-regular fa-user" />
                            </span>
                            <span className="font-bold text-xs tracking-wider text-muted uppercase">Tài khoản</span>
                        </div>
                        <div className="rounded-xl bg-background/80 p-1.5">
                            <ul className="list-none p-0 m-0 flex flex-col gap-1">
                                {accountItems.map((item) => (
                                    <li key={item.to}>
                                        <NavLink to={item.to} className={linkClass}>
                                            <i className={`${item.icon} w-5 text-center text-sm`} />
                                            <span className="text-sm">{item.label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 no-underline w-full px-3 py-2.5 rounded-lg font-medium text-muted hover:text-danger hover:bg-danger/10 transition-colors duration-150 cursor-pointer text-sm"
                                    >
                                        <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center text-sm" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {!isStaff && (
                        <nav aria-label="Dịch vụ">
                            <div className="flex items-center gap-2 px-2 mb-2">
                                <span className="flex items-center justify-center w-5 h-5 rounded-md bg-accent/20 text-accent text-[11px]">
                                    <i className="fa-solid fa-briefcase" />
                                </span>
                                <span className="font-bold text-xs tracking-wider text-muted uppercase">Dịch vụ</span>
                            </div>
                            <div className="rounded-xl bg-background/80 p-1.5">
                                <ul className="list-none p-0 m-0 flex flex-col gap-1">
                                    {serviceItems.map((item) => (
                                        <li key={item.to}>
                                            <NavLink to={item.to} className={linkClass}>
                                                <i className={`${item.icon} w-5 text-center text-sm`} />
                                                <span className="text-sm">{item.label}</span>
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    )}
                </div>
            </div>

            {/* Support hotline footer */}
            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-3 px-2">
                    <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0 text-sm">
                        <i className="fa-solid fa-headset" />
                    </span>
                    <div className="min-w-0">
                        <div className="text-xs text-muted leading-tight">Cần hỗ trợ?</div>
                        <div className="text-xs font-bold text-primary">1900 1839</div>
                    </div>
                </div>
            </div>
        </div>
    );
}