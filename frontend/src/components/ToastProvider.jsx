import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "../context/ToastContext";

let nextId = 0;

const TYPE_STYLES = {
    success: { chip: "bg-success/10 text-success", icon: "fa-solid fa-circle-check" },
    danger: { chip: "bg-danger/10 text-danger", icon: "fa-solid fa-circle-exclamation" },
    info: { chip: "bg-primary/10 text-primary", icon: "fa-solid fa-circle-info" },
    warning: { chip: "bg-warning/10 text-warning", icon: "fa-solid fa-triangle-exclamation" },
};

function ToastItem({ toast, onDismiss }) {
    const style = TYPE_STYLES[toast.type] || TYPE_STYLES.info;

    return (
        <div
            role={toast.type === "danger" ? "alert" : "status"}
            className="pointer-events-auto flex items-start gap-3 w-full rounded-xl border border-border bg-surface p-4 shadow-[0_8px_24px_rgba(15,23,42,0.12)] motion-safe:animate-toast-in"
        >
            <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm ${style.chip}`}>
                <i className={style.icon} />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
                {toast.title && (
                    <p className="text-sm font-bold text-foreground leading-tight mb-0">{toast.title}</p>
                )}
                {toast.message && (
                    <p className="text-sm text-muted leading-snug mb-0 mt-0.5">{toast.message}</p>
                )}
            </div>

            <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Đóng thông báo"
                className="-m-1 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-primary-50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
                <i className="fa-solid fa-xmark text-sm" />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        ({ type = "info", title, message, duration } = {}) => {
            const id = ++nextId;
            setToasts((prev) => [...prev, { id, type, title, message }]);
            const ttl = duration ?? (type === "danger" ? 5000 : 3500);
            if (ttl > 0) {
                setTimeout(() => dismiss(id), ttl);
            }
            return id;
        },
        [dismiss],
    );

    const api = useMemo(
        () => ({
            success: (message, opts) => push({ type: "success", message, ...opts }),
            danger: (message, opts) => push({ type: "danger", message, ...opts }),
            info: (message, opts) => push({ type: "info", message, ...opts }),
            warning: (message, opts) => push({ type: "warning", message, ...opts }),
            dismiss,
        }),
        [push, dismiss],
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div
                className="fixed top-5 right-5 z-[999] flex flex-col items-end gap-2.5 w-[min(92vw,380px)] pointer-events-none"
                aria-live="polite"
                aria-atomic="false"
            >
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;