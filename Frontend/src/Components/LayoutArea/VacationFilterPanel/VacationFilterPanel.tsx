import { FilterBar } from "../FilterBar/FilterBar";
import { SortOptions } from "../SortOptions/SortOptions";
import { SearchBar } from "../SearchBar/SearchBar";
import "./VacationFilterPanel.css";

interface VacationFilterPanelProps {
    currentFilter: "all" | "liked" | "active" | "future";
    setFilter: (filter: "all" | "liked" | "active" | "future") => void;
    sortBy: "date" | "price";
    sortOrder: "asc" | "desc";
    onSortByChange: (value: "date" | "price") => void;
    onSortOrderChange: (value: "asc" | "desc") => void;
    onSearchTextChange: (text: string) => void; 
    isAdmin?: boolean;
}

export function VacationFilterPanel({
    currentFilter,
    setFilter,
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
    onSearchTextChange,
    isAdmin
}: VacationFilterPanelProps): JSX.Element {
    return (
        <div className="vacation-filter-panel">
            <SearchBar onSearchTextChange={onSearchTextChange} />

            <FilterBar
                currentFilter={currentFilter}
                setFilter={setFilter}
                isAdmin={isAdmin}
            />

            <SortOptions
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={onSortByChange}
                onSortOrderChange={onSortOrderChange}
            />
        </div>
    );
}
