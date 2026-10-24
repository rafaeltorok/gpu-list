import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSwipeable } from "react-swipeable";

// Hooks
import useGpuContext from "../../hooks/useGpuContext";

// Components
import List from "./List";
import PaginationWrapper from "./PaginationWrapper";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { SwipeEventData } from "react-swipeable";

// Component
export default function ListContainer() {
  const {
    dataState: { gpus, gpusFound, paginatedData },
    uiState: { searchGpu },
    dataDispatch,
  } = useGpuContext();

  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination-related variables
  const itemsPerPage = Number(searchParams.get("limit")) || 10;
  const currentPage = Number(searchParams.get("page"));

  // Define if the paginated data should be based upon the filtered list or not
  const dataToPaginate = searchGpu ? gpusFound : gpus;

  useEffect(() => {
    dataDispatch({
      type: "SET_PAGINATED_DATA",
      payload: paginateData(dataToPaginate, itemsPerPage, currentPage),
    });
  }, [dataToPaginate, currentPage, dataDispatch, itemsPerPage]);

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
        setSearchParams({ page: String(currentPage - 1), limit: String(itemsPerPage) });
      }

      // Right arrow key
      if (event.key === "ArrowRight" && currentPage < totalPages) {
        setSearchParams({ page: String(currentPage + 1), limit: String(itemsPerPage) });
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
        setSearchParams({ page: String(currentPage - 1), limit: String(itemsPerPage) });
      }

      // Next page
      if (eventData.dir === "Left" && currentPage < totalPages) {
        setSearchParams({ page: String(currentPage + 1), limit: String(itemsPerPage) });
      }
    },
    delta: 50, // Define the min amount of pixels before a swipe is registered
  });

  // Render the list data tables
  return (
    <>
      <main {...swipeHandler}>
        <List gpuList={paginatedData} />
      </main>

      <PaginationWrapper totalPages={totalPages} />
    </>
  );
}

// Handles paginating the data
function paginateData(
  gpus: GpuType[],
  ITEMS_PER_PAGE: number,
  currentPage: number,
): GpuType[] {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = offset + ITEMS_PER_PAGE;

  return gpus.slice(offset, endIndex);
}
