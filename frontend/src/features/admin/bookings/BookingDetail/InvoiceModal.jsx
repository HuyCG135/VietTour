import { Printer, X, FileText } from "lucide-react";
import { PaymentPill } from "./common";
import { bookingCode, formatDate, formatDateTime, formatPax, formatVnd } from "./detailFormat";

function InvoiceField({ label, value }) {
    return (
        <p className="mb-2">
            <span className="mb-0.5 block text-xs text-muted">{label}</span>
            <span className="text-sm font-semibold text-foreground">{value || "---"}</span>
        </p>
    );
}

export default function InvoiceModal({ booking, open, rows = [], total = 0, onClose }) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Hóa đơn booking"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={onClose}
        >
            <div
                className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="flex items-center gap-2 text-base font-bold">
                        <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                        Hóa đơn {bookingCode(booking.id)}
                    </h3>
                    <div className="no-print flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            <Printer className="h-4 w-4" aria-hidden="true" />
                            In ngay
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Đóng"
                            className="cursor-pointer rounded-lg p-1 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="print-only overflow-y-auto p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <p className="text-2xl font-black leading-none text-primary">VIETRAVEL</p>
                            <p className="mt-1 text-xs text-muted">Du lịch trọn vẹn</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-xl font-extrabold text-foreground">HÓA ĐƠN</h4>
                            <p className="mt-1 text-xs text-muted">
                                Mã đơn: <span className="tabular-nums">{bookingCode(booking.id)}</span>
                            </p>
                            <p className="text-xs text-muted">
                                Ngày lập: {formatDateTime(new Date().toISOString())}
                            </p>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                        <InvoiceField label="Họ tên khách hàng" value={booking.contact_name} />
                        <InvoiceField label="Số điện thoại" value={booking.contact_phone} />
                        <div className="sm:col-span-2">
                            <InvoiceField label="Email" value={booking.contact_email} />
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <InvoiceField label="Tour" value={booking.tour_name} />
                        <InvoiceField label="Ngày khởi hành" value={formatDate(booking.departure_date)} />
                        <InvoiceField label="Điểm khởi hành" value={booking.departure_location || "Việt Nam"} />
                        <InvoiceField
                            label="Số lượng khách"
                            value={formatPax(booking.adults, booking.children)}
                        />
                    </div>

                    <table className="mt-6 w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500">
                                <th className="px-3 py-2 text-left font-bold">Hạng mục</th>
                                <th className="px-3 py-2 text-right font-bold">Số lượng</th>
                                <th className="px-3 py-2 text-right font-bold">Đơn giá</th>
                                <th className="px-3 py-2 text-right font-bold">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.key} className="border-t border-slate-100">
                                    <td className="px-3 py-2">{row.label}</td>
                                    <td className="px-3 py-2 text-right tabular-nums">{row.qty || "—"}</td>
                                    <td className="px-3 py-2 text-right tabular-nums">{formatVnd(row.unit)}</td>
                                    <td className="px-3 py-2 text-right font-semibold tabular-nums">
                                        {formatVnd(row.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-200">
                                <td colSpan="3" className="px-3 py-3 text-right font-bold text-foreground">
                                    Tổng cộng
                                </td>
                                <td className="px-3 py-3 text-right font-extrabold text-primary tabular-nums">
                                    {formatVnd(total)}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="px-3 py-2 text-right text-xs text-muted">
                                    Trạng thái thanh toán: <PaymentPill status={booking.payment_status} />
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <p className="no-print mt-8 border-t border-slate-100 pt-4 text-center text-xs text-muted">
                        * Cảm ơn quý khách đã tin tưởng dịch vụ Vietravel. Hóa đơn xác nhận đặt chỗ thành công.
                    </p>
                </div>
            </div>
        </div>
    );
}
