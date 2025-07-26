import "./SortOptions.css";

interface SortOptionsProps {
    sortBy: "price" | "date";
    sortOrder: "asc" | "desc";
    onSortByChange: (value: "price" | "date") => void;
    onSortOrderChange: (value: "asc" | "desc") => void;
}

export function SortOptions(props: SortOptionsProps): JSX.Element {

    function handleCombinedChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        const [newSortBy, newSortOrder] = value.split("-") as ["price" | "date", "asc" | "desc"];

        props.onSortByChange(newSortBy);
        props.onSortOrderChange(newSortOrder);
    }

    const combinedValue = `${props.sortBy}-${props.sortOrder}`;

    return (
        <div className="filter-bar">
            <label htmlFor="sort-select">Sort:</label>
            <select
                id="sort-select"
                value={combinedValue}
                onChange={handleCombinedChange}
            >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="date-asc">Date: Earliest First</option>
                <option value="date-desc">Date: Latest First</option>
            </select>
        </div>
    );
}
