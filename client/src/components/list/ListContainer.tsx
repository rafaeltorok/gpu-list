import { useEffect } from "react";
import { useSearchParams } from "react-router";

// Hooks
import useGpuContext from "../../hooks/useGpuContext";

// Components
import List from "./List";
import PaginationWrapper from "./PaginationWrapper";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

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

  // Render the list data tables
  return (
    <>
      <List gpuList={paginatedData} />

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
