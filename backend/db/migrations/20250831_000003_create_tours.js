export function up(knex) {
    return knex.schema.createTable("tours", (t) => {
        t.increments("id");
        t.string("name", 255).notNullable();
        t.string("slug", 255).unique();
        t.text("description");
        t.string("location", 100).notNullable();
        t.string("region", 100).notNullable();
        t.string("duration", 100).notNullable();
        t.decimal("price_default", 12, 2).notNullable().defaultTo(0);
        t.decimal("price_child", 12, 2).notNullable().defaultTo(0);
        t.string("cover_image", 255).nullable();
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("tours");
}
