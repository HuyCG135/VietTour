import db from "../../../config/knex.js";

// Trích xuất dữ liệu tour từ DB thành các chunk văn bản (nguồn "tour" cho RAG).
// Muốn index thêm nội dung khác (FAQ, chính sách đặt/huỷ...):
// tạo thêm hàm build chunk rồi thêm vào RAG_SOURCES.

const toVND = (price) => `${Number(price || 0).toLocaleString("vi-VN")}đ`;

const toLocalDate = (value) => {
    if (!value) return "";
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const dd = String(value.getDate()).padStart(2, "0");
        const mm = String(value.getMonth() + 1).padStart(2, "0");
        return `${dd}/${mm}/${value.getFullYear()}`;
    }
    const s = String(value).slice(0, 10);
    const [y, m, d] = s.split("-");
    if (y && m && d && y.length === 4) return `${d}/${m}/${y}`;
    return s;
};

const groupBy = (rows, key) => {
    const map = new Map();
    for (const row of rows) {
        const k = row[key];
        if (!map.has(k)) map.set(k, []);
        map.get(k).push(row);
    }
    return map;
};

async function buildTourChunks() {
    const [tours, itineraries, departures, tourServices, services] = await Promise.all([
        db("tours")
            .select("id", "name", "location", "region", "duration", "price_default", "price_child", "description")
            .orderBy("id"),
        db("tour_itineraries").select("tour_id", "day_number", "description").orderBy(["tour_id", "day_number"]),
        db("tour_departures")
            .select("tour_id", "departure_location", "departure_date", "price_moving", "seats_available", "status")
            .orderBy(["tour_id", "departure_date"]),
        db("tour_services").select("tour_id", "service_id"),
        db("services").select("id", "name").where("status", 1),
    ]);

    const itinByTour = groupBy(itineraries, "tour_id");
    const depByTour = groupBy(departures, "tour_id");
    const serviceNameById = new Map(services.map((s) => [s.id, s.name]));

    const serviceNamesByTour = new Map();
    for (const link of tourServices) {
        const name = serviceNameById.get(link.service_id);
        if (!name) continue;
        if (!serviceNamesByTour.has(link.tour_id)) serviceNamesByTour.set(link.tour_id, []);
        serviceNamesByTour.get(link.tour_id).push(name);
    }

        const chunks = [];

    for (const tour of tours) {
        const meta = { type: "tour", tourId: tour.id, tourName: tour.name };
        const basePriceText = `giá tour người lớn ${toVND(tour.price_default)}, trẻ em ${toVND(tour.price_child)}`;

        // Chunk tổng quan
        const overview = `Tour "${tour.name}" — ${tour.duration}, vùng ${tour.region}, điểm đến ${tour.location}. ` +
            `Giá người lớn ${toVND(tour.price_default)}, trẻ em ${toVND(tour.price_child)}. ` +
            `Mô tả: ${tour.description || ""}`.trim();
        chunks.push({ text: overview, metadata: meta });

        // Chunk từng ngày lịch trình
        for (const day of itinByTour.get(tour.id) || []) {
            chunks.push({
                text: `Tour "${tour.name}" — Ngày ${day.day_number}: ${day.description || ""}`.trim(),
                metadata: meta,
            });
        }

        // Chunk lịch khởi hành (kèm giá tour cơ bản)
        const depList = (depByTour.get(tour.id) || [])
            .filter((d) => d.status !== "closed")
            .map((d) => `ngày ${toLocalDate(d.departure_date)} từ ${d.departure_location} (phụ thu ${toVND(d.price_moving)}, còn ${d.seats_available || 0} chỗ)`)
            .join("; ");
        if (depList) {
            chunks.push({ text: `Tour "${tour.name}" — lịch khởi hành: ${depList}. ${basePriceText}.`, metadata: meta });
        }

        // Chunk dịch vụ (kèm giá tour cơ bản)
        const serviceNames = serviceNamesByTour.get(tour.id) || [];
        if (serviceNames.length > 0) {
            chunks.push({ text: `${basePriceText}. Tour "${tour.name}" bao gồm các dịch vụ: ${serviceNames.join(", ")}.`, metadata: meta });
        }
    }

    return chunks;
}

export const RAG_SOURCES = [
    { name: "tour", build: buildTourChunks },
];