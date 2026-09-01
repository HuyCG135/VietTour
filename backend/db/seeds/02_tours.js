import { TOUR_SEED } from "../seed-data/tours.js";

export async function seed(knex) {
    const tours = TOUR_SEED.map((t) => ({
        name: t.name,
        slug: t.slug,
        description: t.description,
        location: t.location,
        region: t.region,
        duration: t.duration,
        price_default: t.price_default,
        price_child: t.price_child,
        cover_image: t.cover_image,
        created_at: new Date(),
        updated_at: new Date(),
    }));
    await knex("tours").insert(tours);

    const rows = await knex("tours").select("id", "slug").orderBy("id");
    const slugById = new Map(rows.map((r) => [r.slug, r.id]));

    const images = [];
    const itineraries = [];
    const departures = [];
    for (const t of TOUR_SEED) {
        const id = slugById.get(t.slug);
        for (const image of t.images || []) {
            images.push({ tour_id: id, image });
        }
        for (const it of t.itineraries || []) {
            itineraries.push({ tour_id: id, day_number: it.day, description: it.description });
        }
        for (const d of t.departures || []) {
            departures.push({
                tour_id: id,
                departure_location: d.departure_location,
                departure_date: d.departure_date,
                price_moving: d.price_moving,
                price_moving_child: d.price_moving_child,
                seats_total: d.seats_total,
                seats_available: d.seats_available,
                status: d.status,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
    }
    await knex("tour_images").insert(images);
    await knex("tour_itineraries").insert(itineraries);
    await knex("tour_departures").insert(departures);
}
