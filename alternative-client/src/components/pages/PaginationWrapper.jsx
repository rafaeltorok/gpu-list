import { Pagination } from "@mui/material";
import { useSearchParams } from "react-router";
import PropTypes from "prop-types";
import "../../styles/Footer.css";

export default function PaginationWrapper({ totalPages }) {
  // Define the search params to access the URL queries
  const [searchParams, setSearchParams] = useSearchParams();

  // Handles inserting the current page number into the URL
  const handlePageChange = (_event, page) => {
    setSearchParams({ page: String(page) });
  };

  return (
    <footer className="pagination">
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
    </footer>
  );
}

PaginationWrapper.propTypes = {
  totalPages: PropTypes.number.isRequired,
};
