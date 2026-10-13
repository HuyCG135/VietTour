import {
    createStaffService,
    deleteUserService,
    listUsersService,
    updateUserService,
} from "./user.service.js";

const handleError = (res, error) => {
    // Lỗi nghiệp vụ có status (400/403/404/409) → trả thẳng message.
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }

    // Lỗi unique từ MySQL (email/phone trùng do race) → trả 409 thân thiện.
    if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
            success: false,
            message: "Email hoặc số điện thoại đã tồn tại",
        });
    }

    res.status(500).json({
        success: false,
        message: error.message,
    });
};

// GET /api/admin/users — danh sách + lọc theo query + phân trang.
export const getAllUsers = async (req, res) => {
    try {
        const result = await listUsersService(req.query);

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                currentPage: result.page,
                totalPages: Math.ceil(result.total / result.limit),
                total: result.total,
                limit: result.limit,
            },
        });
    } catch (error) {
        handleError(res, error);
    }
};

// POST /api/admin/users/staff — tạo tài khoản nhân viên/admin.
export const createStaff = async (req, res) => {
    try {
        const user = await createStaffService(req.body);

        res.status(201).json({
            success: true,
            message: `Tạo tài khoản ${user.role === "admin" ? "admin" : "nhân viên"} thành công!`,
            data: user,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// PUT /api/admin/users/:id — cập nhật user.
export const updateUser = async (req, res) => {
    try {
        const user = await updateUserService(Number(req.params.id), req.body);

        res.json({
            success: true,
            message: "Cập nhật user thành công!",
            data: user,
        });
    } catch (error) {
        handleError(res, error);
    }
};

// DELETE /api/admin/users/:id — xóa user.
export const deleteUser = async (req, res) => {
    try {
        await deleteUserService(Number(req.params.id));

        res.json({
            success: true,
            message: "Xóa user thành công!",
        });
    } catch (error) {
        handleError(res, error);
    }
};