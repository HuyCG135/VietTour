import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-center">
                <div className="w-full md:w-1/2 lg:w-5/12">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="font-bold text-xl mb-3">Quên mật khẩu</h2>
                        <p className="text-gray-500 mb-4">Nhập email của bạn để nhận link đặt lại mật khẩu.</p>

                        {message.text && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50" disabled={loading}>
                                {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" /> : null}
                                Gửi yêu cầu
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-0 text-sm">
                            <Link to="/login" className="text-blue-600 hover:text-blue-700">Quay lại đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
