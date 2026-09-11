import React, { memo } from "react";

const baseBtn =
    "flex items-center justify-center w-11 h-11 rounded-xl border border-slate-300 bg-surface text-foreground transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed";

const QuantityStepper = memo(function QuantityStepper({ label, hint, value, min = 0, max = 50, onChange }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted">
                {label}
                {hint && <span className="ml-1.5 text-xs text-primary font-medium">{hint}</span>}
            </label>
            <div className="flex items-stretch gap-2">
                <button
                    type="button"
                    aria-label={`Giảm ${label}`}
                    onClick={() => onChange(Math.max(min, value - 1))}
                    disabled={value <= min}
                    className={`${baseBtn} hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100`}
                >
                    <i className="fa-solid fa-minus text-sm" />
                </button>
                <input
                    type="number"
                    inputMode="numeric"
                    value={value}
                    min={min}
                    max={max}
                    onChange={(e) => {
                        const n = parseInt(e.target.value, 10);
                        onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
                    }}
                    className="w-20 rounded-xl border border-slate-300 bg-slate-50 text-center font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                    type="button"
                    aria-label={`Tăng ${label}`}
                    onClick={() => onChange(Math.min(max, value + 1))}
                    disabled={value >= max}
                    className={`${baseBtn} hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100`}
                >
                    <i className="fa-solid fa-plus text-sm" />
                </button>
            </div>
        </div>
    );
});

export default QuantityStepper;