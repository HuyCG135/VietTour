import { SectionCard } from "./common";
import { formatDate } from "../bookingFormat";

export default function PassengersTable({ passengers }) {
    return (
        <SectionCard icon="fa-solid fa-users" title="Khách đi tour">
            {passengers.length === 0 ? (
                <p className="text-center text-muted text-sm py-4 mb-0">Không có thông tin hành khách</p>
            ) : (
                <div className="overflow-x-auto -mx-5">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500">
                                <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Họ và tên</th>
                                <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Loại khách</th>
                                <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Giới tính</th>
                                <th className="text-left font-semibold px-5 py-3 whitespace-nowrap">Ngày sinh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((p) => (
                                <tr key={p.id} className="border-t border-border/70">
                                    <td className="px-5 py-3 font-semibold text-foreground whitespace-nowrap">{p.fullname}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                                p.passenger_type === "child"
                                                    ? "bg-emerald-500/10 text-emerald-800"
                                                    : "bg-primary-50 text-primary-dark"
                                            }`}
                                        >
                                            {p.passenger_type === "child" ? "Trẻ em" : "Người lớn"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{p.gender || "Khác"}</td>
                                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{formatDate(p.dob)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </SectionCard>
    );
}