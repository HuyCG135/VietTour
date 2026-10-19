import db from "../../../config/knex.js";

const toNumber = (value) =>
    value === null || value === undefined || value === "" ? 0 : Number(value);

// Chuẩn hóa một dòng user trả về cho client (giấu password).
const mapRow = (row) => ({
    id: row.id,
    fullname: row.fullname,
    email: row.email,
    phone: row.phone,
    address: row.address,
    role: row.role,
    status: toNumber(row.status), // 1 = hoạt động, 0 = đã khóa
    is_verified: toNumber(row.is_verified),
    created_at: row.created_at,
    updated_at: row.updated_at,
});

class User {
    // Dựng query lọc theo các tiêu chí tìm kiếm (giống hành vi dự án cũ).
    // id: khớp chính xác; phone/fullname/email: LIKE; role/status: khớp chính xác.
    static buildListQuery(filters = {}) {
        const query = db("users");

        if (filters.id !== undefined && filters.id !== null && filters.id !== "") {
            const id = Number(filters.id);
            if (Number.isInteger(id) && id >= 1) {
                query.where("id", id);
            }
        }
        if (filters.phone) {
            query.where("phone", "like", `%${filters.phone}%`);
        }
        if (filters.role) {
            query.where("role", filters.role);
        }
        if (filters.status !== undefined && filters.status !== null && filters.status !== "") {
            query.where("status", Number(filters.status));
        }
        if (filters.fullname) {
            query.where("fullname", "like", `%${filters.fullname}%`);
        }
        if (filters.email) {
            query.where("email", "like", `%${filters.email}%`);
        }

        return query;
    }

    // Danh sách user có phân trang, sắp xếp mới nhất trước.
    static async list({ id, phone, role, status, fullname, email, page, limit }) {
        const filters = { id, phone, role, status, fullname, email };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));

        const [{ total }] = await this.buildListQuery(filters).count({ total: "id" });
        const rows = await this.buildListQuery(filters)
            .select(
                "id",
                "fullname",
                "email",
                "phone",
                "address",
                "role",
                "status",
                "is_verified",
                "created_at",
                "updated_at",
            )
            .orderBy("id", "desc")
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return {
            rows: rows.map((row) => mapRow(row)),
            total: Number(total),
            page: pageNum,
            limit: limitNum,
        };
    }

    static async findById(id) {
        const row = await db("users").where("id", id).first();
        return row ? mapRow(row) : null;
    }

    static async findByEmail(email) {
        return db("users").where("email", email).first();
    }

    static async findByPhone(phone) {
        return db("users").where("phone", phone).first();
    }

    // Tạo tài khoản nhân viên/admin (password đã được hash từ service).
    // users.phone NOT NULL → bắt buộc có phone hoàn chỉnh từ validate.
    static async createStaff({ fullname, email, phone, password, role }) {
        const [id] = await db("users").insert({
            fullname,
            email,
            phone,
            password,
            role,
            status: 1, // tạo xong kích hoạt ngay
            is_verified: 0,
            created_at: db.fn.now(),
            updated_at: db.fn.now(),
        });
        return id;
    }

    // Cập nhật một phần: chỉ ghi các field được truyền.
    static async update(id, fields) {
        const data = { updated_at: db.fn.now() };

        if (fields.fullname !== undefined) data.fullname = fields.fullname;
        if (fields.email !== undefined) data.email = fields.email;
        if (fields.phone !== undefined) data.phone = fields.phone;
        if (fields.address !== undefined) data.address = fields.address;
        if (fields.status !== undefined) data.status = Number(fields.status);

        const updated = await db("users").where("id", id).update(data);
        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("users").where("id", id).del();
        return deleted > 0;
    }
}

export default User;