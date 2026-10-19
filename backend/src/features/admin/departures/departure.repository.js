import db from "../../../config/knex.js";

// Sắp xếp cho phép. Mặc định: ngày khởi hành tăng dần.
const SORT_MAP = {
    date_asc: ["departure_date", "asc"],
    date_desc: ["departure_date", "desc"],
    newest: ["id", "desc"],
};

const toNumber = (value) =>
    value === null || value === undefined || value === "" ? 0 : Number(value);

// Date -> "yyyy-mm-dd" theo giờ địa phương (tránh lệch ngày do UTC).
const toLocalDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

// Trạng thái suy diễn — một nguồn sự thật, KHÔNG ghi "full" xuống DB.
// Thứ tự: đã qua ngày -> cờ closed thủ công -> hết chỗ -> mở.
const deriveStatus = (row, today) => {
    const date = toLocalDate(row.departure_date);
    if (date && date < today) return "closed";
    if (row.status === "closed") return "closed";
    if (toNumber(row.seats_available) <= 0) return "full";
    return "open";
};

const mapRow = (row, today) => ({
    id: row.id,
    tour_id: row.tour_id,
    tour_name: row.tour_name, // chỉ có khi join bảng tours
    departure_location: row.departure_location,
    departure_date: toLocalDate(row.departure_date),
    price_moving: toNumber(row.price_moving),
    price_moving_child: toNumber(row.price_moving_child),
    seats_total: toNumber(row.seats_total),
    seats_available: toNumber(row.seats_available),
    status: deriveStatus(row, today), // trạng thái hiển thị cho client
    is_closed: row.status === "closed", // cờ thủ công (dùng cho form sửa)
    created_at: row.created_at,
    updated_at: row.updated_at,
});

class Departure {
    static buildListQuery({ q, tour_id, status, from, to }) {
        const query = db("tour_departures as d").leftJoin("tours as t", "d.tour_id", "t.id");

        if (q) {
            query.where("d.departure_location", "like", `%${q}%`);
        }
        if (tour_id !== undefined && tour_id !== null && tour_id !== "") {
            query.where("d.tour_id", Number(tour_id));
        }
        if (from) {
            query.where("d.departure_date", ">=", from);
        }
        if (to) {
            query.where("d.departure_date", "<=", to);
        }
        // Lọc theo cờ thủ công trong DB (open/closed). Trạng thái suy diễn (full)
        // được client tự tính từ seats_available.
        if (status === "open" || status === "closed") {
            query.where("d.status", status);
        }

        return query;
    }

    static async list({ q, tour_id, status, from, to, sort, page, limit }) {
        const filters = { q, tour_id, status, from, to };
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

        const [{ total }] = await this.buildListQuery(filters).count({ total: "d.id" });
        const [orderColumn, orderDir] = SORT_MAP[sort] ?? SORT_MAP.date_asc;

        const rows = await this.buildListQuery(filters)
            .select("d.*", "t.name as tour_name")
            .orderBy(`d.${orderColumn}`, orderDir)
            .orderBy("d.id", "asc")
            .limit(limitNum)
            .offset((pageNum - 1) * limitNum);

        const today = toLocalDate(new Date());

        return {
            rows: rows.map((row) => mapRow(row, today)),
            total: Number(total),
            page: pageNum,
            limit: limitNum,
        };
    }

    static async getById(id) {
        const row = await db("tour_departures as d")
            .leftJoin("tours as t", "d.tour_id", "t.id")
            .select("d.*", "t.name as tour_name")
            .where("d.id", id)
            .first();

        return row ? mapRow(row, toLocalDate(new Date())) : null;
    }

    // Kiểm tra trùng (tour_id, departure_date, departure_location) —
    // bỏ qua chính nó khi sửa (excludeId).
    static async findByTourDateLocation(tourId, departureDate, departureLocation, excludeId = null) {
        const query = db("tour_departures")
            .where("tour_id", tourId)
            .where("departure_date", departureDate)
            .where("departure_location", departureLocation);

        if (excludeId) {
            query.whereNot("id", excludeId);
        }

        return query.first();
    }

    static async create(fields) {
        const now = new Date();
        const [id] = await db("tour_departures").insert({
            tour_id: fields.tour_id,
            departure_location: fields.departure_location,
            departure_date: fields.departure_date,
            price_moving: fields.price_moving ?? 0,
            price_moving_child: fields.price_moving_child ?? 0,
            seats_total: fields.seats_total,
            seats_available: fields.seats_available ?? fields.seats_total,
            status: fields.status === "closed" ? "closed" : "open",
            created_at: now,
            updated_at: now,
        });

        return id;
    }

    // Cập nhật một phần: chỉ ghi các field được truyền.
    static async update(id, fields) {
        const data = { updated_at: new Date() };

        if (fields.departure_location !== undefined) data.departure_location = fields.departure_location;
        if (fields.departure_date !== undefined) data.departure_date = fields.departure_date;
        if (fields.price_moving !== undefined) data.price_moving = fields.price_moving;
        if (fields.price_moving_child !== undefined) data.price_moving_child = fields.price_moving_child;
        if (fields.seats_total !== undefined) data.seats_total = fields.seats_total;
        if (fields.seats_available !== undefined) data.seats_available = fields.seats_available;
        if (fields.status !== undefined) data.status = fields.status === "closed" ? "closed" : "open";

        const updated = await db("tour_departures").where("id", id).update(data);
        return updated > 0;
    }

    static async updateStatus(id, status) {
        const updated = await db("tour_departures").where("id", id).update({
            status: status === "closed" ? "closed" : "open",
            updated_at: new Date(),
        });

        return updated > 0;
    }

    static async delete(id) {
        const deleted = await db("tour_departures").where("id", id).del();
        return deleted > 0;
    }

    // Đếm booking gắn với chuyến — để chặn xóa (FK bookings.departure_id RESTRICT).
    static async countBookings(departureId) {
        const [{ total }] = await db("bookings").where("departure_id", departureId).count({ total: "id" });
        return Number(total);
    }

    // Danh sách tour gọn cho dropdown chọn tour.
    static async listToursForSelect() {
        return db("tours")
            .select("id", "name", "region", "duration")
            .orderBy("region", "asc")
            .orderBy("name", "asc");
    }

    // Kiểm tra tour tồn tại (dùng trong service trước khi tạo chuyến).
    static async getTourById(tourId) {
        return db("tours").where("id", tourId).first();
    }
}

export default Departure;
