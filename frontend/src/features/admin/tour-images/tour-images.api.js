const API_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_TOUR_IMAGES_URL = `${API_URL}/admin/tour-images`;
import { getToken } from '../../auth/auth.api';

const authHeaders = (extra = {}) => ({
    'Authorization': `Bearer ${getToken()}`,
    ...extra,
});

const buildQuery = (query = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, value);
        }
    });
    const qs = params.toString();
    return qs ? `?${qs}` : '';
};

/** Danh sách tour kèm số lượng ảnh */
export async function getTourImages(query = {}) {
    const res = await fetch(`${ADMIN_TOUR_IMAGES_URL}${buildQuery(query)}`, {
        headers: authHeaders(),
    });
    return res.json();
}

/** Chi tiết tour + toàn bộ ảnh của tour */
export async function getTourImageDetail(tourId) {
    const res = await fetch(`${ADMIN_TOUR_IMAGES_URL}/${tourId}`, {
        headers: authHeaders(),
    });
    return res.json();
}

/** Tải ảnh từ thiết bị lên Cloudinary (multipart/form-data) */
export async function uploadTourImages(tourId, files) {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append('images', file);
    });

    // Không set Content-Type để trình duyệt tự thêm boundary
    const res = await fetch(`${ADMIN_TOUR_IMAGES_URL}/${tourId}/images`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
    });
    return res.json();
}

/** Xóa 1 ảnh khỏi tour */
export async function deleteTourImage(tourId, imageId) {
    const res = await fetch(`${ADMIN_TOUR_IMAGES_URL}/${tourId}/images/${imageId}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    return res.json();
}
