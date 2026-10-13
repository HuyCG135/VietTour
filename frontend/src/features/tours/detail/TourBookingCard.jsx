import { Link } from "react-router-dom";

const formatPrice = (value) => Number(value || 0).toLocaleString("vi-VN");

const TourBookingCard = ({ tourId, priceDefault = 0, priceChild = 0, hotline = "1900 1234", departures = [] }) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-[0_2px_10px_rgba(30,41,59,0.05)]">
            <div className="mb-5">
                <p className="text-sm font-medium text-muted mb-2">Giá tour trọn gói</p>
                <div className="flex items-end">
                    <span className="text-4xl font-extrabold text-primary leading-none">
                        {formatPrice(priceDefault)}
                    </span>
                    <span className="text-primary-dark font-bold text-lg leading-none mb-1 ml-1">₫</span>
                    <span className="text-sm text-muted font-medium ml-2 mb-1">/ khách</span>
                </div>
            </div>

            <div className="mb-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted">Người lớn (Từ 6 tuổi)</span>
                    <span className="text-sm font-bold text-foreground">{formatPrice(priceDefault)} đ</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted">Trẻ em (Dưới 6 tuổi)</span>
                    <span className="text-sm font-bold text-foreground">{formatPrice(priceChild)} đ</span>
                </div>
            </div>

            {departures.length > 0 && (
                <div className="mb-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-muted">Khởi hành gần nhất</span>
                        <span className="text-sm font-bold text-foreground">
                            {new Date(departures[0].departure_date).toLocaleDateString("vi-VN")}
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-muted">Số chỗ còn lại</span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-foreground">
                            <i className="fa-solid fa-user text-xs text-primary" aria-hidden="true" />
                            {departures[0].seats_available} chỗ
                        </span>
                    </div>
                </div>
            )}

            <Link
                to={tourId ? `/booking/${tourId}` : "/tours"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-dark px-4 py-3.5 font-bold text-white transition-colors duration-150 hover:bg-primary active:bg-primary cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 no-underline"
            >
                Đặt tour ngay
                <i className="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
            </Link>

            <div className="mt-5 rounded-xl bg-primary/5 p-4 text-center">
                <h3 className="text-sm font-bold text-foreground">Cần tư vấn thêm?</h3>
                <p className="text-xs text-muted mt-0.5">Hỗ trợ miễn phí 24/7</p>
                <a
                    href={`tel:${hotline.replace(/\s/g, "")}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary-dark transition-colors duration-150 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                    <i className="fa-solid fa-phone-volume" aria-hidden="true" />
                    {hotline}
                </a>
            </div>
        </div>
    );
};

export default TourBookingCard;