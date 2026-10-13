import { useState } from "react";
import Modal from "../../../components/Modal";

// Modal xác nhận xóa user (bố cục bản cũ: icon cảnh báo tròn đỏ, tiêu đề, 2 nút full-width).
export default function DeleteConfirmModal({ user, onClose, onConfirm }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        setError("");
        setDeleting(true);
        try {
            await onConfirm(user);
        } catch (err) {
            setError(err.message || "Không thể xóa người dùng.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal
            open
            onClose={deleting ? undefined : onClose}
            closeOnBackdrop={!deleting}
            size="sm"
            showClose={false}
            ariaLabel="Xác nhận xóa người dùng"
        >
            <div className="px-6 pb-5 pt-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 text-2xl text-danger">
                    <i className="fa-solid fa-triangle-exclamation" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Xác nhận xóa?</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    Bạn có chắc chắn muốn xóa người dùng{" "}
                    <strong className="text-foreground">{user.fullname}</strong>? Hành động này không thể
                    hoàn tác.
                </p>

                {error && (
                    <div className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-left text-sm text-danger">
                        <i className="fa-solid fa-circle-exclamation mr-1.5" />
                        {error}
                    </div>
                )}
            </div>

            <div className="flex gap-2.5 px-6 pb-6">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={deleting}
                    className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-muted transition-colors duration-150 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Hủy
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={deleting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-danger/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {deleting && <i className="fa-solid fa-spinner fa-spin" />}
                    Xóa ngay
                </button>
            </div>
        </Modal>
    );
}