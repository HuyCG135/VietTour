import bcrypt from "bcryptjs";
import db from "../../config/db.js";

class User {
    static async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0];
    }

    static async findByPhone(phone) {
        const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
        return rows[0];
    }

    static async findByEmailOrPhone(value) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ? OR phone = ?", [value, value]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query("SELECT id, fullname, phone, email, role, is_verified, created_at FROM users WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(userData) {
        const { fullname, phone, email, password, role = "customer", is_verified = false } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query("INSERT INTO users (fullname, phone, email, password, role, is_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())", [fullname, phone, email, hashedPassword, role, is_verified ? 1 : 0]);
        return result.insertId;
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async update(id, userData) {
        const { fullname, phone, email, role } = userData;
        const [result] = await db.query("UPDATE users SET fullname = ?, phone = ?, email = ?, role = ? WHERE id = ?", [fullname, phone, email, role, id]);
        return result.affectedRows > 0;
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id]);
        return result.affectedRows > 0;
    }

    static async verifyEmail(id) {
        const [result] = await db.query("UPDATE users SET is_verified = 1 WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }

    static async getAll() {
        const [rows] = await db.query("SELECT id, fullname, phone, email, role, is_verified, created_at FROM users ORDER BY id DESC");
        return rows;
    }

    static async delete(id) {
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
}

export default User;
