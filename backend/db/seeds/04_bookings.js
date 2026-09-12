import { SEED_CONFIG } from "../seed-config.js";

const GENDERS = ["Nam", "Nữ", "Khác"];
const randomGender = () => GENDERS[Math.floor(Math.random() * GENDERS.length)];
const randomDob = (minAge, maxAge) => {
    const year = new Date().getFullYear() - minAge - Math.floor(Math.random() * (maxAge - minAge));
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export async function seed(knex) {
    const userIds = (await knex("users").select("id").orderBy("id")).map((r) => r.id);
    const departureIds = (await knex("tour_departures").select("id").orderBy("id")).map((r) => r.id);

    const bookings = [];
    for (let i = 0; i < SEED_CONFIG.bookings; i++) {
        const userRow = userIds[1 + Math.floor(Math.random() * (userIds.length - 1))];
        const dep = departureIds[Math.floor(Math.random() * departureIds.length)];
        bookings.push({
            user_id: userRow,
            departure_id: dep,
            adults: 1 + Math.floor(Math.random() * 4),
            children: Math.floor(Math.random() * 2),
            total_price: 1000000 + Math.floor(Math.random() * 5000000),
            payment_status: "unpaid",
            status: ["pending", "confirmed", "cancelled"][Math.floor(Math.random() * 3)],
            contact_name: `Khách hàng ${i}`,
            contact_phone: `0900000${String(i).padStart(4, "0")}`,
            contact_email: `booking${i}@example.com`,
            note: null,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }
    await knex("bookings").insert(bookings);

    const inserted = (await knex("bookings").select("id", "adults", "children").orderBy("id")).slice(-SEED_CONFIG.bookings);

    const passengers = [];
    for (const b of inserted) {
        for (let p = 1; p <= b.adults + b.children; p++) {
            passengers.push({
                booking_id: b.id,
                fullname: `Hành khách ${b.id} - ${p}`,
                gender: randomGender(),
                dob: randomDob(p <= b.adults ? 6 : 1, p <= b.adults ? 70 : 5),
                passenger_type: p <= b.adults ? "adult" : "child",
            });
        }
    }
    await knex("passengers").insert(passengers);
}