export function up(knex) {
    return knex.schema.createTable("passengers", (t) => {
        t.increments("id");
        t.integer("booking_id").unsigned().notNullable();
        t.string("fullname", 255).notNullable();
        t.enu("gender", ["Nam", "Nữ", "Khác"]).notNullable().defaultTo("Khác");
        t.date("dob").nullable();
        t.enu("passenger_type", ["adult", "child"]).notNullable().defaultTo("adult");
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
        t.foreign("booking_id").references("bookings.id").onDelete("CASCADE");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("passengers");
}