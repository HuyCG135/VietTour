import React from "react";
import { formatVnd } from "./bookingPrices.js";

export default function BookingSummaryCard({
    tour,
    departure,
    adults,
    children,
    paxCount,
    total,
    unitPrices,
    canBook,
}) {
    const formattedId = `#TOUR${String(tour.id).padStart(3, "0")}`;

    return (
        <div className="rounded-3xl border border-slate-200 bg-surface p-6 sm:p-7 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
            <div className="flex gap-4">
                <div className="shrink-0 w-[120px] h-[90px] overflow-hidden rounded-2xl">
                    <img src={tour.cover_image} alt={tour.name} loading="eager" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">
                        {tour.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted">{formattedId}</p>
                </div>
            </div>

            <div className="mt-5 rounded-2xl bg-primary/5 p-5">
                <div className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-muted font-medium">Thời lượng</span>
                    <span className="font-bold text-foreground">{tour.duration}</span>
                </div>
                {departure && (
                    <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-muted font-medium">Ngày &amp; điểm đón</span>
                        <span className="font-bold text-foreground">
                            {new Date(departure.departure_date + "T00:00:00").toLocaleDateString("vi-VN")} · {departure.departure_location}
                        </span>
                    </div>
                )}
                <div className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-muted font-medium">Đơn giá người lớn</span>
                    <span className="font-bold text-primary">{formatVnd(unitPrices.adult)}</span>
                </div>
                {children > 0 && (
                    <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-muted font-medium">Đơn giá trẻ em</span>
                        <span className="font-bold text-primary">{formatVnd(unitPrices.child)}</span>
                    </div>
                )}
            </div>

            <div className="mt-5 rounded-2xl bg-surface p-5 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
                <div className="flex items-center justify-between">
                    <span className="text-muted font-bold text-sm">Số lượng hành khách</span>
                    <span className="font-extrabold text-foreground">{paxCount} người</span>
                </div>
                <hr className="my-4 border-slate-100" />
                <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-foreground">TỔNG TIỀN</span>
                    <span className="text-2xl font-extrabold text-primary">{formatVnd(total)}</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={!canBook}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-base font-bold text-white transition-colors duration-150 hover:bg-primary-dark active:bg-primary-dark cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                XÁC NHẬN ĐẶT TOUR
                <i className="fa-solid fa-circle-check text-sm" />
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted text-center">
                <i className="fa-solid fa-lock text-success" />
                Thanh toán an tâm &amp; bảo mật
            </p>
        </div>
    );
}