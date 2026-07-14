import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TourCard from "../components/tourCard";
import { getAllTours, searchTours } from "../services/tourService";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Tours() {
    const navigate = useNavigate();
    const query = useQuery();
    const initialKeyword = query.get("search") || "";

    const [keyword, setKeyword] = useState(initialKeyword);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const normalizedKeyword = (query.get("search") || "").trim();
                const response = normalizedKeyword ? await searchTours(normalizedKeyword) : await getAllTours();

                if (!ignore) {
                    if (response?.success) {
                        setTours(response.data || []);
                    } else {
                        setTours([]);
                        setError(response?.message || "Không thể tải danh sách tour");
                    }
                }
            } catch (err) {
                if (!ignore) {
                    setError(err?.message || "Lỗi kết nối đến server");
                    setTours([]);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        load();
        return () => {
            ignore = true;
        };
    }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const value = keyword.trim();
        const params = new URLSearchParams(window.location.search);

        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }

        const next = params.toString();
        navigate(next ? `/tours?${next}` : "/tours");
    };

    return (
        <div className="container py-4">
            <h2 className="section-main-title">Danh sách tour</h2>

            <form className="search-group mb-4" onSubmit={handleSubmit}>
                <button type="submit" className="search-icon" aria-label="Tim kiem">
                    <i className="fa-solid fa-magnifying-glass" />
                </button>
                <input type="text" className="search-input" placeholder="Tìm tour theo tên hoặc mô tả..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </form>

            {loading && (
                <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            )}

            {!loading && error && <p className="text-danger">{error}</p>}

            {!loading && !error && tours.length === 0 && <p className="text-muted">Không tìm thấy tour phù hợp.</p>}

            {!loading && !error && tours.length > 0 && (
                <div className="row g-3">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            )}
        </div>
    );
}
