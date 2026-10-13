import db from "../../config/knex.js";

class Review {
    static async getByUserId(userId) {
        return db("reviews as r")
            .join("tours as t", "r.tour_id", "t.id")
            .select(
                "r.id",
                "r.tour_id",
                "r.rating",
                "r.comment",
                "r.created_at",
                "t.name as tour_name",
                "t.cover_image as cover_image",
            )
            .where("r.user_id", userId)
            .orderBy("r.created_at", "desc");
    }

    static async getById(id) {
        return db("reviews").where("id", id).first();
    }

    static async findForUserAndTour(userId, tourId) {
        return db("reviews").where({ user_id: userId, tour_id: tourId }).first();
    }

    static async create(data) {
        const [id] = await db("reviews").insert({
            user_id: data.user_id,
            tour_id: data.tour_id,
            rating: data.rating,
            comment: data.comment ?? null,
            created_at: new Date(),
        });
        return id;
    }

    static async update(id, data) {
        const updated = await db("reviews")
            .where("id", id)
            .update({ rating: data.rating, comment: data.comment ?? null });
        return updated > 0;
    }

    static async remove(id) {
        const deleted = await db("reviews").where("id", id).del();
        return deleted > 0;
    }
}

export default Review;