import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import StatCards from "./components/StatCards";
import TripsOverview from "./components/TripsOverview";
import TopPackages from "./components/TopPackages";
import BookingsTable from "./components/BookingsTable";
import { getBookingStats, getTopPackages } from "./bookings.api";
import "./dashboard.css";

// Bộ lọc thời gian cho TripsOverview (value khớp API, label hiển thị).
const TRIPS_RANGE_OPTIONS = [
    { value: "12m", label: "12 tháng" },
    { value: "3m", label: "3 tháng" },
    { value: "30d", label: "30 ngày" },
    { value: "7d", label: "7 ngày" },
];

// Màu lát donut cho 5 tour đứng đầu.
const PACKAGE_COLORS = ["#44a8f8", "#2f80c4", "#60a5fa", "#93c5fd", "#c7e2fb"];

const numberFormatter = new Intl.NumberFormat("vi-VN");

// Dữ liệu rỗng dùng khi API chưa trả về, tránh component bị crash.
const EMPTY_STATS = {
    totalBookings: 0,
    totalBookingsChange: 0,
    totalBookingsTrend: "up",
    participants: 0,
    participantsChange: 0,
    participantsTrend: "up",
    earnings: 0,
    earningsChange: 0,
    earningsTrend: "up",
    spark: {
        bookings: Array(12).fill(0),
        participants: Array(12).fill(0),
        earnings: Array(12).fill(0),
    },
};

// Map response API -> shape StatCards đang render.
const buildStatCards = (stats) => [
    {
        id: "bookings",
        icon: "calendar",
        title: "Total Booking",
        value: numberFormatter.format(stats.totalBookings),
        change: stats.totalBookingsChange,
        trend: stats.totalBookingsTrend,
        note: "so với kỳ trước",
        spark: stats.spark.bookings,
    },
    {
        id: "participants",
        icon: "users",
        title: "Participants",
        value: numberFormatter.format(stats.participants),
        change: stats.participantsChange,
        trend: stats.participantsTrend,
        note: "so với kỳ trước",
        spark: stats.spark.participants,
    },
    {
        id: "earnings",
        icon: "dollar",
        title: "Earnings",
        value: `${numberFormatter.format(stats.earnings)} đ`,
        change: stats.earningsChange,
        trend: stats.earningsTrend,
        note: "so với kỳ trước",
        spark: stats.spark.earnings,
    },
];

// Component cha Dashboard booking: cột trái (StatCards + TripsOverview),
// cột phải (TopPackages) và bảng booking ở dưới.
// StatCards/TopPackages tải ở đây; TripsOverview và BookingsTable tự tải
// theo range/search riêng của chúng.
export default function DashboardBooking() {
    const toast = useToast();
    const [stats, setStats] = useState(null);
    const [packages, setPackages] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            try {
                const [statsRes, packagesRes] = await Promise.all([
                    getBookingStats(),
                    getTopPackages("12m", 5),
                ]);

                if (!active) return;

                if (statsRes?.success) {
                    setStats(statsRes.data);
                } else {
                    toast.error(statsRes?.message || "Không thể tải thống kê booking.");
                }

                if (packagesRes?.success) {
                    setPackages(packagesRes.data);
                } else {
                    toast.error(packagesRes?.message || "Không thể tải top package.");
                }
            } catch (error) {
                if (active) {
                    toast.error(error.message || "Không thể tải dashboard booking.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [toast]);

    const statData = buildStatCards(stats ?? EMPTY_STATS);
    const packageData = {
        period: packages?.period ?? "12 tháng gần nhất",
        totalParticipants: packages?.totalParticipants ?? 0,
        items: (packages?.items ?? []).map((item, index) => ({
            ...item,
            color: PACKAGE_COLORS[index % PACKAGE_COLORS.length],
        })),
    };

    return (
        <div className="dashboard" aria-busy={loading}>
            <div className="dashboard-top">
                <div className="dashboard-left">
                    <StatCards stats={statData} />
                    <TripsOverview rangeOptions={TRIPS_RANGE_OPTIONS} />
                </div>
                <TopPackages data={packageData} />
            </div>

            <BookingsTable />
        </div>
    );
}
