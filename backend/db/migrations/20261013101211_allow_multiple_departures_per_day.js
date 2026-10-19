// Nâng cấp: cho phép 1 tour có NHIỀU chuyến khởi hành trong cùng 1 ngày
// (khác điểm khởi hành). Thay unique (tour_id, departure_date) thành
// (tour_id, departure_date, departure_location).
export function up(knex) {
    return knex.schema.alterTable("tour_departures", (t) => {
        t.dropForeign("tour_id", "tour_departures_tour_id_foreign");
        t.dropUnique(["tour_id", "departure_date"], "uk_tour_date");
        t.unique(
            ["tour_id", "departure_date", "departure_location"],
            "uk_tour_date_location",
        );
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
    });
}

export function down(knex) {
    return knex.schema.alterTable("tour_departures", (t) => {
        t.dropForeign("tour_id", "tour_departures_tour_id_foreign");
        t.dropUnique(
            ["tour_id", "departure_date", "departure_location"],
            "uk_tour_date_location",
        );
        t.unique(["tour_id", "departure_date"], "uk_tour_date");
        t.foreign("tour_id").references("tours.id").onDelete("CASCADE");
    });
}