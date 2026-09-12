import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resendVerification } from "./auth.api";

export default function CheckEmail() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        setMessage({ text: "", type: "" });
        try {
            const data = await resendVerification(email);
            if (data.success) {
                setMessage({ text: "Link xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn!", type: "success" });
            } else {
                setMessage({ text: data.message || "Không thể gửi lại link xác thực.", type: "danger" });
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
                <div className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl shadow-sm p-6">
                    <div className="text-center py-8">
                        <div className="text-blue-600 text-5xl mb-4">
                            <i className="fa-solid fa-envelope-open-text" />
                        </div>
                        <h2 className="font-bold text-xl mb-3">Kiểm tra email của bạn</h2>
                        {email && (
                            <p className="text-gray-500 mb-2">
                                Link xác thực đã được gửi đến <span className="font-semibold text-gray-700">{email}</span>.
                            </p>
                        )}
                        <p className="text-gray-500 mb-1">Vui lòng mở hộp thư và nhấn vào link để xác thực tài khoản.</p>
                        <p className="text-gray-400 text-sm mb-4">Nếu không thấy email, hãy kiểm tra mục Spam/Junk.</p>

                        {message.text && <div className={`mx-auto max-w-md px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}

                        {email && (
                            <button type="button" onClick={handleResend} disabled={loading} className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer disabled:opacity-50">
                                {loading ? "Đang gửi..." : "Link hết hạn? Gửi lại"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}