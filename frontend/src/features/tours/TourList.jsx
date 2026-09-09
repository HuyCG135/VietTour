import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TourCard from "./TourCard";
import SearchBox from "../../components/SearchBox";
import Loading from "../../components/Loading";
import { getAllTours, getTours } from "./tour.api";

export default function TourList() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
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
                const response = normalizedKeyword
                    ? await getTours({ q: normalizedKeyword })
                    : await getAllTours();

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
        return () => { ignore = true; };
    }, [query]);

    const handleSearch = (value) => {
        setKeyword(value);
        const params = new URLSearchParams(location.search);
        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }
        const next = params.toString();
        navigate(next ? `/tours?${next}` : "/tours");
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Danh sách tour</h2>

            <SearchBox
                value={keyword}
                onChange={setKeyword}
                onSearch={handleSearch}
            />

            {loading && <Loading />}

            {!loading && error && <p className="text-red-500">{error}</p>}

            {!loading && !error && tours.length === 0 && <p className="text-gray-500">Không tìm thấy tour phù hợp.</p>}

            {!loading && !error && tours.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} />
                    ))}
                </div>
            )}
        </div>
    );
}
