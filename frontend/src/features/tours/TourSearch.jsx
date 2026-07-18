import { useState } from "react";

export default function TourSearch({ onSearch }) {
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(keyword.trim());
    };

    return (
        <form className="search-group mb-6" onSubmit={handleSubmit}>
            <button type="submit" className="search-icon" aria-label="Tìm kiếm">
                <i className="fa-solid fa-magnifying-glass" />
            </button>
            <input
                type="text"
                className="search-input"
                placeholder="Tìm tour theo tên hoặc mô tả..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </form>
    );
}
