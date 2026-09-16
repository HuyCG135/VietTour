function getInitials(name) {
    return (name || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

const ReviewCard = ({ user_name, avatar, rating = 5, comment, created_at }) => {
    return (
        <article className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
            {avatar ? (
                <img
                    src={avatar}
                    alt={user_name}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
            ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {getInitials(user_name)}
                </span>
            )}

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{user_name}</h3>
                    <span className="text-xs text-muted">{created_at}</span>
                </div>

                <div className="flex gap-0.5 mb-2" aria-label={`Đánh giá ${rating} trên 5 sao`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <i
                            key={i}
                            aria-hidden="true"
                            className={`fa-${i < rating ? "solid" : "regular"} fa-star text-xs ${
                                i < rating ? "text-accent" : "text-slate-300"
                            }`}
                        />
                    ))}
                </div>

                {comment ? (
                    <p className="text-sm leading-relaxed text-slate-600">{comment}</p>
                ) : (
                    <p className="text-sm text-muted">Không có bình luận.</p>
                )}
            </div>
        </article>
    );
};

export default ReviewCard;