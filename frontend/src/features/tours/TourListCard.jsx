import { Link } from "react-router-dom";
import defaultTourImage from "../../assets/images/image.png";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(Number(price || 0)) + "đ";
}

export default function TourListCard({ tour, isFavorite, onToggleFavorite, layout = "grid" }) {
    const isPremium = Number(tour.price_default) >= 8000000;
    const tourCode = `TOUR${String(tour.id).padStart(3, "0")}`;

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
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110 z-10"
        >
            <i
                className={`fa-solid fa-heart text-sm transition-colors ${
                    isFavorite ? "text-rose-500" : "text-slate-400 hover:text-rose-400"
                }`}
            />
        </button>
    ) : null;

    if (layout === "grid") {
        return (
            <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.06)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full">
                {/* Ảnh cover 16:9 */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Link to={`/tours/${tour.id}`} className="block w-full h-full">
                        <img
                            src={tour.cover_image || defaultTourImage}
                            alt={tour.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>

                    {/* Lớp gradient nhẹ phủ lên ảnh để đọc badge tốt hơn */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {isPremium && (
                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                    <i className="fa-solid fa-crown text-[10px]" /> Cao cấp
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 bg-slate-900/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                                {tourCode}
                            </span>
                        </div>
                        {favoriteButton}
                    </div>

                    {/* Bottom Badges trên ảnh */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                        <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            <i className="fa-solid fa-location-dot text-rose-400 text-[11px]" />
                            <span className="truncate max-w-[130px]">{tour.location || tour.region}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                            <i className="fa-regular fa-clock text-amber-300 text-[11px]" />
                            <span>{tour.duration}</span>
                        </span>
                    </div>
                </div>

                {/* Nội dung card */}
                <div className="p-4 flex flex-col flex-1">
                    <Link to={`/tours/${tour.id}`} className="no-underline text-inherit mb-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[42px]">
                            {tour.name}
                        </h4>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                        {tour.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                            <span className="text-[11px] text-slate-400 block font-medium">Giá trọn gói từ</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-base sm:text-lg font-extrabold text-rose-600">
                                    {formatPrice(tour.price_default)}
                                </span>
                                <span className="text-[11px] text-slate-400 font-normal">/ khách</span>
                            </div>
                        </div>

                        <Link
                            to={`/tours/${tour.id}`}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all no-underline"
                        >
                            Chi tiết <i className="fa-solid fa-arrow-right text-[10px]" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // List Layout (Dạng danh sách ngang cao cấp)
    return (
        <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(30,41,59,0.06)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
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

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 pointer-events-auto">
                        {isPremium && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                                <i className="fa-solid fa-crown text-[10px]" /> Cao cấp
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 bg-slate-900/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                            {tourCode}
                        </span>
                    </div>
                    <div className="pointer-events-auto">{favoriteButton}</div>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        <i className="fa-solid fa-map-pin text-rose-400 text-[11px]" />
                        <span>{tour.region}</span>
                    </span>
                </div>
            </div>

            {/* Nội dung phải */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Link to={`/tours/${tour.id}`} className="no-underline text-inherit flex-1">
                        <h4 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {tour.name}
                        </h4>
                    </Link>
                </div>

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

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
                    {tour.description}
                </p>

                {/* Footer card */}
                <div className="flex items-end justify-between pt-3 border-t border-slate-100 mt-auto">
                    <div>
                        <span className="text-xs text-slate-400 block font-medium">Giá trọn gói từ</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-extrabold text-rose-600 text-xl sm:text-2xl">
                                {formatPrice(tour.price_default)}
                            </span>
                            <span className="text-xs text-slate-400">/ khách</span>
                        </div>
                    </div>

                    <Link
                        to={`/tours/${tour.id}`}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/20 hover:shadow-lg no-underline"
                    >
                        <span>Xem chi tiết</span>
                        <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                </div>
            </div>
        </div>
    );
}