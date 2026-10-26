import { useEffect } from "react";
import GpuCard from "../ui/GpuCard";
import PropTypes from "prop-types";

export default function GpuList({ gpus, paginatedData, searchTerm, scrollToGpu, swipeHandler }) {
  useEffect(() => {
    if (scrollToGpu) {
      document
        .getElementById(scrollToGpu)
        .scrollIntoView({ behavior: "instant" });
    }
  }, [scrollToGpu]);

  return (
    <main>
      <section { ...swipeHandler }>
        {gpus.length === 0 && searchTerm !== "" ? (
          <div className="no-results">
            <p>No GPUs found matching: {searchTerm}</p>
          </div>
        ) : (
          <div className="gpu-grid">
            {paginatedData.map((gpu) => (
              <GpuCard key={gpu.id} gpu={gpu} />
            ))}
          </div>
        )}
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
