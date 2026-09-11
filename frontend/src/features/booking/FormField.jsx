export const getInputClass = (hasError = false) =>
    [
        "w-full rounded-xl border bg-slate-50 px-4 py-3 text-foreground placeholder:text-slate-400",
        "transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2",
        hasError
            ? "border-danger/60 focus:border-danger focus:ring-danger/20"
            : "border-slate-300 focus:border-primary focus:ring-primary/20",
    ].join(" ");

export const getSelectClass = (hasError = false) =>
    getInputClass(hasError) + " appearance-none pr-11";

export default function FormField({ label, required, hint, error, className = "", children }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
            {label && (
                <label className="text-sm font-medium text-muted">
                    {label}
                    {required && <span className="ml-0.5 text-danger">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="text-xs text-muted">{hint}</p>}
            {error && (
                <p className="text-xs font-medium text-danger" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}