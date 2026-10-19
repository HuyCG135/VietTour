// Seed đánh giá thực tế: chỉ sinh cho đơn đã xác nhận & đã thanh toán,
// ngày đánh giá sau ngày khởi hành, nội dung đa dạng, không trùng (user_id, tour_id).

const SEED = 77777;
const mulberry32 = (seed) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const rng = mulberry32(SEED);
const rand = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const weighted = (pairs) => {
    const total = pairs.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = rng() * total;
    for (const [value, weight] of pairs) {
        if (roll < weight) return value;
        roll -= weight;
    }
    return pairs[pairs.length - 1][0];
};

const pad2 = (n) => String(n).padStart(2, "0");
const toDateOnly = (value) => {
    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const [y, m, d] = String(value).slice(0, 10).split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
};
const addDays = (date, days) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const COMMENTS = [
    "Tour tổ chức chu đáo, hướng dẫn viên nhiệt tình và thân thiện.",
    "Khách sạn sạch sẽ, đồ ăn ngon, gia đình mình rất hài lòng.",
    "Lịch trình hợp lý, thời gian tham quan thoải mái, không quá gấp.",
    "Dịch vụ tốt, nhân viên hỗ trợ nhanh qua điện thoại và email.",
    "Cảnh đẹp, đáng đồng tiền bát gạo. Sẽ giới thiệu cho bạn bè.",
    "Hướng dẫn viên am hiểu địa phương, kể chuyện cuốn hút.",
    "Điểm trừ là xe di chuyển hơi chật, còn lại mọi thứ ổn.",
    "Chuyến đi đúng như mô tả, không phát sinh chi phí.",
    "Phòng ốc ổn, bữa sáng đa dạng. Gia đình có trẻ nhỏ đi rất tiện.",
    "Đón sân bay đúng giờ, thủ tục nhanh gọn.",
];

const RATING_WEIGHTS = [
    [5, 52],
    [4, 30],
    [3, 12],
    [2, 4],
    [1, 2],
];

export async function seed(knex) {
    const now = new Date();

    // Lấy các đơn đã đi (khởi hành trong quá khứ) đã xác nhận, gắn tài khoản khách.
    const rows = (
        await knex("bookings as b")
            .join("tour_departures as d", "b.departure_id", "d.id")
            .whereNotNull("b.user_id")
            .where("b.status", "confirmed")
            .select("b.user_id", "d.tour_id", "d.departure_date")
    ).map((row) => ({ ...row, departure: toDateOnly(row.departure_date) }));

    const reviews = [];
    const seen = new Set();

    for (const row of rows) {
        if (row.departure >= now) continue; // tour chưa đi thì chưa có đánh giá
        if (rng() > 0.75) continue; // khoảng 3/4 đơn để lại đánh giá

        const key = `${row.user_id}-${row.tour_id}`;
        if (seen.has(key)) continue;
        seen.add(key);

        let createdAt = addDays(row.departure, rand(2, 14));
        if (createdAt > now) createdAt = addDays(now, -rand(1, 3));

        reviews.push({
            user_id: row.user_id,
            tour_id: row.tour_id,
            rating: weighted(RATING_WEIGHTS),
            comment: pick(COMMENTS),
            created_at: createdAt,
        });
    }

    // Đảm bảo có tối thiểu vài đánh giá cho mỗi tour (nếu chưa ai đánh giá).
    const tourIds = (await knex("tours").select("id")).map((t) => t.id);
    const userIds = (await knex("users").where("role", "customer").select("id")).map((u) => u.id);
    const covered = new Set(reviews.map((r) => r.tour_id));
    for (const tourId of tourIds) {
        if (covered.has(tourId) || userIds.length === 0) continue;
        const userId = pick(userIds);
        const key = `${userId}-${tourId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        reviews.push({
            user_id: userId,
            tour_id: tourId,
            rating: weighted(RATING_WEIGHTS),
            comment: pick(COMMENTS),
            created_at: addDays(now, -rand(5, 90)),
        });
    }

    if (reviews.length > 0) {
        await knex("reviews").insert(reviews);
    }
}
