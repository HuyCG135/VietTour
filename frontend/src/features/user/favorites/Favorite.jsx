import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TourListCard from "../../tours/TourListCard";
import Loading from "../../../components/Loading";
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
        <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="font-bold text-xl mb-4">Tour yêu thích</h2>

            {loading && <Loading />}

            {!loading && error && <p className="text-red-500">{error}</p>}

            {!loading && !error && favorites.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="text-center py-16">
                        <i className="fa-solid fa-heart text-red-500 mb-3" style={{ fontSize: 48 }} />
                        <p className="text-gray-500 mb-4">Bạn chưa có tour yêu thích nào.</p>
                        <Link
                            to="/tours"
                            className="inline-block bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-medium text-sm no-underline transition-colors"
                        >
                            Khám phá tour ngay
                        </Link>
                    </div>
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