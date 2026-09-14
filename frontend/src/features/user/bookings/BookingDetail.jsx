import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import { useToast } from "../../../context/ToastContext";
import defaultTourImage from "../../../assets/images/image.png";
import { formatVnd } from "../../booking/bookingPrices";
import { getBookingDetail, cancelBooking } from "./booking.api";
import { BOOKING_STATUS, BOOKING_PAYMENT, COMPLETED_STATUS } from "./bookingStatus";
import { formatDate, formatDateTime, formatPax } from "./bookingFormat";

const toNum = (v) => Number(v) || 0;

function SectionCard({ icon, title, children }) {
    return (
        <section className="bg-surface rounded-2xl border border-border overflow-hidden">
            <header className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-primary-50/60">
                <i className={`${icon} text-primary text-base`} />
                <h2 className="font-bold text-base text-foreground mb-0">{title}</h2>
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">{label}</p>
            <p className="font-semibold text-foreground text-[15px] mb-0 break-words">{value}</p>
        </div>
    );
}

function StatusPill({ status, completed = false }) {
    const s = completed
        ? COMPLETED_STATUS
        : BOOKING_STATUS[status] || {
              label: status,
              icon: "fa-solid fa-circle-info",
              cls: "bg-muted/10 text-muted",
          };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-xs sm:text-sm whitespace-nowrap ${s.cls}`}>
            <i className={s.icon} />
            {s.label}
        </span>
    );
}

function PaymentPill({ status }) {
    const p =
        BOOKING_PAYMENT[status] || {
            label: status,
            icon: "fa-solid fa-circle-info",
            chip: "bg-muted/10 text-muted",
        };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${p.chip}`}>
            <i className={p.icon} />
            {p.label}
        </span>
    );
}

export default function BookingDetail() {
    const toast = useToast();
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getBookingDetail(id);
                if (res?.success) {
                    setBooking(res.data);
                } else {
                    setError(res?.message || "Không thể tải thông tin đặt chỗ");
                }
            } catch (err) {
                setError(err?.message || "Lỗi kết nối đến server");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    useEffect(() => {
        if (!invoiceOpen && !cancelOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                setInvoiceOpen(false);
                setCancelOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [invoiceOpen, cancelOpen]);

    const confirmCancel = async () => {
        setCancelling(true);
        try {
            const res = await cancelBooking(id);
            if (res?.success) {
                toast.success(res.message || "Đã gửi yêu cầu hủy booking");
                setBooking((b) => (b ? { ...b, status: "cancelled" } : b));
                setCancelOpen(false);
            } else {
                toast.danger(res?.message || "Không thể hủy booking");
            }
        } catch (err) {
            toast.danger(err?.message || "Lỗi kết nối đến server");
        } finally {
            setCancelling(false);
        }
    };

    const b = booking;

    const adults = toNum(b?.adults);
    const children = toNum(b?.children);
    const unitAdult = toNum(b?.price_default) + toNum(b?.price_moving);
    const unitChild = toNum(b?.price_child) + toNum(b?.price_moving_child);

    let priceRows = [];
    if (adults > 0) {
        priceRows.push({ label: `Người lớn × ${adults}`, qty: adults, unit: unitAdult, amount: unitAdult * adults });
    }
    if (children > 0) {
        priceRows.push({ label: `Trẻ em × ${children}`, qty: children, unit: unitChild, amount: unitChild * children });
    }
    if (priceRows.length === 0) {
        priceRows = [{ label: "Giá tour", qty: 1, unit: toNum(b?.total_price), amount: toNum(b?.total_price) }];
    }

    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const isCompleted =
        b?.status === "confirmed" && b?.payment_status === "paid" && String(b?.departure_date).slice(0, 10) < todayStr;

    const passengers = b?.passengers || [];

    return (
        <div className="space-y-6">
            <Link
                to="/user/bookings"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
                <i className="fa-solid fa-chevron-left" />
                Trở về lịch sử đặt tour
            </Link>

            {loading && <Loading />}

            {!loading && error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 text-danger px-4 py-3 text-sm"
                >
                    <i className="fa-solid fa-circle-exclamation" />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && b && (
                <>
                    {/* Đầu trang: mã đơn + trạng thái + thao tác */}
                    <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1">
                                    Mã booking: <span className="tabular-nums">#MB{b.id}</span>
                                </h1>
                                <p className="text-sm text-muted mb-0">
                                    <i className="fa-regular fa-clock mr-1.5" />
                                    Ngày đặt: {formatDateTime(b.created_at)}
                                </p>
                            </div>
                            {isCompleted ? <StatusPill status="confirmed" completed /> : <StatusPill status={b.status} />}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setInvoiceOpen(true)}
                                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                            >
                                <i className="fa-solid fa-print" />
                                In hóa đơn
                            </button>
                            {b.status === "pending" && (
                                <button
                                    type="button"
                                    onClick={() => setCancelOpen(true)}
                                    className="inline-flex items-center gap-2 border border-danger/60 text-danger hover:bg-danger hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                                >
                                    <i className="fa-solid fa-ban" />
                                    Hủy booking
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Cột trái */}
                        <div className="lg:col-span-2 space-y-5">
                            <SectionCard icon="fa-solid fa-route" title="Thông tin tour">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-40 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                        <img
                                            src={b.cover_image || defaultTourImage}
                                            alt={b.tour_name || "Tour"}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-lg text-foreground leading-snug mb-1">
                                            {b.tour_name || "Tour không xác định"}
                                        </h3>
                                        {b.duration && (
                                            <p className="text-sm text-muted mb-0">
                                                <i className="fa-regular fa-clock mr-1.5" />
                                                Thời gian: {b.duration}
                                            </p>
                                        )}
                                        {b.region && (
                                            <p className="text-sm text-muted mb-0 mt-0.5">
                                                <i className="fa-solid fa-location-dot mr-1.5 text-rose-500" />
                                                Khu vực: {b.region}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
                                    <InfoItem label="Ngày khởi hành" value={formatDate(b.departure_date)} />
                                    <InfoItem label="Điểm khởi hành" value={b.departure_location || "Việt Nam"} />
                                    <InfoItem label="Số lượng khách" value={formatPax(adults, children)} />
                                </div>
                            </SectionCard>

                            <SectionCard icon="fa-solid fa-address-book" title="Thông tin liên lạc">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <InfoItem label="Họ và tên" value={b.contact_name || "---"} />
                                    <InfoItem label="Số điện thoại" value={b.contact_phone || "---"} />
                                    <div className="sm:col-span-2">
                                        <InfoItem label="Email" value={b.contact_email || "---"} />
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard icon="fa-solid fa-users" title="Khách đi tour">
                                {passengers.length === 0 ? (
                                    <p className="text-center text-muted text-sm py-4 mb-0">
                                        Không có thông tin hành khách
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto -mx-5">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 text-slate-500">
                                                    <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Họ và tên</th>
                                                    <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Loại khách</th>
                                                    <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Giới tính</th>
                                                    <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Ngày sinh</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {passengers.map((p) => (
                                                    <tr key={p.id} className="border-t border-border/70">
                                                        <td className="px-5 py-3 font-semibold text-foreground whitespace-nowrap">{p.fullname}</td>
                                                        <td className="px-5 py-3">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                                                    p.passenger_type === "child"
                                                                        ? "bg-emerald-500/10 text-emerald-800"
                                                                        : "bg-primary-50 text-primary-dark"
                                                                }`}
                                                            >
                                                                {p.passenger_type === "child" ? "Trẻ em" : "Người lớn"}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{p.gender || "Khác"}</td>
                                                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{formatDate(p.dob)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </SectionCard>
                        </div>

                        {/* Cột phải */}
                        <div className="space-y-5">
                            <SectionCard icon="fa-solid fa-receipt" title="Chi tiết thanh toán">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-muted">Trạng thái thanh toán</span>
                                        <PaymentPill status={b.payment_status} />
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-muted">Hình thức</span>
                                        <span className="font-semibold text-foreground">VNPay</span>
                                    </div>
                                </div>

                                <div className="my-4 border-t border-border/70" />

                                <div className="space-y-2.5">
                                    {priceRows.map((row) => (
                                        <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                                            <span className="text-muted">{row.label}</span>
                                            <span className="font-semibold text-foreground tabular-nums">{formatVnd(row.amount)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
                                    <span className="font-bold text-foreground">Tổng cộng</span>
                                    <span className="text-2xl font-extrabold text-rose-600 tabular-nums leading-tight">
                                        {formatVnd(b.total_price)}
                                    </span>
                                </div>
                            </SectionCard>

                            <SectionCard icon="fa-solid fa-note-sticky" title="Ghi chú">
                                <p className="text-sm text-muted italic mb-0">{b.note || "Không có ghi chú nào"}</p>
                            </SectionCard>
                        </div>
                    </div>

                    {/* Modal xác nhận hủy */}
                    {cancelOpen && (
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="cancel-title"
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
                            onClick={() => !cancelling && setCancelOpen(false)}
                        >
                            <div
                                className="w-full max-w-md bg-surface rounded-2xl border border-border p-6 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 id="cancel-title" className="font-bold text-lg text-danger flex items-center gap-2 mb-3">
                                    <i className="fa-solid fa-triangle-exclamation" />
                                    Xác nhận hủy booking
                                </h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Bạn có chắc chắn muốn hủy booking <b className="tabular-nums">#MB{b.id}</b> cho tour
                                    <b> {b.tour_name}</b> không?
                                </p>
                                <div className="rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 mb-5">
                                    <i className="fa-solid fa-circle-info mr-1.5" />
                                    Booking sẽ chuyển sang trạng thái <b>Đã hủy</b>, số ghế đã đặt sẽ được trả lại.
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        disabled={cancelling}
                                        onClick={() => setCancelOpen(false)}
                                        className="border border-border text-foreground px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        Không, quay lại
                                    </button>
                                    <button
                                        type="button"
                                        disabled={cancelling}
                                        onClick={confirmCancel}
                                        className="bg-danger hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                                    >
                                        {cancelling && <i className="fa-solid fa-spinner fa-spin" />}
                                        Chắc chắn hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal hóa đơn */}
                    {invoiceOpen && (
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
                            onClick={() => setInvoiceOpen(false)}
                        >
                            <div
                                className="w-full max-w-2xl max-h-[92vh] bg-surface rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                    <h3 className="font-bold text-base flex items-center gap-2 mb-0">
                                        <i className="fa-solid fa-file-invoice text-primary" />
                                        Hóa đơn #MB{b.id}
                                    </h3>
                                    <div className="flex items-center gap-3 no-print">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                                        >
                                            <i className="fa-solid fa-print" />
                                            In ngay
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInvoiceOpen(false)}
                                            aria-label="Đóng"
                                            className="text-muted hover:text-foreground text-2xl leading-none cursor-pointer border-0 bg-transparent"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-y-auto p-6 sm:p-8 print-only">
                                    <div className="flex items-start justify-between gap-6">
                                        <div>
                                            <p className="font-black text-2xl text-primary leading-none mb-1">VIETTOUR</p>
                                            <p className="text-xs text-muted mb-0">Du lịch trọn vẹn</p>
                                        </div>
                                        <div className="text-right">
                                            <h4 className="font-extrabold text-xl text-foreground mb-1">HÓA ĐƠN</h4>
                                            <p className="text-xs text-muted mb-0.5">
                                                Mã đơn: <span className="tabular-nums">#MB{b.id}</span>
                                            </p>
                                            <p className="text-xs text-muted mb-0">Ngày lập: {formatDateTime(new Date().toISOString())}</p>
                                        </div>
                                    </div>

                                    <hr className="my-6" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                        <InvoiceField label="Họ tên khách hàng" value={b.contact_name} />
                                        <InvoiceField label="Số điện thoại" value={b.contact_phone} />
                                        <div className="sm:col-span-2">
                                            <InvoiceField label="Email" value={b.contact_email} />
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4">
                                        <InvoiceField label="Tour" value={b.tour_name} />
                                        <InvoiceField label="Ngày khởi hành" value={formatDate(b.departure_date)} />
                                        <InvoiceField label="Điểm khởi hành" value={b.departure_location || "Việt Nam"} />
                                        <InvoiceField label="Số lượng khách" value={formatPax(adults, children)} />
                                    </div>

                                    <table className="w-full mt-6 text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500">
                                                <th className="text-left font-bold px-3 py-2">Hạng mục</th>
                                                <th className="text-right font-bold px-3 py-2">Số lượng</th>
                                                <th className="text-right font-bold px-3 py-2">Đơn giá</th>
                                                <th className="text-right font-bold px-3 py-2">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {priceRows.map((row) => (
                                                <tr key={row.label} className="border-t border-slate-100">
                                                    <td className="px-3 py-2">{row.label}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{row.qty}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{formatVnd(row.unit)}</td>
                                                    <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatVnd(row.amount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-slate-200">
                                                <td colSpan="3" className="px-3 py-3 text-right font-bold text-foreground">
                                                    Tổng cộng
                                                </td>
                                                <td className="px-3 py-3 text-right font-extrabold text-rose-600 tabular-nums">
                                                    {formatVnd(b.total_price)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan="4" className="px-3 py-2 text-right text-muted text-xs">
                                                    Trạng thái thanh toán: <PaymentPill status={b.payment_status} />
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    <p className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-muted mb-0 no-print">
                                        * Cảm ơn quý khách đã tin tưởng dịch vụ VietTour. Hóa đơn xác nhận đặt chỗ thành công.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function InvoiceField({ label, value }) {
    return (
        <p className="mb-2">
            <span className="text-xs text-muted block mb-0.5">{label}</span>
            <span className="font-semibold text-foreground text-sm">{value || "---"}</span>
        </p>
    );
}