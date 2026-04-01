// React context
import useGpuContext from "../hooks/useGpuContext";

// React components
import Gpu from "./Gpu";

// TypeScript types
import type { GpuType } from "../types/gpu";

export default function GpuList() {
  const {
    dataState: { gpus, gpusFound },
    uiState: { searchGpu },
  } = useGpuContext();

  function scrollToIndex(gpuTableId: string) {
    const element = document.querySelector(".add-gpu-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });

      const gpuTable = document.getElementById(gpuTableId);
      const hideButton =
        gpuTable?.querySelector<HTMLButtonElement>(".show-hide-button");
      const showAllButton: HTMLElement | null =
        document.getElementById("show-all-button");

      if (
        hideButton &&
        hideButton.textContent === "Hide" &&
        showAllButton?.textContent === "Show all data"
      ) {
        hideButton.click();
      }
    }
  }

  function renderGpuList(gpuList: GpuType[]) {
    return (
      <>
        {gpuList.map((gpu) => (
          <div key={gpu.id}>
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
          </div>
        ))}
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
