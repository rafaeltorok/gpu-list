import "../../styles/SearchBar.css";

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export default function SearchBar({ onSearch, searchTerm }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search GPUs..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
