import { Info } from "lucide-react";
import { PAYMENT_META, STATUS_META } from "./bookingMeta";

export function SectionCard({ icon, title, children, className = "" }) {
    const IconComponent = icon || Info;
    return (
        <section
            className={`rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.06)] ${className}`}
        >
            <header className="flex items-center gap-2.5 border-b border-border bg-primary-50/60 px-5 py-4">
                <IconComponent className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-base font-bold text-foreground">{title}</h2>
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}

export function InfoItem({ label, value }) {
    return (
        <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="text-[15px] font-semibold text-foreground break-words">{value || "---"}</p>
        </div>
    );
}

export function StatusPill({ status, label }) {
    const meta =
        STATUS_META[status] || {
            label: label || status || "Không xác định",
            chip: "bg-slate-100 text-slate-600",
            dot: "bg-slate-400",
        };
    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${meta.chip}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
            {label || meta.label}
        </span>
    );
}

export function PaymentPill({ status }) {
    const meta =
        PAYMENT_META[status] || {
            label: status || "Không xác định",
            chip: "bg-slate-100 text-slate-600",
        };
    return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${meta.chip}`}>
            {meta.label}
        </span>
    );
}
