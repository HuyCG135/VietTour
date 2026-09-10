import { Link } from "react-router-dom";
import defaultTourImage from "../../assets/images/image.png";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(Number(price || 0)) + "đ";
}

export default function TourListCard({ tour, isFavorite, onToggleFavorite, layout = "grid" }) {
    const isPremium = Number(tour.price_default) >= 8000000;

    // Nút tim yêu thích dùng chung
    const favoriteButton = onToggleFavorite ? (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite();
            }}
            aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
            className="w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow-sm flex items-center justify-center cursor-pointer transition-all hover:scale-105 z-10"
        >
            <i
                className={`fa-solid fa-heart text-sm transition-colors ${
                    isFavorite ? "text-rose-500" : "text-slate-400 hover:text-rose-400"
                }`}
            />
        </button>
    ) : null;

    // Badge Cao cấp dùng chung: pill đặc, không gradient, không icon
    const premiumBadge = isPremium ? (
        <span className="inline-flex items-center bg-slate-950/75 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Cao cấp
        </span>
    ) : null;

    if (layout === "grid") {
        return (
            <div className="group bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
                {/* Ảnh cover 16:10 */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Link to={`/tours/${tour.id}`} className="block w-full h-full">
                        <img
                            src={tour.cover_image || defaultTourImage}
                            alt={tour.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    {/* Vùng tối đáy ảnh để badge/location đọc rõ, không phủ trùm khung */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 z-10 pointer-events-none">{premiumBadge}</div>
                    <div className="absolute top-3 right-3 z-10">{favoriteButton}</div>

                    <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white text-xs font-medium">
                        <span className="inline-flex items-center gap-1 bg-slate-950/65 px-2 py-0.5 rounded-md">
                            <i className="fa-solid fa-location-dot text-amber-300 text-[11px]" />
                            <span className="truncate max-w-[140px]">{tour.location || tour.region}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-slate-950/65 px-2 py-0.5 rounded-md">
                            <i className="fa-regular fa-clock text-amber-300 text-[11px]" />
                            <span>{tour.duration}</span>
                        </span>
                    </div>
                </div>

                {/* Nội dung card */}
                <div className="p-4 flex flex-col flex-1">
                    <Link to={`/tours/${tour.id}`} className="no-underline text-inherit mb-2">
                        <h2 className="font-bold text-base text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[42px]">
                            {tour.name}
                        </h2>
                    </Link>

                    <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed flex-1">
                        {tour.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                            <span className="text-[11px] text-muted block font-medium">Giá trọn gói từ</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-rose-600">
                                    {formatPrice(tour.price_default)}
                                </span>
                                <span className="text-[11px] text-muted font-normal">/ khách</span>
                            </div>
                        </div>

                        <Link
                            to={`/tours/${tour.id}`}
                            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-xs transition-colors no-underline"
                        >
                            Chi tiết <i className="fa-solid fa-arrow-right text-[10px]" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // List Layout (Dạng danh sách ngang)
    return (
        <div className="group bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
            {/* Ảnh trái */}
            <div className="relative md:w-[38%] lg:w-[36%] min-h-[200px] md:min-h-[220px] bg-slate-100 overflow-hidden">
                <Link to={`/tours/${tour.id}`} className="block w-full h-full">
                    <img
                        src={tour.cover_image || defaultTourImage}
                        alt={tour.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 z-10 pointer-events-none">{premiumBadge}</div>
                <div className="absolute top-3 right-3 z-10">{favoriteButton}</div>

                <div className="absolute bottom-2.5 left-3 z-10 inline-flex items-center gap-1 bg-slate-950/65 px-2 py-0.5 rounded-md text-white text-xs font-medium">
                    <i className="fa-solid fa-map-pin text-amber-300 text-[11px]" />
                    <span>{tour.region}</span>
                </div>
            </div>

            {/* Nội dung phải */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
                <Link to={`/tours/${tour.id}`} className="no-underline text-inherit flex-1 mb-2">
                    <h2 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {tour.name}
                    </h2>
                </Link>

                {/* Meta pills */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                        <i className="fa-solid fa-location-dot text-rose-500" />
                        <span>{tour.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                        <i className="fa-regular fa-clock text-amber-500" />
                        <span>{tour.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                        <i className="fa-solid fa-map text-primary" />
                        <span>{tour.region}</span>
                    </span>
                </div>

                <p className="text-xs sm:text-sm text-muted line-clamp-2 mb-4 leading-relaxed flex-1">
                    {tour.description}
                </p>

                {/* Footer card */}
                <div className="flex items-end justify-between pt-3 border-t border-slate-100 mt-auto">
                    <div>
                        <span className="text-xs text-muted block font-medium">Giá trọn gói từ</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-rose-600 text-xl sm:text-2xl">
                                {formatPrice(tour.price_default)}
                            </span>
                            <span className="text-xs text-muted">/ khách</span>
                        </div>
                    </div>

                    <Link
                        to={`/tours/${tour.id}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors no-underline"
                    >
                        <span>Xem chi tiết</span>
                        <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                </div>
            </div>
        </div>
    );
}