import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";
import { createStaff, deleteUser, getUsers, updateUser } from "./users.api";
import { buildSearchFilters } from "./userUtils";
import UserSearchBar from "./UserSearchBar";
import UsersTable from "./UsersTable";
import Pagination from "./Pagination";
import CreateStaffModal from "./CreateStaffModal";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const PAGE_LIMIT = 10;

// Gắn mảng lỗi validate (nếu có) vào Error để modal hiển thị danh sách.
const toError = (res, fallback) => {
    const error = new Error(res?.message || fallback);
    if (Array.isArray(res?.errors)) error.messages = res.errors;
    return error;
};

export default function UserList() {
    const navigate = useNavigate();
    const toast = useToast();
    const requestSeq = useRef(0);

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 0, total: 0, limit: PAGE_LIMIT });
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [activeFilters, setActiveFilters] = useState({});

    // Trạng thái modal (component chỉ mount khi mở → state luôn mới).
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const sessionExpired = useCallback(() => {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
        navigate("/login");
    }, [toast, navigate]);

    // Fetch danh sách theo filter + trang. requestSeq bỏ qua phản hồi của
    // request cũ khi user gõ/search/đổi trang liên tục.
    const runFetch = useCallback(
        async (filters, targetPage) => {
            const seq = ++requestSeq.current;
            setLoading(true);
            try {
                const res = await getUsers({ ...filters, page: targetPage, limit: PAGE_LIMIT });
                if (seq !== requestSeq.current) return;
                if (res?.httpStatus === 401) {
                    sessionExpired();
                    return;
                }
                if (!res?.success) throw toError(res, "Không thể tải danh sách người dùng.");
                setUsers(res.data ?? []);
                setPagination(res.pagination ?? { currentPage: 1, totalPages: 0, total: 0, limit: PAGE_LIMIT });
            } catch (error) {
                if (seq === requestSeq.current) toast.error(error.message);
            } finally {
                if (seq === requestSeq.current) setLoading(false);
            }
        },
        [toast, sessionExpired],
    );

    // Lần đầu mở trang: tải trang 1 không lọc.
    useEffect(() => {
        runFetch({}, 1);
    }, [runFetch]);

    // Tìm kiếm: parse keyword thông minh → quay về trang 1 với filter mới.
    const handleSearch = useCallback(() => {
        const filters = buildSearchFilters(keyword);
        setActiveFilters(filters);
        runFetch(filters, 1);
    }, [keyword, runFetch]);

    const handlePageChange = useCallback(
        (targetPage) => {
            runFetch(activeFilters, targetPage);
        },
        [activeFilters, runFetch],
    );

    // Tạo tài khoản nhân viên: thành công thì đóng modal, xoá filter và về trang 1
    // để thấy tài khoản vừa tạo (sắp xếp id giảm dần).
    const handleCreateStaff = useCallback(
        async (payload) => {
            const res = await createStaff(payload);
            if (res?.httpStatus === 401) {
                sessionExpired();
                throw new Error("Phiên đăng nhập hết hạn.");
            }
            if (!res?.success) throw toError(res, "Không thể tạo tài khoản.");
            toast.success(res.message || "Tạo tài khoản thành công!");
            setCreateOpen(false);
            setKeyword("");
            setActiveFilters({});
            runFetch({}, 1);
        },
        [toast, sessionExpired, runFetch],
    );

    // Cập nhật user: giữ nguyên filter + trang hiện tại.
    const handleUpdateUser = useCallback(
        async (payload) => {
            const res = await updateUser(editTarget.id, payload);
            if (res?.httpStatus === 401) {
                sessionExpired();
                throw new Error("Phiên đăng nhập hết hạn.");
            }
            if (!res?.success) throw toError(res, "Không thể cập nhật user.");
            toast.success(res.message || "Cập nhật user thành công!");
            setEditTarget(null);
            runFetch(activeFilters, pagination.currentPage);
        },
        [toast, sessionExpired, runFetch, editTarget, activeFilters, pagination.currentPage],
    );

    // Xóa user: nếu trang hiện tại chỉ còn 1 dòng thì lùi 1 trang.
    const handleDeleteUser = useCallback(
        async (user) => {
            const res = await deleteUser(user.id);
            if (res?.httpStatus === 401) {
                sessionExpired();
                throw new Error("Phiên đăng nhập hết hạn.");
            }
            if (!res?.success) throw toError(res, "Không thể xóa người dùng.");
            toast.success(res.message || "Xóa người dùng thành công!");
            setDeleteTarget(null);
            const nextPage = users.length === 1 && pagination.currentPage > 1 ? pagination.currentPage - 1 : pagination.currentPage;
            runFetch(activeFilters, nextPage);
        },
        [toast, sessionExpired, runFetch, users.length, pagination.currentPage, activeFilters],
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Quản lý User</h2>
                    <p className="mt-1 text-sm text-muted">Danh sách các người dùng</p>
                </div>
                <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <i className="fa-solid fa-user-plus" />
                    Tạo tài khoản nhân viên
                </button>
            </div>

            {/* Tìm kiếm */}
            <UserSearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />

            {/* Bảng + phân trang */}
            <div>
                <UsersTable
                    users={users}
                    loading={loading}
                    searchMode={Object.keys(activeFilters).length > 0}
                    onEdit={(user) => setEditTarget(user)}
                    onDelete={(user) => setDeleteTarget(user)}
                />
                <Pagination
                    page={pagination.currentPage}
                    limit={pagination.limit}
                    total={pagination.total}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals */}
            {createOpen && (
                <CreateStaffModal onClose={() => setCreateOpen(false)} onSubmit={handleCreateStaff} />
            )}
            {editTarget && (
                <EditUserModal
                    key={editTarget.id}
                    user={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSubmit={handleUpdateUser}
                />
            )}
            {deleteTarget && (
                <DeleteConfirmModal
                    user={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteUser}
                />
            )}
        </div>
    );
}