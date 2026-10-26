import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import PropTypes from "prop-types";
import { useSwipeable } from "react-swipeable";

// Components
import SearchBar from "../ui/SearchBar";
import AddGpuForm from "../AddGpuForm";
import GpuList from "./GpuList";
import PaginationWrapper from "./PaginationWrapper";

import "../../styles/Home.css";

export default function Home({ gpus, onSearch, searchTerm, addGpu, scrollToGpu }) {
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const ITEMS_PER_PAGE = 9;
  
  // Handles the page number param
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page"));

  // Filter the list by search term, if available
  const gpusFound = gpus.filter((g) => {
    return `${g.manufacturer} ${g.gpuline} ${g.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  });

  // Define if the paginated data should be based upon the filtered list or not
  const dataToPaginate = searchTerm ? gpusFound : gpus;

  // Paginate the data into slices for each page
  const paginatedData = paginateData(
    dataToPaginate,
    ITEMS_PER_PAGE,
    currentPage,
  );

  // Total number of pages to be displayed by the MUI Pagination component
  const totalPages = Math.ceil(dataToPaginate.length / ITEMS_PER_PAGE) || 0;

  // Prevents invalid page numbers
  useEffect(() => {
    if (currentPage > totalPages || currentPage < 1) {
      setSearchParams({ page: "1" });
    }
  }, [currentPage, totalPages, setSearchParams]);

  // Handles keyboard navigation
  useEffect(() => {
    function onKeyDown(event) {
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
    onSwiped: (eventData) => {
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

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="home-actions">
          {/* Search bar and add form controls */}
          <SearchBar onSearch={onSearch} searchTerm={searchTerm} />
          <button className="add-gpu-toggle" onClick={toggleAddForm}>
            {showAddForm ? "Cancel" : "Add GPU"}
          </button>
        </div>
      </div>

      {/* Add GPU form */}
      {showAddForm && (
        <div className="add-form-container">
          <AddGpuForm createGpu={addGpu} onCancel={toggleAddForm} />
        </div>
      )}

      {/* Cards list */}
      <GpuList
        gpus={gpus}
        paginatedData={paginatedData}
        searchTerm={searchTerm}
        scrollToGpu={scrollToGpu}
        currentPage={currentPage}
        swipeHandler={swipeHandler}
      />

      {paginatedData.length > 0 && (
        <PaginationWrapper totalPages={totalPages} />
      )}
    </div>
  );
}

// Helper function to handle the data pagination
function paginateData(
  dataToPaginate,
  ITEMS_PER_PAGE,
  currentPage,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = offset + ITEMS_PER_PAGE;

  return dataToPaginate.slice(offset, endIndex);
}

Home.propTypes = {
  gpus: PropTypes.array.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  addGpu: PropTypes.func.isRequired,
  scrollToGpu: PropTypes.string,
};
