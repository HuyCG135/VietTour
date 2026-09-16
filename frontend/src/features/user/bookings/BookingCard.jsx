import { Link } from "react-router-dom";
import defaultTourImage from "../../../assets/images/image.png";
import { formatVnd } from "../../booking/bookingPrices";
import { BOOKING_STATUS, BOOKING_PAYMENT, COMPLETED_STATUS } from "./bookingStatus";
import { formatDate, formatDateTime, formatPax } from "./bookingFormat";

function InfoRow({ icon, iconClass, label, children }) {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className={`w-5 shrink-0 text-center text-sm ${iconClass || "text-muted"} ${icon}`} />
            <span className="font-semibold text-slate-500 w-[104px] shrink-0">{label}</span>
            <span className="font-medium text-foreground truncate">{children}</span>
        </div>
    );
}

export default function BookingCard({ booking: b }) {
    const status = BOOKING_STATUS[b.status] || {
        label: b.status,
        icon: "fa-solid fa-circle-info",
        cls: "bg-muted/10 text-muted",
    };
    const payment = BOOKING_PAYMENT[b.payment_status] || {
        label: b.payment_status,
        icon: "fa-solid fa-circle-info",
        chip: "bg-muted/10 text-muted",
    };

    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const isCompleted =
        b.status === "confirmed" && b.payment_status === "paid" && String(b.departure_date).slice(0, 10) < todayStr;
    const statusTag = isCompleted ? COMPLETED_STATUS : status;

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted font-medium mb-1 px-1">
                <i className="fa-regular fa-clock mr-1.5" />
                Đặt lúc {formatDateTime(b.created_at)}
            </p>

            <article className="group bg-surface rounded-2xl border border-border shadow-[0_2px_10px_rgba(30,41,59,0.05)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 ml-4">
                <div className="w-full sm:w-48 lg:w-56 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                        src={b.cover_image || defaultTourImage}
                        alt={b.tour_name || "Tour"}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <Link
                        to={`/user/bookings/${b.id}`}
                        className="font-bold text-base sm:text-lg text-foreground leading-snug mb-0 hover:text-primary transition-colors"
                    >
                        {b.tour_name || "Tour không xác định"}
                    </Link>

                    <InfoRow icon="fa-solid fa-ticket" label="Mã booking:">
                        #MB{b.id}
                    </InfoRow>
                    <InfoRow icon="fa-solid fa-calendar-days" iconClass="text-primary" label="Khởi hành:">
                        {formatDate(b.departure_date)}
                    </InfoRow>
                    <InfoRow icon="fa-solid fa-location-dot" iconClass="text-rose-500" label="Khu vực:">
                        {b.region || "Việt Nam"}
                    </InfoRow>
                    {b.duration && (
                        <InfoRow icon="fa-regular fa-clock" iconClass="text-amber-500" label="Thời lượng:">
                            {b.duration}
                        </InfoRow>
                    )}

                    {b.note && (
                        <p className="text-xs text-muted mt-1 mb-0">
                            <i className="fa-regular fa-note-sticky mr-1.5 text-slate-400" />
                            {b.note}
                        </p>
                    )}

                    <Link
                        to={`/user/bookings/${b.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-1"
                    >
                        Xem chi tiết
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                    </Link>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-2 shrink-0 sm:min-w-[180px] sm:pt-1 sm:pl-5 sm:border-l border-border/60">
                    <div>
                        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-xs sm:text-sm whitespace-nowrap ${statusTag.cls}`}>
                            <i className={statusTag.icon} />
                            {statusTag.label}
                        </span>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${payment.chip}`}>
                            <i className={payment.icon} />
                            {payment.label}
                        </span>

                        <div className="text-center sm:text-right">
                            <span className="text-[11px] text-muted block font-medium">Tổng tiền</span>
                            <span className="text-xl sm:text-2xl font-extrabold text-rose-600 tabular-nums leading-tight">
                                {formatVnd(b.total_price)}
                            </span>
                            <span className="text-xs text-muted block mt-0.5">{formatPax(b.adults, b.children)}</span>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}