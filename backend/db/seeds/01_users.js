import { makeUser } from "../factories.js";
import { SEED_CONFIG } from "../seed-config.js";

export async function seed(knex) {
    const users = [];
    users.push(await makeUser(0, "admin"));
    for (let i = 1; i <= SEED_CONFIG.users; i++) {
        users.push(await makeUser(i, "customer"));
    }
    for (const user of users) {
        await knex("users").insert(user);
    }
}
