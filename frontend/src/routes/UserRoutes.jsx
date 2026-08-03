import { Routes, Route, Navigate } from "react-router-dom";
import Profile from "../features/user/profile/Profile";
import Favorite from "../features/user/favorites/Favorite";
import BookingHistory from "../features/user/bookings/BookingHistory";

export default function UserRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to="profile" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="favorite" element={<Favorite />} />
            <Route path="bookings" element={<BookingHistory />} />
        </Routes>
    );
}
