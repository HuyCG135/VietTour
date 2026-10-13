import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/login?verified=false");
            return;
        }

        fetch(`${API_URL}/auth/verify-email?token=${token}`)
            .then((res) => {
                const finalUrl = new URL(res.url, window.location.origin);
                const verified = finalUrl.searchParams.get("verified") || "false";
                navigate(`/login?verified=${verified}`, { replace: true });
            })
            .catch(() => {
                navigate("/login?verified=error", { replace: true });
            });
    }, [navigate, searchParams]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 my-12 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.9) 100%)" }}>
            <div className="flex justify-center">
                <div className="w-full md:w-1/2 lg:w-5/12 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                        <span className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <h2 className="font-bold text-xl mb-1">Đang xác thực email...</h2>
                        <p className="text-gray-500 text-sm mb-0">Vui lòng chờ trong giây lát.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}