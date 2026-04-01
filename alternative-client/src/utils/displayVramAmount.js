export default function displayVramAmount(vram) {
  return vram < 1 ? `${vram * 1000}MB` : `${vram}GB`;
}
