import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./auth.api";
import bgLogin from "../../assets/images/bgLogin.jpg";
<<<<<<< Updated upstream
=======
import logoIcon from "../../assets/images/icon.svg";

const inputClass = (hasError = false) => ["w-full rounded-xl border bg-slate-50 py-3 text-foreground placeholder:text-slate-400", "transition-colors duration-150 focus:bg-white focus:outline-none focus:ring-2", hasError ? "border-danger/60 focus:border-danger focus:ring-danger/20" : "border-slate-300 focus:border-primary focus:ring-primary/20"].join(" ");
>>>>>>> Stashed changes

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case "username": {
                const input = value.trim();
                if (!input) return "Vui lòng nhập email hoặc số điện thoại.";
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
                const isPhone = /^0[0-9]{9}$/.test(input);
                if (!isEmail && !isPhone) return "Email hoặc số điện thoại không hợp lệ.";
                return "";
            }
            case "password":
                return value ? "" : "Vui lòng nhập mật khẩu.";
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
        setForm((prev) => ({ ...prev, [name]: value }));
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
            const data = await login(form.username, form.password);
            if (data.success) {
                localStorage.setItem("token", data?.data?.token || "");
                localStorage.setItem("user", JSON.stringify(data?.data?.user || null));
                navigate("/");
            } else {
                setMessage({ text: data.message || "Đăng nhập thất bại.", type: "danger" });
            }
        } catch {
            setMessage({ text: "Có lỗi xảy ra. Vui lòng thử lại.", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    return (
<<<<<<< Updated upstream
        <div className="max-w-7xl mx-auto px-6 py-12 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 100%)" }}>
            <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-1/2">
                    <div className="flex items-center justify-center text-center text-white mb-6 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${bgLogin})`, borderRadius: 12, padding: "2rem" }}>
                        <div>
                            <h1 className="font-bold text-3xl">Đăng nhập</h1>
                            <h5 className="mb-0 font-normal">Chào mừng trở lại với VietTour</h5>
=======
        <div className="mx-auto -mt-[70px] flex max-w-7xl justify-center px-4 py-4 sm:px-6 sm:py-16">
            <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-surface shadow-[0_20px_45px_rgba(15,40,60,0.12)] lg:h-[min(560px,calc(100dvh-140px))] lg:grid-cols-2">
                <div className="relative hidden h-full lg:block">
                    <img src={bgLogin} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60" />
                    <div className="relative z-10 flex h-full flex-col p-10 text-white">
                        <Link to="/" className="flex items-center gap-2.5 no-underline text-white">
                            <img src={logoIcon} alt="VietTour" width="32" height="32" />
                            <span className="text-lg font-bold">VietTour</span>
                        </Link>

                        <div className="mt-auto">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Chào mừng trở lại</span>
                            <h1 className="mt-2 text-3xl font-extrabold leading-tight">Khám phá lại những miền đất thân quen</h1>
                            <p className="mt-3 text-sm leading-relaxed text-white/80">Đăng nhập để đặt tour, theo dõi hành trình và nhận những ưu đãi hấp dẫn từ VietTour.</p>
>>>>>>> Stashed changes
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderRadius: 12 }}>
                        {message.text && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}

<<<<<<< Updated upstream
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-2">Email hoặc số điện thoại</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-user" />
                                    </span>
                                    <input id="username" type="text" name="username" className={`w-full px-3 py-2 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập email hoặc số điện thoại" value={form.username} onChange={handleChange} onBlur={handleBlur} />
                                </div>
                                {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
=======
                    <div className="mt-2 lg:mt-0">
                        <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">Đăng nhập</h2>
                        <p className="mt-2 text-sm text-muted">Nhập thông tin tài khoản của bạn để tiếp tục.</p>
                    </div>

                    {message.text && (
                        <div className={`mt-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${message.type === "danger" ? "border-danger/40 bg-danger/5 text-danger" : "border-success/40 bg-success/5 text-success"}`}>
                            <i className={`fa-solid mt-0.5 ${message.type === "danger" ? "fa-circle-exclamation" : "fa-circle-check"}`} />
                            <span>{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="username" className="text-sm font-medium text-muted">
                                Email hoặc số điện thoại
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="username" type="text" name="username" placeholder="Nhập email hoặc số điện thoại" value={form.username} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.username} className={`${inputClass(!!errors.username)} pl-11`} />
>>>>>>> Stashed changes
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Mật khẩu</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-key" />
                                    </span>
                                    <input id="password" name="password" type={showPwd ? "text" : "password"} className={`flex-1 px-3 py-2 border-t border-b text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập mật khẩu của bạn" value={form.password} onChange={handleChange} onBlur={handleBlur} />
                                    <button className="px-3 py-2 border border-l-0 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors text-sm cursor-pointer" type="button" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? "Ẩn" : "Hiện"}
                                    </button>
                                </div>
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>
<<<<<<< Updated upstream

                            <div className="mb-3">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled={loading}>
                                    {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" /> : null}
                                    Đăng nhập
=======
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-4 top-1/2 z-10 -translate-y-1/2 text-base text-slate-400" />
                                <input id="password" name="password" type="password" placeholder="Nhập mật khẩu của bạn" value={form.password} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.password} className={`${inputClass(!!errors.password)} pl-11 pr-11`} />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-primary">
                                    <i className={`fa-solid ${showPwd ? "fa-eye-slash" : "fa-eye"} text-base`} />
>>>>>>> Stashed changes
                                </button>
                            </div>
                        </form>

<<<<<<< Updated upstream
                        <p className="text-center text-gray-500 text-sm mb-0">
                            Chưa có tài khoản?{" "}
                            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                    <p className="text-center mt-3 text-sm">
                        <Link to="/" className="text-blue-600 hover:text-blue-700">
                            Quay về trang chủ
=======
                        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary">
                            {loading && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Đăng nhập
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-muted">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
                            Đăng ký ngay
>>>>>>> Stashed changes
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
