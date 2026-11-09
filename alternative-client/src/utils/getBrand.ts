// Style the table color scheme respective to the manufacturer colors
export default function getBrand(fullModelName: string): string {
  const lowercaseModelName = fullModelName.toLowerCase();

  if (
    lowercaseModelName.includes("nvidia") ||
    lowercaseModelName.includes("geforce")
  ) {
    return "nvidia";
  } else if (
    lowercaseModelName.includes("amd") ||
    lowercaseModelName.includes("radeon")
  ) {
    return "amd";
  } else if (
    lowercaseModelName.includes("intel") ||
    lowercaseModelName.includes("arc")
  ) {
    return "intel";
  }
  return "default";
}
