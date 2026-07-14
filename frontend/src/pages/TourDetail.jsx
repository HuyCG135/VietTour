import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getTourById } from "../services/tourService";
import defaultTourImage from "../assets/images/image.png";

function useTourId() {
    const params = useParams();
    const location = useLocation();

    return useMemo(() => {
        const query = new URLSearchParams(location.search);
        return params.id || query.get("id") || "";
    }, [location.search, params.id]);
}

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
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
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        loadTour();

        return () => {
            ignore = true;
        };
    }, [tourId]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h1 className="h4 mb-1">Không tìm thấy tour</h1>
                        <p className="mb-0">{error || "Tour này không còn tồn tại."}</p>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => navigate("/tours")}>
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Link to="/tours" className="text-decoration-none small text-muted">
                <i className="fa-solid fa-arrow-left me-2" />
                Quay lại danh sách
            </Link>

            <div className="row g-4 mt-2 align-items-start">
                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm overflow-hidden border-0">
                        <img src={tour.image || tour.cover_image || defaultTourImage} alt={tour.name} className="img-fluid" style={{ width: "100%", height: 420, objectFit: "cover" }} />
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                <span className="badge text-bg-info">{tour.location || tour.region}</span>
                                <span className="badge text-bg-primary">{tour.duration}</span>
                            </div>

                            <h1 className="h3 fw-bold mb-3">{tour.name}</h1>
                            <p className="text-muted mb-4">{tour.description}</p>

                            <div className="mb-3">
                                <div className="text-uppercase small text-muted mb-1">Giá tour</div>
                                <div className="h3 text-danger fw-bold mb-0">{formatPrice(tour.price || tour.price_default)}</div>
                            </div>

                            <div className="mb-4">
                                <div className="text-uppercase small text-muted mb-1">Khu vực</div>
                                <div className="fw-semibold">{tour.region || tour.location || "-"}</div>
                            </div>

                            <button type="button" className="btn btn-primary w-100" onClick={() => navigate("/tours")}>
                                Đặt tour ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
