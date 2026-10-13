import {
    STATUS_META,
    WEEKDAY_LABELS,
    buildMonthGrid,
    deriveStatus,
    formatCompactCurrency,
    minAllowedKey,
    toKey,
} from "./departureUtils";

// Số chip hiển thị tối đa trong 1 ô ngày (dư ra hiện "+k nữa · xem ngày").
const VISIBLE_CHIPS = 2;

function DepartureChip({ departure, today, onClick }) {
    const status = deriveStatus(departure, today);
    const meta = STATUS_META[status];
    const seatsLeft = Number(departure.seats_available);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`Chuyến ngày ${departure.departure_date}, ${departure.departure_location}`}
            className={`mt-1.5 w-full rounded-lg border px-1.5 py-1 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(15,23,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${meta.border} ${meta.soft}`}
        >
            <span className="flex min-w-0 items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
                <span className="truncate text-[11px] font-semibold text-foreground">
                    {departure.departure_location}
                </span>
            </span>
            <span className="mt-1 flex items-center justify-between gap-1 text-[10px]">
                <span className={`font-bold ${seatsLeft <= 0 ? "text-warning" : "text-muted"}`}>
                    {seatsLeft}/{departure.seats_total}
                </span>
                <span className="truncate text-muted">
                    {formatCompactCurrency(departure.price_moving)}
                </span>
            </span>
        </button>
    );
}

function DayCell({
    day,
    inMonth,
    isToday,
    isPast,
    tooSoon,
    departures,
    selected,
    today,
    onSelectDeparture,
    onSelectDay,
}) {
    const key = toKey(day);
    const canAdd = !isPast && !tooSoon;
    const list = departures ?? [];
    const visible = list.slice(0, VISIBLE_CHIPS);
    const hiddenCount = list.length - visible.length;

    const dateBadge = isToday
        ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
        : inMonth
          ? "text-xs font-semibold text-foreground sm:text-sm"
          : "text-xs font-medium text-slate-300 sm:text-sm";

    return (
        <div
            className={`relative h-full min-h-[92px] border-b border-r border-border p-1.5 transition-colors duration-150 sm:min-h-[112px] sm:p-2 ${
                selected ? "bg-primary-50" : inMonth ? "bg-surface" : "bg-slate-50/50"
            }`}
        >
            <div className="flex items-center justify-between">
                <span className={dateBadge}>{day.getDate()}</span>
                {isToday && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                        Hôm nay
                    </span>
                )}
            </div>

            {visible.map((departure) => (
                <DepartureChip
                    key={departure.id}
                    departure={departure}
                    today={today}
                    onClick={() => onSelectDeparture(departure)}
                />
            ))}

            {hiddenCount > 0 && (
                <button
                    type="button"
                    onClick={() => onSelectDay(key)}
                    aria-label={`Xem ${hiddenCount} chuyến khác trong ngày`}
                    className="mt-1.5 w-full rounded-lg border border-dashed border-border px-1.5 py-1 text-center text-[11px] font-semibold text-slate-400 transition-colors duration-150 hover:border-primary hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    +{hiddenCount} nữa · xem ngày
                </button>
            )}

            {list.length > 0 && canAdd && (
                <button
                    type="button"
                    onClick={() => onSelectDay(key)}
                    className="mt-1.5 flex w-full items-center justify-center gap-1 text-[10px] font-semibold text-slate-400 transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                    <i className="fa-solid fa-plus text-[9px]" />
                    Thêm chuyến
                </button>
            )}

            {list.length === 0 && canAdd && (
                <button
                    type="button"
                    onClick={() => onSelectDay(key)}
                    className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-border py-1.5 text-[11px] font-semibold text-slate-400 transition-colors duration-150 hover:border-primary hover:bg-primary-50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <i className="fa-solid fa-plus text-[10px]" />
                    Thêm
                </button>
            )}
        </div>
    );
}

export default function MonthCalendar({
    monthDate,
    departuresByDate,
    selectedKey,
    today,
    onSelectDeparture,
    onSelectDay,
}) {
    const weeks = buildMonthGrid(monthDate);
    const month = monthDate.getMonth();

    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_28px_rgba(30,41,59,0.06)]">
            <div className="grid grid-cols-7 border-b border-border bg-slate-50/80">
                {WEEKDAY_LABELS.map((label) => (
                    <div
                        key={label}
                        className="py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted"
                    >
                        {label}
                    </div>
                ))}
            </div>

            {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7">
                    {week.map((day, dayIndex) => {
                        const key = toKey(day);
                        return (
                            <div
                                key={key}
                                className={`${dayIndex === 6 ? "[&>div]:border-r-0" : ""} ${
                                    weekIndex === weeks.length - 1 ? "[&>div]:border-b-0" : ""
                                }`}
                            >
                                <DayCell
                                    day={day}
                                    inMonth={day.getMonth() === month}
                                    isToday={key === today}
                                    isPast={key < today}
                                    tooSoon={key >= today && key < minAllowedKey()}
                                    departures={departuresByDate[key]}
                                    selected={key === selectedKey}
                                    today={today}
                                    onSelectDeparture={onSelectDeparture}
                                    onSelectDay={onSelectDay}
                                />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}