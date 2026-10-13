const reasons = [
    {
        icon: "fa-solid fa-dollar-sign",
        title: "Giá tốt, minh bạch",
        text: "Mọi tour đều báo giá trọn gói rõ ràng theo từng khách, không phát sinh chi phí ẩn khi đặt chỗ.",
    },
    {
        icon: "fa-solid fa-shield-halved",
        title: "Đặt chỗ an toàn",
        text: "Lịch khởi hành được xác nhận chắc chắn, có đội ngũ hỗ trợ xuyên suốt hành trình của bạn.",
    },
    {
        icon: "fa-solid fa-rotate",
        title: "Trải nghiệm liền mạch",
        text: "Từ chọn tour, thanh toán đến lên đường đều được sắp xếp gọn gàng, đúng hẹn.",
    },
];

const WhyChooseUs = () => {
    return (
        <section className="mx-auto max-w-[900px] px-10 pb-20 pt-10">
            <h2 className="mb-10 text-center text-3xl font-extrabold tracking-wide text-slate-900">
                Vì sao chọn VietTour?
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
                {reasons.map(({ icon, title, text }) => (
                    <div
                        className="flex flex-col items-center rounded-2xl border border-slate-200 bg-surface p-7 text-center shadow-[0_2px_10px_rgba(30,41,59,0.05)]"
                        key={title}
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <i className={`${icon} text-2xl text-primary`} />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
                        <p className="text-sm leading-relaxed text-slate-500">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;