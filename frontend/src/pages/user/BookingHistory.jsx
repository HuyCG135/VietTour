export default function BookingHistory() {
    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Lịch sử đặt tour</h2>
            <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                    <i className="fa-solid fa-clock-rotate-left text-primary mb-3" style={{ fontSize: 48 }} />
                    <p className="text-muted">Bạn chưa có lịch sử đặt tour nào.</p>
                </div>
            </div>
        </div>
    );
}
