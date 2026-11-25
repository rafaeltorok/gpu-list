// Style the table color scheme respective to the manufacturer colors
export default function getBrand(fullModelName: string): string {
  const lowercaseModel = fullModelName.toLowerCase();

   // Prioritize the manufacturer name first
  if (lowercaseModel.includes("nvidia")) {
    return "nvidia";
  } else if (lowercaseModel.includes("amd")) {
    return "amd";
  } else if (lowercaseModel.includes("intel")) {
    return "intel";
  }

  // If the manufacturer is not one of the main ones, follow the line name
  if (lowercaseModel.includes("geforce")) {
    return "nvidia";
  } else if (lowercaseModel.includes("radeon")) {
    return "amd";
  } else if (lowercaseModel.includes("arc")) {
    return "intel";
  }

  // For generic manufacturers or lines, return a generic class name
  return "default";
}
