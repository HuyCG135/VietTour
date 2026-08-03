import { NavLink } from "react-router-dom";

const sidebarItems = [
    { to: "/user/profile", label: "Hồ sơ", icon: "fa-solid fa-user" },
    { to: "/user/favorite", label: "Yêu thích", icon: "fa-solid fa-heart" },
    { to: "/user/bookings", label: "Lịch sử booking", icon: "fa-solid fa-calendar-check" },
];

export default function UserSidebar() {
    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(30,41,59,0.08)] sticky top-[90px]">
            <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-base mb-0">Tài khoản</h5>
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 no-underline w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-800 hover:bg-blue-50 hover:text-blue-600"
                                    }`
                                }
                            >
                                <i className={item.icon} style={{ width: 18 }} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
