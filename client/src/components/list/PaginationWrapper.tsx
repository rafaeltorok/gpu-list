import { Pagination } from "@mui/material";
import { useSearchParams } from "react-router";

// TypeScript types
import type { ChangeEvent } from "react";

interface PaginationWrapperProps {
  totalPages: number;
}

export default function PaginationWrapper({
  totalPages,
}: PaginationWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Handles inserting the current page number into the URL
  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    // Get the current cards per page value if available
    const limit = searchParams.get("limit") || 10;

    setSearchParams({ page: String(page), limit: String(limit) });
  };

  return (
    <footer>
      <Pagination
        count={totalPages}
        page={Number(searchParams.get("page")) || 1}
        shape="rounded"
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={0}
        onChange={handlePageChange}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#fff",
          },
        }}
      />
    </footer>
  );
}
