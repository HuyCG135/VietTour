import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="py-16">
                <div className="text-7xl font-bold text-blue-600 mb-3">404</div>
                <h1 className="text-xl font-bold mb-3">Trang không tồn tại</h1>
                <p className="text-gray-500 mb-6">Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xoá.</p>
                <Link to="/" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 transition-colors">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
