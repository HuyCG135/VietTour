import bcrypt from "bcryptjs";
import db from "../../config/knex.js";

class User {
    static async findByEmail(email) {
        return db("users").where("email", email).first();
    }

    static async findByPhone(phone) {
        return db("users").where("phone", phone).first();
    }

    static async findByEmailOrPhone(value) {
        return db("users").where("email", value).orWhere("phone", value).first();
    }

    static async findById(id) {
        return db("users")
            .select("id", "fullname", "phone", "email", "address", "role", "is_verified", "created_at")
            .where("id", id)
            .first();
    }

    static async create(userData) {
        const { fullname, phone, email, password, role = "customer", is_verified = false } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [insertId] = await db("users").insert({
            fullname,
            phone,
            email,
            password: hashedPassword,
            role,
            is_verified: is_verified ? 1 : 0,
            created_at: db.fn.now(),
        });
        return insertId;
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static async update(id, userData) {
        const { fullname, phone, address = null } = userData;
        const result = await db("users")
            .where("id", id)
            .update({ fullname, phone, address, updated_at: db.fn.now() });
        return result > 0;
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await db("users")
            .where("id", id)
            .update({ password: hashedPassword, updated_at: db.fn.now() });
        return result > 0;
    }

    static async verifyEmail(id) {
        const result = await db("users").where("id", id).update({ is_verified: 1 });
        return result > 0;
    }
}

export default User;