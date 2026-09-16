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