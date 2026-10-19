import db from "../../../config/knex.js";

// Câu ORDER BY phải bọc hàm tổng hợp vì query có GROUP BY t.id
const SORT_MAP = {
    newest: "MAX(t.id) desc",
    name_asc: "MAX(t.name) asc",
    most_images: "COUNT(ti.id) desc",
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
    id: row.id,
    name: row.name,
    slug: row.slug,
    region: row.region,
    duration: row.duration,
    location: row.location,
    cover_image: row.cover_image,
    image_count: Number(row.image_count ?? 0),
});

const mapImage = (row) => ({
    id: row.id,
    image: row.image,
});

class TourImage {
    /** Danh sách tour kèm số lượng ảnh (dùng cho trang quản lý ảnh) */
    static async listTours({ q, region, sort, page, limit }) {
        const filters = { q, region };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 8));
        const orderBy = SORT_MAP[sort] ?? SORT_MAP.newest;

        const [{ total }] = await applyFilters(db("tours as t"), filters).count({ total: "*" });

        const rows = await applyFilters(
            db("tours as t")
                .leftJoin("tour_images as ti", "ti.tour_id", "t.id")
                .select(
                    "t.id", "t.name", "t.slug", "t.region",
                    "t.duration", "t.location", "t.cover_image",
                )
                .count({ image_count: "ti.id" })
                .groupBy("t.id")
                .orderByRaw(orderBy),
            filters,
        )
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        return { rows: rows.map(mapTour), total, page: pageNum, limit: limitNum };
    }

    /** Thông tin tour + toàn bộ ảnh của tour */
    static async getTourDetail(tourId) {
        const tour = await db("tours")
            .select("id", "name", "slug", "region", "duration", "location", "cover_image")
            .where("id", tourId)
            .first();

        if (!tour) return null;

        const images = await this.getByTour(tourId);
        return { ...tour, images };
    }

    static async getByTour(tourId) {
        const rows = await db("tour_images")
            .select("id", "image")
            .where("tour_id", tourId)
            .orderBy("id", "asc");
        return rows.map(mapImage);
    }

    static async getById(imageId) {
        const row = await db("tour_images").where("id", imageId).first();
        return row ? mapImage(row) : null;
    }

    /** Lấy 1 ảnh kèm điều kiện thuộc tour (chống xóa nhầm ảnh của tour khác) */
    static async getByTourAndId(tourId, imageId) {
        const row = await db("tour_images")
            .where("id", imageId)
            .andWhere("tour_id", tourId)
            .first();
        return row ? mapImage(row) : null;
    }

    /** Thêm nhiều ảnh cho 1 tour, trả về các row đã tạo */
    static async createMany(tourId, images) {
        if (images.length === 0) return [];

        const inserted = await db("tour_images")
            .insert(images.map((url) => ({ tour_id: tourId, image: url })));

        // mysql2 trả về insertId (số đầu tiên) + affectedRows
        const firstId = Array.isArray(inserted) ? inserted[0] : inserted;
        const count = Array.isArray(inserted) ? inserted.length : 1;

        return images.map((url, index) => ({
            id: Number(firstId) + index,
            image: url,
        }));
    }

    static async delete(imageId) {
        const deleted = await db("tour_images").where("id", imageId).del();
        return deleted > 0;
    }
}

export default TourImage;
