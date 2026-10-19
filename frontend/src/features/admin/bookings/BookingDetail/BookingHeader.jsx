import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StatusPill } from "./common";
import { bookingCode, formatDateTime } from "./detailFormat";

export default function BookingHeader({ booking }) {
    return (
        <div className="space-y-4">
            <Link
                to="/admin/bookings"
                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Trở về danh sách booking
            </Link>

            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Chi tiết booking
                    </p>
                    <h1 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl tabular-nums">
                        {bookingCode(booking.id)}
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Ngày đặt: {formatDateTime(booking.created_at)}
                    </p>
                </div>
                <StatusPill status={booking.status} label={booking.status_label} />
            </div>
        </div>
    );
}
