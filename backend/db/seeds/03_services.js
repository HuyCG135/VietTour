import { makeService } from "../factories.js";
import { SEED_CONFIG } from "../seed-config.js";

export async function seed(knex) {
    const services = Array.from({ length: SEED_CONFIG.services }, (_, i) => makeService(i + 1));
    await knex("services").insert(services);

    const serviceRows = await knex("services").select("id", "slug").orderBy("id");
    const slugById = new Map(serviceRows.map((r) => [r.slug, r.id]));
    const tourIds = (await knex("tours").select("id").orderBy("id")).map((r) => r.id);

    const tourServices = [];
    const serviceIdArr = [...slugById.values()];
    for (const id of tourIds) {
        const n = 2 + Math.floor(Math.random() * 3);
        const picked = new Set();
        while (picked.size < n) {
            picked.add(serviceIdArr[Math.floor(Math.random() * serviceIdArr.length)]);
        }
        for (const sid of picked) {
            tourServices.push({ tour_id: id, service_id: sid });
        }
    }
    await knex("tour_services").insert(tourServices);
}
