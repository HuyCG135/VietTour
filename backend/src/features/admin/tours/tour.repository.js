import db from "../../../config/knex.js";

const toNumber = (value) =>
    value === null || value === undefined || value === "" ? 0 : Number(value);

const buildTourData = (tourFields) => ({
    name: tourFields.name,
    slug: tourFields.slug ?? null,
    description: tourFields.description ?? null,
    location: tourFields.location,
    region: tourFields.region,
    duration: tourFields.duration,
    price_default: tourFields.price_default ?? 0,
    price_child: tourFields.price_child ?? 0,
    cover_image: tourFields.cover_image ?? null,
    updated_at: new Date(),
});

const SORT_MAP = {
    newest: ["id", "desc"],
    price_asc: ["price_default", "asc"],
    price_desc: ["price_default", "desc"],
    name_asc: ["name", "asc"],
};

const mapTour = (tour) => ({
    ...tour,
    price_default: toNumber(tour.price_default),
    price_child: toNumber(tour.price_child),
});

class Tour {
    static buildListQuery({ q, region, min_price, max_price }) {
        const query = db("tours");

        if (q) {
            const keyword = `%${q}%`;
            query.where((builder) => {
                builder.where("name", "like", keyword).orWhere("location", "like", keyword);
            });
        }

        if (region) {
            query.where("region", region);
        }

        if (min_price !== undefined && min_price !== null && min_price !== "") {
            const min = Number(min_price);
            if (Number.isFinite(min)) {
                query.where("price_default", ">=", min);
            }
        }

        if (max_price !== undefined && max_price !== null && max_price !== "") {
            const max = Number(max_price);
            if (Number.isFinite(max)) {
                query.where("price_default", "<=", max);
            }
        }

        return query;
    }

    static async list({ q, region, min_price, max_price, sort, page, limit }) {
        const filters = { q, region, min_price, max_price };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 8));

        const [{ total }] = await this.buildListQuery(filters).count({ total: "*" });
        const [orderColumn, orderDir] = SORT_MAP[sort] ?? SORT_MAP.newest;

        const rows = await this.buildListQuery(filters)
            .orderBy(orderColumn, orderDir)
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return { rows: rows.map(mapTour), total, page: pageNum, limit: limitNum };
    }

    static async getFilterOptions() {
        const regions = await db("tours").distinct("region").pluck("region");
        const [priceRange] = await db("tours").min("price_default as min").max("price_default as max");

        return {
            regions: regions.filter(Boolean).sort((a, b) => a.localeCompare(b, "vi")),
            priceRange: { min: Number(priceRange?.min ?? 0), max: Number(priceRange?.max ?? 0) },
        };
    }

    static async getById(id) {
        const tour = await db("tours").where("id", id).first();
        if (!tour) {
            return null;
        }
        return {
            ...tour,
            price_default: toNumber(tour.price_default),
            price_child: toNumber(tour.price_child),
        };
    }

    static async create(tourFields) {
        const data = {
            ...buildTourData(tourFields),
            created_at: new Date(),
        };
        const [tourId] = await db("tours").insert(data);
        return tourId;
    }

    static async update(id, tourFields) {
        const updated = await db("tours").where("id", id).update(buildTourData(tourFields));
        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("tours").where("id", id).del();
        return deleted > 0;
    }
}

export default Tour;