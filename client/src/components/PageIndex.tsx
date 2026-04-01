// React Context
import useGpuContext from "../hooks/useGpuContext";

// CSS Styles
import "../styles/PageIndex.css";

// TypeScript types
import type { GpuType } from "../types/gpu";

export default function PageIndex() {
  const {
    dataState: { gpus, gpusFound },
    uiState: { searchGpu, showIndex },
    uiDispatch,
  } = useGpuContext();

  // Scroll to gpu when index item is clicked
  const scrollToGpu = (id: string) => {
    const gpuTable = document.getElementById(id);
    if (gpuTable) {
      gpuTable.scrollIntoView({ behavior: "smooth" });
      const button =
        gpuTable.querySelector<HTMLButtonElement>(".show-hide-button");
      if (button && button.textContent === "Show") {
        button.click();
      }
    }
  };

  function renderIndexItems(gpuList: GpuType[]) {
    return (
      <>
        {gpuList.map((gpu) => (
          <li key={gpu.id}>
            <button
              className="index-item-button"
              onClick={() =>
                scrollToGpu(
                  `${gpu.manufacturer.toLowerCase()}-${gpu.gpuline.toLowerCase()}-${gpu.model.toLowerCase()}`,
                )
              }
            >
              <span
                className={
                  gpu.manufacturer.toLowerCase() === "nvidia"
                    ? "nvidia-model-header"
                    : gpu.manufacturer.toLowerCase() === "amd"
                      ? "amd-model-header"
                      : gpu.manufacturer.toLowerCase() === "intel"
                        ? "intel-model-header"
                        : gpu.gpuline.toLowerCase() === "geforce"
                          ? "nvidia-model-header"
                          : gpu.gpuline.toLowerCase() === "radeon"
                            ? "amd-model-header"
                            : gpu.gpuline.toLowerCase() === "arc"
                              ? "intel-model-header"
                              : "model-header"
                }
              >
                {gpu.manufacturer} {gpu.gpuline} {gpu.model}
              </span>
            </button>
          </li>
        ))}
      </>
    );
  }

  return (
    <div id="page-index">
      <h2 className="page-index-title">
        <button
          id="show-index-button"
          type="button"
          onClick={() =>
            uiDispatch({
              type: "TOGGLE_INDEX",
            })
          }
        >
          {showIndex ? "Hide index" : "Show index"}
        </button>
      </h2>
      {showIndex && (
        <ul className="page-index-list">
          {searchGpu ? renderIndexItems(gpusFound) : renderIndexItems(gpus)}
        </ul>
      )}
    </div>
  );
}
