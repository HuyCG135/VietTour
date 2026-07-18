export default function SearchBox({ value, onChange, onSearch }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(value);
    };

    return (
        <form className="search-group mb-6" onSubmit={handleSubmit}>
            <button type="submit" className="search-icon" aria-label="Tìm kiếm">
                <i className="fa-solid fa-magnifying-glass" />
            </button>
            <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </form>
    );
}
