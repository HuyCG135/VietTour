import { useEffect, useState } from "react";
import { getAllTours, getToursByRegion } from "../features/tours/tour.api";
import TourCard from "../features/tours/TourCard";

export default function Home() {
    const [topTours, setTopTours] = useState([]);
    const [mienBac, setMienBac] = useState([]);
    const [mienTrung, setMienTrung] = useState([]);
    const [mienNam, setMienNam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTours();
    }, []);

    const loadTours = async () => {
        try {
            const [top, bac, trung, nam] = await Promise.all([
                getAllTours(),
                getToursByRegion("Miền Bắc"),
                getToursByRegion("Miền Trung"),
                getToursByRegion("Miền Nam"),
            ]);
            if (top.success) setTopTours(top.data);
            if (bac.success) setMienBac(bac.data);
            if (trung.success) setMienTrung(trung.data);
            if (nam.success) setMienNam(nam.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderTours = (tours) => {
        if (!tours.length) return <p className="text-gray-500">Không có tour nào.</p>;
        return (
            <div className="flex flex-wrap gap-3">
                {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status">
                    <span className="sr-only">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Top Tours</h2>
            {renderTours(topTours)}

            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-3 border-b-3 border-blue-500 mt-16">
                <i className="fa-solid fa-mountain mr-2 text-blue-500" />
                Miền Bắc
            </h2>
            {renderTours(mienBac)}

            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-3 border-b-3 border-blue-500 mt-16">
                <i className="fa-solid fa-umbrella-beach mr-2 text-blue-500" />
                Miền Trung
            </h2>
            {renderTours(mienTrung)}

            <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-3 border-b-3 border-blue-500 mt-16">
                <i className="fa-solid fa-city mr-2 text-blue-500" />
                Miền Nam
            </h2>
            {renderTours(mienNam)}

            <div className="mb-12"></div>
        </div>
    );
}
