import type { GpuType } from "../../../../../shared/types/types";

interface ModelTitleProps {
  gpu: GpuType;
  gpuHeaderClass: string;
}

export default function ModelTitle({ gpu, gpuHeaderClass }: ModelTitleProps) {
  return (
    <div id={`${gpu.id}-heading`} className={`${gpuHeaderClass} table-main-title`}>
      {/* Filters out an empty GPU line to prevent two whitespaces in the full model name */}
      {[gpu.manufacturer, gpu.gpuline, gpu.model].filter(Boolean).join(" ")}
    </div>
  );
}
