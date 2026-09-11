import TourHeader from "./detail/TourHeader";
import TourGallery from "./detail/TourGallery";
import TourTabs from "./detail/TourTabs";
import TourOverview from "./detail/TourOverview";
import TourItinerary from "./detail/TourItinerary";
import TourServices from "./detail/TourServices";
import TourReviews from "./detail/TourReviews";
import TourBookingCard from "./detail/TourBookingCard";
import { TOUR_MOCK } from "./detail/tour.mock";

export default function TourDetail() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <TourHeader tour={TOUR_MOCK} />

            <div className="mt-5">
                <TourGallery images={TOUR_MOCK.images} name={TOUR_MOCK.name} />
            </div>

            <div className="mt-4">
                <TourTabs />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-8">
                    <TourOverview description={TOUR_MOCK.description} />
                    <TourItinerary itineraries={TOUR_MOCK.itineraries} />
                    <TourServices services={TOUR_MOCK.services} />
                    <TourReviews
                        reviews={TOUR_MOCK.reviews}
                        avgRating={TOUR_MOCK.avg_rating}
                        reviewCount={TOUR_MOCK.review_count}
                    />
                </div>

                <aside className="order-first lg:order-none lg:col-span-4 lg:sticky lg:top-24">
                    <TourBookingCard
                        priceDefault={TOUR_MOCK.price_default}
                        priceChild={TOUR_MOCK.price_child}
                        hotline={TOUR_MOCK.hotline}
                    />
                </aside>
            </div>
        </div>
    );
}