import type { GpuType } from "../../../../../shared/types/types";

interface ModelTitleProps {
  gpu: GpuType;
  gpuHeaderClass: string;
}

export default function ModelTitle({ gpu, gpuHeaderClass }: ModelTitleProps) {
  return (
    <tr>
      <th id={`${gpu.id}-heading`} className={gpuHeaderClass} colSpan={2}>
        {/* Filters out an empty GPU line to prevent two whitespaces in the full model name */}
        {[gpu.manufacturer, gpu.gpuline, gpu.model]
          .filter(Boolean)
          .join(" ")}
      </th>
    </tr>
  );
}
