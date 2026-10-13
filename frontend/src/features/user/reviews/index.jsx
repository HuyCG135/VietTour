import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";
import UserPageHeader from "../../../components/UserPageHeader";
import Pagination from "../../tours/Pagination";
import { useToast } from "../../../context/ToastContext";
import { getMyReviews, updateReview, deleteReview } from "./review.api";
import ReviewCard from "./ReviewCard";
import EditReviewModal from "./EditReviewModal";
import DeleteReviewModal from "./DeleteReviewModal";

const PAGE_SIZE = 6;

export default function Reviews() {
    const toast = useToast();
    const listRef = useRef(null);
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getMyReviews();
                if (res?.success) {
                    setReviews(res.data || []);
                } else {
                    setError(res?.message || "Không thể tải danh sách đánh giá");
                }
            } catch (err) {
                setError(err?.message || "Lỗi kết nối đến server");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!editing && !deleting) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                setEditing(null);
                setDeleting(null);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [editing, deleting]);

    const openEdit = (review) => setEditing(review);
    const openDelete = (review) => setDeleting(review);

    // Lùi trang nếu trang hiện tại vượt quá tổng số trang (sau khi xoá bớt đánh giá)
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
        if (page > totalPages) setPage(totalPages);
    }, [reviews.length, page]);

    const changePage = (next) => {
        const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
        if (next < 1 || next > totalPages) return;
        setPage(next);
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const saveEdit = async (rating, comment) => {
        if (!editing) return;
        setSaving(true);
        try {
            const res = await updateReview(editing.id, { rating, comment });
            if (res?.success) {
                toast.success(res.message || "Đã sửa đánh giá thành công");
                setReviews((prev) =>
                    prev.map((r) => (r.id === editing.id ? { ...r, rating, comment } : r)),
                );
                setEditing(null);
            } else {
                toast.danger(res?.message || "Không thể cập nhật đánh giá, vui lòng thử lại");
            }
        } catch (err) {
            toast.danger(err?.message || "Lỗi kết nối đến server");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleting) return;
        setRemoving(true);
        try {
            const res = await deleteReview(deleting.id);
            if (res?.success) {
                toast.success(res.message || "Đã xóa đánh giá thành công");
                setReviews((prev) => prev.filter((r) => r.id !== deleting.id));
                setDeleting(null);
            } else {
                toast.danger(res?.message || "Không thể xóa đánh giá, vui lòng thử lại");
            }
        } catch (err) {
            toast.danger(err?.message || "Lỗi kết nối đến server");
        } finally {
            setRemoving(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visibleReviews = reviews.slice(start, start + PAGE_SIZE);

    return (
        <div className="space-y-6">
            <UserPageHeader
                title="Đánh giá của quý khách"
                subtitle="Những cảm nhận quý khách đã chia sẻ cho các chuyến đi"
            />

            {loading && <Loading />}

            {!loading && error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 text-danger px-4 py-3 text-sm"
                >
                    <i className="fa-solid fa-circle-exclamation" />
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && reviews.length === 0 && (
                <div className="text-center py-14 px-4 bg-background rounded-2xl border border-border shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-amber-400/10 text-amber-500 mx-auto flex items-center justify-center text-2xl mb-4">
                        <i className="fa-regular fa-star" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">
                        Quý khách chưa gửi đánh giá nào
                    </h3>
                    <p className="text-muted text-sm mb-5 max-w-sm mx-auto">
                        Sau mỗi chuyến đi, hãy chia sẻ cảm nhận để giúp khách du lịch khác có trải nghiệm tốt hơn nhé.
                    </p>
                    <Link
                        to="/tours"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm no-underline transition-colors"
                    >
                        Khám phá tour ngay
                        <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                </div>
            )}

            {!loading && !error && reviews.length > 0 && (
                <>
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <i className="fa-solid fa-star text-amber-400 text-xs" />
                        <span>
                            Đã gửi <b className="text-foreground font-bold">{reviews.length}</b> đánh giá
                        </span>
                    </div>

                    <section
                        ref={listRef}
                        aria-label="Danh sách đánh giá"
                        className="space-y-4 scroll-mt-24"
                    >
                        {visibleReviews.map((r) => (
                            <ReviewCard key={r.id} review={r} onEdit={openEdit} onDelete={openDelete} />
                        ))}
                    </section>

                    {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={changePage} />}
                </>
            )}

            {editing && (
                <EditReviewModal
                    key={editing.id}
                    review={editing}
                    saving={saving}
                    onClose={() => setEditing(null)}
                    onSave={saveEdit}
                />
            )}

            <DeleteReviewModal
                review={deleting}
                open={!!deleting}
                deleting={removing}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}