// TypeScript types
import type { GpuType, GpuInputType } from "../types/types";

// Helper function
function isValidData(data: unknown): boolean {
  return typeof data === 'number' && Number.isFinite(data) && data > 0;
}

// Calculate Performance util
export default function calculatePerformance(gpu: GpuType | GpuInputType): string[] {
  return [
    getFp32(gpu.model, gpu.cores, gpu.boostclock),
    getTextureRate(gpu.tmus, gpu.boostclock),
    getPixelRate(gpu.rops, gpu.boostclock),
    getBandwidth(gpu.bus, gpu.memclock),
  ];
}

function getFp32(model: string, cores: number, coreclock: number): string {
  // Guard against invalid values
  if (
    model.trim() === "" || 
    !isValidData(cores) ||
    !isValidData(coreclock)
  ) {
    return("N/A");
  }

  // Define the amount of IPC based on the graphics card model
  const factor =
    model.toLowerCase().includes("rx 7") ||
    model.toLowerCase().includes("rx 90")
      ? 4
      : 2;

  // Calculate the FP32 performance
  const fp32Performance = (cores * coreclock * factor) / 1000000;
  return fp32Performance < 1
    ? (fp32Performance * 1000).toFixed(2) + " GFLOPS"
    : fp32Performance.toFixed(2) + " TFLOPS";
}

function getTextureRate(tmus: number, coreclock: number): string {
  // Guard against invalid values
  if (
    !isValidData(tmus) ||
    !isValidData(coreclock)
  ) {
    return("N/A");
  }

  return ((tmus * coreclock) / 1000).toFixed(2) + " GTexel/s";
}

function getPixelRate(rops: number, coreclock: number): string {
  // Guard against invalid values
  if (
    !isValidData(rops) ||
    !isValidData(coreclock)
  ) {
    return("N/A");
  }
  
  return ((rops * coreclock) / 1000).toFixed(2) + " GPixel/s";
}

function getBandwidth(bus: number, memclock: number): string {
  // Guard against invalid values
  if (
    !isValidData(bus) ||
    !isValidData(memclock)
  ) {
    return("N/A");
  }

  return ((bus * memclock) / 8).toFixed(2) + " GB/s";
}
