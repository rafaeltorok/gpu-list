// React Context
import useGpuContext from "../hooks/useGpuContext";

// Utils
import generateGpuDomId from "../../../shared/utils/generateGpuDomId";
import getManufacturerClass from "../../../shared/utils/getManufacturerClass";

// CSS Styles
import "../styles/PageIndex.css";

// TypeScript types
import type { GpuType } from "../../../shared/types/types";

// Component
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

  function renderIndexItems() {
    const indexItems: GpuType[] = searchGpu.trimStart() ? gpusFound : gpus;

    if (indexItems.length === 0) {
      return null;
    }

    return (
      <ul className="index-list">
        {indexItems.map((gpu) => (
          <li key={gpu.id}>
            <button
              className="index-item-button"
              onClick={() => scrollToGpu(generateGpuDomId(gpu))}
            >
              <span
                className={getManufacturerClass(`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`)}
              >
                {gpu.manufacturer} {gpu.gpuline} {gpu.model}
              </span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div id="page-index-container">
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
      {showIndex && (
        <div className="index-list-container">{renderIndexItems()}</div>
      )}
    </div>
  );
}
