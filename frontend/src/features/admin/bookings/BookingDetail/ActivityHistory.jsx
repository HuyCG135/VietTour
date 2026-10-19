import { History } from "lucide-react";
import { formatDateTime } from "./detailFormat";

// Màu dot theo tone backend trả về.
const TONE_DOT = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    warning: "bg-amber-500",
};

export default function ActivityHistory({ events = [] }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
            <header className="flex items-center gap-2.5 border-b border-border bg-primary-50/60 px-5 py-4">
                <History className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-primary-dark">
                    Lịch sử hoạt động
                </h2>
            </header>

            <div className="p-5">
                {events.length === 0 ? (
                    <p className="text-sm text-muted">Chưa có hoạt động nào.</p>
                ) : (
                    <ol className="relative space-y-5">
                        {events.map((event, index) => {
                            const dot = TONE_DOT[event.tone] || TONE_DOT.primary;
                            const isLast = index === events.length - 1;
                            return (
                                <li key={event.id} className="relative flex gap-3">
                                    {!isLast && (
                                        <span
                                            className="absolute left-[3px] top-4 h-[calc(100%+20px)] w-px bg-border"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span
                                        className={`relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ring-surface ${dot}`}
                                        aria-hidden="true"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold leading-snug text-foreground">
                                            {event.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted tabular-nums">
                                            {formatDateTime(event.time)}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>
        </section>
    );
}
