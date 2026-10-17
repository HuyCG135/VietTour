import { PieChart, Pie, Cell } from "recharts";
import { MoreHorizontal, ChevronDown } from "lucide-react";

// Biểu đồ donut + danh sách top package
export default function TopPackages({ data }) {
    const { period, totalParticipants, items } = data;

    return (
        <div className="card top-packages">
            <div className="card-header">
                <h3 className="card-title">Top Packages</h3>
                <button className="icon-btn">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Donut */}
            <div className="donut-wrap">
                <PieChart width={200} height={200}>
                    <Pie
                        data={items}
                        dataKey="percent"
                        innerRadius={68}
                        outerRadius={92}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={3}
                        cornerRadius={6}
                        stroke="none"
                    >
                        {items.map((it) => (
                            <Cell key={it.id} fill={it.color} />
                        ))}
                    </Pie>
                </PieChart>

                <div className="donut-center">
                    <span className="donut-period">
                        {period} <ChevronDown size={10} />
                    </span>
                    <strong>{totalParticipants.toLocaleString("en-US")}</strong>
                    <span className="donut-sub">Total Participants</span>
                </div>
            </div>

            {/* Danh sách */}
            <ul className="package-list">
                {items.map((it) => (
                    <li key={it.id} className="package-item">
                        <span
                            className="package-percent"
                            style={{ background: it.color, color: it.percent > 20 ? "#fff" : "#2f80c4" }}
                        >
                            {it.percent}%
                        </span>
                        <div>
                            <div className="package-name">{it.name}</div>
                            <div className="package-sub">{it.participants} Participants</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
