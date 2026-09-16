export default function SearchBox({ value, onChange, onSearch, placeholder = "Tìm kiếm theo tên tour, điểm đến...", className = "" }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(value);
    };

    return (
        <form className={`search-group relative w-full ${className}`} onSubmit={handleSubmit}>
            <button type="submit" className="search-icon" aria-label="Tìm kiếm">
                <i className="fa-solid fa-magnifying-glass" />
            </button>
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => {
                        onChange("");
                        onSearch?.("");
                    }}
                    aria-label="Xóa tìm kiếm"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-0 bg-transparent cursor-pointer p-1"
                >
                    <i className="fa-solid fa-circle-xmark" />
                </button>
            )}
        </form>
    );
}
