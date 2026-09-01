import db from "../../config/knex.js";

class Tour {
    static async getAll() {
        return db("tours").orderBy("id", "desc");
    }

    static async getByRegion(region) {
        return db("tours").where("region", region).orderBy("id", "desc");
    }

    static async getById(id) {
        return db("tours").where("id", id).first();
    }

    static async create(tourData) {
        const data = {
            ...tourData,
            slug: tourData.slug ?? null,
            description: tourData.description ?? null,
            price_default: tourData.price_default ?? 0,
            price_child: tourData.price_child ?? 0,
            cover_image: tourData.cover_image ?? null,
            created_at: new Date(),
            updated_at: new Date(),
        };
        const [insertId] = await db("tours").insert(data);
        return insertId;
    }

    static async update(id, tourData) {
        const data = {
            ...tourData,
            slug: tourData.slug ?? null,
            description: tourData.description ?? null,
            price_default: tourData.price_default ?? 0,
            price_child: tourData.price_child ?? 0,
            cover_image: tourData.cover_image ?? null,
            updated_at: new Date(),
        };
        const updated = await db("tours").where("id", id).update(data);
        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("tours").where("id", id).del();
        return deleted > 0;
    }

    static async search(keyword) {
        return db("tours")
            .where("name", "like", `%${keyword}%`)
            .orWhere("description", "like", `%${keyword}%`)
            .orderBy("id", "desc");
    }
}

export default Tour;
