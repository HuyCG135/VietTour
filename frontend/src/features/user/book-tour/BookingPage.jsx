import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import { getTourById } from "../tours/tour.api.js";
import BookingFlow from "./BookingFlow.jsx";

export default function BookingPage() {
    const { tourId } = useParams();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getTourById(tourId);
                if (cancelled) return;
                if (!res.success) {
                    throw new Error(res.message || "Không tải được dữ liệu tour.");
                }
                setTour(res.data);
            } catch (err) {
                if (!cancelled) setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [tourId, reloadKey]);

    if (!isAuthenticated) {
        const redirect = encodeURIComponent(location.pathname);
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted">
                <i className="fa-solid fa-circle-notch fa-spin text-primary text-3xl" aria-hidden="true" />
                <p className="mt-3 text-sm">Đang tải tour...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto text-center py-24">
                <i className="fa-solid fa-triangle-exclamation text-3xl text-warning" aria-hidden="true" />
                <p className="mt-3 font-semibold text-foreground">Không thể tải tour</p>
                <p className="mt-1 text-sm text-muted">{error}</p>
                <div className="mt-5 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => setReloadKey((key) => key + 1)}
                        className="rounded-full bg-primary px-6 py-2.5 font-bold text-white transition-colors duration-150 hover:bg-primary-dark cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    >
                        Thử lại
                    </button>
                    <Link
                        to="/tours"
                        className="rounded-full border border-slate-200 px-6 py-2.5 font-bold text-foreground transition-colors duration-150 hover:bg-slate-50 no-underline"
                    >
                        Về danh sách tour
                    </Link>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="max-w-xl mx-auto text-center py-24">
                <i className="fa-solid fa-route text-3xl text-muted" aria-hidden="true" />
                <p className="mt-3 font-semibold text-foreground">Chưa có thông tin tour</p>
                <Link
                    to="/tours"
                    className="mt-5 inline-block rounded-full border border-slate-200 px-6 py-2.5 font-bold text-foreground transition-colors duration-150 hover:bg-slate-50 no-underline"
                >
                    Về danh sách tour
                </Link>
            </div>
        );
    }

    return <BookingFlow user={user} tour={tour} />;
}