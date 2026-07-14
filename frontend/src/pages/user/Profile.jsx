import { useState } from "react";
import { getUser } from "../../services/authService";
import defaultAvatar from "../../assets/images/image.png";

export default function Profile() {
    const user = getUser();
    const [form, setForm] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: gọi API cập nhật profile
        setMessage({ text: "Cập nhật thành công!", type: "success" });
    };

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Thông tin cá nhân</h2>

            <div className="row">
                <div className="col-12 col-md-4 text-center mb-4">
                    <img src={defaultAvatar} alt="Avatar" className="rounded-circle mb-3" style={{ width: 120, height: 120, objectFit: "cover" }} />
                    <p className="fw-bold mb-0">{user?.fullname || "Người dùng"}</p>
                    <p className="text-muted small">{user?.email}</p>
                </div>

                <div className="col-12 col-md-8">
                    <div className="card shadow-sm p-4">
                        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Họ và tên</label>
                                <input name="fullname" type="text" className="form-control" value={form.fullname} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Số điện thoại</label>
                                <input name="phone" type="tel" className="form-control" value={form.phone} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
