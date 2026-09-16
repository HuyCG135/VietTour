import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./auth.api";
import bgRegister from "../../assets/images/bgRegister.jpg";
import logoIcon from "../../assets/images/icon.svg";

const inputClass = (hasError = false) => ["w-full rounded-xl border bg-slate-50 py-3 text-foreground placeholder:text-slate-400", "transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2", hasError ? "border-danger/60 focus:border-danger focus:ring-danger/20" : "border-slate-300 focus:border-primary focus:ring-primary/20"].join(" ");

export default function Register() {
    const [form, setForm] = useState({ fullname: "", phone: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case "fullname":
                if (!value || value.trim().length === 0) return "Vui lòng nhập họ và tên.";
                if (value.trim().length < 2) return "Họ và tên phải có ít nhất 2 ký tự.";
                if (value.trim().length > 50) return "Họ và tên không được vượt quá 50 ký tự.";
                return "";
            case "email":
                if (!value || value.trim().length === 0) return "Vui lòng nhập email.";
                if (value.trim().length < 5) return "Email phải có ít nhất 5 ký tự.";
                if (value.trim().length > 100) return "Email không được vượt quá 100 ký tự.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ.";
                return "";
            case "phone":
                if (!value || value.trim().length === 0) return "Vui lòng nhập số điện thoại.";
                if (!/^0[0-9]{9}$/.test(value)) return "Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 chữ số).";
                return "";
            case "password":
                if (!value || value.trim().length === 0) return "Vui lòng nhập mật khẩu.";
                if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
                if (value.length > 20) return "Mật khẩu không được vượt quá 20 ký tự.";
                return "";
            case "confirmPassword":
                if (!value || value.trim().length === 0) return "Vui lòng xác nhận mật khẩu.";
                if (value !== form.password) return "Mật khẩu và xác nhận mật khẩu không khớp.";
                return "";
            default:
                return "";
        }
    };

    const validate = (formValue = form) => {
        const errs = {};
        Object.keys(formValue).forEach((key) => {
            const fieldError = validateField(key, formValue[key]);
            if (fieldError) errs[key] = fieldError;
        });
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const nextForm = { ...form, [name]: value };
        setForm(nextForm);
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        try {
            const data = await register(form);
            if (data.success) {
                setMessage({ text: "Đăng ký thành công! Đang chuyển hướng...", type: "success" });
                setTimeout(() => navigate(`/register-success?email=${encodeURIComponent(form.email)}`), 1000);
            } else {
                setMessage({ text: data.message || "Đăng ký thất bại.", type: "danger" });
            }
        } catch {
            setMessage({ text: "Có lỗi xảy ra. Vui lòng thử lại.", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto -mt-[70px] flex max-w-7xl justify-center px-4 py-4 sm:px-6 sm:py-16">
            <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-surface shadow-[0_20px_45px_rgba(15,40,60,0.12)] lg:h-[min(680px,calc(100dvh-140px))] lg:grid-cols-2">
                <div className="relative hidden h-full lg:block">
                    <img src={bgRegister} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60" />
                    <div className="relative z-10 flex h-full flex-col p-10 text-white">
                        <Link to="/" className="flex items-center gap-2.5 no-underline text-white">
                            <img src={logoIcon} alt="VietTour" width="32" height="32" />
                            <span className="text-lg font-bold">VietTour</span>
                        </Link>

                        <div className="mt-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Tạo tài khoản mới</span>
                            <h1 className="mt-2 text-3xl font-extrabold leading-tight">Bắt đầu hành trình của bạn cùng VietTour</h1>
                            <p className="mt-3 text-sm leading-relaxed text-white/80">Cùng khám phá Việt Nam với hàng ngàn tour du lịch hấp dẫn, giá tốt và trải nghiệm liền mạch.</p>
                        </div>
                    </div>
                </div>

                <div className="h-full overflow-y-auto p-6 sm:p-9">
                    <div className="flex items-center gap-2.5 lg:hidden">
                        <img src={logoIcon} alt="VietTour" width="28" height="28" />
                        <span className="text-lg font-bold text-foreground">VietTour</span>
                    </div>

                    <div className="mt-2 lg:mt-0">
                        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">Đăng ký tài khoản</h2>
                        <p className="mt-2 text-sm text-muted">Điền thông tin bên dưới để bắt đầu khám phá.</p>
                    </div>

                    {message.text && (
                        <div className={`mt-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${message.type === "danger" ? "border-danger/40 bg-danger/5 text-danger" : "border-success/40 bg-success/5 text-success"}`}>
                            <i className={`fa-solid mt-0.5 ${message.type === "danger" ? "fa-circle-exclamation" : "fa-circle-check"}`} />
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-3.5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullname" className="text-sm font-medium text-muted">
                                Họ và tên
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="fullname" name="fullname" type="text" placeholder="Nhập họ và tên của bạn" value={form.fullname} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.fullname} className={`${inputClass(!!errors.fullname)} pl-11`} />
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.fullname ?? ""}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-muted">
                                Email
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-envelope absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="email" name="email" type="email" placeholder="Nhập địa chỉ email" value={form.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.email} className={`${inputClass(!!errors.email)} pl-11`} />
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.email ?? ""}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="phone" className="text-sm font-medium text-muted">
                                Số điện thoại
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-phone absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="phone" name="phone" type="tel" placeholder="Nhập số điện thoại" value={form.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.phone} className={`${inputClass(!!errors.phone)} pl-11`} />
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.phone ?? ""}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-muted">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="password" name="password" type={showPwd ? "text" : "password"} placeholder="Nhập mật khẩu" value={form.password} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.password} className={`${inputClass(!!errors.password)} pl-11 pr-11`} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-primary">
                                    <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"} text-base`} />
                                </button>
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.password ?? ""}</p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-muted">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="confirmPassword" name="confirmPassword" type={showPwd ? "text" : "password"} placeholder="Xác nhận mật khẩu" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.confirmPassword} className={`${inputClass(!!errors.confirmPassword)} pl-11 pr-11`} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-primary">
                                    <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"} text-base`} />
                                </button>
                            </div>
                            <p className="min-h-4 text-xs font-medium text-danger">{errors.confirmPassword ?? ""}</p>
                        </div>

                        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary">
                            {loading && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Đăng ký
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-muted">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
