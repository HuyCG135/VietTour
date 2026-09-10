import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getTourById } from "./tour.api";
import defaultTourImage from "../../assets/images/image.png";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
}

function useTourId() {
    const params = useParams();
    const location = useLocation();
    return useMemo(() => {
        const query = new URLSearchParams(location.search);
        return params.id || query.get("id") || "";
    }, [location.search, params.id]);
}

export default function TourDetail() {
    const tourId = useTourId();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const loadTour = async () => {
            if (!tourId) {
                setError("Thiếu mã tour.");
                setLoading(false);
                return;
            }
            try {
                const response = await getTourById(tourId);
                if (!ignore) {
                    if (response?.success) {
                        setTour(response.data || null);
                        setError("");
                    } else {
                        setTour(null);
                        setError(response?.message || "Không tìm thấy tour.");
                    }
                }
            } catch (fetchError) {
                if (!ignore) {
                    setTour(null);
                    setError(fetchError?.message || "Lỗi tải chi tiết tour.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadTour();
        return () => { ignore = true; };
    }, [tourId]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status">
                        <span className="sr-only">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-base font-semibold mb-1">Không tìm thấy tour</h1>
                        <p className="mb-0 text-sm text-gray-600">{error || "Tour này không còn tồn tại."}</p>
                    </div>
                    <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/tours")}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <Link to="/tours" className="no-underline text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <i className="fa-solid fa-arrow-left mr-2" />
                Quay lại danh sách
            </Link>

            <div className="flex flex-wrap gap-4 mt-3 items-start">
                <div className="w-full lg:w-7/12">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border-0">
                        <img src={tour.image || tour.cover_image || defaultTourImage} alt={tour.name} className="w-full h-[420px] object-cover" />
                    </div>
                </div>

                <div className="w-full lg:w-4/12">
                    <div className="bg-white rounded-xl shadow-sm border-0 h-full">
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500 text-white">{tour.location || tour.region}</span>
                                <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600 text-white">{tour.duration}</span>
                            </div>

                            <h1 className="text-xl font-bold mb-3">{tour.name}</h1>
                            <p className="text-gray-500 mb-4">{tour.description}</p>

                            <div className="mb-3">
                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Giá tour</div>
                                <div className="text-2xl text-red-600 font-bold mb-0">{formatPrice(tour.price || tour.price_default)}</div>
                            </div>

                            <div className="mb-6">
                                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Khu vực</div>
                                <div className="font-semibold">{tour.region || tour.location || "-"}</div>
                            </div>

                            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer" onClick={() => navigate("/tours")}>
                                Đặt tour ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
