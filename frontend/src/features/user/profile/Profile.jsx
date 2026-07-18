import { useState } from "react";
import { getUser } from "../../auth/auth.api";
import defaultAvatar from "../../../assets/images/image.png";

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
        // TODO: call API update profile
        setMessage({ text: "Cập nhật thành công!", type: "success" });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <h2 className="font-bold text-xl mb-4">Thông tin cá nhân</h2>

            <div className="flex flex-wrap">
                <div className="w-full md:w-1/3 text-center mb-6">
                    <img src={defaultAvatar} alt="Avatar" className="rounded-full mx-auto mb-3" style={{ width: 120, height: 120, objectFit: "cover" }} />
                    <p className="font-bold mb-0">{user?.fullname || "Người dùng"}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                <div className="w-full md:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        {message.text && <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${message.type === "danger" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>{message.text}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                <input name="fullname" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={form.fullname} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input name="email" type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={form.email} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input name="phone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={form.phone} onChange={handleChange} />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer">Lưu thay đổi</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
