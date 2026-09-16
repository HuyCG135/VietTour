export default function Stars({ rating, size = "text-[13px]" }) {
    return (
        <span
            className={`inline-flex items-center gap-0.5 ${size}`}
            role="img"
            aria-label={`Đánh giá ${rating} trên 5 sao`}
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <i
                    key={i}
                    aria-hidden="true"
                    className={`${i <= rating ? "fa-solid fa-star text-amber-400" : "fa-regular fa-star text-slate-300"}`}
                />
            ))}
        </span>
    );
}