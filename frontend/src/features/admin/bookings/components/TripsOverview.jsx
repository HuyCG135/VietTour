import { useEffect, useRef, useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";
import { getTripsOverview } from "../bookings.api";

// Biểu đồ đường: số chuyến Done / Canceled theo range đang chọn.
export default function TripsOverview({ rangeOptions }) {
    const toast = useToast();
    const requestSeq = useRef(0);

    const [range, setRange] = useState(rangeOptions[0].value);
    const [data, setData] = useState([]);
    const [loadedRange, setLoadedRange] = useState(null);

    // Đổi range → loadedRange vẫn là range cũ nên loading = true ngay,
    // không cần setState đồng bộ trong effect.
    const loading = loadedRange !== range;

    useEffect(() => {
        const seq = ++requestSeq.current;

        getTripsOverview(range)
            .then((res) => {
                if (seq !== requestSeq.current) return;
                if (!res?.success) {
                    throw new Error(res?.message || "Không thể tải Trips Overview.");
                }
                setData(res.data ?? []);
            })
            .catch((error) => {
                if (seq !== requestSeq.current) return;
                setData([]);
                toast.error(error.message);
            })
            .finally(() => {
                if (seq === requestSeq.current) setLoadedRange(range);
            });
    }, [range, toast]);

    // Trục Y co giãn theo dữ liệu thật thay vì cố định 0..2000.
    const maxValue = data.reduce((max, item) => Math.max(max, item.done, item.canceled), 0);
    const step = Math.max(1, Math.ceil(maxValue / 4));
    const ticks = Array.from({ length: 5 }, (_, index) => index * step);

    return (
        <div className="card trips-card">
            {/* Tiêu đề + chọn khoảng thời gian */}
            <div className="card-header">
                <h3 className="card-title">Tổng quan chuyến đi</h3>
                <div className="select-wrap">
                    <select
                        className="btn-primary select-primary"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                    >
                        {rangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} color="#fff" />
                </div>
            </div>

            {/* Chú thích */}
            <div className="legend">
                <span className="legend-item"><i className="legend-line" /> Đã xác nhận</span>
                <span className="legend-item"><i className="legend-line dashed" /> Đã hủy</span>
            </div>

            {/* Biểu đồ */}
            <div className={`trips-chart${loading ? " is-loading" : ""}`}>
                {!loading && data.length === 0 ? (
                    <p className="chart-state">Chưa có dữ liệu trong khoảng thời gian này.</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid stroke="#e8edf3" vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7b8794" }} />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 10, fill: "#7b8794" }}
                                ticks={ticks}
                                allowDecimals={false}
                            />
                            <Tooltip />
                            <Area type="monotone" dataKey="done" name="Đã xác nhận" stroke="#44a8f8" strokeWidth={2} fill="#44a8f8" fillOpacity={0.15} />
                            <Line type="monotone" dataKey="canceled" name="Đã hủy" stroke="#4b5563" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
