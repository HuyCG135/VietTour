import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TourListCard from "../../tours/TourListCard";
import Pagination from "../../tours/Pagination";
import Loading from "../../../components/Loading";
import UserPageHeader from "../../../components/UserPageHeader";
import { getFavorites, removeFavorite } from "./favorite.api";
import { useToast } from "../../../context/ToastContext";

const PAGE_SIZE = 6;

export default function Favorite() {
    const toast = useToast();
    const listRef = useRef(null);
    const [favorites, setFavorites] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getFavorites();
                if (res?.success) {
                    setFavorites(res.data || []);
                } else {
                    setError(res?.message || "Không thể tải danh sách yêu thích");
                }
            } catch (err) {
                setError(err?.message || "Lỗi kết nối đến server");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleRemove = async (tourId) => {
        const res = await removeFavorite(tourId);
        if (res?.success) {
            setFavorites((prev) => prev.filter((t) => t.id !== tourId));
            toast.success("Đã bỏ khỏi danh sách yêu thích");
        } else {
            toast.danger(res?.message || "Không thể bỏ yêu thích, vui lòng thử lại");
        }
    };

    // Lùi trang nếu trang hiện tại vượt quá tổng số trang (sau khi xoá bớt tour)
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
        if (page > totalPages) setPage(totalPages);
    }, [favorites.length, page]);

    const changePage = (next) => {
        const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
        if (next < 1 || next > totalPages) return;
        setPage(next);
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visibleFavorites = favorites.slice(start, start + PAGE_SIZE);

    return (
        <div className="space-y-6">
            <UserPageHeader
                title="Tour yêu thích"
                subtitle="Những tour quý khách đã lưu để xem lại và đặt sau"
            />

            {loading && <Loading />}

            {/* Lỗi tải danh sách */}
            {!loading && error && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 text-danger px-4 py-3 text-sm"
                >
                    <i className="fa-solid fa-circle-exclamation" />
                    <span>{error}</span>
                </div>
            )}

            {/* Danh sách rỗng */}
            {!loading && !error && favorites.length === 0 && (
                <div className="text-center py-14 px-4 bg-background rounded-2xl border border-border shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-danger/10 text-danger mx-auto flex items-center justify-center text-2xl mb-4">
                        <i className="fa-solid fa-heart" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">Chưa có tour yêu thích</h3>
                    <p className="text-muted text-sm mb-5 max-w-sm mx-auto">
                        Bấm icon tim trên mỗi tour để lưu lại tour quý khách quan tâm và đặt sau.
                    </p>
                    <Link
                        to="/tours"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm no-underline transition-colors shadow-md shadow-primary/25"
                    >
                        Khám phá tour ngay
                        <i className="fa-solid fa-arrow-right text-xs" />
                    </Link>
                </div>
            )}

            {/* Danh sách đã lưu */}
            {!loading && !error && favorites.length > 0 && (
                <>
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <i className="fa-solid fa-heart text-danger text-xs" />
                        <span>
                            Đang lưu <b className="text-foreground font-bold">{favorites.length}</b> tour
                        </span>
                    </div>

                    <section ref={listRef} aria-label="Danh sách tour yêu thích" className="scroll-mt-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {visibleFavorites.map((tour) => (
                                <TourListCard
                                    key={tour.id}
                                    tour={tour}
                                    layout="grid"
                                    isFavorite
                                    onToggleFavorite={() => handleRemove(tour.id)}
                                />
                            ))}
                        </div>
                    </section>

                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
                    )}
                </>
            )}
        </div>
    );
}