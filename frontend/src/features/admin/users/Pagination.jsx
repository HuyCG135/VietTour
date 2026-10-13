// Dựng dãy số trang có rút gọn bằng dấu "…" (giữ nguyên logic bản cũ).
const getPaginationRange = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
};

// Thanh phân trang: dòng "Hiển thị X–Y trong tổng số N người dùng" + nút Trước/Tiếp.
// Bản cũ ẩn hẳn thanh này khi chỉ có 1 trang.
export default function Pagination({ page, limit, total, onPageChange }) {
    const totalPages = Math.max(1, Math.ceil(Number(total) / Number(limit || 1)));

    if (totalPages <= 1) return null;

    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-slate-50 px-5 py-4">
            <span className="text-sm text-muted">
                Hiển thị {from}–{to} trong tổng số {total} người dùng
            </span>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    aria-label="Trang trước"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:border-primary/40 hover:bg-primary-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <i className="fa-solid fa-chevron-left" />
                </button>

                {getPaginationRange(page, totalPages).map((item, index) =>
                    item === "..." ? (
                        <span key={`dots-${index}`} className="px-1 leading-9 text-muted">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPageChange(item)}
                            className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2.5 text-sm font-medium transition-colors duration-150 ${
                                item === page
                                    ? "border-transparent bg-primary text-white shadow-sm"
                                    : "border-border bg-surface text-muted hover:border-primary/40 hover:bg-primary-50 hover:text-primary"
                            }`}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    aria-label="Trang sau"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-sm font-medium text-muted transition-colors duration-150 hover:border-primary/40 hover:bg-primary-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <i className="fa-solid fa-chevron-right" />
                </button>
            </div>
        </div>
    );
}