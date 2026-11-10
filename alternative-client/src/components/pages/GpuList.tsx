import useGpuContext from "../../hooks/useGpuContext";

// Components
import GpuCard from "../ui/GpuCard";
import CardsPerPage from "../ui/CardsPerPage";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { SwipeableHandlers } from "react-swipeable";

interface GpuListProps {
  paginatedData: GpuType[];
  swipeHandler: SwipeableHandlers;
}

export default function GpuList({
  paginatedData,
  swipeHandler,
}: GpuListProps) {
  const { dataState, uiState } = useGpuContext();

  // No GPUs available
  if (dataState.gpus.length === 0 && !uiState.searchTerm) {
    return (
      <main>
        <div className="no-results">
          <p>No GPUs available on the database</p>
        </div>
      </main>
    );
  }

  // No search results
  if (dataState.gpusFound.length === 0 && uiState.searchTerm !== "") {
    return (
      <div className="no-results">
        <p>No GPUs found matching: {uiState.searchTerm}</p>
      </div>
    );
  }

  return (
    <main>
      <CardsPerPage />

      <section {...swipeHandler}>
        <div className="gpu-grid">
          {paginatedData.map((gpu: GpuType) => (
            <GpuCard key={gpu.id} gpu={gpu} />
          ))}
        </div>
      </section>
    </main>
  );
}
