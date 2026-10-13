export function up(knex) {
    return knex.schema.createTable("bookings", (t) => {
        t.increments("id");
        t.integer("user_id").unsigned().nullable();
        t.integer("departure_id").unsigned().notNullable();
        t.integer("adults").notNullable().defaultTo(1);
        t.integer("children").notNullable().defaultTo(0);
        t.decimal("total_price", 12, 2).notNullable().defaultTo(0);
        t.enu("payment_status", ["unpaid", "paid", "refunded"]).notNullable().defaultTo("unpaid");
        t.enu("status", ["pending", "confirmed", "cancelled"]).notNullable().defaultTo("pending");
        t.string("contact_name", 255).notNullable();
        t.string("contact_phone", 20).notNullable();
        t.string("contact_email", 255).notNullable();
        t.text("note").nullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
        t.foreign("user_id").references("users.id").onDelete("SET NULL");
        t.foreign("departure_id").references("tour_departures.id").onDelete("RESTRICT");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("bookings");
}
