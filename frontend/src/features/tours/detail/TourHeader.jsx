import { Link } from "react-router-dom";

const TourHeader = ({ tour, onShare, onToggleFavorite, isFavorite }) => {
    return (
        <div className="bg-surface rounded-3xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] p-5 sm:p-6">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                <Link to="/" className="hover:text-primary transition-colors no-underline">
                    Trang chủ
                </Link>
                <i className="fa-solid fa-angle-right text-[10px]" aria-hidden="true" />
                <Link to="/tours" className="hover:text-primary transition-colors no-underline">
                    Tour du lịch
                </Link>
                <i className="fa-solid fa-angle-right text-[10px]" aria-hidden="true" />
                <span className="font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-[420px]">{tour.name}</span>
            </nav>

            <hr className="my-4 border-slate-100" />

            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight leading-tight">
                        {tour.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                            <i className="fa-solid fa-location-dot text-primary text-[11px]" />
                            {tour.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                            <i className="fa-regular fa-clock text-primary text-[11px]" />
                            {tour.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-lg">
                            <i className="fa-solid fa-map text-primary text-[11px]" />
                            {tour.region}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-xs font-medium px-2.5 py-1.5 rounded-full ml-1">
                            <i className="fa-solid fa-circle-check text-[11px]" />
                            Đang mở bán
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={onShare}
                        aria-label="Chia sẻ tour"
                        className="w-10 h-10 rounded-full bg-surface border border-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors duration-150 hover:text-primary hover:border-primary/40"
                    >
                        <i className="fa-solid fa-share-nodes" />
                    </button>
                    <button
                        type="button"
                        onClick={onToggleFavorite}
                        aria-label={isFavorite ? "Bỏ yêu thích" : "Lưu yêu thích"}
                        className="w-10 h-10 rounded-full bg-surface border border-slate-200 flex items-center justify-center cursor-pointer transition-colors duration-150 hover:border-primary/40"
                    >
                        <i
                            className={`fa-${isFavorite ? "solid" : "regular"} fa-heart text-slate-500 hover:text-rose-500 ${
                                isFavorite ? "text-rose-500" : ""
                            }`}
                        />
                    </button>
                    <button
                        type="button"
                        className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-6 py-2.5 rounded-full transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                    >
                        Đặt Tour ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourHeader;