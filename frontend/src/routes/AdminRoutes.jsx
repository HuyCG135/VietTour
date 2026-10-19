import { Routes, Route, Navigate } from "react-router-dom";
import TourList from "../features/admin/tours/List";
import ItineraryList from "../features/admin/itineraries/List";
import DepartureList from "../features/admin/departures/List";
import BookingDashboard from "../features/admin/bookings/DashboardBooking";
import AdminBookingDetail from "../features/admin/bookings/BookingDetail";
import ServiceList from "../features/admin/services/List";
import ServiceForm from "../features/admin/services/Form";
import TourServiceList from "../features/admin/tour-services/List";
import TourServiceForm from "../features/admin/tour-services/Form";
import TourImageList from "../features/admin/tour-images/List";
import UserList from "../features/admin/users/List";
import Statistics from "../features/admin/statistics/List";

export default function AdminRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="tours" />} />
            <Route path="tours" element={<TourList />} />
            <Route path="tours/new" element={<Navigate to="/admin/tours" replace />} />
            <Route path="tours/:id/edit" element={<Navigate to="/admin/tours" replace />} />
            <Route path="itineraries" element={<ItineraryList />} />
            <Route path="itineraries/:tourId/edit" element={<Navigate to="/admin/itineraries" replace />} />
            <Route path="departures" element={<DepartureList />} />
            <Route path="bookings" element={<BookingDashboard />} />
            <Route path="bookings/:id" element={<AdminBookingDetail />} />
            <Route path="services" element={<ServiceList />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="services/:id/edit" element={<ServiceForm />} />
            <Route path="tour-services" element={<TourServiceList />} />
            <Route path="tour-services/:tourId/edit" element={<TourServiceForm />} />
            <Route path="tour-images" element={<TourImageList />} />
            <Route path="tour-images/:tourId/edit" element={<Navigate to="/admin/tour-images" replace />} />
            <Route path="users" element={<UserList />} />
            <Route path="statistics" element={<Statistics />} />
        </Routes>
    );
}
