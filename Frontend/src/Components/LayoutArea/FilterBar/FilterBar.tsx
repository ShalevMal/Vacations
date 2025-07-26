import "./FilterBar.css";

export type FilterType = "all" | "liked" | "active" | "future";

interface FilterBarProps {
    setFilter: (filter: FilterType) => void;
    currentFilter: FilterType;
    isAdmin?: boolean;
}

export function FilterBar({ setFilter, currentFilter, isAdmin }: FilterBarProps): JSX.Element {
    const filters: FilterType[] = isAdmin
        ? ["all", "active", "future"]
        : ["all", "liked", "active", "future"];

    return (
        <div className="filter-bar">
            <label htmlFor="filter-select">Filter:</label>
            <select
                id="filter-select"
                value={currentFilter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
            >
                {filters.map((filter) => (
                    <option key={filter} value={filter}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}
