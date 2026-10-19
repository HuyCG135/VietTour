import { Users } from "lucide-react";
import { SectionCard } from "./common";
import { formatDate } from "./detailFormat";

const PASSENGER_TYPE = {
    adult: "Người lớn",
    child: "Trẻ em",
};

export default function PassengersSection({ passengers = [] }) {
    return (
        <SectionCard icon={Users} title="Danh sách hành khách">
            {passengers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted">
                    Chưa có thông tin hành khách.
                </p>
            ) : (
                <div className="-mx-5 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500">
                                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Họ và tên</th>
                                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Loại khách</th>
                                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Giới tính</th>
                                <th className="whitespace-nowrap px-5 py-3 text-left font-semibold">Ngày sinh</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passengers.map((passenger) => (
                                <tr key={passenger.id} className="border-t border-border">
                                    <td className="px-5 py-3 font-semibold text-foreground">
                                        {passenger.fullname || "---"}
                                    </td>
                                    <td className="px-5 py-3 text-muted">
                                        {PASSENGER_TYPE[passenger.passenger_type] || passenger.passenger_type || "---"}
                                    </td>
                                    <td className="px-5 py-3 text-muted">{passenger.gender || "---"}</td>
                                    <td className="px-5 py-3 text-muted tabular-nums">
                                        {passenger.dob_text || (passenger.dob ? formatDate(passenger.dob) : "---")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </SectionCard>
    );
}
