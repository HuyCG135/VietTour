import { SEED_CONFIG } from "../seed-config.js";

export async function seed(knex) {
    const userIds = (await knex("users").select("id").orderBy("id")).map((r) => r.id);
    const tourIds = (await knex("tours").select("id").orderBy("id")).map((r) => r.id);

    const reviews = [];
    const used = new Set();
    for (let i = 0; i < SEED_CONFIG.reviews; i++) {
        const userRow = userIds[1 + Math.floor(Math.random() * (userIds.length - 1))];
        const tourRow = tourIds[Math.floor(Math.random() * tourIds.length)];
        const key = `${userRow}-${tourRow}`;
        if (used.has(key)) continue;
        used.add(key);
        reviews.push({
            user_id: userRow,
            tour_id: tourRow,
            rating: 1 + Math.floor(Math.random() * 5),
            comment: "Tour rất tuyệt, nhân viên nhiệt tình.",
            created_at: new Date(),
        });
    }
    await knex("reviews").insert(reviews);
}
