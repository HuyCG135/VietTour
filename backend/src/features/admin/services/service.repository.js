import db from "../../../config/knex.js";

const SORT_MAP = {
    newest: ["id", "desc"],
    name_asc: ["name", "asc"],
    name_desc: ["name", "desc"],
    updated_desc: ["updated_at", "desc"],
};

const mapService = (service) => ({
    ...service,
    status: Number(service.status),
});

const buildServiceData = (fields, current = {}) => ({
    name: fields.name,
    slug: fields.slug ?? current.slug ?? null,
    description: fields.description ?? current.description ?? null,
    icon: fields.icon ?? current.icon ?? null,
    status: fields.status === undefined ? Number(current.status ?? 1) : Number(fields.status),
    updated_at: new Date(),
});

class ServiceRepository {
    static buildListQuery({ q, status }) {
        const query = db("services");

        if (q) {
            const keyword = `%${q}%`;
            query.where((builder) => {
                builder
                    .where("name", "like", keyword)
                    .orWhere("slug", "like", keyword)
                    .orWhere("description", "like", keyword);
            });
        }

        if (status === "0" || status === "1" || status === 0 || status === 1) {
            query.where("status", Number(status));
        }

        return query;
    }

    static async list({ q, status, sort, page, limit }) {
        const filters = { q, status };
        const countQuery = this.buildListQuery(filters);
        const dataQuery = this.buildListQuery(filters);
        const [{ total }] = await countQuery.count({ total: "*" });
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
        const [orderColumn, orderDir] = SORT_MAP[sort] ?? SORT_MAP.newest;

        const rows = await dataQuery
            .orderBy(orderColumn, orderDir)
            .orderBy("id", "desc")
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return {
            rows: rows.map(mapService),
            total: Number(total),
            page: pageNum,
            limit: limitNum,
        };
    }

    static async getById(id) {
        const service = await db("services").where("id", id).first();
        return service ? mapService(service) : null;
    }

    static async findBySlug(slug, excludeId = null) {
        if (!slug) return null;

        const query = db("services").where("slug", slug);
        if (excludeId) query.whereNot("id", excludeId);
        return query.first();
    }

    static async create(fields) {
        const data = {
            ...buildServiceData(fields),
            created_at: new Date(),
        };
        const [serviceId] = await db("services").insert(data);
        return serviceId;
    }

    static async update(id, fields) {
        const updated = await db("services").where("id", id).update(buildServiceData(fields));
        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("services").where("id", id).del();
        return deleted > 0;
    }
}

export default ServiceRepository;
