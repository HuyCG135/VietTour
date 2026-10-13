import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTourImageDetail, uploadTourImages, deleteTourImage } from "./tour-images.api";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 10;

const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function TourImageForm() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [tour, setTour] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let ignore = false;

        getTourImageDetail(tourId)
            .then((data) => {
                if (ignore) return;
                if (!data.success) {
                    setError(data.message || "Không thể tải thông tin ảnh tour");
                    return;
                }
                const detail = data.data;
                setTour({
                    id: detail.id,
                    name: detail.name,
                    region: detail.region,
                    duration: detail.duration,
                });
                setImages(detail.images || []);
            })
            .catch(() => {
                if (!ignore) setError("Không thể kết nối đến máy chủ");
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => { ignore = true; };
    }, [tourId]);

    // Dọn object URL khi unmount (dùng ref để không revoke URL đang hiển thị)
    const previewsRef = useRef([]);
    previewsRef.current = previews;

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
        };
    }, []);

    const resetSelection = () => {
        previewsRef.current.forEach((preview) => URL.revokeObjectURL(preview.url));
        setSelectedFiles([]);
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const addFiles = (fileList) => {
        const incoming = Array.from(fileList || []);
        if (incoming.length === 0) return;

        setError("");
        const valid = [];

        for (const file of incoming) {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                setError(`"${file.name}" không phải là định dạng ảnh được hỗ trợ (JPG, PNG, WEBP, GIF, AVIF)`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                setError(`"${file.name}" vượt quá ${formatSize(MAX_FILE_SIZE)}`);
                continue;
            }
            valid.push(file);
        }

        if (valid.length === 0) return;

        const room = MAX_FILES - selectedFiles.length;
        if (room <= 0) {
            setError(`Chỉ được chọn tối đa ${MAX_FILES} ảnh mỗi lần`);
            return;
        }

        const accepted = valid.slice(0, room);
        if (valid.length > room) {
            setError(`Chỉ được chọn tối đa ${MAX_FILES} ảnh mỗi lần, ${valid.length - room} ảnh bị bỏ qua`);
        }

        setSelectedFiles((prev) => [...prev, ...accepted]);
        setPreviews((prev) => [
            ...prev,
            ...accepted.map((file) => ({ url: URL.createObjectURL(file), name: file.name })),
        ]);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("Vui lòng chọn ít nhất một ảnh để tải lên");
            return;
        }

        setError("");
        setSuccess("");
        setUploading(true);

        try {
            const data = await uploadTourImages(tourId, selectedFiles);
            if (!data.success) {
                const detail = Array.isArray(data.errors) ? data.errors.join(", ") : "";
                setError(detail || data.message || "Không thể tải ảnh lên");
                return;
            }

            setImages((prev) => [...prev, ...(data.data || [])]);
            setSuccess(data.message || "Tải ảnh lên thành công");
            if (Array.isArray(data.errors) && data.errors.length > 0) {
                setError(data.errors.join(", "));
            }
            resetSelection();
        } catch {
            setError("Không thể kết nối đến máy chủ");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!window.confirm("Bạn có chắc muốn xóa ảnh này? Ảnh cũng sẽ bị xóa trên Cloudinary.")) {
            return;
        }

        setError("");
        setSuccess("");
        setDeletingId(imageId);

        try {
            const data = await deleteTourImage(tourId, imageId);
            if (!data.success) {
                setError(data.message || "Không thể xóa ảnh");
                return;
            }
            setImages((prev) => prev.filter((item) => item.id !== imageId));
            setSuccess(data.message || "Xóa ảnh thành công");
        } catch {
            setError("Không thể kết nối đến máy chủ");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" role="status" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl mb-0">Chỉnh sửa ảnh tour</h2>
                <button
                    type="button"
                    onClick={() => navigate("/admin/tour-images")}
                    className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                    <i className="fa-solid fa-arrow-left mr-1.5" />
                    Quay lại
                </button>
            </div>

            {tour && (
                <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                    <span className="text-gray-400">Mã tour:</span>
                    <b className="text-gray-800">#{tour.id}</b>
                    <span className="text-gray-400">Tên tour:</span>
                    <b className="text-gray-800">{tour.name}</b>
                    <span className="text-gray-400">Miền:</span>
                    <b className="text-gray-800">{tour.region || "—"}</b>
                    <span className="text-gray-400">Số ảnh:</span>
                    <b className="text-gray-800">{images.length}</b>
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-exclamation mr-1.5" />
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3">
                    <i className="fa-solid fa-circle-check mr-1.5" />
                    {success}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h3 className="font-semibold text-base mb-4">
                    <i className="fa-solid fa-cloud-arrow-up text-blue-600 mr-2" />
                    Tải ảnh từ thiết bị
                </h3>

                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        addFiles(e.dataTransfer.files);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        dragging
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                    }`}
                >
                    <i className="fa-solid fa-cloud-arrow-up text-blue-600 mb-2" style={{ fontSize: 32 }} />
                    <p className="text-sm text-gray-700 font-medium">
                        Kéo thả ảnh vào đây hoặc bấm để chọn từ thiết bị
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP, GIF, AVIF — tối đa {formatSize(MAX_FILE_SIZE)} mỗi ảnh, {MAX_FILES} ảnh mỗi lần
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => addFiles(e.target.files)}
                    />
                </div>

                {previews.length > 0 && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600 font-medium">
                                Đã chọn {selectedFiles.length} ảnh
                            </p>
                            <button
                                type="button"
                                onClick={resetSelection}
                                disabled={uploading}
                                className="text-sm text-gray-500 hover:text-red-500 font-medium cursor-pointer disabled:opacity-50"
                            >
                                <i className="fa-solid fa-xmark mr-1" />
                                Xóa lựa chọn
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                            {previews.map((preview, index) => (
                                <div key={`${preview.name}-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <img src={preview.url} alt={preview.name} className="w-full h-24 object-cover" />
                                    <p className="text-[11px] text-gray-500 px-2 py-1 truncate" title={preview.name}>
                                        {preview.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={resetSelection}
                        disabled={uploading || selectedFiles.length === 0}
                        className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || selectedFiles.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin" />
                                Đang tải lên...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-upload mr-1.5" />
                                Tải lên Cloudinary
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-base mb-4">
                    <i className="fa-solid fa-images text-blue-600 mr-2" />
                    Ảnh của tour
                    <span className="text-sm font-normal text-gray-400 ml-2">
                        Ảnh đầu tiên sẽ hiển thị trong thư viện tour
                    </span>
                </h3>

                {images.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        <i className="fa-regular fa-image mb-2" style={{ fontSize: 28 }} />
                        <p className="text-sm">Tour này chưa có ảnh nào.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div key={image.id} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                                <div className="relative">
                                    <img
                                        src={image.image}
                                        alt={`Ảnh ${index + 1} của ${tour?.name ?? "tour"}`}
                                        className="w-full h-36 object-cover"
                                        loading="lazy"
                                    />
                                    {index === 0 && (
                                        <span className="absolute top-2 left-2 bg-gray-800/80 text-white text-xs font-medium px-2 py-1 rounded-lg">
                                            Ảnh đầu
                                        </span>
                                    )}
                                </div>

                                <div className="p-2.5 mt-auto flex items-center justify-between gap-2">
                                    <p className="text-[11px] text-gray-400 truncate" title={image.image}>
                                        #{image.id}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(image.id)}
                                        disabled={deletingId !== null}
                                        title="Xóa ảnh"
                                        className="shrink-0 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 w-8 h-8 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {deletingId === image.id ? (
                                            <i className="fa-solid fa-spinner fa-spin" />
                                        ) : (
                                            <i className="fa-solid fa-trash" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
