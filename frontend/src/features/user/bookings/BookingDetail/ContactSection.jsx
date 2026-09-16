import { SectionCard, InfoItem } from "./common";

export default function ContactSection({ booking }) {
    const b = booking;
    return (
        <SectionCard icon="fa-solid fa-address-book" title="Thông tin liên lạc">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoItem label="Họ và tên" value={b.contact_name || "---"} />
                <InfoItem label="Số điện thoại" value={b.contact_phone || "---"} />
                <div className="sm:col-span-2">
                    <InfoItem label="Email" value={b.contact_email || "---"} />
                </div>
            </div>
        </SectionCard>
    );
}