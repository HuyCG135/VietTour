import db from "../../config/knex.js";

class Favorite {
    static async getByUser(userId) {
        return db("wishlist")
            .join("tours", "wishlist.tour_id", "=", "tours.id")
            .where("wishlist.user_id", userId)
            .orderBy("wishlist.created_at", "desc")
            .select(
                "tours.id",
                "tours.name",
                "tours.slug",
                "tours.location",
                "tours.region",
                "tours.duration",
                "tours.price_default",
                "tours.price_child",
                "tours.cover_image",
            );
    }

    static async getIds(userId) {
        return db("wishlist").where("user_id", userId).pluck("tour_id");
    }

    static async get(userId, tourId) {
        return db("wishlist").where("user_id", userId).where("tour_id", tourId).first();
    }

    static async add(userId, tourId) {
        return db("wishlist").insert({ user_id: userId, tour_id: tourId });
    }

    static async remove(userId, tourId) {
        return db("wishlist").where("user_id", userId).where("tour_id", tourId).del();
    }
}

export default Favorite;