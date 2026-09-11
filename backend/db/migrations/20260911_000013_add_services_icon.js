export function up(knex) {
    return knex.schema.alterTable("services", (t) => {
        t.string("icon", 100).nullable();
    });
}

export function down(knex) {
    return knex.schema.alterTable("services", (t) => {
        t.dropColumn("icon");
    });
}