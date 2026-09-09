import db from "../../config/knex.js";

class Tour {
    static SORT_MAP = {
        price_asc: ["price_default", "asc"],
        price_desc: ["price_default", "desc"],
    };

    static buildListQuery({ q, region, min_price, max_price, duration, services }) {
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

        return base;
    }

    static async getAll() {
        return db("tours").orderBy("id", "desc");
    }

    static async list({ q, region, min_price, max_price, duration, services, sort, page, limit }) {
        const countQuery = this.buildListQuery({ q, region, min_price, max_price, duration, services });
        const dataQuery = this.buildListQuery({ q, region, min_price, max_price, duration, services });

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

    static async getFilterOptions() {
        const regions = await db("tours").distinct("region").pluck("region");
        const [priceRange] = await db("tours")
            .min("price_default as min")
            .max("price_default as max");
        const services = await db("services").select("id", "name").orderBy("id", "asc");

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
}

export default Tour;
