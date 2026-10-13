export function up(knex) {
    return knex.schema.alterTable("bookings", (t) => {
        t.date("contact_dob").nullable();
        t.enu("contact_gender", ["Nam", "Nữ", "Khác"]).nullable();
    });
}

export function down(knex) {
    return knex.schema.alterTable("bookings", (t) => {
        t.dropColumn("contact_gender");
        t.dropColumn("contact_dob");
    });
}