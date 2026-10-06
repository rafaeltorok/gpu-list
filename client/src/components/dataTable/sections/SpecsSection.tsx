import GpuDataRow from "../GpuDataRow";

import type { GpuType } from "../../../../../shared/types/types";

interface SpecsSectionProps {
  gpu: GpuType;
  gpuHeaderClass: string;
  gpuData: GpuType;
  setGpuData: (data: GpuType) => void;
  editMode: boolean;
}

export default function SpecsSection({
  gpu,
  gpuHeaderClass,
  gpuData,
  setGpuData,
  editMode,
}: SpecsSectionProps) {
  // Format the VRAM amount in either GB or MB
  const vramToDisplay = gpu.vram < 1 ? `${gpu.vram * 1000}MB` : `${gpu.vram}GB`;

  return (
    <tbody id={`${gpu.id}-specs`} aria-labelledby={`${gpu.id}-specs-heading`}>
      <tr>
        <th className="table-header" colSpan={2}>
          SPECIFICATIONS
        </th>
      </tr>
      <GpuDataRow
        header="CORES"
        data={`${gpu.cores}`}
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
  );
}
