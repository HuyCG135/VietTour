import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Calendar, Users, CircleDollarSign, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

const icons = { calendar: Calendar, users: Users, dollar: CircleDollarSign };

// Hàng 3 thẻ thống kê: Total Booking / Participants / Earnings
export default function StatCards({ stats }) {
    return (
        <div className="stats-row">
            {stats.map((s) => {
                const Icon = icons[s.icon];
                const isUp = s.trend === "up";
                const color = isUp ? "#44a8f8" : "#f0626e";

                return (
                    <div className="stat-card" key={s.id}>
                        {/* Tiêu đề */}
                        <div className="stat-card-header">
                            <span className="stat-icon">
                                <Icon size={16} color="#44a8f8" />
                            </span>
                            <span className="stat-title">{s.title}</span>
                            <button className="icon-btn">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                        {/* Số liệu + biểu đồ mini */}
                        <div className="stat-card-body">
                            <div>
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-change">
                                    <span className={isUp ? "text-up" : "text-down"}>
                                        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {isUp ? "+" : ""}
                                        {s.change}%
                                    </span>
                                    <span className="stat-note">{s.note}</span>
                                </div>
                            </div>

                            <div className="sparkline">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={s.spark.map((v, i) => ({ i, v }))}>
                                        <Area
                                            type="monotone"
                                            dataKey="v"
                                            stroke={color}
                                            strokeWidth={1.5}
                                            fill={color}
                                            fillOpacity={0.15}
                                            isAnimationActive={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
