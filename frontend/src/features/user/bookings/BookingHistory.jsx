export default function BookingHistory() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="font-bold text-xl mb-4">Lịch sử đặt tour</h2>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="text-center py-16">
                    <i className="fa-solid fa-clock-rotate-left text-blue-600 mb-3" style={{ fontSize: 48 }} />
                    <p className="text-gray-500">Bạn chưa có lịch sử đặt tour nào.</p>
                </div>
            </div>
        </div>
    );
}
