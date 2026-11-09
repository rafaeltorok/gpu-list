export default function displayVramAmount(vram: number): string {
  return vram < 1 ? `${vram * 1000}MB` : `${vram}GB`;
}
