import { Pagination } from "@mui/material";
import { useSearchParams } from "react-router";

// TypeScript types
import type { ChangeEvent } from "react";

interface PaginationWrapperProps {
  totalPages: number;
}

export default function PaginationWrapper({ totalPages }: PaginationWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handles inserting the current page number into the URL
  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    console.log("Pagination clicked:", page);
    setSearchParams({ page: String(page) });
  }

  return (
    <div className="pagination">
      <Pagination
        count={totalPages}
        page={Number(searchParams.get("page")) || 1}
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
