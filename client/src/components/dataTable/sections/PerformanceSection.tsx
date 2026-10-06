import calculatePerformance from "../../../../../shared/utils/calculatePerformance";

import GpuPerformanceRow from "../GpuPerformanceRow";

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
    <tbody
      id={`${gpuData.id}-performance`}
      aria-labelledby={`${gpuData.id}-performance-heading`}
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
  );
}
