import UserPageHeader from "../../../components/UserPageHeader";

export default function BookingHistory() {
    return (
        <div className="space-y-6">
            <UserPageHeader
                title="Lịch sử đặt tour"
                subtitle="Xem lại các tour quý khách đã đặt và trạng thái thanh toán"
            />
            <div className="text-center py-16">
                <i className="fa-solid fa-clock-rotate-left text-primary mb-3" style={{ fontSize: 48 }} />
                <p className="text-muted">Bạn chưa có lịch sử đặt tour nào.</p>
            </div>
        </div>
    );
}