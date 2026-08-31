export function up(knex) {
    return knex.schema.createTable("wishlist", (t) => {
        t.increments("id");
        t.integer("user_id").unsigned().notNullable();
        t.integer("tour_id").unsigned().notNullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.foreign("user_id").references("users.id").onDelete("CASCADE");
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
        t.unique(["user_id", "tour_id"], "uk_wishlist");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("wishlist");
}
