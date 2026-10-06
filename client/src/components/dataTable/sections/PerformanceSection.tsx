import calculatePerformance from "../../../../../shared/utils/calculatePerformance";

import PerformanceRow from "../rows/PerformanceRow";

import type { GpuType } from "../../../../../shared/types/types";

interface PerformanceSectionProps {
  gpu: GpuType;
  gpuData: GpuType;
  gpuHeaderClass: string;
}

export default function PerformanceSection({
  gpu,
  gpuData,
  gpuHeaderClass,
}: PerformanceSectionProps) {
  // Calculate the theoretical performance for the current graphics card
  const gpuPerformance = calculatePerformance(gpu);

  return (
    <div
      id={`${gpuData.id}-performance`}
      aria-labelledby={`${gpuData.id}-performance-heading`}
      className="table-data-section-column"
    >
      <h3
        className="table-division-header"
      >
        THEORETICAL PERFORMANCE
      </h3>

      <PerformanceRow
        header="FP32 (float)"
        data={`${gpuPerformance[0]}`}
        headerClass={gpuHeaderClass}
      />
      <PerformanceRow
        header="TEXTURE RATE"
        data={`${gpuPerformance[1]}`}
        headerClass={gpuHeaderClass}
      />
      <PerformanceRow
        header="PIXEL RATE"
        data={`${gpuPerformance[2]}`}
        headerClass={gpuHeaderClass}
      />
      <PerformanceRow
        header="BANDWIDTH"
        data={`${gpuPerformance[3]}`}
        headerClass={gpuHeaderClass}
      />
    </div>
  );
}
