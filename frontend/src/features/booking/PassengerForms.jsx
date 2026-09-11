import React from "react";
import PassengerRow from "./PassengerRow.jsx";
import { getPassengerType } from "./bookingValidation.js";

export default function PassengerForms({ paxCount, adults, passengers, setPassenger, fieldError }) {
    if (paxCount <= 1) return null;

    const rows = [];
    for (let i = 2; i <= paxCount; i++) {
        const type = getPassengerType(i, adults);
        rows.push(
            <PassengerRow
                key={i}
                index={i}
                label={type === "adult" ? "Người lớn" : "Trẻ em"}
                type={type}
                data={passengers[i]}
                setPassenger={setPassenger}
                fieldError={fieldError}
            />,
        );
    }

    return (
        <div className="bg-surface rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
            <div className="border-b border-slate-100 px-6 sm:px-8 pt-6 pb-4">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary text-sm">
                        <i className="fa-solid fa-user-friends" />
                    </span>
                    THÔNG TIN HÀNH KHÁCH
                </h2>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-4 border-t-2 border-dashed border-slate-100">
                {rows}
            </div>
        </div>
    );
}