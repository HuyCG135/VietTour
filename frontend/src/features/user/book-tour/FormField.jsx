import { Children, cloneElement, isValidElement, useId } from "react";

export default function FormField({ label, required, hint, error, className = "", children }) {
    const errorId = useId();
    return (
        <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
            {label && (
                <label className="text-sm font-medium text-muted">
                    {label}
                    {required && <span className="ml-0.5 text-danger">*</span>}
                </label>
            )}
            {error
                ? Children.map(children, (child) =>
                      isValidElement(child) ? cloneElement(child, { "aria-describedby": errorId }) : child,
                  )
                : children}
            {hint && !error && <p className="text-xs text-muted">{hint}</p>}
            {error && (
                <p id={errorId} className="text-xs font-medium text-danger">
                    {error}
                </p>
            )}
        </div>
    );
}