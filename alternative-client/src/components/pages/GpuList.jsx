import { useEffect } from "react";

// Components
import GpuCard from "../ui/GpuCard";
import CardsPerPage from "../ui/CardsPerPage";

import PropTypes from "prop-types";

export default function GpuList({
  gpus,
  paginatedData,
  searchTerm,
  scrollToGpu,
  swipeHandler,
}) {
  useEffect(() => {
    if (scrollToGpu) {
      document
        .getElementById(scrollToGpu)
        .scrollIntoView({ behavior: "instant" });
    }
  }, [scrollToGpu]);

  // No GPUs available
  if (gpus.length === 0 && !searchTerm) {
    return (
      <main>
        <div className="no-results">
          <p>No GPUs available on the database</p>
        </div>
      </main>
    );
  }

  // No search results
  if (gpus.length === 0 && searchTerm !== "") {
    return (
      <div className="no-results">
        <p>No GPUs found matching: {searchTerm}</p>
      </div>
    );
  }

  return (
    <main>
      <CardsPerPage />

      <section {...swipeHandler}>
        <div className="gpu-grid">
          {paginatedData.map((gpu) => (
            <GpuCard key={gpu.id} gpu={gpu} />
          ))}
        </div>
      </section>
    </main>
  );
}

GpuList.propTypes = {
  gpus: PropTypes.array.isRequired,
  paginatedData: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  scrollToGpu: PropTypes.string,
  swipeHandler: PropTypes.object.isRequired,
};
