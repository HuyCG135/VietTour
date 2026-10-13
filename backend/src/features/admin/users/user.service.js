import bcrypt from "bcryptjs";
import User from "./user.repository.js";

const createHttpError = (status, message) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

// Loại bỏ trường nhạy cảm nếu rò rỉ từ repository (phòng hờ).
const safeUser = (user) => {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
};

// Danh sách user + lọc + phân trang (dành cho admin).
export const listUsersService = async (query = {}) => {
    const filters = {
        id: query.id,
        phone: typeof query.phone === "string" ? query.phone.trim() : query.phone,
        role: query.role,
        status: query.status,
        fullname: typeof query.fullname === "string" ? query.fullname.trim() : query.fullname,
        email: typeof query.email === "string" ? query.email.trim() : query.email,
    };

    return User.list({
        ...filters,
        page: query.page,
        limit: query.limit,
    });
};

// Tạo tài khoản nhân viên/admin — email/phone trùng bị chặn với mã 409.
export const createStaffService = async (payload) => {
    const fullname = payload.fullname.trim();
    const email = payload.email.trim();
    const phone = payload.phone.trim();

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
        throw createHttpError(409, "Email này đã được sử dụng bởi tài khoản khác!");
    }

    const existingPhone = await User.findByPhone(phone);
    if (existingPhone) {
        throw createHttpError(409, "Số điện thoại này đã được sử dụng bởi tài khoản khác!");
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const id = await User.createStaff({
        fullname,
        email,
        phone,
        password: hashedPassword,
        role: payload.role,
    });

    return { id, fullname, email, phone, role: payload.role };
};

// Cập nhật fullname/email/phone/status. Không đổi được role; không khóa được admin.
export const updateUserService = async (id, payload) => {
    const existing = await User.findById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy user để cập nhật");
    }

    // Email mới trùng user khác → 400 (hành vi cũ).
    if (payload.email !== undefined && payload.email.trim().toLowerCase() !== existing.email.toLowerCase()) {
        const duplicated = await User.findByEmail(payload.email.trim());
        if (duplicated && duplicated.id !== id) {
            throw createHttpError(400, "Email này đã được sử dụng bởi người dùng khác!");
        }
    }

    // Role không được đổi qua endpoint này (hành vi cũ).
    if (payload.role !== undefined && payload.role !== existing.role) {
        throw createHttpError(400, "Không được phép thay đổi vai trò của user");
    }

    // Không cho khóa tài khoản admin.
    if (String(payload.status) === "0" && existing.role === "admin") {
        throw createHttpError(400, "Không được phép khóa tài khoản admin");
    }

    const updates = {};
    if (payload.fullname !== undefined) updates.fullname = payload.fullname.trim();
    if (payload.email !== undefined) updates.email = payload.email.trim();
    if (payload.phone !== undefined) updates.phone = payload.phone.trim();
    if (payload.address !== undefined) updates.address = payload.address;
    if (payload.status !== undefined) updates.status = payload.status;

    await User.update(id, updates);
    return safeUser(await User.findById(id));
};

// Xóa user: chỉ xóa được customer đang bị khóa (status=0) — giữ hành vi an toàn cũ.
export const deleteUserService = async (id) => {
    const existing = await User.findById(id);
    if (!existing) {
        throw createHttpError(404, "Không tìm thấy user để xóa");
    }

    if (existing.role !== "customer" || existing.status === 1) {
        throw createHttpError(
            403,
            "Không được phép xóa tài khoản quản trị/nhân viên hoặc tài khoản đang hoạt động",
        );
    }

    await User.delete(id);
    return true;
};