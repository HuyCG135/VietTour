export default function DeleteReviewModal({ review, open, deleting, onClose, onConfirm }) {
    if (!open) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-review-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50"
            onClick={() => !deleting && onClose()}
        >
            <div
                className="w-full max-w-md bg-surface rounded-2xl border border-border p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="delete-review-title" className="font-bold text-lg text-danger flex items-center gap-2 mb-3">
                    <i className="fa-solid fa-triangle-exclamation" />
                    Xóa đánh giá
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                    Quý khách chắc chắn muốn xóa đánh giá cho tour{" "}
                    <b className="line-clamp-none">“{review?.tour_name}”</b> không?
                </p>
                <div className="rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-3 mb-5">
                    <i className="fa-solid fa-circle-info mr-1.5" />
                    Đánh giá sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={onClose}
                        className="border border-border text-foreground px-4 py-2 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Không, quay lại
                    </button>
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={onConfirm}
                        className="bg-danger hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2"
                    >
                        {deleting && <i className="fa-solid fa-spinner fa-spin" />}
                        Chắc chắn xóa
                    </button>
                </div>
            </div>
        </div>
    );
}