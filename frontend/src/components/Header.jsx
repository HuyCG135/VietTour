import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../features/auth/auth.api";
import logoIcon from "../assets/images/icon.svg";
import defaultAvatar from "../assets/images/image.png";

export default function Header() {
    const user = getUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-[70px] items-center justify-between border-b border-gray-200 px-12 bg-white/80 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-3 no-underline text-gray-800">
                <img className="mr-2" src={logoIcon} alt="VietTour" width="32" height="32" />
                <h2 className="text-lg font-bold mb-0">VietTour</h2>
            </Link>

            <nav className="hidden lg:flex flex-1 justify-center items-center gap-6">
                <Link className="no-underline text-gray-700 font-medium px-2 py-1 hover:text-blue-600 transition-colors" to="/">
                    Điểm đến
                </Link>
                <Link className="no-underline text-gray-700 font-medium px-2 py-1 hover:text-blue-600 transition-colors" to="/tours">
                    Tours
                </Link>
                <Link className="no-underline text-gray-700 font-medium px-2 py-1 hover:text-blue-600 transition-colors" to="/about">
                    Về chúng tôi
                </Link>
                <Link className="no-underline text-gray-700 font-medium px-2 py-1 hover:text-blue-600 transition-colors" to="/contact">
                    Liên hệ
                </Link>
                {user?.role === "admin" && (
                    <Link className="no-underline text-gray-700 font-medium px-2 py-1 hover:text-blue-600 transition-colors" to="/admin">
                        Admin
                    </Link>
                )}
            </nav>

            <div className="flex items-center gap-2">
                {user ? (
                    <>
                        <Link to="/user/profile" className="rounded-full overflow-hidden block" style={{ width: 40, height: 40 }} title="Thông tin cá nhân">
                            <img src={defaultAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        </Link>
                        <button onClick={handleLogout} className="hidden sm:inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full px-6 py-2 border border-gray-300 transition-colors cursor-pointer">
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hidden sm:inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-2 transition-colors">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="hidden sm:inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-full px-6 py-2 border border-gray-300 transition-colors">
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
