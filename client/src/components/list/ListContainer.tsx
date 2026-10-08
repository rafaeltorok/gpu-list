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
    dataState: { gpus, gpusFound },
    uiState: { searchGpu },
  } = useGpuContext();

  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination-related variables
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(searchParams.get("page")) || 1;
  let paginatedData: GpuType[] = [];
  let totalPages = 0;
  
  // Define if the paginated data should be based upon the filtered list or not
  if (searchGpu) {
    if (gpusFound.length > 0) {
      totalPages = Math.ceil(gpusFound.length / ITEMS_PER_PAGE) || 0;
      paginatedData = paginateData(gpusFound, ITEMS_PER_PAGE, currentPage);
    }
  } else {
    if (gpus.length > 0) {
      totalPages = Math.ceil(gpus.length / ITEMS_PER_PAGE) || 0;
      paginatedData = paginateData(gpus, ITEMS_PER_PAGE, currentPage);
    }
  }

  // Prevents invalid page numbers
  if (
    currentPage > totalPages ||
    currentPage < 1
  ) {
    setSearchParams({ page: "1" });
  }

  // Render the list data tables
  return (
    <>
      <List gpuList={paginatedData} />

      <PaginationWrapper totalPages={totalPages} currentPage={currentPage} />
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
