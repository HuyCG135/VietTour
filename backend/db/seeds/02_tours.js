import { makeTour, makeItinerary, makeDeparture } from "../factories.js";
import { SEED_CONFIG } from "../seed-config.js";

export async function seed(knex) {
    const tours = Array.from({ length: SEED_CONFIG.tours }, (_, i) => makeTour(i + 1));
    await knex("tours").insert(tours);

    const tourRows = await knex("tours").select("id", "slug").orderBy("id");
    const slugById = new Map(tourRows.map((r) => [r.slug, r.id]));

    const images = [];
    const itineraries = [];
    const departures = [];
    for (const tour of tours) {
        const id = slugById.get(tour.slug);
        images.push({ tour_id: id, image: null }, { tour_id: id, image: null });
        for (let d = 1; d <= 3; d++) {
            itineraries.push(makeItinerary(id, d));
        }
        const nDepartures = 2 + Math.floor(Math.random() * 3);
        for (let k = 0; k < nDepartures; k++) {
            // offset khác nhau => ngày cách nhau 14 ngày, không trùng uk_tour_date
            departures.push(makeDeparture(id, k));
        }
    }
    await knex("tour_images").insert(images);
    await knex("tour_itineraries").insert(itineraries);
    await knex("tour_departures").insert(departures);
}
