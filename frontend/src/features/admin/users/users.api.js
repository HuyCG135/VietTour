import { getToken } from "../../auth/auth.api";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const ADMIN_USERS_URL = `${API_URL}/admin/users`;

const authHeaders = (extra = {}) => ({
    Authorization: `Bearer ${getToken()}`,
    ...extra,
});

const buildQuery = (query = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.set(key, value);
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : "";
};

// Gắn mã trạng thái HTTP vào JSON trả về để component xử lý 401 (phiên hết hạn)
// hoặc 403/409 một cách nhất quán.
const parseJson = async (res) => {
    const json = await res.json().catch(() => ({}));
    json.httpStatus = res.status;
    return json;
};

// Danh sách user + lọc theo query (id/phone/fullname/email/role/status) + phân trang.
export async function getUsers(query = {}) {
    const res = await fetch(`${ADMIN_USERS_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return parseJson(res);
}

// Tạo tài khoản nhân viên/admin (POST /api/admin/users/staff).
export async function createStaff(data) {
    const res = await fetch(`${ADMIN_USERS_URL}/staff`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return parseJson(res);
}

// Cập nhật user (fullname/email/phone/status — không sửa role).
export async function updateUser(id, data) {
    const res = await fetch(`${ADMIN_USERS_URL}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(data),
    });
    return parseJson(res);
}

// Xóa user (backend chỉ cho xóa customer đang bị khóa).
export async function deleteUser(id) {
    const res = await fetch(`${ADMIN_USERS_URL}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return parseJson(res);
}