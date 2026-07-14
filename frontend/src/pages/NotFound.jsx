import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="container py-5 text-center">
            <div className="py-5">
                <div className="display-1 fw-bold text-primary mb-2">404</div>
                <h1 className="h3 fw-bold mb-3">Trang không tồn tại</h1>
                <p className="text-muted mb-4">Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xoá.</p>
                <Link to="/" className="btn btn-primary rounded-pill px-4">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
