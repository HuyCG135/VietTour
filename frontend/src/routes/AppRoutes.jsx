import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import TourList from "../features/tours/TourList";
import TourDetail from "../features/tours/TourDetail";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import About from "../pages/About";
import Contact from "../pages/Contact";

import AdminLayout from "../layouts/AdminLayout";
import AdminRoutes from "./AdminRoutes";

import UserLayout from "../layouts/UserLayout";
import UserRoutes from "./UserRoutes";

import NotFound from "../pages/NotFound";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/tours" element={<TourList />} />
                    <Route path="/tours/:id" element={<TourDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="*" element={<NotFound />} />
                </Route>

                <Route
                    path="/admin/*"
                    element={
                        <AdminLayout>
                            <AdminRoutes />
                        </AdminLayout>
                    }
                />
                <Route
                    path="/user/*"
                    element={
                        <UserLayout>
                            <UserRoutes />
                        </UserLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
