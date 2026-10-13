import db from "../../../config/knex.js";

const SORT_MAP = {
    newest: ["id", "desc"],
    name_asc: ["name", "asc"],
    name_desc: ["name", "desc"],
};

const applyFilters = (query, { q, region }) => {
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

    if (region) {
        query.where("t.region", region);
    }

    return query;
};

const mapTour = (row) => ({
    id: Number(row.id),
    name: row.name,
    slug: row.slug,
    region: row.region,
    duration: row.duration,
    location: row.location,
    cover_image: row.cover_image,
    service_count: Number(row.service_count ?? 0),
});

class TourService {
    static async listTours({ q, region, sort, page, limit }) {
        const filters = { q, region };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 8));
        const [orderColumn, orderDir] = SORT_MAP[sort] ?? SORT_MAP.newest;

        const [{ total }] = await applyFilters(db("tours as t"), filters).count({ total: "*" });
        const rows = await applyFilters(
            db("tours as t")
                .leftJoin("tour_services as ts", "ts.tour_id", "t.id")
                .select(
                    "t.id",
                    "t.name",
                    "t.slug",
                    "t.region",
                    "t.duration",
                    "t.location",
                    "t.cover_image",
                )
                .count({ service_count: "ts.id" })
                .groupBy(
                    "t.id",
                    "t.name",
                    "t.slug",
                    "t.region",
                    "t.duration",
                    "t.location",
                    "t.cover_image",
                ),
            filters,
        )
            .orderBy(`t.${orderColumn}`, orderDir)
            .orderBy("t.id", "desc")
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return {
            rows: rows.map(mapTour),
            total: Number(total),
            page: pageNum,
            limit: limitNum,
        };
    }

    static async getDetail(tourId) {
        const tour = await db("tours").where("id", tourId).first();
        if (!tour) {
            return null;
        }

        const [services, assignedRows] = await Promise.all([
            db("services")
                .select("id", "name", "description", "icon", "status")
                .orderBy("name", "asc"),
            db("tour_services as ts")
                .innerJoin("services as s", "s.id", "ts.service_id")
                .select("s.id")
                .where("ts.tour_id", tourId),
        ]);

        const assignedIds = new Set(assignedRows.map((row) => Number(row.id)));
        return {
            ...tour,
            service_count: assignedIds.size,
            services: services.map((service) => ({
                ...service,
                id: Number(service.id),
                status: Number(service.status),
                selected: assignedIds.has(Number(service.id)),
            })),
        };
    }

    static async getExistingServices(ids) {
        if (ids.length === 0) {
            return [];
        }

        const services = await db("services").select("id", "status").whereIn("id", ids);
        return services.map((service) => ({
            id: Number(service.id),
            status: Number(service.status),
        }));
    }

    static async replaceServices(tourId, serviceIds) {
        await db.transaction(async (trx) => {
            await trx("tour_services").where("tour_id", tourId).del();

            if (serviceIds.length > 0) {
                await trx("tour_services").insert(
                    serviceIds.map((serviceId) => ({
                        tour_id: tourId,
                        service_id: serviceId,
                    })),
                );
            }
        });
    }
}

export default TourService;
