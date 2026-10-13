// Thanh tìm kiếm cho trang Quản lý user — đồng bộ design token của dự án:
// input rounded-xl với icon kính lúp + nút primary phẳng.
export default function UserSearchBar({ value, onChange, onSearch }) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[240px] flex-1">
                    <i className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted" />
                    <input
                        type="text"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") onSearch();
                        }}
                        placeholder="Tìm kiếm theo ID, tên, số điện thoại..."
                        className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors duration-150 placeholder:text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                    />
                </div>
                <button
                    type="button"
                    onClick={onSearch}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                    <i className="fa-solid fa-magnifying-glass" />
                    Tìm kiếm
                </button>
            </div>
        </div>
    );
}