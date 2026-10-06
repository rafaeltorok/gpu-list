import GpuDataRow from "../GpuDataRow";

import type { GpuType } from "../../../../../shared/types/types";

interface ClocksSectionProps {
  gpuHeaderClass: string;
  gpuData: GpuType;
  setGpuData: (data: GpuType) => void;
  editMode: boolean;
}

export default function ClocksSection({
  gpuHeaderClass,
  gpuData,
  setGpuData,
  editMode,
}: ClocksSectionProps) {
  return (
    <tbody
      id={`${gpuData.id}-clocks`}
      aria-labelledby={`${gpuData.id}-clocks-heading`}
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
  );
}
