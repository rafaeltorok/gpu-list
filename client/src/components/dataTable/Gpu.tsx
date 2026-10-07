import { useState, useEffect } from "react";

// Custom hooks
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import generateGpuDomId from "../../../../shared/utils/generateGpuDomId";

// Components
import ModelTitle from "./sections/ModelTitle";
import SpecsSection from "./sections/SpecsSection";
import ClocksSection from "./sections/ClocksSection";
import PerformanceSection from "./sections/PerformanceSection";
import TableControls from "./sections/TableControls";

// CSS Styles
import "../../styles/Gpu.css";
import "../../styles/ManufacturerColors.css";

// TypeScript types
import type { GpuType } from "../../../../shared/types/types";
import type { UpdateGpuDataProps } from "../../types/componentProps";

interface GpuProps {
  gpu: GpuType;
}

// Helper functions
// Style the table color scheme respective to the manufacturer colors
function getClass(fullModelName: string): string {
  if (fullModelName.includes("nvidia") || fullModelName.includes("geforce")) {
    return "nvidia-model-header";
  } else if (
    fullModelName.includes("amd") ||
    fullModelName.includes("radeon")
  ) {
    return "amd-model-header";
  } else if (fullModelName.includes("intel") || fullModelName.includes("arc")) {
    return "intel-model-header";
  }
  return "model-header";
}

// Update the GPU data when clicking on the "Edit" button
async function updateGpuData({
  gpu,
  setEditMode,
  editGpu,
}: UpdateGpuDataProps): Promise<void> {
  const updateSuccess = await editGpu(gpu);
  if (updateSuccess) {
    alert(
      `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} specs were updated!`,
    );
    setEditMode(false);
  } else {
    alert(
      `Failed to update ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model} specs`,
    );
  }
}

// Component
export default function Gpu({ gpu }: GpuProps) {
  // Create an editable backup based on the original data
  const [gpuData, setGpuData] = useState<GpuType>(gpu);

  // Table controls
  const [showBody, setShowBody] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Access the React context
  const {
    uiState: { showAll },
  } = useGpuContext();

  // Sync individual state with global "Show All" toggle
  useEffect(() => {
    setShowBody(showAll);
  }, [showAll]);

  // Get the classname to customize the table color scheme based on the manufacturer
  const gpuHeaderClass = getClass(
    `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`.toLowerCase(),
  );

  return (
    <div
      id={generateGpuDomId(gpu)}
      className="gpu-data-table"
      aria-label={`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
      data-testid="gpu-data-table"
    >
      <div className="top-table-section">
        {/* Full model name for the data table main title */}
        <ModelTitle gpu={gpu} gpuHeaderClass={gpuHeaderClass} />

        {/* Hide button row */}
        <div className="table-header">
          <button
            className="show-hide-button"
            onClick={() => {
              setShowBody(!showBody);
              setEditMode(false);
              setGpuData({ ...gpu }); // Reset any modifications when clicking on Hide
            }}
            aria-expanded={showBody}
            aria-controls={`${gpu.id}-specs ${gpu.id}-clocks ${gpu.id}-performance ${gpu.id}-delete`}
          >
            {showBody ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Data section - main table body */}
      {showBody && (
        <>
          <div className="table-data-section">
            <SpecsSection
              gpu={gpu}
              gpuHeaderClass={gpuHeaderClass}
              gpuData={gpuData}
              setGpuData={setGpuData}
              editMode={editMode}
            />

            <ClocksSection
              gpuData={gpuData}
              gpuHeaderClass={gpuHeaderClass}
              setGpuData={setGpuData}
              editMode={editMode}
            />

            <PerformanceSection
              gpu={gpu}
              gpuData={gpuData}
              gpuHeaderClass={gpuHeaderClass}
            />
          </div>

          {/* Controls section - handles edit mode and removing a card */}
          <TableControls
            gpu={gpu}
            gpuData={gpuData}
            setGpuData={setGpuData}
            editMode={editMode}
            setEditMode={setEditMode}
            updateGpuData={updateGpuData}
          />
        </>
      )}
    </div>
  );
}
