function buildPageList(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("...");
    pages.push(total);

    return pages;
}

export default function Pagination({ page, totalPages, onChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const pages = buildPageList(page, totalPages);
    const btnBase =
        "w-[45px] h-[45px] rounded-full flex items-center justify-center font-bold text-sm border-0 cursor-pointer transition-colors";

    return (
        <nav className="flex justify-center gap-2 mt-6" aria-label="Phân trang">
            <button
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                className={`${btnBase} ${page <= 1 ? "text-gray-400 cursor-not-allowed bg-gray-100" : "text-gray-700 bg-white shadow-sm hover:bg-gray-100"}`}
                aria-label="Trang trước"
            >
                <i className="fa-solid fa-chevron-left" />
            </button>

            {pages.map((p, idx) =>
                p === "..." ? (
                    <span key={`dot-${idx}`} className="flex items-center justify-center w-[45px] h-[45px] text-gray-400 font-bold">
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onChange(p)}
                        className={`${btnBase} ${
                            p === page
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-700 bg-white shadow-sm hover:bg-gray-100"
                        }`}
                    >
                        {p}
                    </button>
                ),
            )}

            <button
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                className={`${btnBase} ${page >= totalPages ? "text-gray-400 cursor-not-allowed bg-gray-100" : "text-gray-700 bg-white shadow-sm hover:bg-gray-100"}`}
                aria-label="Trang sau"
            >
                <i className="fa-solid fa-chevron-right" />
            </button>
        </nav>
    );
}