import { useState } from "react";
import ReviewCard from "./ReviewCard";

const INITIAL_VISIBLE = 3;

const TourReviews = ({ reviews = [], avgRating = 0, reviewCount = 0 }) => {
    const [showAll, setShowAll] = useState(false);
    const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);

    return (
        <section
            id="reviews"
            className="scroll-mt-24 bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] p-6"
        >
            <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <i className="fa-solid fa-star-half-stroke text-primary" aria-hidden="true" />
                    Đánh giá từ du khách
                </h2>

                {reviewCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-accent/10 text-foreground font-bold text-sm px-3 py-1.5 rounded-full">
                        <i className="fa-solid fa-star text-accent" aria-hidden="true" />
                        {Number(avgRating).toFixed(1)}
                        <span className="font-medium text-muted">({reviewCount} lượt)</span>
                    </span>
                )}
            </div>

            {reviews.length === 0 ? (
                <p className="text-sm text-muted">Chưa có đánh giá nào cho tour này.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {visibleReviews.map((review) => (
                            <ReviewCard key={review.id} {...review} />
                        ))}
                    </div>

                    {reviews.length > INITIAL_VISIBLE && (
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => setShowAll((prev) => !prev)}
                                className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 font-bold px-6 py-2.5 rounded-full transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                            >
                                {showAll ? "Thu gọn đánh giá" : "Hiện tất cả đánh giá"}
                                <i className={`fa-solid fa-chevron-${showAll ? "up" : "down"} text-xs`} aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default TourReviews;