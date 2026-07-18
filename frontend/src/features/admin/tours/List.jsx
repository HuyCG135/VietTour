import { useEffect, useState } from "react";
import { getAllTours } from "./tours.api";

export default function TourList() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTours()
            .then((data) => { if (data.success) setTours(data.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl mb-0">Quản lý Tour</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer">
                    <i className="fa-solid fa-plus mr-2" />
                    Thêm Tour
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Tên Tour</th>
                                <th className="px-4 py-3">Vùng</th>
                                <th className="px-4 py-3">Giá</th>
                                <th className="px-4 py-3">Thời gian</th>
                                <th className="px-4 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {tours.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500 py-6">Không có tour nào.</td>
                                </tr>
                            ) : (
                                tours.map((tour, idx) => (
                                    <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">{idx + 1}</td>
                                        <td className="px-4 py-3 font-medium">{tour.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{tour.region || tour.location}</td>
                                        <td className="px-4 py-3 text-gray-600">{new Intl.NumberFormat("vi-VN").format(tour.price || tour.price_default)} VNĐ</td>
                                        <td className="px-4 py-3 text-gray-600">{tour.duration}</td>
                                        <td className="px-4 py-3">
                                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-3 py-1.5 rounded-lg text-sm mr-2 transition-colors cursor-pointer">Sửa</button>
                                            <button className="border border-red-500 text-red-500 hover:bg-red-50 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
