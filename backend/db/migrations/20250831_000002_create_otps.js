export function up(knex) {
    return knex.schema.createTable("otps", (t) => {
        t.increments("id");
        t.integer("user_id").unsigned().nullable();
        t.string("email", 255).notNullable();
        t.string("otp", 10).notNullable();
        t.enu("type", ["VERIFY_EMAIL", "RESET_PASSWORD"]).notNullable();
        t.datetime("expires_at").notNullable();
        t.tinyint("is_used").notNullable().defaultTo(0);
        t.timestamp("created_at").defaultTo(knex.fn.now());
        t.foreign("user_id").references("users.id").onDelete("CASCADE");
        t.unique(["email", "type"], "idx_user_type");
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("otps");
}
