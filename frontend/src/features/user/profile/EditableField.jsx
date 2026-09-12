import { useEffect, useRef } from "react";

export default function EditableField({
    label,
    id,
    value,
    editing,
    draft,
    editable = true,
    icon,
    badge,
    onToggleEdit,
    onDraftChange,
    onCommit,
}) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing && inputRef.current) inputRef.current.focus();
    }, [editing]);

    return (
        <div className="group rounded-xl border border-border/70 bg-background/40 hover:bg-background/80 hover:border-border transition-all duration-150 p-3.5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {icon && (
                        <span className="w-8 h-8 shrink-0 rounded-lg bg-surface border border-border/80 text-muted flex items-center justify-center text-sm shadow-xs">
                            <i className={icon} />
                        </span>
                    )}

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
                            {badge && (
                                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-border/60 text-muted">
                                    {badge}
                                </span>
                            )}
                        </div>

                        {editing ? (
                            <div className="flex items-center gap-2 mt-1.5">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={draft ?? ""}
                                    onChange={(e) => onDraftChange(id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            onCommit(id);
                                        }
                                        if (e.key === "Escape") {
                                            e.preventDefault();
                                            onToggleEdit(id);
                                        }
                                    }}
                                    aria-label={label}
                                    className="w-full px-3 py-1.5 text-sm text-foreground bg-surface border border-primary rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-150 shadow-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => onCommit(id)}
                                    title="Xác nhận"
                                    aria-label={`Lưu ${label}`}
                                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-150 cursor-pointer shadow-xs"
                                >
                                    <i className="fa-solid fa-check text-xs" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onToggleEdit(id)}
                                    title="Hủy"
                                    aria-label={`Hủy sửa ${label}`}
                                    className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-danger hover:bg-danger/10 transition-colors duration-150 cursor-pointer shadow-xs"
                                >
                                    <i className="fa-solid fa-xmark text-xs" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-[15px] font-medium text-foreground truncate select-all" title={value}>
                                {value || <span className="text-muted italic">Chưa cập nhật</span>}
                            </div>
                        )}
                    </div>
                </div>

                {editable && !editing && (
                    <button
                        type="button"
                        onClick={() => onToggleEdit(id)}
                        aria-label={`Sửa ${label}`}
                        title="Chỉnh sửa"
                        className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary-50 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                        <i className="fa-solid fa-pencil text-xs" />
                    </button>
                )}
            </div>
        </div>
    );
}