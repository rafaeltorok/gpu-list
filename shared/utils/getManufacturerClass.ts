// Style the table color scheme respective to the manufacturer colors
export default function getManufacturerClass(fullModelName: string): string {
  const lowercaseModelName = fullModelName.toLowerCase();

  if (lowercaseModelName.includes("nvidia") || lowercaseModelName.includes("geforce")) {
    return "nvidia-model-header";
  } else if (
    lowercaseModelName.includes("amd") ||
    lowercaseModelName.includes("radeon")
  ) {
    return "amd-model-header";
  } else if (lowercaseModelName.includes("intel") || lowercaseModelName.includes("arc")) {
    return "intel-model-header";
  }
  return "model-header";
}
