// Helper format dùng riêng cho trang Admin Booking Detail.

export const toNum = (value) => Number(value) || 0;

// Mã booking hiển thị đồng bộ với danh sách: BK-00018.
export const bookingCode = (id) => `BK-${String(id ?? "").padStart(5, "0")}`;

export const formatVnd = (value) => `${toNum(value).toLocaleString("vi-VN")} đ`;

export function formatDate(value) {
    if (!value) return "---";
    const [y, m, d] = String(value).slice(0, 10).split("-");
    if (!y || !m || !d) return "---";
    return `${d}/${m}/${y}`;
}

export function formatDateTime(value) {
    if (!value) return "---";
    const iso = String(value).includes("T") ? value : String(value).replace(" ", "T");
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return formatDate(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatPax(adults, children) {
    const a = toNum(adults);
    const c = toNum(children);
    const parts = [];
    if (a) parts.push(`${a} người lớn`);
    if (c) parts.push(`${c} trẻ em`);
    return parts.join(" · ") || "Chưa có thông tin";
}

// Bảng giá: đơn giá = giá tour + phụ thu lịch khởi hành (giống trang user).
// Nếu tổng các dòng lệch total_price, thêm dòng "Ưu đãi / điều chỉnh" để cộng đúng.
export function buildPriceRows(booking = {}) {
    const adults = toNum(booking.adults);
    const children = toNum(booking.children);
    const unitAdult = toNum(booking.price_default) + toNum(booking.price_moving);
    const unitChild = toNum(booking.price_child) + toNum(booking.price_moving_child);
    const total = toNum(booking.total_price);

    const rows = [];
    if (adults > 0) {
        rows.push({
            key: "adult",
            label: `Người lớn (x${adults})`,
            qty: adults,
            unit: unitAdult,
            amount: unitAdult * adults,
        });
    }
    if (children > 0) {
        rows.push({
            key: "child",
            label: `Trẻ em (x${children})`,
            qty: children,
            unit: unitChild,
            amount: unitChild * children,
        });
    }
    if (rows.length === 0) {
        rows.push({ key: "tour", label: "Giá tour", qty: 1, unit: total, amount: total });
    }

    const lineTotal = rows.reduce((sum, row) => sum + row.amount, 0);
    const adjustment = total - lineTotal;
    if (adjustment !== 0) {
        rows.push({
            key: "adjustment",
            label: "Ưu đãi / điều chỉnh",
            qty: "",
            unit: adjustment,
            amount: adjustment,
            isAdjustment: true,
        });
    }

    return { rows, total };
}
