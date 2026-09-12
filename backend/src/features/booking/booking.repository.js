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

    // Tạo booking + passengers + trừ ghế trong cùng transaction
    static async createWithPassengers({
        user_id,
        departure_id,
        adults,
        children,
        total_price,
        contact_name,
        contact_phone,
        contact_email,
        note,
        passengers,
    }) {
        return db.transaction(async (trx) => {
            const [bookingId] = await trx("bookings").insert({
                user_id,
                departure_id,
                adults,
                children,
                total_price,
                payment_status: "unpaid",
                status: "pending",
                contact_name,
                contact_phone,
                contact_email,
                note: note || null,
                created_at: new Date(),
                updated_at: new Date(),
            });

            if (Array.isArray(passengers) && passengers.length > 0) {
                await trx("passengers").insert(
                    passengers.map((p) => ({
                        booking_id: bookingId,
                        fullname: p.name,
                        gender: p.gender || "Khác",
                        dob: p.dob || null,
                        passenger_type: p.type === "child" ? "child" : "adult",
                    }))
                );
            }

            await trx("tour_departures")
                .where("id", departure_id)
                .decrement("seats_available", adults + children);

            return bookingId;
        });
    }

    static async getDeparture(id) {
        return db("tour_departures").where("id", id).first();
    }

    // Booking kA'm departure + tour (dA1ng cho thanh toAc)
    static async getByIdWithDeparture(id) {
        return db("bookings as b")
            .leftJoin("tour_departures as d", "b.departure_id", "d.id")
            .leftJoin("tours as t", "d.tour_id", "t.id")
            .select(
                "b.*",
                "d.departure_date",
                "d.price_moving",
                "d.price_moving_child",
                "t.name as tour_name",
            )
            .where("b.id", id)
            .first();
    }

    static async getPassengersByBookingId(bookingId) {
        return db("passengers")
            .select("id", "fullname", "gender", "dob", "passenger_type")
            .where("booking_id", bookingId)
            .orderBy("id", "asc");
    }

    // Xác nhận thanh toán: payment_status -> paid, status -> confirmed
    static async markPaid(id) {
        const updated = await db("bookings")
            .where("id", id)
            .update({ payment_status: "paid", status: "confirmed", updated_at: new Date() });
        return updated > 0;
    }

    static async updateStatus(id, status) {
        const updated = await db("bookings")
            .where("id", id)
            .update({ status, updated_at: new Date() });
        return updated > 0;
    }

    // Hoàn trả ghế khi hủy booking
    static async restoreSeats(departureId, paxCount) {
        return db("tour_departures")
            .where("id", departureId)
            .increment("seats_available", paxCount);
    }

    static async delete(id) {
        const deleted = await db("bookings").where("id", id).del();
        return deleted > 0;
    }
}

export default Booking;
