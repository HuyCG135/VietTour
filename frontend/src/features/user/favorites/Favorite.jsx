import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TourListCard from "../../tours/TourListCard";
import Loading from "../../../components/Loading";
import UserPageHeader from "../../../components/UserPageHeader";
import { getFavorites, removeFavorite } from "./favorite.api";

export default function Favorite() {
    const [favorites, setFavorites] = useState([]);
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
        }
    };

    return (
        <div className="space-y-6">
            <UserPageHeader
                title="Tour yêu thích"
                subtitle="Những tour quý khách đã lưu để xem lại và đặt sau"
            />

            {loading && <Loading />}

            {!loading && error && <p className="text-red-500">{error}</p>}

            {!loading && !error && favorites.length === 0 && (
                <div className="text-center py-16">
                    <i className="fa-solid fa-heart text-danger mb-3" style={{ fontSize: 48 }} />
                    <p className="text-muted mb-4">Bạn chưa có tour yêu thích nào.</p>
                    <Link
                        to="/tours"
                        className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium text-sm no-underline transition-colors"
                    >
                        Khám phá tour ngay
                    </Link>
                </div>
            )}

            {!loading && !error && favorites.length > 0 && (
                <div className="flex flex-col gap-4">
                    {favorites.map((tour) => (
                        <TourListCard
                            key={tour.id}
                            tour={tour}
                            isFavorite
                            onToggleFavorite={() => handleRemove(tour.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}