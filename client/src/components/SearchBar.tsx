// Component dependencies
import { useEffect } from "react";
import useGpuContext from "../hooks/useGpuContext";

// CSS Styles
import "../styles/SearchBar.css";

export default function SearchBar() {
  const {
    uiState: { showSearch, searchGpu },
    uiDispatch,
  } = useGpuContext();

  const handleSearch = (searchTerm: string) => {
    uiDispatch({
      type: "SET_SEARCH",
      payload: searchTerm,
    });
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
        onClick={() =>
          uiDispatch({
            type: "TOGGLE_SEARCH",
          })
        }
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
