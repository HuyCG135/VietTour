import { useState } from "react";

const TABS = [
    { id: "overview", label: "Tổng quan", icon: "fa-solid fa-circle-info" },
    { id: "itinerary", label: "Lịch trình", icon: "fa-solid fa-route" },
    { id: "services", label: "Dịch vụ", icon: "fa-solid fa-bell-concierge" },
    { id: "reviews", label: "Đánh giá", icon: "fa-solid fa-star-half-stroke" },
];

const TourTabs = () => {
    const [active, setActive] = useState(TABS[0].id);

    const handleClick = (id) => {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav aria-label="Chuyển mục nội dung" className="flex gap-1 border-b border-slate-200 overflow-x-auto">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleClick(tab.id)}
                    aria-current={active === tab.id ? "true" : undefined}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap -mb-px border-b-2 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        active === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-muted hover:text-foreground"
                    }`}
                >
                    <i className={`${tab.icon} text-xs`} aria-hidden="true" />
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};

export default TourTabs;