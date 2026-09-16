const TourServices = ({ services = [] }) => {
    return (
        <section
            id="services"
            className="scroll-mt-24 bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)] p-6"
        >
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-5">
                <i className="fa-solid fa-bell-concierge text-primary" aria-hidden="true" />
                Tiện ích & Dịch vụ
            </h2>

            {services.length === 0 ? (
                <p className="text-sm text-muted">Chưa có thông tin dịch vụ cho tour này.</p>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                        <li
                            key={service.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <i className={service.icon || "fa-solid fa-circle-check"} aria-hidden="true" />
                            </span>
                            <span className="text-sm font-medium text-foreground">{service.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default TourServices;