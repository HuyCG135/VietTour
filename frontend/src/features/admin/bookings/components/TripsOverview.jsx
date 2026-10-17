import { useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";

// Biểu đồ đường: số chuyến Done / Canceled theo tháng
export default function TripsOverview({ data, rangeOptions }) {
    const [range, setRange] = useState(rangeOptions[0]);

    return (
        <div className="card trips-card">
            {/* Tiêu đề + chọn khoảng thời gian */}
            <div className="card-header">
                <h3 className="card-title">Trips Overview</h3>
                <div className="select-wrap">
                    <select className="btn-primary select-primary" value={range} onChange={(e) => setRange(e.target.value)}>
                        {rangeOptions.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} color="#fff" />
                </div>
            </div>

            {/* Chú thích */}
            <div className="legend">
                <span className="legend-item"><i className="legend-line" /> Done</span>
                <span className="legend-item"><i className="legend-line dashed" /> Canceled</span>
            </div>

            {/* Biểu đồ */}
            <div className="trips-chart">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 8, bottom: 0, left: -20 }}>
                        <CartesianGrid stroke="#e8edf3" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7b8794" }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#7b8794" }} ticks={[0, 500, 1000, 1500, 2000]} />
                        <Tooltip />
                        <Area type="monotone" dataKey="done" stroke="#44a8f8" strokeWidth={2} fill="#44a8f8" fillOpacity={0.15} />
                        <Line type="monotone" dataKey="canceled" stroke="#4b5563" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
