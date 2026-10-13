import { useState } from "react";
import { Link } from "react-router-dom";
import bgLogin from "../../assets/images/bgForgotPassword.jpeg";
import logoIcon from "../../assets/images/icon.svg";

const inputClass = (hasError = false) => ["w-full rounded-xl border bg-slate-50 py-3 pl-11 text-foreground placeholder:text-slate-400", "transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2", hasError ? "border-danger/60 focus:border-danger focus:ring-danger/20" : "border-slate-300 focus:border-primary focus:ring-primary/20"].join(" ");

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const validateField = (value) => {
        if (!value || value.trim().length === 0) return "Vui lòng nhập email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ.";
        return "";
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateField(value) }));
    };

    const handleBlur = () => {
        setErrors((prev) => ({ ...prev, email: validateField(email) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateField(email);
        if (err) {
            setErrors({ email: err });
            return;
        }
        setLoading(true);
        try {
            // TODO: call API forgot password
            setMessage({ text: "Link đặt lại mật khẩu đã được gửi đến email của bạn!", type: "success" });
        } catch {
            setMessage({ text: "Có lỗi xảy ra. Vui lòng thử lại.", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto -mt-[70px] flex max-w-7xl justify-center px-4 py-4 sm:px-6 sm:py-16">
            <div className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-surface shadow-[0_20px_45px_rgba(15,40,60,0.12)] lg:h-[min(480px,calc(100dvh-128px))] lg:grid-cols-2">
                <div className="relative hidden h-full lg:block">
                    <img src={bgLogin} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60" />
                    <div className="relative z-10 flex h-full flex-col p-10 text-white">
                        <Link to="/" className="flex items-center gap-2.5 no-underline text-white">
                            <img src={logoIcon} alt="VietTour" width="32" height="32" />
                            <span className="text-lg font-bold">VietTour</span>
                        </Link>

                        <div className="mt-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Quên mật khẩu</span>
                            <h1 className="mt-2 text-3xl font-extrabold leading-tight">Đừng lo, chúng tôi giúp bạn</h1>
                            <p className="mt-3 text-sm leading-relaxed text-white/80">Nhập email đã đăng ký để nhận link đặt lại mật khẩu an toàn.</p>
                        </div>
                    </div>
                </div>

                <div className="h-full overflow-y-auto p-6 sm:p-10 lg:p-10">
                    <div className="flex items-center gap-2.5 lg:hidden">
                        <img src={logoIcon} alt="VietTour" width="28" height="28" />
                        <span className="text-lg font-bold text-foreground">VietTour</span>
                    </div>

                    <div className="mt-2 lg:mt-0">
                        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">Quên mật khẩu</h2>
                        <p className="mt-2 text-sm text-muted">Nhập email đã đăng ký để nhận link đặt lại mật khẩu.</p>
                    </div>

                    {message.text && (
                        <div className={`mt-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${message.type === "danger" ? "border-danger/40 bg-danger/5 text-danger" : "border-success/40 bg-success/5 text-success"}`}>
                            <i className={`fa-solid mt-0.5 ${message.type === "danger" ? "fa-circle-exclamation" : "fa-circle-check"}`} />
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-muted">
                                Email
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="email" name="email" type="email" placeholder="Nhập email đã đăng ký" value={email} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.email} className={inputClass(!!errors.email)} />
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.email ?? ""}</p>
                        </div>

                        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary">
                            {loading && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Gửi yêu cầu
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted">
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                            Quay lại đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
