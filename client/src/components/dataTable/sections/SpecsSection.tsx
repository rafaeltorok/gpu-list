import DataRow from "../rows/DataRow";

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
    <div
      id={`${gpu.id}-specs`}
      aria-labelledby={`${gpu.id}-specs-heading`}
      className="table-data-section-column"
    >
      <h3
        className="table-division-header"
      >
        SPECIFICATIONS
      </h3>

      <DataRow
        header="CORES"
        data={`${gpu.cores}`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.cores}
        id="cores"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
      <DataRow
        header="TMUs"
        data={`${gpuData.tmus}`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.tmus}
        id="tmus"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
      <DataRow
        header="ROPs"
        data={`${gpuData.rops}`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.rops}
        id="rops"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
      <DataRow
        header="VRAM"
        data={`${vramToDisplay} ${gpuData.memtype}`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.vram}
        id="vram"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
      <DataRow
        header="BUS WIDTH"
        data={`${gpuData.bus} bit`}
        headerClass={gpuHeaderClass}
        editMode={editMode}
        value={gpuData.bus}
        id="bus"
        gpuData={gpuData}
        setGpuData={setGpuData}
      />
    </div>
  );
}
