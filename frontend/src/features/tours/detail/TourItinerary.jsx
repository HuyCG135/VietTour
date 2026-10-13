const renderSchedule = (raw) => {
    const text = (raw || "").replace(/\\n/g, "\n");
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return null;
    }

    if (lines.length === 1) {
        return <p className="text-sm leading-relaxed text-muted">{lines[0]}</p>;
    }

    const [title, ...schedule] = lines;

    return (
        <>
            <p className="mb-3 text-sm font-semibold text-foreground">{title}</p>
            <ul className="space-y-2">
                {schedule.map((line, index) => {
                    const match = line.match(/^(\d{1,2}:\d{2})\s*:?\s*(.*)$/);
                    return (
                        <li
                            key={index}
                            className={match ? "flex items-start gap-2.5" : "text-sm leading-relaxed text-muted"}
                        >
                            {match ? (
                                <>
                                    <span className="mt-0.5 inline-flex shrink-0 items-center rounded-md bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-dark">
                                        {match[1]}
                                    </span>
                                    <span className="text-sm leading-relaxed text-muted">{match[2]}</span>
                                </>
                            ) : (
                                line
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

const TourItinerary = ({ itineraries = [] }) => {
    return (
        <section
            id="itinerary"
            className="scroll-mt-24 bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] p-6"
        >
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-6">
                <i className="fa-solid fa-route text-primary" aria-hidden="true" />
                Lịch trình chi tiết
            </h2>

            {itineraries.length === 0 ? (
                <p className="text-sm text-muted">Chưa có lịch trình cho tour này.</p>
            ) : (
                <ol className="relative border-l-2 border-slate-200 ml-3 pt-2 space-y-8">
                    {itineraries.map((item) => (
                        <li key={item.day} className="relative pl-8">
                            <span className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                {item.day}
                            </span>
                            <div className="text-sm font-semibold text-foreground mb-1">
                                Ngày {item.day}
                            </div>
                            {renderSchedule(item.description)}
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default TourItinerary;