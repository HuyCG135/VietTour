import { useState } from "react";
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, Plus, ArrowUpDown } from "lucide-react";

const columns = ["Name", "Booking Code", "Package", "Duration", "Date", "Price", "Status"];

// Toàn bộ phần Bookings: thanh công cụ + bảng + phân trang
export default function BookingsTable({ rows, meta }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Lọc theo ô tìm kiếm
    const q = search.trim().toLowerCase();
    const filtered = rows.filter((r) =>
        [r.name, r.code, r.package].some((v) => v.toLowerCase().includes(q))
    );

    return (
        <section className="bookings">
            {/* Thanh công cụ */}
            <div className="bookings-toolbar">
                <h3 className="section-title">Bookings</h3>
                <div className="toolbar-actions">
                    <label className="search-box">
                        <Search size={14} color="#9aa5b1" />
                        <input
                            placeholder="Search name, package, etc"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button className="btn-outline">
                        <Calendar size={14} /> Today <ChevronDown size={12} />
                    </button>
                    <button className="btn-primary">
                        <Plus size={14} /> Add Booking
                    </button>
                </div>
            </div>

            <div className="table-card">
                {/* Bảng */}
                <div className="table-wrap">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                {columns.map((c) => (
                                    <th key={c}>
                                        <span className="th-inner">
                                            {c} <ArrowUpDown size={11} color="#9aa5b1" />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.id}>
                                    <td className="cell-strong">{r.name}</td>
                                    <td>{r.code}</td>
                                    <td>{r.package}</td>
                                    <td>{r.duration}</td>
                                    <td>{r.date}</td>
                                    <td>${r.price.toLocaleString("en-US")}</td>
                                    <td>
                                        <span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Chân bảng: Showing + phân trang */}
                <div className="bookings-footer">
                    <div className="showing">
                        <span>Showing</span>
                        <button className="btn-outline btn-small">
                            {meta.pageSize} <ChevronDown size={12} />
                        </button>
                        <span>out of {meta.total}</span>
                    </div>

                    <div className="pagination">
                        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                            <ChevronLeft size={12} /> Previous
                        </button>
                        {[1, 2, 3].map((p) => (
                            <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>
                                {p}
                            </button>
                        ))}
                        <span className="page-dots">...</span>
                        <button
                            className={`page-btn ${page === meta.totalPages ? "active" : ""}`}
                            onClick={() => setPage(meta.totalPages)}
                        >
                            {meta.totalPages}
                        </button>
                        <button className="page-btn" disabled={page === meta.totalPages} onClick={() => setPage(page + 1)}>
                            Next <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
