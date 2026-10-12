import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function PaymentResult() {
    const [params] = useSearchParams();
    const status = params.get("status");
    const message = params.get("message");
    const bookingId = params.get("bookingId");
    const isSuccess = status === "success";

    return (
        <div className="max-w-2xl mx-auto px-6 py-20">
            <div className="rounded-3xl border border-slate-200 bg-surface p-8 sm:p-10 shadow-[0_2px_10px_rgba(30,41,59,0.05)] text-center">
                {isSuccess ? (
                    <>
                        <span className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-success/10 text-success text-2xl">
                            <i className="fa-solid fa-circle-check" />
                        </span>
                        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Thanh toán thành công</h1>
                        <p className="mt-2 text-muted">
                            Đơn {bookingId && <strong className="text-foreground">#{`MB${bookingId}`} </strong>}
                            đã được thanh toán và xác nhận chỗ.
                        </p>
                        <p className="mt-1 text-sm text-muted">
                            Chi tiết hóa đơn sẵn có trong lịch sử đặt tour.
                        </p>
                    </>
                ) : (
                    <>
                        <span className="mx-auto flex w-16 h-16 items-center justify-center rounded-full bg-warning/10 text-warning text-2xl">
                            <i className="fa-solid fa-triangle-exclamation" />
                        </span>
                        <h1 className="mt-5 text-2xl font-extrabold text-foreground">Thanh toán thất bại</h1>
                        <p className="mt-2 text-muted">{message || "Giao dịch không hoàn tất hoặc đã bị hủy."}</p>
                        <p className="mt-1 text-sm text-muted">
                            Đơn chưa được thanh toán. Bạn có thể thanh toán lại trong lịch sử đặt tour.
                        </p>
                    </>
                )}

                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {bookingId ? (
                        <Link
                            to={`/user/bookings/${bookingId}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 no-underline"
                        >
                            {isSuccess ? "Xem đơn đặt tour" : "Thanh toán lại"}
                            <i className="fa-solid fa-arrow-right text-sm" />
                        </Link>
                    ) : (
                        <Link
                            to="/user/bookings"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 no-underline"
                        >
                            Lịch sử đặt tour
                            <i className="fa-solid fa-arrow-right text-sm" />
                        </Link>
                    )}
                    <Link
                        to="/tours"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-bold text-foreground transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 no-underline"
                    >
                        Xem các tour khác
                    </Link>
                </div>
            </div>
        </div>
    );
}