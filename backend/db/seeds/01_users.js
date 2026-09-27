import { makeUser } from "../factories.js";
import { SEED_CONFIG } from "../seed-config.js";

export async function seed(knex) {
    const users = [];
    users.push(await makeUser(0, "admin"));
    users.push(await makeUser(1, "tour-staff"));
    users.push(await makeUser(2, "booking-staff"));
    for (let i = 3; i <= SEED_CONFIG.users; i++) {
        users.push(await makeUser(i, "customer"));
    }
    for (const user of users) {
        await knex("users").insert(user);
    }
}
