import { PaymentPill } from "./common";
import { formatVnd } from "../../../booking/bookingPrices";
import { formatDate, formatDateTime, formatPax } from "../bookingFormat";

function InvoiceField({ label, value }) {
    return (
        <p className="mb-2">
            <span className="text-xs text-muted block mb-0.5">{label}</span>
            <span className="font-semibold text-foreground text-sm">{value || "---"}</span>
        </p>
    );
}

export default function InvoiceModal({ booking, open, priceRows, adults, children, onClose }) {
    if (!open) return null;
    const b = booking;
    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
            onClick={onClose}
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
                            onClick={onClose}
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
    );
}