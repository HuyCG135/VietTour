export function up(knex) {
    return knex.schema.createTable("tour_departures", (t) => {
        t.increments("id");
        t.integer("tour_id").unsigned().notNullable();
        t.string("departure_location", 100).notNullable();
        t.date("departure_date").notNullable();
        t.decimal("price_moving", 12, 2).notNullable().defaultTo(0);
        t.decimal("price_moving_child", 12, 2).notNullable().defaultTo(0);
        t.integer("seats_total").notNullable().defaultTo(1);
        t.integer("seats_available").notNullable().defaultTo(1);
        t.enu("status", ["open", "closed", "full"]).notNullable().defaultTo("open");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
        t.unique(["tour_id", "departure_date"], "uk_tour_date");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("tour_departures");
}
