import useGpuContext from "../../hooks/useGpuContext";
import { useSearchParams } from "react-router";
import useLimit from "../../hooks/useLimit";
import "../../styles/SearchBar.css";

export default function SearchBar() {
  const {
    uiState: { searchTerm },
    uiDispatch,
  } = useGpuContext();
  const [_searchParams, setSearchParams] = useSearchParams();
  const { limit } = useLimit();

  // Handle the user search term
  function handleSearch(term: string) {
    // Set the term within the URL
    setSearchParams({ page: "1", limit: String(limit) });

    // Synchronize the term with the Context state
    uiDispatch({
      type: "SET_SEARCH_TERM",
      payload: term.trimStart(),
    });
  }

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search GPUs..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
