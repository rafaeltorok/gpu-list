import { useEffect } from "react";
import { useSearchParams } from "react-router";

// Custom hooks
import useGpuContext from "../hooks/useGpuContext";

// CSS Styles
import "../styles/SearchBar.css";

export default function SearchBar() {
  const {
    uiState: { showSearch, searchGpu },
    uiDispatch,
  } = useGpuContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = searchParams.get("limit") || 10;

  const handleSearch = (searchTerm: string) => {
    uiDispatch({
      type: "SET_SEARCH",
      payload: searchTerm.trimStart(),
    });
    // Reset the page to 1 when the user inputs a search term
    // Maintain the cards per page value, if available
    setSearchParams({ page: "1", limit: String(limit) });
  };

  useEffect(() => {
    if (!showSearch) {
      uiDispatch({
        type: "SET_SEARCH",
        payload: "",
      });
    }
  }, [showSearch, uiDispatch]);

  return (
    <div id="search-bar-field">
      <button
        id="show-search-button"
        type="button"
        onClick={() => {
          uiDispatch({
            type: "TOGGLE_SEARCH",
          });
          // Reset the page number when cancelling a search
          if (showSearch) {
            setSearchParams({ page: "1", limit: String(limit) });
          }
        }}
      >
        {showSearch ? "Cancel" : "Search"}
      </button>
      {showSearch && (
        <form>
          <input
            type="text"
            id="search-bar-input"
            placeholder="Search"
            value={searchGpu}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}
