import React from "react";
import FormField from "./FormField.jsx";
import { getInputClass, getSelectClass } from "./formClasses.js";
import { GENDER_OPTIONS } from "./bookingState.js";

export default function ContactInfoForm({
    contact,
    setContact,
    markTouched,
    fieldError,
}) {
    return (
        <div className="bg-surface rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
            <div className="border-b border-slate-100 px-6 sm:px-8 pt-6 pb-4">
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary text-sm">
                        <i className="fa-solid fa-address-book" />
                    </span>
                    THÔNG TIN LIÊN LẠC
                </h2>
            </div>

            <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                    label="Tên người liên hệ"
                    required
                    error={fieldError("contact_name")}
                >
                    <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => setContact("name", e.target.value)}
                        onBlur={() => markTouched("contact_name")}
                        placeholder="VD: Nguyễn Văn A"
                        aria-invalid={!!fieldError("contact_name")}
                        className={getInputClass(!!fieldError("contact_name"))}
                    />
                </FormField>

                <FormField
                    label="Số điện thoại"
                    required
                    error={fieldError("contact_phone")}
                >
                    <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact("phone", e.target.value)}
                        onBlur={() => markTouched("contact_phone")}
                        placeholder="VD: 0912 345 678"
                        aria-invalid={!!fieldError("contact_phone")}
                        className={getInputClass(!!fieldError("contact_phone"))}
                    />
                </FormField>

                <FormField
                    label="Ngày sinh"
                    required
                    error={fieldError("contact_dob")}
                >
                    <input
                        type="date"
                        value={contact.dob}
                        onChange={(e) => setContact("dob", e.target.value)}
                        onBlur={() => markTouched("contact_dob")}
                        max={new Date().toISOString().slice(0, 10)}
                        aria-invalid={!!fieldError("contact_dob")}
                        className={getInputClass(!!fieldError("contact_dob"))}
                    />
                </FormField>

                <FormField
                    label="Giới tính"
                    required
                    error={fieldError("contact_gender")}
                >
                    <select
                        value={contact.gender}
                        onChange={(e) => setContact("gender", e.target.value)}
                        aria-invalid={!!fieldError("contact_gender")}
                        className={getSelectClass(!!fieldError("contact_gender"))}
                    >
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </FormField>

                <FormField
                    label="Email"
                    required
                    className="sm:col-span-2"
                    error={fieldError("contact_email")}
                    hint="Chúng tôi sẽ gửi xác nhận đặt tour qua email"
                >
                    <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact("email", e.target.value)}
                        onBlur={() => markTouched("contact_email")}
                        placeholder="VD: email@example.com"
                        aria-invalid={!!fieldError("contact_email")}
                        className={getInputClass(!!fieldError("contact_email"))}
                    />
                </FormField>

                <FormField
                    label="Ghi chú thêm"
                    className="sm:col-span-2"
                    hint="Yêu cầu đặc biệt về chỗ ngồi, ăn uống..."
                >
                    <textarea
                        value={contact.note}
                        onChange={(e) => setContact("note", e.target.value)}
                        placeholder="Yêu cầu đặc biệt..."
                        rows={3}
                        className="resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-foreground placeholder:text-slate-400 transition-colors duration-150 focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </FormField>
            </div>
        </div>
    );
}