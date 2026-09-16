export function up(knex) {
    return knex.schema.createTable("tour_itineraries", (t) => {
        t.increments("id");
        t.integer("tour_id").unsigned().notNullable();
        t.integer("day_number").notNullable();
        t.text("description");
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
        t.unique(["tour_id", "day_number"], "uk_tour_day");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("tour_itineraries");
}
