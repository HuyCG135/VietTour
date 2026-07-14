import db from "../../config/db.js";

class Tour {
    static async getAll() {
        try {
            const [rows] = await db.query("SELECT * FROM tours ORDER BY id DESC");
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getByRegion(region) {
        try {
            const [rows] = await db.query("SELECT * FROM tours WHERE region = ? ORDER BY id DESC", [region]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await db.query("SELECT * FROM tours WHERE id = ?", [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(tourData) {
        try {
            const { name, description, price, region, duration, image } = tourData;
            const [result] = await db.query(
                `
                    INSERT INTO tours (name, description, price, region, duration, image, created_at) 
                    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                [name, description, price, region, duration, image],
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, tourData) {
        try {
            const { name, description, price, region, duration, image } = tourData;
            const [result] = await db.query(
                `
                    UPDATE tours SET name = ?, description = ?, price = ?, region = ?, duration = ?, image = ?, updated_at = NOW() WHERE id = ?`,
                [name, description, price, region, duration, image, id],
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query("DELETE FROM tours WHERE id = ?", [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    static async search(keyword) {
        try {
            const [rows] = await db.query("SELECT * FROM tours WHERE name LIKE ? OR description LIKE ?", [`%${keyword}%`, `%${keyword}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

export default Tour;
