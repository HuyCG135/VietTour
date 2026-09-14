import { Link } from "react-router-dom";
import defaultTourImage from "../../../assets/images/image.png";
import { formatDate } from "../bookings/bookingFormat";
import Stars from "./Stars";

export default function ReviewCard({ review: r, onEdit, onDelete }) {
    return (
        <article className="group bg-surface rounded-2xl border border-border shadow-[0_2px_10px_rgba(30,41,59,0.05)] hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 p-5 sm:p-6">
            <div className="flex items-start gap-4">
                <Link
                    to={`/tours/${r.tour_id}`}
                    className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100 block"
                    aria-label={`Xem tour ${r.tour_name || ""}`}
                >
                    <img
                        src={r.cover_image || defaultTourImage}
                        alt={r.tour_name || "Tour"}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>

                <div className="flex-1 min-w-0 pt-0.5">
                    <Link
                        to={`/tours/${r.tour_id}`}
                        className="font-bold text-base sm:text-lg text-foreground leading-snug line-clamp-2 block hover:text-primary transition-colors"
                    >
                        {r.tour_name || "Tour không xác định"}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-muted font-medium">
                            <i className="fa-regular fa-clock mr-1.5" />
                            {formatDate(r.created_at)}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                    <button
                        type="button"
                        aria-label="Sửa đánh giá"
                        onClick={() => onEdit(r)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors duration-150 hover:bg-primary hover:text-white hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 cursor-pointer"
                    >
                        <i className="fa-solid fa-pen text-xs" />
                    </button>
                    <button
                        type="button"
                        aria-label="Xóa đánh giá"
                        onClick={() => onDelete(r)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-surface text-danger transition-colors duration-150 hover:bg-danger hover:text-white hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2 cursor-pointer"
                    >
                        <i className="fa-regular fa-trash-can text-xs" />
                    </button>
                </div>
            </div>

            <div className="mt-4 rounded-xl bg-primary-50/70 px-4 py-3.5 flex gap-3">
                <i className="fa-solid fa-quote-left text-primary/40 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line break-words mb-0">
                    {r.comment || (
                        <span className="italic text-muted">Không có nội dung bình luận</span>
                    )}
                </p>
            </div>
        </article>
    );
}