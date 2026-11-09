import { Pagination } from "@mui/material";
import { useSearchParams } from "react-router";

import useLimit from "../../hooks/useLimit";

import "../../styles/Footer.css";

// TypeScript types
import type { ChangeEvent } from "react";

interface PaginationWrapperProps {
  totalPages: number;
}

export default function PaginationWrapper({
  totalPages,
}: PaginationWrapperProps) {
  // Define the search params to access the URL queries
  const [searchParams, setSearchParams] = useSearchParams();

  // Prevent the amount of cards per page from being erased
  const { limit } = useLimit();

  // Handles inserting the current page number into the URL
  const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
    setSearchParams({ page: String(page), limit: String(limit) });
  };

  return (
    <div className="pagination">
      {totalPages > 0 && (
        <Pagination
          count={totalPages}
          page={Number(searchParams.get("page")) || 1}
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          siblingCount={0}
          boundaryCount={0}
          onChange={handlePageChange}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#fff",
            },
          }}
        />
      )}
    </div>
  );
}
