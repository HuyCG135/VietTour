export function up(knex) {
    return knex.schema.createTable("tour_services", (t) => {
        t.increments("id");
        t.integer("tour_id").unsigned().notNullable();
        t.integer("service_id").unsigned().notNullable();
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
        t.foreign("service_id").references("services.id").onDelete("CASCADE");
        t.unique(["tour_id", "service_id"], "uk_tour_service");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("tour_services");
}
