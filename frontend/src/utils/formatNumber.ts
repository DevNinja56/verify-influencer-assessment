export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  const suffixes = ["K", "M", "B", "T"]; // Thousand, Million, Billion, Trillion
  const tier = Math.floor(Math.log10(num) / 3); // Determine the magnitude (thousands, millions, etc.)
  const suffix = suffixes[tier - 1] || ""; // Get the appropriate suffix (K, M, etc.)

  const scale = Math.pow(10, tier * 3);
  const scaledNumber = num / scale; // Scale the number down

  return `${scaledNumber.toFixed(1)}${suffix}`; // Keep one decimal point for readability
}
