import { Route } from "lucide-react";
import { SectionCard, InfoItem } from "./common";
import { formatDate, formatPax, toNum } from "./detailFormat";
import defaultTourImage from "../../../../assets/images/image.png";

export default function TourInfoSection({ booking }) {
    const adults = toNum(booking.adults);
    const children = toNum(booking.children);

    return (
        <SectionCard icon={Route} title="Thông tin tour">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
                    <img
                        src={booking.cover_image || defaultTourImage}
                        alt={booking.tour_name || "Tour"}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-snug text-foreground">
                        {booking.tour_name || "Tour không xác định"}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <InfoItem label="Thời lượng" value={booking.duration} />
                        <InfoItem label="Khu vực" value={booking.region} />
                        <InfoItem label="Ngày khởi hành" value={booking.departure_date_text || formatDate(booking.departure_date)} />
                        <InfoItem label="Điểm khởi hành" value={booking.departure_location} />
                        <InfoItem label="Số lượng khách" value={formatPax(adults, children)} />
                        <InfoItem
                            label="Chỗ còn trống"
                            value={
                                booking.seats_available === null || booking.seats_available === undefined
                                    ? undefined
                                    : `${toNum(booking.seats_available)} / ${toNum(booking.seats_total)}`
                            }
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
