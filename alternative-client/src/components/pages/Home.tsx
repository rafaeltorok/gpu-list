import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSwipeable } from "react-swipeable";

// Hooks
import useGpuContext from "../../hooks/useGpuContext";
import useLimit from "../../hooks/useLimit";

// Components
import SearchBar from "../ui/SearchBar";
import AddGpuForm from "../ui/addForm/AddGpuForm";
import GpuList from "./GpuList";
import PaginationWrapper from "./PaginationWrapper";

import "../../styles/Home.css";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { SwipeEventData } from "react-swipeable";

export default function Home() {
  const { dataState, uiState, uiDispatch } = useGpuContext();
  const { limit } = useLimit();

  const itemsPerPage = limit || 9;

  // Handles the page number param
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page"));

  // Define if the paginated data should be based upon the filtered list or not
  const dataToPaginate = uiState.searchTerm ? dataState.gpusFound : dataState.gpus;

  // Paginate the data into slices for each page
  const paginatedData = paginateData(dataToPaginate, itemsPerPage, currentPage);

  // Total number of pages to be displayed by the MUI Pagination component
  const totalPages = Math.ceil(dataToPaginate.length / itemsPerPage) || 0;

  // Prevents invalid page numbers
  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      setSearchParams({ page: "1", limit: String(itemsPerPage) });
    }
  }, [currentPage, totalPages, setSearchParams, itemsPerPage]);

  // Handles keyboard navigation
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Left arrow key
      if (event.key === "ArrowLeft" && currentPage > 1) {
        setSearchParams({
          page: String(currentPage - 1),
          limit: String(itemsPerPage),
        });
      }

      // Right arrow key
      if (event.key === "ArrowRight" && currentPage < totalPages) {
        setSearchParams({
          page: String(currentPage + 1),
          limit: String(itemsPerPage),
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setSearchParams, currentPage, totalPages, itemsPerPage]);

  // Handles the Touch screen swipe to change the page
  const swipeHandler = useSwipeable({
    onSwiped: (eventData: SwipeEventData) => {
      // Previous page
      if (eventData.dir === "Right" && currentPage > 1) {
        setSearchParams({
          page: String(currentPage - 1),
          limit: String(itemsPerPage),
        });
      }

      // Next page
      if (eventData.dir === "Left" && currentPage < totalPages) {
        setSearchParams({
          page: String(currentPage + 1),
          limit: String(itemsPerPage),
        });
      }
    },
    delta: 50, // Define the min amount of pixels before a swipe is registered
  });

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-actions">
          {/* Search bar and add form controls */}
          <SearchBar />
          <button
            className="add-gpu-toggle"
            onClick={() => uiDispatch({ type: "TOGGLE_ADD_FORM" })}
          >
            {uiState.showAddForm ? "Cancel" : "Add GPU"}
          </button>
        </div>
      </div>

      {/* Add GPU form */}
      {uiState.showAddForm && (
        <div className="add-form-container">
          <AddGpuForm />
        </div>
      )}

      {/* Cards list */}
      <GpuList
      paginatedData={paginatedData}
        swipeHandler={swipeHandler}
      />

      <PaginationWrapper totalPages={totalPages} />
    </div>
  );
}

// Helper function to handle the data pagination
function paginateData(
  dataToPaginate: GpuType[],
  itemsPerPage: number,
  currentPage: number,
): GpuType[] {
  const offset = (currentPage - 1) * itemsPerPage;
  const endIndex = offset + itemsPerPage;

  return dataToPaginate.slice(offset, endIndex);
}
