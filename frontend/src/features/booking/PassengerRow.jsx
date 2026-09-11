import React, { memo } from "react";
import FormField, { getInputClass, getSelectClass } from "./FormField.jsx";
import { GENDER_OPTIONS } from "./bookingState.js";

const PassengerRow = memo(function PassengerRow({ index, label, type, data, setPassenger, fieldError }) {
    const isAdult = type === "adult";
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-4">
            <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    isAdult
                        ? "bg-primary/10 text-primary"
                        : "bg-info/10 text-info"
                }`}
            >
                Hành khách {index} ({label})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <FormField
                    className="sm:col-span-5"
                    label="Họ tên"
                    required
                    error={fieldError(`ps_name_${index}`)}
                >
                    <input
                        type="text"
                        value={data?.name || ""}
                        onChange={(e) => setPassenger(index, "name", e.target.value)}
                        placeholder="Nhập họ tên"
                        aria-invalid={!!fieldError(`ps_name_${index}`)}
                        className={getInputClass(!!fieldError(`ps_name_${index}`))}
                    />
                </FormField>

                <FormField
                    className="sm:col-span-3"
                    label="Giới tính"
                >
                    <select
                        value={data?.gender || "Nam"}
                        onChange={(e) => setPassenger(index, "gender", e.target.value)}
                        className={getSelectClass()}
                    >
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    className="sm:col-span-4"
                    label="Ngày sinh"
                    required
                    error={fieldError(`ps_dob_${index}`)}
                >
                    <input
                        type="date"
                        value={data?.dob || ""}
                        onChange={(e) => setPassenger(index, "dob", e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        aria-invalid={!!fieldError(`ps_dob_${index}`)}
                        className={getInputClass(!!fieldError(`ps_dob_${index}`))}
                    />
                </FormField>
            </div>
        </div>
    );
});

export default PassengerRow;