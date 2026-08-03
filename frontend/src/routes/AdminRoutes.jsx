import { Routes, Route, Navigate } from "react-router-dom";
import TourList from "../features/admin/tours/List";
import ItineraryList from "../features/admin/itineraries/List";
import DepartureList from "../features/admin/departures/List";
import BookingList from "../features/admin/bookings/List";
import ServiceList from "../features/admin/services/List";
import TourServiceList from "../features/admin/tour-services/List";
import TourImageList from "../features/admin/tour-images/List";
import UserList from "../features/admin/users/List";
import Statistics from "../features/admin/statistics/List";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="tours" />} />
            <Route path="tours" element={<TourList />} />
            <Route path="itineraries" element={<ItineraryList />} />
            <Route path="departures" element={<DepartureList />} />
            <Route path="bookings" element={<BookingList />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="tour-services" element={<TourServiceList />} />
            <Route path="tour-images" element={<TourImageList />} />
            <Route path="users" element={<UserList />} />
            <Route path="statistics" element={<Statistics />} />
        </Routes>
    );
}
