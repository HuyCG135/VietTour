import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../services/authService";
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
        <header className="fixed-top d-flex align-items-center justify-content-between border-bottom px-5 py-3 bg-white bg-opacity-80">
            {/* Logo */}
            <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none text-body">
                <img className="me-2" src={logoIcon} alt="VietTour" width="32" height="32" />
                <h2 className="fs-4 fw-bold mb-0">VietTour</h2>
            </Link>

            {/* Thanh điều hướng */}
            <nav className="d-none d-lg-flex flex-grow-1 justify-content-center align-items-center gap-4">
                <Link className="text-decoration-none text-body fw-medium px-2 py-1" to="/">
                    Điểm đến
                </Link>
                <Link className="text-decoration-none text-body fw-medium px-2 py-1" to="/tours">
                    Tours
                </Link>
                <Link className="text-decoration-none text-body fw-medium px-2 py-1" to="/">
                    Về chúng tôi
                </Link>
                <Link className="text-decoration-none text-body fw-medium px-2 py-1" to="/">
                    Liên hệ
                </Link>
                {user?.role === "admin" && (
                    <Link className="text-decoration-none text-body fw-medium px-2 py-1" to="/admin">
                        Admin
                    </Link>
                )}
            </nav>

            <div className="d-flex align-items-center gap-2">
                {user ? (
                    <>
                        <Link to="/user/profile" className="rounded-circle overflow-hidden" style={{ width: 40, height: 40, cursor: "pointer" }} title="Thông tin cá nhân">
                            <img src={defaultAvatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </Link>
                        <button onClick={handleLogout} className="d-none d-sm-flex btn btn-light rounded-pill px-4 fw-bold border">
                            Đăng xuất
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="d-none d-sm-flex btn btn-primary rounded-pill px-4 fw-bold">
                            Đăng nhập
                        </Link>
                        <Link to="/register" className="d-none d-sm-flex btn btn-light rounded-pill px-4 fw-bold border">
                            Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
