const TourOverview = ({ description = "", title = "Về chuyến đi này" }) => {
    return (
        <section
            id="overview"
            className="scroll-mt-24 bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] p-6"
        >
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
                <i className="fa-solid fa-circle-info text-primary" aria-hidden="true" />
                {title}
            </h2>

            {description ? (
                <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-line">{description}</p>
            ) : (
                <p className="text-sm text-muted">Chưa có mô tả cho tour này.</p>
            )}
        </section>
    );
};

export default TourOverview;