import { useEffect } from "react";

export default function ImageLightbox({ src, alt, caption, onClose }) {
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            onClose();
        };
        window.addEventListener("keydown", onKeyDown, true);
        return () => window.removeEventListener("keydown", onKeyDown, true);
    }, [onClose]);

    if (!src) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh"
            onClick={(event) => {
                event.stopPropagation();
                onClose();
            }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-slate-950/85 p-4"
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onClose();
                }}
                aria-label="Đóng ảnh"
                className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/90 text-foreground shadow-lg transition-colors duration-150 hover:bg-danger hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
                <i className="fa-solid fa-xmark" />
            </button>

            <img
                src={src}
                alt={alt || "Ảnh xem trước"}
                onClick={(event) => event.stopPropagation()}
                className="max-h-[85vh] max-w-[92vw] cursor-default rounded-xl object-contain shadow-2xl motion-safe:animate-toast-in"
            />

            {caption && (
                <p className="max-w-[92vw] truncate rounded-lg bg-slate-950/70 px-3 py-1.5 text-sm text-white" title={caption}>
                    {caption}
                </p>
            )}
        </div>
    );
}
