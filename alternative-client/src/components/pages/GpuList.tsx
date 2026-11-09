import { useEffect } from "react";

// Components
import GpuCard from "../ui/GpuCard";
import CardsPerPage from "../ui/CardsPerPage";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { SwipeableHandlers } from "react-swipeable";

interface GpuListProps {
  gpus: GpuType[];
  paginatedData: GpuType[];
  searchTerm: string;
  scrollToGpu: string | null;
  swipeHandler: SwipeableHandlers;
}

export default function GpuList({
  gpus,
  paginatedData,
  searchTerm,
  scrollToGpu,
  swipeHandler,
}: GpuListProps) {
  useEffect(() => {
    if (scrollToGpu) {
      const documentObject = document.getElementById(scrollToGpu);

      if (documentObject) {
        documentObject.scrollIntoView({ behavior: "instant" });
      }
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
