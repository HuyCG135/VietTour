export async function seed(knex) {
    // Order matters for FK
    await knex("wishlist").del();
    await knex("reviews").del();
    await knex("passengers").del();
    await knex("bookings").del();
    await knex("tour_services").del();
    await knex("services").del();
    await knex("tour_departures").del();
    await knex("tour_itineraries").del();
    await knex("tour_images").del();
    await knex("tours").del();
    await knex("otps").del();
    await knex("users").del();
}
