// Context
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import generateGpuDomId from "../../../../shared/utils/generateGpuDomId";

// Components
import Gpu from "../dataTable/Gpu";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

interface ListProps {
  gpuList: GpuType[];
}

export default function List({ gpuList }: ListProps) {
  const {
    dataState: { gpusFound },
    uiState: { searchGpu, showAll },
  } = useGpuContext();

  // Search term not found
  if (searchGpu && gpusFound.length === 0) {
    return <div>No GPUs found</div>; 
  }

  // Render the list of available cards
  return (
    <>
      {gpuList.length < 1 ? (
        <div>No GPUs available</div>
      ) : (
        gpuList.map((gpu) => (
          <section
            key={gpu.id}
            className="table-container"
            aria-labelledby={`${gpu.id}-heading`}
          >
            <Gpu gpu={gpu} />
            <button
              className="back-to-index-button"
              onClick={() => scrollToIndex(generateGpuDomId(gpu), showAll)}
            >
              Back to Index
            </button>
          </section>
        ))
      )}
    </>
  );
}

// Handles scrolling back to the index
function scrollToIndex(gpuTableId: string, showAll: boolean) {
  // Scroll to the add gpu form position
  const element = document.querySelector(".add-gpu-form");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  // Collapse the respective data table clicked on
  const gpuTable = document.getElementById(gpuTableId);
  const hideButton =
    gpuTable?.querySelector<HTMLButtonElement>(".show-hide-button");

  if (
    hideButton &&
    hideButton.getAttribute("aria-expanded") === "true" &&
    !showAll
  ) {
    hideButton.click();
  }
}
