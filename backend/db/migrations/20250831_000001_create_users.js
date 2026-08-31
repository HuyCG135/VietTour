export function up(knex) {
    return knex.schema.createTable("users", (t) => {
        t.increments("id");
        t.string("fullname", 255).notNullable();
        t.string("phone", 20).notNullable().unique();
        t.string("email", 255).notNullable().unique();
        t.string("password", 255).notNullable();
        t.enu("role", ["customer", "admin"]).notNullable().defaultTo("customer");
        t.tinyint("status").notNullable().defaultTo(1);
        t.tinyint("is_verified").notNullable().defaultTo(0);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("users");
}
