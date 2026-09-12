import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./auth.api";
import bgRegister from "../../assets/images/bgRegister.jpg";

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
        <div className="max-w-7xl mx-auto px-6 py-12 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 100%)" }}>
            <div className="flex justify-center items-stretch flex-wrap">
                <div className="hidden lg:block lg:w-5/12">
                    <div className="flex items-center justify-center text-center text-white h-full bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: `url(${bgRegister})`, borderRadius: "20px 0 0 20px", padding: "2rem" }}>
                        <div>
                            <h2 className="font-bold text-2xl">Tạo tài khoản mới</h2>
                            <h6 className="mb-4 font-normal">Cùng khám phá Việt Nam với hàng ngàn tour du lịch hấp dẫn.</h6>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-7/12">
                    <div className="bg-white rounded-xl lg:rounded-l-none lg:rounded-r-xl shadow-sm p-6 h-full">
                        {message.text && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-user" />
                                    </span>
                                    <input id="fullname" name="fullname" type="text" className={`w-full px-3 py-2 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fullname ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập họ và tên của bạn" value={form.fullname} onChange={handleChange} onBlur={handleBlur} />
                                </div>
                                {errors.fullname && <div className="text-red-500 text-sm mt-1">{errors.fullname}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-envelope" />
                                    </span>
                                    <input id="email" name="email" type="email" className={`w-full px-3 py-2 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập địa chỉ email" value={form.email} onChange={handleChange} onBlur={handleBlur} />
                                </div>
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-phone" />
                                    </span>
                                    <input id="phone" name="phone" type="tel" className={`w-full px-3 py-2 border rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập số điện thoại" value={form.phone} onChange={handleChange} onBlur={handleBlur} />
                                </div>
                                {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-key" />
                                    </span>
                                    <input id="password" name="password" type={showPwd ? "text" : "password"} className={`flex-1 px-3 py-2 border-t border-b text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`} placeholder="Nhập mật khẩu" value={form.password} onChange={handleChange} onBlur={handleBlur} />
                                    <button className="px-3 py-2 border border-l-0 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors text-sm cursor-pointer" type="button" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? "Ẩn" : "Hiện"}
                                    </button>
                                </div>
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                                <div className="flex">
                                    <span className="flex items-center px-3 py-2 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500">
                                        <i className="fa-solid fa-key" />
                                    </span>
                                    <input id="confirmPassword" name="confirmPassword" type={showPwd ? "text" : "password"} className={`flex-1 px-3 py-2 border-t border-b text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} placeholder="Xác nhận mật khẩu" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                                    <button className="px-3 py-2 border border-l-0 rounded-r-lg bg-white text-gray-600 hover:bg-gray-50 transition-colors text-sm cursor-pointer" type="button" onClick={() => setShowPwd(!showPwd)}>
                                        {showPwd ? "Ẩn" : "Hiện"}
                                    </button>
                                </div>
                                {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                            </div>

                            <div className="mb-3">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled={loading}>
                                    {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" /> : null}
                                    Đăng ký
                                </button>
                            </div>
                        </form>

                        <p className="text-center text-gray-500 text-sm mb-0">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="w-full lg:w-7/12 lg:ml-[41.666667%]">
                    <p className="text-center mt-3 mb-0 text-sm">
                        <Link to="/" className="text-blue-600 hover:text-blue-700">
                            Quay về trang chủ
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
