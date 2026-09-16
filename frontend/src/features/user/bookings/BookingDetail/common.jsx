import { BOOKING_STATUS, BOOKING_PAYMENT, COMPLETED_STATUS } from "../bookingStatus";

export function SectionCard({ icon, title, children }) {
    return (
        <section className="bg-surface rounded-2xl border border-border overflow-hidden">
            <header className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-primary-50/60">
                <i className={`${icon} text-primary text-base`} />
                <h2 className="font-bold text-base text-foreground mb-0">{title}</h2>
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function InfoItem({ label, value }) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted mb-1">{label}</p>
            <p className="font-semibold text-foreground text-[15px] mb-0 break-words">{value}</p>
        </div>
    );
}

export function StatusPill({ status, completed = false }) {
    const s = completed
        ? COMPLETED_STATUS
        : BOOKING_STATUS[status] || {
              label: status,
              icon: "fa-solid fa-circle-info",
              cls: "bg-muted/10 text-muted",
          };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-xs sm:text-sm whitespace-nowrap ${s.cls}`}>
            <i className={s.icon} />
            {s.label}
        </span>
    );
}

export function PaymentPill({ status }) {
    const p =
        BOOKING_PAYMENT[status] || {
            label: status,
            icon: "fa-solid fa-circle-info",
            chip: "bg-muted/10 text-muted",
        };
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${p.chip}`}>
            <i className={p.icon} />
            {p.label}
        </span>
    );
}