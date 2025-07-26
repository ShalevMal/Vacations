import { ChangeEvent } from "react";
import "./SearchBar.css";

type SearchBarProps = {
    onSearchTextChange: (text: string) => void;
};

export function SearchBar({ onSearchTextChange }: SearchBarProps): JSX.Element {
    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const text = event.target.value;
        onSearchTextChange(text);
    }

    return (
        <div className="search-bar">
            <input
                type="search"
                placeholder="Search destination..."
                onChange={handleChange}
                className="search-input"
            />
        </div>
    );
}
