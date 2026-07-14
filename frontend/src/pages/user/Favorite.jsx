export default function Favorite() {
    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Tour yêu thích</h2>
            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <i className="fa-solid fa-heart text-danger mb-3" style={{ fontSize: 48 }} />
                    <p className="text-muted">Bạn chưa có tour yêu thích nào.</p>
                </div>
            </div>
        </div>
    );
}
