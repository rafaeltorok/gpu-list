// TypeScript types
import type { GpuInputType, GpuType } from "../types/types";

// Util
export default function generateGpuDomId(gpu: GpuType | GpuInputType): string {
  if (!gpu) {
    return "";
  }

  if (
    !gpu.manufacturer ||
    !gpu.manufacturer.trim() ||
    !gpu.model ||
    !gpu.model.trim()
  ) {
    return "";
  }

  const fullModelName = `${gpu.manufacturer.trim()}-${gpu.gpuline.trim()}-${gpu.model.trim()}`;
  return fullModelName.replace(/\s+/g, '-').replace(/-{2,}/g, '-').toLowerCase();
}
