import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "./auth.api";
import bgLogin from "../../assets/images/bgLogin.jpg";

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect");
    const redirectTarget = redirect && redirect.startsWith("/") ? redirect : "/";

    const verified = searchParams.get("verified");
    const verifiedMessages = {
        true: { text: "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.", type: "success" },
        already: { text: "Email của bạn đã được xác thực trước đó.", type: "success" },
        false: { text: "Xác thực email thất bại. Link không hợp lệ hoặc đã hết hạn.", type: "danger" },
        error: { text: "Có lỗi xảy ra khi xác thực email. Vui lòng thử lại.", type: "danger" },
    };
    const initialMessage = verified ? verifiedMessages[verified] : null;

    const [form, setForm] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(initialMessage || { text: "", type: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);

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
                if (data.data?.user?.is_verified === 0) {
                    navigate(`/register-success?email=${encodeURIComponent(data.data.user.email || "")}`);
                } else {
                    navigate(redirectTarget);
                }
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
        <div className="max-w-7xl mx-auto px-6 py-12 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 100%)" }}>
            <div className="flex justify-center">
                <div className="w-full md:w-2/3 lg:w-1/2">
                    <div className="flex items-center justify-center text-center text-white mb-6 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${bgLogin})`, borderRadius: 12, padding: "2rem" }}>
                        <div>
                            <h1 className="font-bold text-3xl">Đăng nhập</h1>
                            <h5 className="mb-0 font-normal">Chào mừng trở lại với VietTour</h5>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderRadius: 12 }}>
                        {message.text && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}

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

                            <div className="mb-3">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled={loading}>
                                    {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" /> : null}
                                    Đăng nhập
                                </button>
                            </div>
                        </form>

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
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
