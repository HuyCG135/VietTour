import { UserRound } from "lucide-react";
import { SectionCard, InfoItem, PaymentPill } from "./common";
import { formatDate } from "./detailFormat";

export default function CustomerSection({ booking }) {
    const name = booking.customer_name || booking.contact_name;
    const email = booking.contact_email || booking.user_email;
    const phone = booking.contact_phone || booking.user_phone;
    const isRegistered = Boolean(booking.user_id);

    return (
        <SectionCard icon={UserRound} title="Thông tin khách hàng">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem label="Họ và tên" value={name} />
                <InfoItem label="Số điện thoại" value={phone} />
                <InfoItem label="Email" value={email} />
                <InfoItem label="Ngày sinh" value={booking.contact_dob ? formatDate(booking.contact_dob) : undefined} />
                <InfoItem label="Giới tính" value={booking.contact_gender} />
                <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Loại khách
                    </p>
                    <p className="text-[15px] font-semibold text-foreground">
                        {isRegistered ? "Khách có tài khoản" : "Khách vãng lai"}
                    </p>
                </div>
                <div>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                        Thanh toán
                    </p>
                    <PaymentPill status={booking.payment_status} />
                </div>
                {booking.note && (
                    <div className="sm:col-span-2">
                        <InfoItem label="Ghi chú" value={booking.note} />
                    </div>
                )}
            </div>
        </SectionCard>
    );
}
