// Component dependencies
import { useState, useEffect } from "react";
import useGpuContext from "../hooks/useGpuContext";

// Utils
import calculatePerformance from "../../../shared/utils/calculatePerformance";
import generateGpuDomId from "../../../shared/utils/generateGpuDomId";

// React components
import GpuDataRow from "./GpuDataRow";
import GpuPerformanceRow from "./GpuPerformanceRow";

// TypeScript types
import type { GpuType } from "../../../shared/types/types";

// CSS Styles
import "../styles/Gpu.css";
import "../styles/ManufacturerColors.css";

type GpuProps = {
  gpu: GpuType;
};

export default function Gpu({ gpu }: GpuProps) {
  const [showBody, setShowBody] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [gpuData, setGpuData] = useState<GpuType>(gpu);

  // Access the React context
  const {
    deleteGpu,
    editGpu,
    uiState: { showAll },
  } = useGpuContext();

  // Utilities
  const gpuPerformance = calculatePerformance(gpu);
  const vramToDisplay = gpu.vram < 1 ? `${gpu.vram * 1000}MB` : `${gpu.vram}GB`;

  // Sync individual state with global "Show All" toggle
  useEffect(() => {
    setShowBody(showAll);
  }, [showAll]);

  function getClass(fullModelName: string): string {
    if (fullModelName.includes("nvidia") || fullModelName.includes("geforce")) {
      return "nvidia-model-header";
    } else if (
      fullModelName.includes("amd") ||
      fullModelName.includes("radeon")
    ) {
      return "amd-model-header";
    } else if (
      fullModelName.includes("intel") ||
      fullModelName.includes("arc")
    ) {
      return "intel-model-header";
    }
    return "model-header";
  }

  async function updateGpuData(): Promise<void> {
    const updateSuccess = await editGpu(gpuData);
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

  const gpuHeaderClass = getClass(
    `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`.toLowerCase(),
  );

  return (
    <table
      id={generateGpuDomId(gpu)}
      className="gpu-data-table"
      aria-label={`${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
      data-testid="gpu-data-table"
    >
      <thead>
        <tr>
          <th id={`${gpu.id}-heading`} className={gpuHeaderClass} colSpan={2}>
            {/* Filters out an empty GPU line to prevent two whitespaces in the full model name */}
            {[gpu.manufacturer, gpu.gpuline, gpu.model]
              .filter(Boolean)
              .join(" ")}
          </th>
        </tr>
        <tr>
          <th colSpan={2} className="table-header">
            <button
              className="show-hide-button"
              onClick={() => setShowBody(!showBody)}
              aria-expanded={showBody}
              aria-controls={`${gpu.id}-specs ${gpu.id}-clocks ${gpu.id}-performance ${gpu.id}-delete`}
            >
              {showBody ? "Hide" : "Show"}
            </button>
          </th>
        </tr>
      </thead>
      {showBody && (
        <>
          <tbody
            id={`${gpu.id}-specs`}
            aria-labelledby={`${gpu.id}-specs-heading`}
          >
            <tr>
              <th className="table-header" colSpan={2}>
                SPECIFICATIONS
              </th>
            </tr>
            <GpuDataRow
              header="CORES"
              data={`${gpuData.cores}`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.cores}
              id="cores"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="TMUs"
              data={`${gpuData.tmus}`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.tmus}
              id="tmus"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="ROPs"
              data={`${gpuData.rops}`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.rops}
              id="rops"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="VRAM"
              data={`${vramToDisplay} ${gpuData.memtype}`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.vram}
              id="vram"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="BUS WIDTH"
              data={`${gpuData.bus} bit`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.bus}
              id="bus"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
          </tbody>

          <tbody
            id={`${gpu.id}-clocks`}
            aria-labelledby={`${gpu.id}-clocks-heading`}
          >
            <tr>
              <th className="table-header" colSpan={2}>
                CLOCK SPEEDS
              </th>
            </tr>
            <GpuDataRow
              header="BASE CLOCK"
              data={`${gpuData.baseclock} MHz`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.baseclock}
              id="baseclock"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="BOOST CLOCK"
              data={`${gpuData.boostclock} MHz`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.boostclock}
              id="boostclock"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
            <GpuDataRow
              header="MEMORY CLOCK"
              data={`${gpuData.memclock} Gbps effective`}
              headerClass={gpuHeaderClass}
              editMode={editMode}
              value={gpuData.memclock}
              id="memclock"
              gpuData={gpuData}
              setGpuData={setGpuData}
            />
          </tbody>

          <tbody
            id={`${gpu.id}-performance`}
            aria-labelledby={`${gpu.id}-performance-heading`}
          >
            <tr>
              <th className="table-header" colSpan={2}>
                THEORETICAL PERFORMANCE
              </th>
            </tr>
            <GpuPerformanceRow
              header="FP32(float)"
              data={`${gpuPerformance[0]}`}
              headerClass={gpuHeaderClass}
            />
            <GpuPerformanceRow
              header="TEXTURE RATE"
              data={`${gpuPerformance[1]}`}
              headerClass={gpuHeaderClass}
            />
            <GpuPerformanceRow
              header="PIXEL RATE"
              data={`${gpuPerformance[2]}`}
              headerClass={gpuHeaderClass}
            />
            <GpuPerformanceRow
              header="BANDWIDTH"
              data={`${gpuPerformance[3]}`}
              headerClass={gpuHeaderClass}
            />
          </tbody>

          <tfoot id={`${gpu.id}-delete`}>
            <tr>
              <td colSpan={2} id="edit-gpu-button">
                {editMode ? (
                  <button
                    aria-label={`Edit ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                    onClick={() => void updateGpuData()}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    aria-label={`Edit ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                    onClick={() => void setEditMode(true)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={2} id="delete-gpu-button">
                <button
                  aria-label={`Delete ${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`}
                  onClick={() => void deleteGpu(gpu)}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tfoot>
        </>
      )}
    </table>
  );
}
