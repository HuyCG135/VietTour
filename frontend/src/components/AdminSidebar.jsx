import { Link } from "react-router-dom";

const sidebarItems = [
    { to: "/admin/tours", label: "Quản lý tour", icon: "fa-solid fa-map" },
    { to: "/admin/itineraries", label: "Quản lý lịch trình", icon: "fa-solid fa-route" },
    { to: "/admin/departures", label: "Quản lý điểm khởi hành", icon: "fa-solid fa-location-dot" },
    { to: "/admin/bookings", label: "Quản lý booking", icon: "fa-solid fa-calendar-check" },
    { to: "/admin/services", label: "Quản lý dịch vụ", icon: "fa-solid fa-concierge-bell" },
    { to: "/admin/tour-services", label: "Quản lý dịch vụ tour", icon: "fa-solid fa-list" },
    { to: "/admin/tour-images", label: "Quản lý hình ảnh tour", icon: "fa-solid fa-image" },
    { to: "/admin/users", label: "Quản lý user", icon: "fa-solid fa-users" },
    { to: "/admin/statistics", label: "Thống kê", icon: "fa-solid fa-chart-column" },
];

export default function AdminSidebar() {
    return (
        <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(30,41,59,0.08)] sticky top-[90px]">
            <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-base mb-0">Quản lý</h5>
                </div>
                <ul className="list-none p-0 m-0 flex flex-col gap-1">
                    {sidebarItems.map((item) => (
                        <li key={item.to} className="rounded-lg text-gray-800 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600">
                            <Link to={item.to} className="flex items-center gap-3 no-underline text-inherit w-full px-3 py-2.5 rounded-lg">
                                <i className={item.icon} style={{ width: 18 }} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
