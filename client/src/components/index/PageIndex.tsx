// React Context
import useGpuContext from "../../hooks/useGpuContext";

// CSS Styles
import "../../styles/PageIndex.css";

import IndexEntry from "./IndexEntry";

// Component
export default function PageIndex() {
  const {
    dataState: { paginatedData },
    uiState: { showIndex },
    uiDispatch,
  } = useGpuContext();

  return (
    <div id="page-index-container">
      <button
        id="show-index-button"
        type="button"
        onClick={() =>
          uiDispatch({
            type: "TOGGLE_INDEX",
          })
        }
      >
        {showIndex ? "Hide index" : "Show index"}
      </button>
      {showIndex && (
        <div className="index-list-container">
          {paginatedData.length > 0 ? (
            <ul className="index-list">
              {paginatedData.map((gpu) => (
                <IndexEntry key={gpu.id} gpu={gpu} />
              ))}
            </ul>
          ) : (
            <p>No entries</p>
          )}
        </div>
      )}
    </div>
  );
}
