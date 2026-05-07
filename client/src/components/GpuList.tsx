// React context
import useGpuContext from "../hooks/useGpuContext";

// React components
import Gpu from "./Gpu";

// TypeScript types
import type { GpuType } from "../../../shared/types/types";

export default function GpuList() {
  const {
    dataState: { gpus, gpusFound },
    uiState: { searchGpu, showAll },
  } = useGpuContext();

  function scrollToIndex(gpuTableId: string) {
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

  function renderGpuList(gpuList: GpuType[]) {
    return (
      <>
        {gpuList.length < 1 ? (
          <div>No GPUs available</div>
        ) : (
          gpuList.map((gpu) => (
            <section key={gpu.id} aria-labelledby={`${gpu.id}-heading`}>
              <Gpu gpu={gpu} />
              <button
                className="back-to-index-button"
                onClick={() =>
                  scrollToIndex(
                    `${gpu.manufacturer.toLowerCase()}-${gpu.gpuline.toLowerCase()}-${gpu.model.toLowerCase()}`,
                  )
                }
              >
                Back to Index
              </button>
            </section>
          ))
        )}
      </>
    );
  }

  return (
    <>
      {searchGpu ? (
        gpusFound.length > 0 ? (
          renderGpuList(gpusFound)
        ) : (
          <div>No GPUs found</div>
        )
      ) : (
        renderGpuList(gpus)
      )}
    </>
  );
}
