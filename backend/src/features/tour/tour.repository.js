import db from "../../config/knex.js";

class Tour {
    static SORT_MAP = {
        price_asc: ["price_default", "asc"],
        price_desc: ["price_default", "desc"],
    };

    static buildListQuery({ q, region, min_price, max_price, duration, services, departure_date }) {
        const base = db("tours");

        if (q) {
            base.where((builder) => {
                builder.where("name", "like", `%${q}%`).orWhere("description", "like", `%${q}%`);
            });
        }
        if (region) {
            base.where("region", region);
        }
        if (min_price !== undefined && min_price !== null && min_price !== "") {
            base.where("price_default", ">=", Number(min_price));
        }
        if (max_price !== undefined && max_price !== null && max_price !== "") {
            base.where("price_default", "<=", Number(max_price));
        }
        if (duration === "short" || duration === "long") {
            const days = duration === "short"
                ? [1, 2, 3]
                : [4, 5, 6, 7, 8, 9, 10];
            base.where((builder) => {
                days.forEach((d, index) => {
                    const whereFn = index === 0 ? "whereRaw" : "orWhereRaw";
                    builder[whereFn]("CAST(SUBSTRING_INDEX(duration, ' ', 1) AS UNSIGNED) = ?", [d]);
                });
            });
        }
        if (Array.isArray(services) && services.length > 0) {
            base.whereIn(
                "tours.id",
                db("tour_services").select("tour_id").whereIn("service_id", services),
            );
        }
        if (departure_date) {
            base.whereIn(
                "tours.id",
                db("tour_departures").select("tour_id")
                    .where("departure_date", departure_date)
                    .andWhere("status", "open"),
            );
        }

        return base;
    }

    static async getAll() {
        return db("tours").orderBy("id", "desc");
    }

    static async list({ q, region, min_price, max_price, duration, services, sort, page, limit, departure_date }) {
        const countQuery = this.buildListQuery({ q, region, min_price, max_price, duration, services, departure_date });
        const dataQuery = this.buildListQuery({ q, region, min_price, max_price, duration, services, departure_date });

        const [{ total }] = await countQuery.count({ total: "*" });
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));

        const [orderColumn, orderDir] = Tour.SORT_MAP[sort] ?? ["id", "desc"];

        const rows = await dataQuery
            .orderBy(orderColumn, orderDir)
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return {
            rows,
            total,
            page: pageNum,
            limit: limitNum,
        };
    }

    static async getCalendar({ from, to, q, region, min_price, max_price, duration, services }) {
        const filtered = this.buildListQuery({ q, region, min_price, max_price, duration, services });

        const rows = await filtered
            .join("tour_departures", "tours.id", "tour_departures.tour_id")
            .where("tour_departures.status", "open")
            .whereBetween("tour_departures.departure_date", [from, to])
            .groupBy("tour_departures.departure_date")
            .orderBy("tour_departures.departure_date", "asc")
            .select("tour_departures.departure_date")
            .countDistinct({ count: "tours.id" });

        return rows.map((row) => {
            const date = new Date(row.departure_date);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return {
                date: `${y}-${m}-${d}`,
                count: Number(row.count),
            };
        });
    }

    static async getFilterOptions() {
        const regions = await db("tours").distinct("region").pluck("region");
        const [priceRange] = await db("tours")
            .min("price_default as min")
            .max("price_default as max");
        const services = await db("services").select("id", "name", "icon").orderBy("id", "asc");

        return {
            regions: regions.filter(Boolean).sort((a, b) => a.localeCompare(b, "vi")),
            priceRange: {
                min: Number(priceRange?.min ?? 0),
                max: Number(priceRange?.max ?? 0),
            },
            services,
        };
    }

    static async getByRegion(region) {
        return db("tours").where("region", region).orderBy("id", "desc");
    }

    static async getById(id) {
        return db("tours").where("id", id).first();
    }

    static async getDetailById(id) {
        const toLocalDate = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            return `${y}-${m}-${d}`;
        };
        const toLocalDay = (value) => {
            const date = value instanceof Date ? value : new Date(value);
            if (Number.isNaN(date.getTime())) return "";
            const d = String(date.getDate()).padStart(2, "0");
            const m = String(date.getMonth() + 1).padStart(2, "0");
            return `${d}/${m}/${date.getFullYear()}`;
        };

        const [tour, images, itineraries, departures, services, reviews] = await Promise.all([
            db("tours").where("id", id).first(),
            db("tour_images").select("image").where("tour_id", id).orderBy("id", "asc"),
            db("tour_itineraries")
                .select("day_number as day", "description")
                .where("tour_id", id)
                .orderBy("day_number", "asc"),
            db("tour_departures")
                .where("tour_id", id)
                .andWhere("status", "open")
                .andWhere("departure_date", ">=", toLocalDate(new Date()))
                .orderBy("departure_date", "asc"),
            db("services as s")
                .innerJoin("tour_services as ts", "ts.service_id", "s.id")
                .select("s.id", "s.name", "s.icon")
                .where("ts.tour_id", id)
                .orderBy("s.id", "asc"),
            db("reviews as r")
                .innerJoin("users as u", "u.id", "r.user_id")
                .select("r.id", "u.fullname as user_name", "r.rating", "r.comment", "r.created_at")
                .where("r.tour_id", id)
                .orderBy("r.created_at", "desc"),
        ]);

        if (!tour) {
            return null;
        }

        const imageList = images.map((row) => row.image).filter(Boolean);
        if (imageList.length === 0 && tour.cover_image) {
            imageList.push(tour.cover_image);
        }

        const count = reviews.length;
        const avg =
            count > 0
                ? Math.round((reviews.reduce((sum, row) => sum + Number(row.rating), 0) / count) * 10) / 10
                : 0;

        return {
            ...tour,
            price_default: Number(tour.price_default),
            price_child: Number(tour.price_child),
            images: imageList,
            itineraries: itineraries.map((row) => ({ day: Number(row.day), description: row.description })),
            departures: departures.map((row) => ({
                id: row.id,
                departure_location: row.departure_location,
                departure_date: toLocalDate(row.departure_date),
                price_moving: Number(row.price_moving),
                price_moving_child: Number(row.price_moving_child),
                seats_total: Number(row.seats_total),
                seats_available: Number(row.seats_available),
                status: row.status,
            })),
            services,
            reviews: reviews.map((row) => ({
                id: row.id,
                user_name: row.user_name,
                avatar: null,
                rating: Number(row.rating),
                comment: row.comment,
                created_at: toLocalDay(row.created_at),
            })),
            avg_rating: avg,
            review_count: count,
            is_available: departures.length > 0,
        };
    }
}

export default Tour;
