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
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(searchParams.get("page"));

  // Define if the paginated data should be based upon the filtered list or not
  const dataToPaginate = searchGpu ? gpusFound : gpus;

  useEffect(() => {
    dataDispatch({
      type: "SET_PAGINATED_DATA",
      payload: paginateData(dataToPaginate, ITEMS_PER_PAGE, currentPage),
    });
  }, [dataToPaginate, currentPage, dataDispatch]);

  const totalPages = Math.ceil(dataToPaginate.length / ITEMS_PER_PAGE) || 0;

  // Prevents invalid page numbers
  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      setSearchParams({ page: "1" });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // Handles keyboard navigation
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Left arrow key
      if (event.key === "ArrowLeft" && currentPage > 1) {
        setSearchParams({ page: String(currentPage - 1) });
      }

      // Right arrow key
      if (event.key === "ArrowRight" && currentPage < totalPages) {
        setSearchParams({ page: String(currentPage + 1) });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setSearchParams, currentPage, totalPages]);

  // Handles the Touch screen swipe to change the page
  const swipeHandler = useSwipeable({
    onSwiped: (eventData: SwipeEventData) => {
      // Previous page
      if (eventData.dir === "Right" && currentPage > 1) {
        setSearchParams({ page: String(currentPage - 1) });
      }

      // Next page
      if (eventData.dir === "Left" && currentPage < totalPages) {
        setSearchParams({ page: String(currentPage + 1) });
      }
    },
    delta: 50, // Define the min amount of pixels before a swipe is registered
  });

  // Render the list data tables
  return (
    <>
      <div {...swipeHandler}>
        <List gpuList={paginatedData} />
      </div>

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
