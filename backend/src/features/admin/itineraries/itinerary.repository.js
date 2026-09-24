import db from "../../../config/knex.js";

const SORT_MAP = {
    newest: ["id", "desc"],
    name_asc: ["name", "asc"],
};

const applyFilters = (query, { q, id_tour, region }) => {
    if (q) {
        const keyword = `%${q}%`;
        const idMatch = Number(q);
        query.where((builder) => {
            builder.where("t.name", "like", keyword);
            if (Number.isInteger(idMatch) && idMatch > 0) {
                builder.orWhere("t.id", idMatch);
            }
        });
    }

    if (id_tour !== undefined && id_tour !== null && id_tour !== "") {
        const id = Number(id_tour);
        if (Number.isFinite(id)) {
            query.where("t.id", id);
        }
    }

    if (region) {
        query.where("t.region", region);
    }

    return query;
};

const mapTour = (row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    region: row.region,
    duration: row.duration,
    location: row.location,
    cover_image: row.cover_image,
    itinerary_days: Number(row.itinerary_days ?? 0),
});

class Itinerary {
    static async listTours({ q, id_tour, region, sort, page, limit }) {
        const filters = { q, id_tour, region };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 8));
        const [orderColumn, orderDir] = SORT_MAP[sort] ?? SORT_MAP.newest;

        const [{ total }] = await applyFilters(db("tours as t"), filters).count({ total: "*" });

        const rows = await applyFilters(
            db("tours as t")
                .leftJoin("tour_itineraries as ti", "ti.tour_id", "t.id")
                .select(
                    "t.id",
                    "t.name",
                    "t.slug",
                    "t.region",
                    "t.duration",
                    "t.location",
                    "t.cover_image",
                )
                .count({ itinerary_days: "ti.id" })
                .groupBy("t.id"),
            filters,
        )
            .orderBy(`t.${orderColumn}`, orderDir)
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return {
            rows: rows.map(mapTour),
            total: total,
            page: pageNum,
            limit: limitNum,
        };
    }

    static async getDetail(tourId) {
        const tour = await db("tours").where("id", tourId).first();
        if (!tour) {
            return null;
        }

        const itineraries = await db("tour_itineraries")
            .where("tour_id", tourId)
            .orderBy("day_number", "asc");

        return {
            ...tour,
            itineraries: itineraries.map((item) => ({
                day_number: item.day_number,
                description: item.description,
            })),
        };
    }

    static async replaceItineraries(tourId, itineraries) {
        await db.transaction(async (trx) => {
            await trx("tour_itineraries").where("tour_id", tourId).del();

            if (itineraries.length > 0) {
                await trx("tour_itineraries").insert(
                    itineraries.map((item) => ({
                        tour_id: tourId,
                        day_number: item.day_number,
                        description: item.description,
                    })),
                );
            }
        });
    }
}

export default Itinerary;