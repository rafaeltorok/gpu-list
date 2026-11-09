import { useState, useEffect } from "react";

// Custom hooks
import useGpuContext from "../../hooks/useGpuContext";

// Utils
import generateGpuDomId from "../../../../shared/utils/generateGpuDomId";
import getManufacturerClass from "../../../../shared/utils/getManufacturerClass";

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

interface GpuProps {
  gpu: GpuType;
}

// Component
export default function Gpu({ gpu }: GpuProps) {
  // Create an editable object based on the original data
  const [gpuData, setGpuData] = useState<GpuType>(gpu);

  // Table controls
  const [showBody, setShowBody] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [overrideMode, setOverrideMode] = useState(false);

  // Access the React context
  const {
    uiState: { showAll },
    uiDispatch,
    editGpu,
  } = useGpuContext();

  // Sync individual state with global "Show All" toggle
  useEffect(() => {
    setShowBody(showAll);
  }, [showAll]);

  // Update the GPU data when clicking on the "Edit" button
  async function updateGpuData(): Promise<void> {
    if (
      gpuData.manufacturer.trim() === "" ||
      gpuData.model.trim() === "" ||
      gpuData.cores < 1 ||
      gpuData.tmus < 1 ||
      gpuData.rops < 1 ||
      gpuData.vram < 0.016 ||
      gpuData.bus < 1 ||
      gpuData.memtype.trim() === "" ||
      gpuData.baseclock < 1 ||
      gpuData.boostclock < 1 ||
      gpuData.memclock < 0.01
    ) {
      uiDispatch({
        type: "SET_DIALOG_MESSAGE",
        payload: "Failed to update the specs",
      });
      uiDispatch({
        type: "TOGGLE_NOTIFICATION_MESSAGE",
        payload: true,
      });
      return;
    }

    const updateSuccess = await editGpu(gpuData);
    if (updateSuccess) {
      setEditMode(false);
    }
  }

  // Get the classname to customize the table color scheme based on the manufacturer
  const gpuHeaderClass = getManufacturerClass(
    `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`,
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
              setOverrideMode(false);
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
              overrideMode={overrideMode}
            />

            <PerformanceSection
              gpuData={gpuData}
              gpuHeaderClass={gpuHeaderClass}
            />
          </div>

          {/* Controls section - handles edit mode and removing a card */}
          <TableControls
            gpu={gpu}
            setGpuData={setGpuData}
            updateGpuData={updateGpuData}
            editMode={editMode}
            setEditMode={setEditMode}
            overrideMode={overrideMode}
            setOverrideMode={setOverrideMode}
          />
        </>
      )}
    </div>
  );
}
