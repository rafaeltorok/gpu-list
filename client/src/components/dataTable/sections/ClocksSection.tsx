import DataRow from "../rows/DataRow";

import type { GpuType } from "../../../../../shared/types/types";

interface ClocksSectionProps {
  gpuHeaderClass: string;
  gpuData: GpuType;
  setGpuData: (data: GpuType) => void;
  editMode: boolean;
  overrideMode?: boolean;
}

export default function ClocksSection({
  gpuHeaderClass,
  gpuData,
  setGpuData,
  editMode,
  overrideMode,
}: ClocksSectionProps) {
  return (
    <div
      id={`${gpuData.id}-clocks`}
      aria-labelledby={`${gpuData.id}-clocks-heading`}
      className="table-data-section-column"
    >
      <h3 className="table-division-header">CLOCK SPEEDS</h3>

      <DataRow
        header="BASE CLOCK"
        data={`${gpuData.baseclock} MHz`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.baseclock}
        id="baseclock"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
      <DataRow
        header="BOOST CLOCK"
        data={`${gpuData.boostclock} MHz`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.boostclock}
        id="boostclock"
        gpuData={gpuData}
        setGpuData={setGpuData}
        overrideMode={overrideMode}
      />
      <DataRow
        header="MEMORY CLOCK"
        data={`${gpuData.memclock} Gbps effective`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.memclock}
        id="memclock"
        gpuData={gpuData}
        setGpuData={setGpuData}
        overrideMode={overrideMode}
      />
    </div>
  );
}
