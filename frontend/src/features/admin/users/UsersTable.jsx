import { ROLE_META, STATUS_META, getAvatarLetter } from "./userUtils";

// Bảng danh sách user — đồng bộ design token của dự án:
// card trắng viền border-border, thead in hoa xám, zebra nhẹ + hover,
// avatar tròn tông primary, badge trạng thái theo token success/danger.
export default function UsersTable({ users, loading, searchMode, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {["ID", "Họ tên", "Email", "Số điện thoại", "Vai trò", "Trạng thái", "Hành động"].map(
                                (label) => (
                                    <th
                                        key={label}
                                        className="border-b border-border bg-slate-50 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                                    >
                                        {label}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted">
                                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                                    {searchMode ? "Đang tìm kiếm..." : "Đang tải dữ liệu..."}
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-sm text-muted">
                                    {searchMode
                                        ? "Không tìm thấy người dùng. Vui lòng thử tiêu chí khác."
                                        : "Không có người dùng nào."}
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const role = ROLE_META[user.role] ?? {
                                    label: user.role,
                                    icon: "fa-solid fa-user",
                                };
                                const status = STATUS_META[user.status] ?? STATUS_META[0];

                                return (
                                    <tr
                                        key={user.id}
                                        onClick={() => onEdit(user)}
                                        title="Nhấn để chỉnh sửa"
                                        className="cursor-pointer transition-colors duration-150 even:bg-slate-50/60 hover:bg-primary-50/60"
                                    >
                                        <td className="px-5 py-4 align-middle font-semibold text-foreground">
                                            {user.id}
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <div className="flex items-center gap-3.5">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-dark">
                                                    {getAvatarLetter(user.fullname)}
                                                </span>
                                                <span className="font-medium whitespace-nowrap text-foreground">
                                                    {user.fullname}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 align-middle text-sm whitespace-nowrap text-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-5 py-4 align-middle text-sm whitespace-nowrap text-foreground">
                                            {user.phone || (
                                                <span className="text-muted italic">Chưa cập nhật</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 align-middle text-sm font-medium whitespace-nowrap text-muted">
                                            {role.label}
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                                            >
                                                {status.label}
                                            </span>
                                        </td>
                                        <td
                                            className="px-5 py-4 align-middle"
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(user)}
                                                    title="Sửa"
                                                    className="flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:border-primary/40 hover:bg-primary-50 hover:text-primary"
                                                >
                                                    <i className="fa-solid fa-pen-to-square" />
                                                    Sửa
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(user)}
                                                    title="Xóa"
                                                    className="flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
                                                >
                                                    <i className="fa-solid fa-trash-can" />
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}