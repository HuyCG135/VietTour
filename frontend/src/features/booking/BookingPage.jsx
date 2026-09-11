import { useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import BookingSteps from "./BookingSteps.jsx";
import ContactInfoForm from "./ContactInfoForm.jsx";
import BookingDetailsForm from "./BookingDetailsForm.jsx";
import PassengerForms from "./PassengerForms.jsx";
import BookingSummaryCard from "./BookingSummaryCard.jsx";
import useBookingForm from "./useBookingForm.js";
import { getTotalPrice, formatVnd } from "./bookingPrices.js";
import { MOCK_TOUR, MOCK_TOUR_DEPARTURES } from "./booking.mock.js";

const getContactPrefill = (user) => ({
    name: user?.fullname || "",
    phone: user?.phone || "",
    email: user?.email || "",
});

export default function BookingPage() {
    const { tourId } = useParams();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();
    const [success, setSuccess] = useState(null);

    const tour = MOCK_TOUR;
    const departures = MOCK_TOUR_DEPARTURES;

    const form = useBookingForm(tour, departures, getContactPrefill(user), (payload) => {
        const selectedDeparture = departures.find((d) => d.id === payload.departure_id) || null;
        setSuccess({
            code: `#TOUR${String(tour.id).padStart(3, "0")}`,
            pax: payload.adults + payload.children,
            total: getTotalPrice(tour, selectedDeparture, payload.adults, payload.children),
            contact_name: payload.contact_name,
        });
    });

    if (!isAuthenticated) {
        const redirect = encodeURIComponent(location.pathname);
        return <Navigate to={`/login?redirect=${redirect}`} replace />;
    }

    const canBook = user?.role === "customer";

    const {
        contact,
        departureId,
        adults,
        children,
        passengers,
        departure,
        unitPrices,
        total,
        paxCount,
        maxAdults,
        maxChildren,
        setContact,
        setDeparture,
        setAdults,
        setChildren,
        setPassenger,
        markTouched,
        handleSubmit,
        fieldError,
    } = form;

    return (
        <div className="pb-16">
            <BookingSteps tourCoverImage={tour.cover_image} tourName={tour.name} />
            <main className="max-w-7xl mx-auto px-6">
                {canBook && success && (
                    <div className="max-w-2xl mx-auto -mt-10 rounded-3xl border border-success/30 bg-surface p-8 sm:p-10 shadow-[0_2px_10px_rgba(30,41,59,0.05)] text-center">
                        <span className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-success/10 text-success text-2xl">
                            <i className="fa-solid fa-circle-check" />
                        </span>
                        <h2 className="mt-5 text-2xl font-extrabold text-foreground">Đặt tour thành công</h2>
                        <p className="mt-2 text-muted">
                            Đơn <strong className="text-foreground">{success.code}</strong> cho{" "}
                            <strong className="text-foreground">{success.pax} hành khách</strong> đang được xác nhận.
                            Chúng tôi sẽ liên hệ {success.contact_name} để hoàn tất thanh toán.
                        </p>
                        <p className="mt-4 text-2xl font-extrabold text-primary">{formatVnd(success.total)}</p>
                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                to="/tours"
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                            >
                                Xem các tour khác
                                <i className="fa-solid fa-arrow-right text-sm" />
                            </Link>
                            <Link
                                to={`/tours/${tour.id}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-bold text-foreground transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                            >
                                Về trang tour
                            </Link>
                        </div>
                    </div>
                )}

                {!canBook && (
                    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warning/40 bg-surface p-4 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
                        <i className="fa-regular fa-circle-exclamation mt-0.5 text-warning" />
                        <div>
                            <p className="font-bold text-foreground">Thông báo quyền hạn</p>
                            <p className="mt-0.5 text-sm text-muted">
                                Chỉ tài khoản khách hàng mới có thể đặt tour. Vui lòng đăng nhập bằng tài khoản khách
                                hàng.
                            </p>
                        </div>
                    </div>
                )}

                {(!canBook || (canBook && !success)) && (
                    <form onSubmit={handleSubmit} noValidate className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                            <ContactInfoForm
                                contact={contact}
                                setContact={setContact}
                                markTouched={markTouched}
                                fieldError={fieldError}
                            />
                            <BookingDetailsForm
                                departures={departures}
                                departureId={departureId}
                                departure={departure}
                                adults={adults}
                                children={children}
                                maxAdults={maxAdults}
                                maxChildren={maxChildren}
                                paxCount={paxCount}
                                setDeparture={setDeparture}
                                setAdults={setAdults}
                                setChildren={setChildren}
                                fieldError={fieldError}
                            />
                            <PassengerForms
                                paxCount={paxCount}
                                adults={adults}
                                passengers={passengers}
                                setPassenger={setPassenger}
                                fieldError={fieldError}
                            />
                        </div>

                        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28 lg:self-start">
                            <BookingSummaryCard
                                tour={tour}
                                departure={departure}
                                adults={adults}
                                children={children}
                                paxCount={paxCount}
                                total={total}
                                unitPrices={unitPrices}
                                canBook={canBook}
                            />
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}