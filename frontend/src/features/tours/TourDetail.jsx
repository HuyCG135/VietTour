import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTourById } from "./tour.api";
import TourHeader from "./detail/TourHeader";
import TourGallery from "./detail/TourGallery";
import TourTabs from "./detail/TourTabs";
import TourOverview from "./detail/TourOverview";
import TourItinerary from "./detail/TourItinerary";
import TourServices from "./detail/TourServices";
import TourReviews from "./detail/TourReviews";
import TourBookingCard from "./detail/TourBookingCard";

const TourDetail = () => {
    const { id } = useParams();
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
                const res = await getTourById(id);
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
    }, [id, reloadKey]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-muted">
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

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <TourHeader tour={tour} />

            <div className="mt-5">
                <TourGallery images={tour.images} name={tour.name} />
            </div>

            <div className="mt-4">
                <TourTabs />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    <TourOverview description={tour.description} />
                    <TourItinerary itineraries={tour.itineraries} />
                    <TourServices services={tour.services} />
                    <TourReviews
                        reviews={tour.reviews}
                        avgRating={tour.avg_rating}
                        reviewCount={tour.review_count}
                    />
                </div>

                <aside className="order-first lg:order-none lg:col-span-4 lg:sticky lg:top-24">
                    <TourBookingCard
                        tourId={tour.id}
                        priceDefault={tour.price_default}
                        priceChild={tour.price_child}
                        hotline="1900 1234"
                        departures={tour.departures}
                    />
                </aside>
            </div>
        </div>
    );
};

export default TourDetail;