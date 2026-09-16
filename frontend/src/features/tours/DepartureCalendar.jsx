import { useMemo } from "react";

const DAY_MS = 86400000;
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const toLocalKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const DepartureCalendar = ({ counts, selectedDate, onSelect }) => {
    // useMemo: chỉ tính lại "danh sách 30 ngày" khi selectedDate thay đổi,
    // tránh tạo lại array mới mỗi lần render → giảm công việc cho React.
    const days = useMemo(() => {
        const today = new Date();
        const list = [];
        for (let i = 0; i < 30; i++) {
            list.push(new Date(today.getTime() + i * DAY_MS));
        }

        // Nếu ngày đang chọn (từ URL) nằm ngoài 30 ngày tới, vẫn chèn vào đầu
        // để người dùng nhìn thấy và gỡ bộ lọc được (không bị "bí" chọn).
        if (selectedDate) {
            const exists = list.some((d) => toLocalKey(d) === selectedDate);
            const parsed = new Date(`${selectedDate}T00:00:00`);
            if (!exists && !Number.isNaN(parsed.getTime())) {
                list.unshift(parsed);
            }
        }
        return list;
    }, [selectedDate]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2.5 px-1">
                <i className="fa-solid fa-calendar-days text-primary text-sm" />
                <span className="text-sm font-bold text-slate-800">Lịch khởi hành</span>
            </div>

            {/* Thanh ngang: overflow-x-auto để cuộn ngang trên mobile, mỗi ô 1 ngày */}
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {days.map((d) => {
                    const key = toLocalKey(d);
                    const count = counts[key] || 0;
                    const isSelected = key === selectedDate;
                    const hasTours = count > 0;

                    return (
                        <button
                            key={key}
                            type="button"
                            disabled={!hasTours}
                            onClick={() => onSelect(key)}
                            aria-pressed={isSelected}
                            aria-label={`Khởi hành ngày ${d.getDate()} tháng ${d.getMonth() + 1}, ${count} tour`}
                            className={`flex-none w-14 flex flex-col items-center py-2 rounded-xl border transition-colors cursor-pointer ${
                                isSelected
                                    ? "bg-primary border-primary text-white"
                                    : hasTours
                                        ? "bg-white border-slate-200 text-slate-800 hover:border-primary hover:bg-primary/5"
                                        : "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                        >
                            <span className="text-[10px] font-medium opacity-80">{WEEKDAYS[d.getDay()]}</span>
                            <span className="text-base font-extrabold leading-tight">{d.getDate()}</span>
                            <span
                                className={`text-[10px] mt-0.5 ${
                                    isSelected
                                        ? "text-white/90"
                                        : hasTours
                                            ? "text-primary font-semibold"
                                            : "text-slate-300"
                                }`}
                            >
                                {hasTours ? `${count} tour` : "—"}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DepartureCalendar;