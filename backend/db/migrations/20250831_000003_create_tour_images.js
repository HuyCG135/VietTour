export function up(knex) {
    return knex.schema.createTable("tour_images", (t) => {
        t.increments("id");
        t.integer("tour_id").unsigned().notNullable();
        t.string("image", 255).nullable();
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("tour_images");
}
