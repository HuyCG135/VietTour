export function up(knex) {
    return knex.schema.createTable("services", (t) => {
        t.increments("id");
        t.string("name", 255).notNullable();
        t.string("slug", 255).unique();
        t.text("description");
        t.tinyint("status").notNullable().defaultTo(1);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("services");
}
