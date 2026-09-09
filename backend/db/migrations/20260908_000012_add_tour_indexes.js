export function up(knex) {
    return knex.schema.alterTable("tours", (t) => {
        t.index("region", "idx_tours_region");
        t.index("price_default", "idx_tours_price_default");
    });
}

export function down(knex) {
    return knex.schema.alterTable("tours", (t) => {
        t.dropIndex("region", "idx_tours_region");
        t.dropIndex("price_default", "idx_tours_price_default");
    });
}