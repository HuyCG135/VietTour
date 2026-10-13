export function up(knex) {
    return knex.schema.createTable("reviews", (t) => {
        t.increments("id");
        t.integer("user_id").unsigned().notNullable();
        t.integer("tour_id").unsigned().notNullable();
        t.integer("rating").unsigned().notNullable();
        t.text("comment").nullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.foreign("user_id").references("users.id").onDelete("CASCADE");
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
        t.unique(["user_id", "tour_id"], "uk_user_tour_review");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("reviews");
}
