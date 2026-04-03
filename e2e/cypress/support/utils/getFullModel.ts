// TypeScript types
import type { GpuInputType } from "../../../../shared/types/types";

// Properly format a card's full model name
export default function getFullModel(gpu: GpuInputType): string {
  if (!gpu.gpuline.trim()) {
    // remove any whitespace when the card has no specific line
    return `${gpu.manufacturer} ${gpu.model}`;
  }
  return `${gpu.manufacturer} ${gpu.gpuline} ${gpu.model}`;
}
