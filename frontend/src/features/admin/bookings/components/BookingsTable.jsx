import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Calendar, ChevronDown, ChevronLeft, ChevronRight, Plus, ArrowUpDown } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";
import { getBookings } from "../bookings.api";

const columns = ["Name", "Booking Code", "Package", "Duration", "Date", "Price", "Status"];
const PAGE_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 350;

const priceFormatter = new Intl.NumberFormat("vi-VN");

// Dãy số trang: luôn có trang đầu/cuối + trang hiện tại và 2 trang kề.
const buildPageNumbers = (currentPage, totalPages) => {
    if (totalPages <= 0) return [];

    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);

    const sorted = [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
    const result = [];

    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) {
            result.push("dots");
        }
        result.push(page);
    });

    return result;
};

// Toàn bộ phần Bookings: thanh công cụ + bảng + phân trang.
// Search và phân trang chạy phía server qua /api/admin/bookings.
export default function BookingsTable() {
    const toast = useToast();
    const requestSeq = useRef(0);
    const skipFirstSearch = useRef(true);

    const [search, setSearch] = useState("");
    const [rows, setRows] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
        total: 0,
        limit: PAGE_LIMIT,
    });
    const [loading, setLoading] = useState(true);

    const runFetch = useCallback(
        async (keyword, targetPage) => {
            const seq = ++requestSeq.current;
            setLoading(true);

            try {
                const res = await getBookings({
                    search: keyword,
                    page: targetPage,
                    limit: PAGE_LIMIT,
                });

                if (seq !== requestSeq.current) return;
                if (!res?.success) {
                    throw new Error(res?.message || "Không thể tải danh sách booking.");
                }

                setRows(res.data ?? []);
                setPagination(
                    res.pagination ?? {
                        currentPage: 1,
                        totalPages: 0,
                        total: 0,
                        limit: PAGE_LIMIT,
                    },
                );
            } catch (error) {
                if (seq === requestSeq.current) {
                    toast.error(error.message);
                }
            } finally {
                if (seq === requestSeq.current) setLoading(false);
            }
        },
        [toast],
    );

    // Lần đầu mở trang: tải trang 1, không lọc.
    useEffect(() => {
        runFetch("", 1);
    }, [runFetch]);

    // Gõ tìm kiếm: debounce rồi quay về trang 1.
    useEffect(() => {
        if (skipFirstSearch.current) {
            skipFirstSearch.current = false;
            return undefined;
        }

        const timer = setTimeout(() => {
            runFetch(search.trim(), 1);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [search, runFetch]);

    const goToPage = (targetPage) => {
        if (
            targetPage < 1 ||
            targetPage > pagination.totalPages ||
            targetPage === pagination.currentPage ||
            loading
        ) {
            return;
        }
        runFetch(search.trim(), targetPage);
    };

    const pageNumbers = buildPageNumbers(pagination.currentPage, pagination.totalPages);
    const from = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.limit + 1;
    const to = Math.min(pagination.currentPage * pagination.limit, pagination.total);

    return (
        <section className="bookings">
            {/* Thanh công cụ */}
            <div className="bookings-toolbar">
                <h3 className="section-title">Bookings</h3>
                <div className="toolbar-actions">
                    <label className="search-box">
                        <Search size={14} color="#9aa5b1" />
                        <input
                            placeholder="Tìm theo tên, mã, tour..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>
                    <button type="button" className="btn-outline">
                        <Calendar size={14} /> Today <ChevronDown size={12} />
                    </button>
                    <button type="button" className="btn-primary">
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
                                {columns.map((column) => (
                                    <th key={column}>
                                        <span className="th-inner">
                                            {column} <ArrowUpDown size={11} color="#9aa5b1" />
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="table-state">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="table-state">
                                        Không tìm thấy booking nào.
                                    </td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="cell-strong">{row.name}</td>
                                        <td>{row.code}</td>
                                        <td>{row.package}</td>
                                        <td>{row.duration}</td>
                                        <td>{row.date}</td>
                                        <td>{priceFormatter.format(row.price)} đ</td>
                                        <td>
                                            <span className={`status-badge status-${row.status.toLowerCase()}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Chân bảng: Showing + phân trang */}
                <div className="bookings-footer">
                    <div className="showing">
                        <span>Showing</span>
                        <button type="button" className="btn-outline btn-small">
                            {pagination.limit} <ChevronDown size={12} />
                        </button>
                        <span>
                            out of {pagination.total} ({from}-{to})
                        </span>
                    </div>

                    <div className="pagination">
                        <button
                            type="button"
                            className="page-btn"
                            disabled={pagination.currentPage === 1 || loading}
                            onClick={() => goToPage(pagination.currentPage - 1)}
                        >
                            <ChevronLeft size={12} /> Previous
                        </button>

                        {pageNumbers.map((page, index) =>
                            page === "dots" ? (
                                <span key={`dots-${index}`} className="page-dots">
                                    ...
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    key={page}
                                    className={`page-btn ${page === pagination.currentPage ? "active" : ""}`}
                                    disabled={loading}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ),
                        )}

                        <button
                            type="button"
                            className="page-btn"
                            disabled={
                                loading ||
                                pagination.totalPages === 0 ||
                                pagination.currentPage === pagination.totalPages
                            }
                            onClick={() => goToPage(pagination.currentPage + 1)}
                        >
                            Next <ChevronRight size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
