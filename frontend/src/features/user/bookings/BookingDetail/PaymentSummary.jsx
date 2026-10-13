import { SectionCard, PaymentPill } from "./common";
import { formatVnd } from "../../../booking/bookingPrices";

export default function PaymentSummary({ booking, priceRows }) {
    const b = booking;
    return (
        <>
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
        </>
    );
}