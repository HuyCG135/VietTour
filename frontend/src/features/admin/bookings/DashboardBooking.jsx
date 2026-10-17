import StatCards from "./components/StatCards";
import TripsOverview from "./components/TripsOverview";
import TopPackages from "./components/TopPackages";
import BookingsTable from "./components/BookingsTable";
import {
    statsData,
    tripsOverviewData,
    tripsRangeOptions,
    topPackagesData,
    bookingsData,
    bookingsMeta,
} from "./data/mockData";
import "./dashboard.css";

// Component cha Dashboard booking: cột trái (StatCards + TripsOverview),
// cột phải (TopPackages) và bảng booking ở dưới. Dữ liệu lấy từ mockData,
// sẽ thay bằng API ở bước sau.
export default function DashboardBooking() {
    return (
        <div className="dashboard">
            <div className="dashboard-top">
                <div className="dashboard-left">
                    <StatCards stats={statsData} />
                    <TripsOverview data={tripsOverviewData} rangeOptions={tripsRangeOptions} />
                </div>
                <TopPackages data={topPackagesData} />
            </div>

            <BookingsTable rows={bookingsData} meta={bookingsMeta} />
        </div>
    );
}
