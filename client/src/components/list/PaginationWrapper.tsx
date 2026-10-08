import { Pagination } from "@mui/material";
import { useSearchParams } from "react-router";

// TypeScript types
import type { ChangeEvent } from "react";

interface PaginationWrapperProps {
  totalPages: number;
  currentPage: number;
}

export default function PaginationWrapper({ totalPages, currentPage }: PaginationWrapperProps) {
  const [_searchParams, setSearchParams] = useSearchParams();

  // Handles inserting the current page number into the URL
  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
  }

  return (
    <div className="pagination">
      <Pagination
        count={totalPages}
        page={currentPage}
        shape="rounded"
        color="primary"
        showFirstButton showLastButton
        siblingCount={0}
        onChange={handlePageChange}
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#fff',
          },
        }}
      />
    </div>
  );
}
