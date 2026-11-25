export default function displayVramAmount(vram: number): string {
  // Return N/A for invalid VRAM amounts
  if (!vram || typeof vram !== "number" || Number(vram) <= 0) {
    return "N/A";
  }
  
  return vram < 1 ? `${vram * 1000}MB` : `${vram}GB`;
}
