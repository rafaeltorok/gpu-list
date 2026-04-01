export default function getBrand(gpu) {
  if (
    gpu.manufacturer.toLowerCase() === "nvidia" ||
    gpu.gpuline.toLowerCase() === "geforce"
  ) {
    return "nvidia";
  } else if (
    gpu.manufacturer.toLowerCase() === "amd" ||
    gpu.gpuline.toLowerCase() === "radeon"
  ) {
    return "amd";
  } else if (
    gpu.manufacturer.toLowerCase() === "intel" ||
    gpu.gpuline.toLowerCase() === "arc"
  ) {
    return "intel";
  } else {
    return "";
  }
}
