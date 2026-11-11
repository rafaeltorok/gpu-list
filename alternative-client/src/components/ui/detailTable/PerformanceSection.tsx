import calculatePerformance from "../../../../../shared/utils/calculatePerformance";
import PerformanceItem from "./PerformanceItem";

// TypeScript types
import type { GpuType } from "../../../../../shared/types/types";

interface PerformanceSectionProps {
  editableData: GpuType;
}

export default function PerformanceSection({
  editableData,
}: PerformanceSectionProps) {
  // Calculate the Theoretical performance for the current card
  const gpuPerformance = calculatePerformance(editableData);

  return (
    <div className="gpu-detail-section">
      <h2>Performance</h2>
      <div className="specs-grid">
        <PerformanceItem
          label={"FP32(float)"}
          data={gpuPerformance[0]}
        />
        <PerformanceItem
          label={"Texture Rate"}
          data={gpuPerformance[1]}
        />
        <PerformanceItem
          label={"Pixel Rate"}
          data={gpuPerformance[2]}
        />
        <PerformanceItem
          label={"Bandwidth"}
          data={gpuPerformance[3]}
        />
      </div>
    </div>
  );
}
