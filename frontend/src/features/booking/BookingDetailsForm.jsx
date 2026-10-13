import React from "react";
import FormField from "./FormField.jsx";
import { getSelectClass } from "./formClasses.js";
import QuantityStepper from "./QuantityStepper.jsx";

export default function BookingDetailsForm({
    departures,
    departureId,
    departure,
    adults,
    children,
    maxAdults,
    maxChildren,
    setDeparture,
    setAdults,
    setChildren,
    fieldError,
}) {
    return (
        <div className="bg-surface rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
            <div className="border-b border-slate-100 px-6 sm:px-8 pt-6 pb-4">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary text-sm">
                        <i className="fa-solid fa-list-check" />
                    </span>
                    CHI TIẾT ĐẶT CHỖ
                </h2>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-6">
                <FormField
                    label="Ngày khởi hành & Điểm đón"
                    required
                    error={fieldError("departure_id")}
                >
                    <select
                        value={departureId}
                        onChange={(e) => setDeparture(e.target.value)}
                        aria-invalid={!!fieldError("departure_id")}
                        className={getSelectClass(!!fieldError("departure_id"))}
                    >
                        <option value="">-- Chọn lịch khởi hành phù hợp --</option>
                        {departures.map((d) => {
                            const date = new Date(d.departure_date + "T00:00:00").toLocaleDateString("vi-VN");
                            const suffix = d.seats_available <= 0 ? " (Hết chỗ)" : "";
                            return (
                                <option key={d.id} value={d.id} disabled={d.seats_available <= 0}>
                                    {date} — Khởi hành từ {d.departure_location}{suffix}
                                </option>
                            );
                        })}
                    </select>
                </FormField>

                {departure && (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1.5 text-xs font-medium text-success">
                            <i className="fa-solid fa-user-group text-[10px]" />
                            Còn {departure.seats_available} chỗ
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <QuantityStepper
                        label="Số lượng người lớn"
                        hint="(Từ 6 tuổi)"
                        value={adults}
                        min={1}
                        max={maxAdults}
                        onChange={setAdults}
                    />
                    <QuantityStepper
                        label="Số lượng trẻ em"
                        hint="(Dưới 6 tuổi)"
                        value={children}
                        min={0}
                        max={maxChildren}
                        onChange={setChildren}
                    />
                </div>

                {fieldError("pax") && (
                    <p className="text-sm font-medium text-danger" role="alert">
                        {fieldError("pax")}
                    </p>
                )}
            </div>
        </div>
    );
}