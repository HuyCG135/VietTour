export function formatDate(value) {
    if (!value) return "";
    const [y, m, d] = String(value).slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

export function formatDateTime(value) {
    if (!value) return "";
    const iso = String(value).includes("T") ? value : String(value).replace(" ", "T");
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return formatDate(value);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatPax(adults, children) {
    const a = Number(adults) || 0;
    const c = Number(children) || 0;
    const parts = [];
    if (a) parts.push(`${a} người lớn`);
    if (c) parts.push(`${c} trẻ em`);
    return parts.join(" · ") || "1 người lớn";
}