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

  const [_searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (searchTerm: string) => {
    uiDispatch({
      type: "SET_SEARCH",
      payload: searchTerm.trimStart(),
    });
    // Reset the page to 1 when the user inputs a search term
    setSearchParams({ page: "1" });
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
          if (showSearch) setSearchParams({ page: "1" });
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
