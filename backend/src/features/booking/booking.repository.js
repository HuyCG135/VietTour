import db from "../../config/knex.js";

class Booking {
    static async getAll() {
        return db("bookings as b")
            .leftJoin("users as u", "b.user_id", "u.id")
            .leftJoin("tour_departures as d", "b.departure_id", "d.id")
            .leftJoin("tours as t", "d.tour_id", "t.id")
            .select(
                "b.*",
                "u.fullname",
                "u.email",
                "t.name as tour_name",
                "t.price_default as price",
                "d.departure_date",
            )
            .orderBy("b.created_at", "desc");
    }

    static async getByUserId(userId) {
        return db("bookings as b")
            .leftJoin("tour_departures as d", "b.departure_id", "d.id")
            .leftJoin("tours as t", "d.tour_id", "t.id")
            .select(
                "b.*",
                "t.name as tour_name",
                "t.price_default as price",
                "t.duration",
                "t.region",
                "d.departure_date",
            )
            .where("b.user_id", userId)
            .orderBy("b.created_at", "desc");
    }

    static async getById(id) {
        return db("bookings").where("id", id).first();
    }

    static async create(bookingData) {
        const data = {
            ...bookingData,
            adults: bookingData.adults ?? 1,
            children: bookingData.children ?? 0,
            total_price: bookingData.total_price ?? 0,
            payment_status: bookingData.payment_status ?? "unpaid",
            status: bookingData.status ?? "pending",
            note: bookingData.note ?? null,
            created_at: new Date(),
            updated_at: new Date(),
        };
        const [insertId] = await db("bookings").insert(data);
        return insertId;
    }

    static async updateStatus(id, status) {
        const updated = await db("bookings")
            .where("id", id)
            .update({ status, updated_at: new Date() });
        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("bookings").where("id", id).del();
        return deleted > 0;
    }
}

export default Booking;
