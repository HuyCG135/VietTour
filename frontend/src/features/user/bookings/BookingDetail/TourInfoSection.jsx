import { SectionCard, InfoItem } from "./common";
import defaultTourImage from "../../../../assets/images/image.png";
import { formatDate, formatPax } from "../bookingFormat";

export default function TourInfoSection({ booking, adults, children }) {
    const b = booking;
    return (
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
    );
}