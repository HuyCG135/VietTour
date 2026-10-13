import { useEffect, useMemo, useRef, useState } from "react";

// Bỏ dấu để tìm kiếm không cần gõ dấu: "da nang" vẫn khớp "Đà Nẵng".
const normalize = (value) =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");

function highlight(text, query) {
    const q = query.trim();
    if (!q) return text;
    const normText = normalize(text);
    // Chỉ tô đậm khi chỉ số khớp còn đúng trên chuỗi gốc.
    if (normText.length !== text.length) return text;
    const at = normText.indexOf(normalize(q));
    if (at < 0) return text;
    return (
        <>
            {text.slice(0, at)}
            <mark className="rounded-sm bg-accent/30 text-foreground">
                {text.slice(at, at + q.length)}
            </mark>
            {text.slice(at + q.length)}
        </>
    );
}

export default function TourPicker({ tours, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const selected = useMemo(() => tours.find((item) => item.id === value), [tours, value]);

    // Nhóm theo miền + lọc theo từ khóa.
    const groups = useMemo(() => {
        const q = normalize(query.trim());
        const map = new Map();
        tours.forEach((tour) => {
            const haystack = normalize(`${tour.name} ${tour.region ?? ""}`);
            if (q && !haystack.includes(q)) return;
            const region = tour.region ?? "Khác";
            if (!map.has(region)) map.set(region, []);
            map.get(region).push(tour);
        });
        return Array.from(map, ([region, items]) => ({ region, items }));
    }, [tours, query]);

    const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

    // Danh sách phẳng để render (kèm dòng tiêu đề nhóm + chỉ số điều hướng).
    const rows = useMemo(() => {
        const result = [];
        let index = 0;
        groups.forEach((group) => {
            result.push({ type: "group", key: `group-${group.region}`, label: group.region });
            group.items.forEach((tour) => {
                result.push({ type: "item", key: `tour-${tour.id}`, tour, index });
                index += 1;
            });
        });
        return result;
    }, [groups]);

    // Đóng khi bấm ra ngoài.
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    // Tự focus ô tìm kiếm khi mở.
    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // Giữ mục đang chọn trong tầm nhìn khi di chuyển bằng bàn phím.
    useEffect(() => {
        if (!open) return;
        listRef.current
            ?.querySelector('[data-active="true"]')
            ?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    const openPicker = () => {
        setQuery("");
        setActiveIndex(Math.max(0, tours.findIndex((item) => item.id === value)));
        setOpen(true);
    };

    const selectTour = (id) => {
        onChange(id);
        setOpen(false);
        setQuery("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, flat.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (flat[activeIndex]) selectTour(flat[activeIndex].id);
        } else if (event.key === "Escape") {
            event.stopPropagation();
            setOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={rootRef} className="relative w-full">
            <button
                type="button"
                onClick={() => (open ? setOpen(false) : openPicker())}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && !open) {
                        event.preventDefault();
                        openPicker();
                    }
                }}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-surface px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    open ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
            >
                <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">
                        {selected?.name ?? "Chọn tour"}
                    </span>
                    {selected && (
                        <span className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                            <span className="inline-flex items-center gap-1">
                                <i className="fa-solid fa-location-dot" />
                                {selected.region}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <i className="fa-regular fa-clock" />
                                {selected.duration}
                            </span>
                        </span>
                    )}
                </span>
                <i
                    className={`fa-solid fa-chevron-down shrink-0 text-xs text-muted transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-[0_18px_44px_rgba(15,23,42,0.18)] motion-safe:animate-toast-in">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                        <i className="fa-solid fa-magnifying-glass text-sm text-muted" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setActiveIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Tìm tour theo tên hoặc miền..."
                            role="combobox"
                            aria-expanded="true"
                            aria-controls="tour-picker-list"
                            aria-activedescendant={
                                flat[activeIndex] ? `tour-option-${flat[activeIndex].id}` : undefined
                            }
                            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-slate-400"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery("");
                                    setActiveIndex(0);
                                    inputRef.current?.focus();
                                }}
                                aria-label="Xóa tìm kiếm"
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-slate-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            >
                                <i className="fa-solid fa-xmark text-xs" />
                            </button>
                        )}
                    </div>

                    <div
                        ref={listRef}
                        id="tour-picker-list"
                        role="listbox"
                        className="custom-scrollbar max-h-72 overflow-y-auto p-1.5"
                    >
                        {rows.length === 0 ? (
                            <p className="px-3 py-6 text-center text-sm text-muted">
                                Không tìm thấy tour nào khớp “{query}”.
                            </p>
                        ) : (
                            rows.map((row) =>
                                row.type === "group" ? (
                                    <p
                                        key={row.key}
                                        className="px-2 pb-1 pt-2.5 text-[11px] font-bold uppercase tracking-wide text-muted"
                                    >
                                        {row.label}
                                    </p>
                                ) : (
                                    <button
                                        key={row.key}
                                        id={`tour-option-${row.tour.id}`}
                                        type="button"
                                        role="option"
                                        aria-selected={row.tour.id === value}
                                        data-active={row.index === activeIndex}
                                        onMouseEnter={() => setActiveIndex(row.index)}
                                        onClick={() => selectTour(row.tour.id)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-100 ${
                                            row.index === activeIndex ? "bg-primary-50" : ""
                                        } ${row.tour.id === value ? "font-semibold text-primary" : "text-foreground"}`}
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm">
                                                {highlight(row.tour.name, query)}
                                            </span>
                                            <span className="mt-0.5 block truncate text-xs text-muted">
                                                {row.tour.region} · {row.tour.duration}
                                            </span>
                                        </span>
                                        {row.tour.id === value && (
                                            <i className="fa-solid fa-check shrink-0 text-primary" />
                                        )}
                                    </button>
                                ),
                            )
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-border bg-slate-50/70 px-3 py-2 text-[11px] text-muted">
                        <span>{flat.length} tour</span>
                        <span className="hidden items-center gap-1 sm:flex">
                            <kbd className="rounded border border-border bg-surface px-1">↑</kbd>
                            <kbd className="rounded border border-border bg-surface px-1">↓</kbd>
                            chọn
                            <kbd className="ml-1 rounded border border-border bg-surface px-1">Enter</kbd>
                            xác nhận
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
