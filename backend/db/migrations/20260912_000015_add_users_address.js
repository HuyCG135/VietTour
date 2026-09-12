export function up(knex) {
    return knex.schema.alterTable("users", (t) => {
        t.string("address", 255).nullable();
    });
}

export function down(knex) {
    return knex.schema.alterTable("users", (t) => {
        t.dropColumn("address");
    });
}