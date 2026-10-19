import { useState } from "react";
import { MIN_LEAD_DAYS, formatCurrency } from "./departureUtils";

const emptyForm = (dateKey) => ({
    departure_location: "",
    departure_date: dateKey ?? "",
    price_moving: "",
    price_moving_child: "",
    seats_total: "20",
    seats_available: "20",
    status: "open",
});

// Dữ liệu khởi tạo cho form: sửa thì lấy từ chuyến, thêm mới thì form trống.
const buildInitialForm = (mode, departure, defaultDate) => {
    if (mode === "edit" && departure) {
        return {
            departure_location: departure.departure_location ?? "",
            departure_date: departure.departure_date ?? defaultDate ?? "",
            price_moving: String(departure.price_moving ?? ""),
            price_moving_child: String(departure.price_moving_child ?? ""),
            seats_total: String(departure.seats_total ?? "20"),
            seats_available: String(departure.seats_available ?? "20"),
            status: departure.is_closed ? "closed" : "open",
        };
    }
    return emptyForm(defaultDate);
};

const inputClass =
    "w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors duration-150 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted";
const errorClass = "mt-1 text-xs font-medium text-danger";

export default function DepartureFormModal({
    mode,
    tour,
    departure,
    defaultDate,
    minKey,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(() => buildInitialForm(mode, departure, defaultDate));
    const [errors, setErrors] = useState({});

    const setField = (field) => (event) =>
        setForm((prev) => ({ ...prev, [field]: event.target.value }));

    const validate = () => {
        const next = {};
        if (!form.departure_location.trim()) {
            next.departure_location = "Nhập điểm khởi hành.";
        }
        if (!form.departure_date) {
            next.departure_date = "Chọn ngày khởi hành.";
        } else if (form.departure_date < minKey) {
            next.departure_date = `Ngày khởi hành phải cách hôm nay ít nhất ${MIN_LEAD_DAYS} ngày.`;
        }

        const total = Number(form.seats_total);
        const available = Number(form.seats_available);
        if (!Number.isFinite(total) || total < 1) {
            next.seats_total = "Tổng chỗ phải từ 1 trở lên.";
        } else if (!Number.isFinite(available) || available < 0 || available > total) {
            next.seats_available = "Chỗ trống phải trong khoảng 0 – tổng chỗ.";
        }
        if (Number(form.price_moving) < 0) next.price_moving = "Giá không được âm.";
        if (Number(form.price_moving_child) < 0) next.price_moving_child = "Giá không được âm.";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validate()) return;
        onSubmit({
            departure_location: form.departure_location.trim(),
            departure_date: form.departure_date,
            price_moving: Number(form.price_moving) || 0,
            price_moving_child: Number(form.price_moving_child) || 0,
            seats_total: Number(form.seats_total),
            seats_available: Number(form.seats_available),
            status: form.status,
        });
    };

    const isEdit = mode === "edit";
    const preview =
        Number(form.price_moving) > 0 ? formatCurrency(form.price_moving) : "Chưa nhập giá";

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="departure-form-title"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 sm:items-center sm:p-4"
        >
            <form
                onClick={(event) => event.stopPropagation()}
                onSubmit={handleSubmit}
                className="custom-scrollbar max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-2xl motion-safe:animate-toast-in sm:max-w-lg sm:rounded-2xl"
            >
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 id="departure-form-title" className="text-lg font-bold text-foreground">
                            {isEdit ? "Sửa chuyến khởi hành" : "Thêm chuyến khởi hành"}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted">{tour?.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-primary-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <i className="fa-solid fa-xmark" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={labelClass} htmlFor="departure-location">
                            Điểm khởi hành
                        </label>
                        <input
                            id="departure-location"
                            type="text"
                            value={form.departure_location}
                            onChange={setField("departure_location")}
                            placeholder="VD: Sân bay Nội Bài, Hà Nội"
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-muted">
                            Một tour có thể mở nhiều chuyến trong cùng ngày — mỗi chuyến một điểm
                            khởi hành.
                        </p>
                        {errors.departure_location && (
                            <p className={errorClass}>{errors.departure_location}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="departure-date">
                            Ngày khởi hành
                        </label>
                        <input
                            id="departure-date"
                            type="date"
                            min={minKey}
                            value={form.departure_date}
                            onChange={setField("departure_date")}
                            className={inputClass}
                        />
                        <p className="mt-1 text-xs text-muted">
                            Phải cách hôm nay ít nhất {MIN_LEAD_DAYS} ngày.
                        </p>
                        {errors.departure_date && (
                            <p className={errorClass}>{errors.departure_date}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass} htmlFor="price-adult">
                                Giá người lớn (đ)
                            </label>
                            <input
                                id="price-adult"
                                type="number"
                                min="0"
                                step="50000"
                                value={form.price_moving}
                                onChange={setField("price_moving")}
                                placeholder="4200000"
                                className={inputClass}
                            />
                            {errors.price_moving && <p className={errorClass}>{errors.price_moving}</p>}
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="price-child">
                                Giá trẻ em (đ)
                            </label>
                            <input
                                id="price-child"
                                type="number"
                                min="0"
                                step="50000"
                                value={form.price_moving_child}
                                onChange={setField("price_moving_child")}
                                placeholder="3200000"
                                className={inputClass}
                            />
                            {errors.price_moving_child && (
                                <p className={errorClass}>{errors.price_moving_child}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass} htmlFor="seats-total">
                                Tổng số chỗ
                            </label>
                            <input
                                id="seats-total"
                                type="number"
                                min="1"
                                value={form.seats_total}
                                onChange={setField("seats_total")}
                                className={inputClass}
                            />
                            {errors.seats_total && <p className={errorClass}>{errors.seats_total}</p>}
                        </div>
                        <div>
                            <label className={labelClass} htmlFor="seats-available">
                                Chỗ còn trống
                            </label>
                            <input
                                id="seats-available"
                                type="number"
                                min="0"
                                value={form.seats_available}
                                onChange={setField("seats_available")}
                                className={inputClass}
                            />
                            {errors.seats_available && (
                                <p className={errorClass}>{errors.seats_available}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <span className={labelClass}>Trạng thái</span>
                        <div className="flex gap-2">
                            {[
                                { value: "open", label: "Mở bán", icon: "fa-solid fa-circle-check" },
                                { value: "closed", label: "Đóng", icon: "fa-solid fa-lock" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({ ...prev, status: option.value }))
                                    }
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                                        form.status === option.value
                                            ? "border-primary bg-primary-50 text-primary"
                                            : "border-border text-muted hover:border-primary/40 hover:text-foreground"
                                    }`}
                                >
                                    <i className={option.icon} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="text-sm text-muted">
                        Giá NL: <b className="text-foreground">{preview}</b>
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-slate-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            {isEdit ? "Lưu thay đổi" : "Thêm chuyến"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
