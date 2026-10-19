import { useEffect, useRef, useState } from "react";

export default function SelectMenu({ id, value, onChange, options, icon, ariaLabel, className = "" }) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef(null);
    const listRef = useRef(null);

    const selectedIndex = options.findIndex((option) => option.value === value);
    const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    const openMenu = () => {
        setActiveIndex(Math.max(0, selectedIndex));
        setOpen(true);
    };

    const choose = (optionValue) => {
        onChange(optionValue);
        setOpen(false);
    };

    const handleKeyDown = (event) => {
        if (!open) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                openMenu();
            }
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, options.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter") {
            if (event.target?.getAttribute?.("role") === "option") return;
            event.preventDefault();
            if (options[activeIndex]) choose(options[activeIndex].value);
        } else if (event.key === "Escape") {
            event.stopPropagation();
            setOpen(false);
        }
    };

    return (
        <div ref={rootRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
            <button
                type="button"
                id={id}
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => (open ? setOpen(false) : openMenu())}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-primary-50/50 py-2.5 pl-3.5 pr-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    open ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                }`}
            >
                {icon && <i className={`${icon} shrink-0 text-xs text-primary`} />}
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                    {selected?.label ?? "Chọn"}
                </span>
                <i
                    className={`fa-solid fa-chevron-down shrink-0 text-[10px] text-muted transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div
                    ref={listRef}
                    role="listbox"
                    aria-label={ariaLabel}
                    className="custom-scrollbar absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-[0_18px_44px_rgba(15,23,42,0.18)] motion-safe:animate-toast-in"
                >
                    {options.map((option, index) => (
                        <button
                            key={option.value || "__all__"}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            data-active={index === activeIndex}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => choose(option.value)}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors duration-100 ${
                                index === activeIndex ? "bg-primary-50" : ""
                            } ${
                                option.value === value
                                    ? "font-semibold text-primary"
                                    : "text-foreground hover:text-primary"
                            }`}
                        >
                            <span className="flex min-w-0 items-center gap-2.5">
                                {option.icon && <i className={`${option.icon} shrink-0 text-xs text-muted`} />}
                                <span className="truncate text-sm">{option.label}</span>
                            </span>
                            {option.value === value && (
                                <i className="fa-solid fa-check shrink-0 text-primary" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
