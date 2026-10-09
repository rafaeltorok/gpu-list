// Utils
import getManufacturerClass from "../../../../shared/utils/getManufacturerClass";
import generateGpuDomId from "../../../../shared/utils/generateGpuDomId";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";

interface IndexEntryProps {
  gpu: GpuType;
}

export default function IndexEntry({ gpu }: IndexEntryProps) {
  // Scroll to the respective data table when clicking on an index entry
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

  return (
    <li key={gpu.id}>
      <button
        className="index-item-button"
        onClick={() => scrollToGpu(generateGpuDomId(gpu))}
      >
        <span
          className={getManufacturerClass(
            `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`,
          )}
        >
          {gpu.manufacturer} {gpu.gpuline} {gpu.model}
        </span>
      </button>
    </li>
  );
}
