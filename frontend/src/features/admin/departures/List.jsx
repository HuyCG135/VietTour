import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import MonthCalendar from "./MonthCalendar";
import DepartureFormModal from "./DepartureFormModal";
import TourPicker from "./TourPicker";
import {
    createDeparture,
    deleteDeparture,
    getDepartures,
    getTours,
    updateDeparture,
    updateDepartureStatus,
} from "./departures.api";
import {
    MIN_LEAD_DAYS,
    STATUS_META,
    addMonths,
    buildMonthGrid,
    deriveStatus,
    formatCompactCurrency,
    formatCurrency,
    formatDateVN,
    formatMonthTitle,
    groupByDate,
    minAllowedKey,
    monthPrefix,
    startOfMonth,
    toKey,
    todayKey,
} from "./departureUtils";

const iconButtonClass =
    "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-muted transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

function Legend() {
    return (
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            {Object.entries(STATUS_META).map(([key, meta]) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {meta.label}
                </span>
            ))}
        </div>
    );
}

function DetailRow({ icon, label, children }) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <i className={icon} />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <div className="text-sm font-medium text-foreground">{children}</div>
            </div>
        </div>
    );
}

function DayDepartureItem({ departure, today, onSelect }) {
    const status = deriveStatus(departure, today);
    const itemMeta = STATUS_META[status];
    const left = Number(departure.seats_available);

    return (
        <button
            type="button"
            onClick={onSelect}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 text-left transition-colors duration-150 hover:border-primary/40 hover:bg-primary-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
            <span className={`h-2 w-2 shrink-0 rounded-full ${itemMeta.dot}`} />
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                    {departure.departure_location}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                    <span className={`font-bold ${left <= 0 ? "text-warning" : "text-muted"}`}>
                        {left}/{departure.seats_total} chỗ
                    </span>
                    <span className="truncate">{formatCompactCurrency(departure.price_moving)}</span>
                </span>
            </span>
            <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${itemMeta.soft} ${itemMeta.text}`}
            >
                {itemMeta.label}
            </span>
            <i className="fa-solid fa-chevron-right text-xs text-muted" />
        </button>
    );
}

function DayDrawer({
    dateKey,
    departure,
    dayDepartures,
    meta,
    seatsLeft,
    isPast,
    canAdd,
    today,
    onClose,
    onSelectDeparture,
    onEdit,
    onToggle,
    onDelete,
    onAdd,
}) {
    return (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Chi tiết ngày">
            <button
                type="button"
                aria-label="Đóng"
                onClick={onClose}
                className="absolute inset-0 h-full w-full cursor-default bg-slate-950/40"
            />
            <aside className="custom-scrollbar absolute right-0 top-[70px] bottom-0 flex w-full max-w-sm flex-col overflow-y-auto bg-surface shadow-2xl motion-safe:animate-toast-in">
                <div className="flex items-start justify-between gap-3 border-b border-border p-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Chi tiết ngày
                        </p>
                        <h3 className="mt-0.5 text-base font-bold capitalize text-foreground">
                            {formatDateVN(dateKey)}
                        </h3>
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

                {departure ? (
                    <>
                        <div className="flex items-center gap-2 px-5 pt-4">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${meta.soft} ${meta.text}`}
                            >
                                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                                {meta.label}
                            </span>
                            {seatsLeft <= 0 && (
                                <span className="text-xs font-semibold text-warning">Hết chỗ</span>
                            )}
                        </div>

                        <div className="divide-y divide-border px-5">
                            <DetailRow icon="fa-solid fa-location-dot" label="Điểm khởi hành">
                                {departure.departure_location}
                            </DetailRow>
                            <DetailRow icon="fa-solid fa-user" label="Giá người lớn">
                                {formatCurrency(departure.price_moving)}
                            </DetailRow>
                            <DetailRow icon="fa-solid fa-child" label="Giá trẻ em">
                                {formatCurrency(departure.price_moving_child)}
                            </DetailRow>
                            <DetailRow icon="fa-solid fa-chair" label="Chỗ còn trống">
                                <div className="flex items-center gap-2">
                                    <b>
                                        {seatsLeft}/{departure.seats_total}
                                    </b>
                                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                                        <span
                                            className={`block h-full rounded-full ${
                                                seatsLeft <= 0 ? "bg-warning" : "bg-primary"
                                            }`}
                                            style={{
                                                width: `${
                                                    departure.seats_total > 0
                                                        ? Math.round(
                                                              (seatsLeft / departure.seats_total) * 100,
                                                          )
                                                        : 0
                                                }%`,
                                            }}
                                        />
                                    </span>
                                </div>
                            </DetailRow>
                        </div>

                        <div className="flex items-center justify-between gap-2 px-5 pt-3">
                            <p className="text-xs text-muted">Ngày này còn:</p>
                            <span className="text-xs font-bold text-foreground">
                                {dayDepartures.length} chuyến
                            </span>
                        </div>

                        <div className="mt-auto space-y-2 border-t border-border p-5">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={onToggle}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    <i
                                        className={
                                            meta.label === "Đóng"
                                                ? "fa-solid fa-lock-open"
                                                : "fa-solid fa-lock"
                                        }
                                    />
                                    {meta.label === "Đóng" ? "Mở lại" : "Đóng chuyến"}
                                </button>
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    disabled={isPast}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                >
                                    <i className="fa-solid fa-pen" />
                                    Sửa
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={onDelete}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-3 py-2 text-sm font-semibold text-danger transition-colors duration-150 hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
                            >
                                <i className="fa-solid fa-trash" />
                                Xóa chuyến
                            </button>
                            {isPast && (
                                <p className="text-center text-xs text-muted">
                                    Chuyến đã qua ngày — chỉ có thể xem hoặc xóa.
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {dayDepartures.length > 0 ? (
                            <div className="px-5 pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                                    Các chuyến trong ngày ({dayDepartures.length})
                                </p>
                                <div>
                                    {dayDepartures.map((item) => (
                                        <DayDepartureItem
                                            key={item.id}
                                            departure={item}
                                            today={today}
                                            onSelect={() => onSelectDeparture(item)}
                                        />
                                    ))}
                                </div>
                                {canAdd ? (
                                    <button
                                        type="button"
                                        onClick={onAdd}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                    >
                                        <i className="fa-solid fa-plus" />
                                        Thêm chuyến cho ngày này
                                    </button>
                                ) : (
                                    <p className="mt-5 text-center text-xs text-muted">
                                        Chỉ tạo được chuyến cách hôm nay ít nhất {MIN_LEAD_DAYS} ngày.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-xl text-primary">
                                    <i className="fa-solid fa-calendar-plus" />
                                </span>
                                {canAdd ? (
                                    <>
                                        <p className="text-sm text-muted">
                                            Ngày này chưa có chuyến khởi hành nào.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={onAdd}
                                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                        >
                                            <i className="fa-solid fa-plus" />
                                            Thêm chuyến cho ngày này
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm text-muted">
                                        Chỉ tạo được chuyến cách hôm nay ít nhất {MIN_LEAD_DAYS} ngày.
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </aside>
        </div>
    );
}

function DeleteDepartureModal({ departure, onClose, onConfirm }) {
    if (!departure) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-departure-title"
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        >
            <div
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl motion-safe:animate-toast-in"
            >
                <h3
                    id="delete-departure-title"
                    className="mb-3 flex items-center gap-2 text-lg font-bold text-danger"
                >
                    <i className="fa-solid fa-triangle-exclamation" />
                    Xóa chuyến khởi hành
                </h3>
                <p className="mb-4 text-sm text-muted">
                    Chuyến ngày <b className="text-foreground">{formatDateVN(departure.departure_date)}</b>{" "}
                    tại <b className="text-foreground">{departure.departure_location}</b> sẽ bị xóa. Thao
                    tác này không hoàn tác được.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-slate-50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40"
                    >
                        Xóa chuyến
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DepartureList() {
    const toast = useToast();
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [toursLoading, setToursLoading] = useState(true);
    const [tourId, setTourId] = useState(null);
    const [departures, setDepartures] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [monthDate, setMonthDate] = useState(() => startOfMonth(new Date()));
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [form, setForm] = useState({ open: false, mode: "create", departure: null, dateKey: null });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const requestSeq = useRef(0);

    const today = todayKey();
    const minKey = minAllowedKey();

    const tour = useMemo(() => tours.find((item) => item.id === tourId), [tours, tourId]);

    // Phạm vi ngày hiển thị trên lưới lịch (bao gồm ngày kề tuần đầu/cuối tháng)
    // để chip ở các ô ngày liền kề không bị thiếu khi fetch theo tháng.
    const gridRange = useMemo(() => {
        const days = buildMonthGrid(monthDate).flat();
        return {
            from: days.length ? toKey(days[0]) : "",
            to: days.length ? toKey(days[days.length - 1]) : "",
        };
    }, [monthDate]);

    const tourDepartures = useMemo(
        () => departures.filter((item) => item.tour_id === tourId),
        [departures, tourId],
    );
    const byDate = useMemo(() => groupByDate(tourDepartures), [tourDepartures]);
    const prefix = monthPrefix(monthDate);
    const monthCount = tourDepartures.filter((item) =>
        item.departure_date.startsWith(prefix),
    ).length;

    const dayDepartures = selectedDay ? byDate[selectedDay] ?? [] : [];
    const drawerStatus = selectedDeparture ? deriveStatus(selectedDeparture, today) : null;
    const drawerMeta = drawerStatus ? STATUS_META[drawerStatus] : null;
    const seatsLeft = selectedDeparture ? Number(selectedDeparture.seats_available) : 0;

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== "Escape") return;
            setSelectedDay(null);
            setSelectedDeparture(null);
            setDeleteTarget(null);
            setForm((prev) => ({ ...prev, open: false }));
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Tải danh sách tour cho dropdown chọn tour (một lần khi mở màn hình).
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await getTours();
                if (cancelled) return;
                if (res?.httpStatus === 401) {
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }
                if (!res?.success) throw new Error(res?.message || "Không tải được danh sách tour.");
                setTours(res.data ?? []);
                setTourId((prev) => prev ?? res.data?.[0]?.id ?? null);
            } catch (error) {
                if (!cancelled) toast.error(error.message);
            } finally {
                if (!cancelled) setToursLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [toast, navigate]);

    // Tải chuyến khởi hành theo tour + tháng hiển thị. Dùng requestSeq để bỏ qua
    // phản hồi của request cũ khi người dùng đổi tour/đổi tháng liên tục.
    useEffect(() => {
        if (!tourId || !gridRange.from) return;
        let cancelled = false;
        const seq = ++requestSeq.current;
        setDataLoading(true);
        (async () => {
            try {
                const res = await getDepartures({
                    tour_id: tourId,
                    from: gridRange.from,
                    to: gridRange.to,
                    limit: 100,
                });
                if (cancelled || seq !== requestSeq.current) return;
                if (res?.httpStatus === 401) {
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }
                if (!res?.success) throw new Error(res?.message || "Không tải được lịch khởi hành.");
                setDepartures(res.data ?? []);
            } catch (error) {
                if (!cancelled && seq === requestSeq.current) toast.error(error.message);
            } finally {
                if (!cancelled && seq === requestSeq.current) setDataLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [tourId, gridRange.from, gridRange.to, toast, navigate]);

    const openCreate = (dateKey) =>
        setForm({ open: true, mode: "create", departure: null, dateKey: dateKey ?? minKey });
    const openEdit = (departure) =>
        setForm({ open: true, mode: "edit", departure, dateKey: departure.departure_date });

    const handleSubmit = async (payload) => {
        try {
            if (form.mode === "edit" && form.departure) {
                const res = await updateDeparture(form.departure.id, payload);
                if (res?.httpStatus === 401) {
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }
                if (!res?.success) throw new Error(res?.message || "Không cập nhật được chuyến.");
                setDepartures((prev) =>
                    prev.map((item) => (item.id === res.data.id ? { ...item, ...res.data } : item)),
                );
                toast.success(res?.message || "Đã cập nhật chuyến khởi hành.");
            } else {
                const res = await createDeparture({ ...payload, tour_id: tourId });
                if (res?.httpStatus === 401) {
                    toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                    navigate("/login");
                    return;
                }
                if (!res?.success) throw new Error(res?.message || "Không tạo được chuyến.");
                setDepartures((prev) => [...prev, res.data]);
                toast.success(res?.message || "Đã thêm chuyến khởi hành.");
                // Nhảy tới tháng chứa ngày vừa tạo để lịch hiển thị chuyến mới.
                setMonthDate(startOfMonth(new Date(`${payload.departure_date}T00:00:00`)));
            }
            setForm((prev) => ({ ...prev, open: false }));
        } catch (error) {
            toast.error(error.message);
        }
    };

    const toggleStatus = async (departure) => {
        if (departure.departure_date < today) {
            toast.warning("Chuyến đã qua ngày, không thể mở lại.");
            return;
        }
        const next = departure.is_closed ? "open" : "closed";
        try {
            const res = await updateDepartureStatus(departure.id, next);
            if (res?.httpStatus === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                navigate("/login");
                return;
            }
            if (!res?.success) throw new Error(res?.message || "Không đổi được trạng thái.");
            setDepartures((prev) =>
                prev.map((item) => (item.id === departure.id ? { ...item, ...res.data } : item)),
            );
            toast.success(
                res?.message || (next === "closed" ? "Đã đóng chuyến." : "Đã mở lại chuyến."),
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    const confirmDelete = async () => {
        try {
            const res = await deleteDeparture(deleteTarget.id);
            if (res?.httpStatus === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
                navigate("/login");
                setDeleteTarget(null);
                return;
            }
            if (!res?.success) throw new Error(res?.message || "Không xóa được chuyến.");
            setDepartures((prev) => prev.filter((item) => item.id !== deleteTarget.id));
            if (selectedDeparture && selectedDeparture.id === deleteTarget.id) {
                setSelectedDeparture(null);
            }
            toast.success(res?.message || "Đã xóa chuyến khởi hành.");
            setDeleteTarget(null);
        } catch (error) {
            toast.error(error.message);
            setDeleteTarget(null);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Quản lý điểm khởi hành</h2>
                    <p className="mt-1 text-sm text-muted">
                        Mỗi tour một lịch · cùng ngày có thể mở nhiều chuyến (khác điểm khởi hành) ·
                        tạo mới phải cách hôm nay ít nhất {MIN_LEAD_DAYS} ngày.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => openCreate(minKey)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <i className="fa-solid fa-plus" />
                    Thêm chuyến
                </button>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-r from-primary-50 to-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="block w-full sm:w-96">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                            Tour đang quản lý
                        </span>
                        {toursLoading ? (
                            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">
                                <i className="fa-solid fa-spinner fa-spin" />
                                Đang tải tour…
                            </div>
                        ) : (
                            <TourPicker
                                tours={tours}
                                value={tourId}
                                onChange={(id) => {
                                    setTourId(id);
                                    setSelectedDay(null);
                                    setSelectedDeparture(null);
                                }}
                            />
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
                        <span className="inline-flex items-center gap-1.5">
                            <i className="fa-solid fa-location-dot text-primary" />
                            {tour?.region}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <i className="fa-regular fa-clock text-primary" />
                            {tour?.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <i className="fa-solid fa-calendar-days text-primary" />
                            {monthCount} chuyến trong tháng
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Tháng trước"
                        onClick={() => setMonthDate((date) => addMonths(date, -1))}
                        className={iconButtonClass}
                    >
                        <i className="fa-solid fa-chevron-left" />
                    </button>
                    <span className="min-w-[9.5rem] text-center text-base font-bold text-foreground">
                        {formatMonthTitle(monthDate)}
                    </span>
                    <button
                        type="button"
                        aria-label="Tháng sau"
                        onClick={() => setMonthDate((date) => addMonths(date, 1))}
                        className={iconButtonClass}
                    >
                        <i className="fa-solid fa-chevron-right" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setMonthDate(startOfMonth(new Date()))}
                        className="ml-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground transition-colors duration-150 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        Hôm nay
                    </button>
                    {dataLoading && (
                        <span className="ml-1 flex items-center gap-1.5 text-xs text-muted">
                            <i className="fa-solid fa-spinner fa-spin" />
                            Đang tải
                        </span>
                    )}
                </div>
                <Legend />
            </div>

            <MonthCalendar
                monthDate={monthDate}
                departuresByDate={byDate}
                selectedKey={selectedDay}
                today={today}
                onSelectDay={setSelectedDay}
                onSelectDeparture={(departure) => {
                    setSelectedDay(departure.departure_date);
                    setSelectedDeparture(departure);
                }}
            />

            <p className="text-xs text-muted">
                <i className="fa-solid fa-lightbulb text-accent" /> Bấm vào ô ngày để xem hoặc thêm
                chuyến; bấm vào chuyến để đóng–mở, sửa hoặc xóa.
            </p>

            {selectedDay && (
                <DayDrawer
                    dateKey={selectedDay}
                    departure={selectedDeparture}
                    dayDepartures={dayDepartures}
                    meta={drawerMeta}
                    seatsLeft={seatsLeft}
                    isPast={selectedDay < today}
                    canAdd={selectedDay >= minKey}
                    today={today}
                    onClose={() => {
                        setSelectedDay(null);
                        setSelectedDeparture(null);
                    }}
                    onSelectDeparture={setSelectedDeparture}
                    onEdit={() => openEdit(selectedDeparture)}
                    onToggle={() => toggleStatus(selectedDeparture)}
                    onDelete={() => setDeleteTarget(selectedDeparture)}
                    onAdd={() => openCreate(selectedDay)}
                />
            )}

            {form.open && (
                <DepartureFormModal
                    mode={form.mode}
                    tour={tour}
                    departure={form.departure}
                    defaultDate={form.dateKey}
                    minKey={minKey}
                    onClose={() => setForm((prev) => ({ ...prev, open: false }))}
                    onSubmit={handleSubmit}
                />
            )}

            <DeleteDepartureModal
                departure={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
