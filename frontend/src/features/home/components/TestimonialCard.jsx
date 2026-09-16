const TestimonialCard = ({ avatar, name, role, quote, rating = 5 }) => {
    return (
        <div className="relative flex h-full flex-col justify-between rounded-2xl bg-white/95 backdrop-blur-sm px-6 pb-6 pt-11 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
            <img
                src={avatar}
                alt={name}
                className="absolute -top-8 left-6 h-16 w-16 rounded-full border-4 border-white object-cover shadow-md ring-1 ring-slate-900/5"
            />

            <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="pr-2">
                        <h3 className="text-base font-bold text-slate-900">{name}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{role}</p>
                    </div>

                    <div className="flex shrink-0 gap-0.5 pt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <i
                                key={i}
                                aria-hidden="true"
                                className={`text-sm ${
                                    i < rating
                                        ? "fa-solid fa-star text-amber-400"
                                        : "fa-regular fa-star text-slate-200"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">{quote}</p>
            </div>
        </div>
    );
};

export default TestimonialCard;