import { Link } from "react-router-dom";

const STEPS = [
    { number: "01", title: "Thông tin & Đặt chỗ" },
    { number: "02", title: "Ghi nhận đơn" },
    { number: "03", title: "Thanh toán VNPay" },
];

export default function BookingSteps({ tourName }) {
    return (
        <header className="relative bg-surface border-b border-border">
            <div className="mx-auto max-w-7xl px-6 pt-[78px] sm:pt-[84px] pb-6 sm:pb-8">
                <nav aria-label="breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-sm text-muted">
                    <Link to="/" className="no-underline font-medium text-muted hover:text-primary transition-colors">
                        VietTour
                    </Link>
                    <i className="fa-solid fa-angle-right text-[10px] text-primary/40" aria-hidden="true" />
                    <Link to="/tours" className="no-underline font-medium text-muted hover:text-primary transition-colors">
                        Tour du lịch
                    </Link>
                    <i className="fa-solid fa-angle-right text-[10px] text-primary/40" aria-hidden="true" />
                    {tourName && (
                        <>
                            <span className="font-semibold text-foreground truncate max-w-[180px] sm:max-w-[320px]">
                                {tourName}
                            </span>
                            <i className="fa-solid fa-angle-right text-[10px] text-primary/40" aria-hidden="true" />
                        </>
                    )}
                    <span className="font-bold text-primary" aria-current="page">
                        Đặt tour
                    </span>
                </nav>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Hoàn tất đặt tour
                </h1>
                <p className="mt-2 max-w-xl text-sm sm:text-base text-muted leading-relaxed">
                    Ghi nhận đơn không thu phí — thanh toán VNPay được thực hiện ở bước tiếp theo.
                </p>

                <div className="mt-6 sm:mt-8">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                        {STEPS.map((step, index) => (
                            <span
                                key={step.number}
                                className={`h-1.5 rounded-full transition-colors duration-300 ${
                                    index === 0 ? "flex-[1.15] bg-primary" : "flex-1 bg-border"
                                }`}
                            />
                        ))}
                    </div>
                    <ol className="mt-3 grid grid-cols-3 gap-2 text-xs sm:text-sm" aria-label="Tiến trình đặt chỗ">
                        {STEPS.map((step, index) => (
                            <li
                                key={step.number}
                                className="min-w-0 text-center"
                                aria-current={index === 0 ? "step" : undefined}
                            >
                                <span
                                    className={`block truncate px-0.5 ${
                                        index === 0 ? "font-bold text-foreground" : "font-medium text-muted"
                                    }`}
                                >
                                    {step.number}. {step.title}
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </header>
    );
}