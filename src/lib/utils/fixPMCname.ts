export function fixPMCName(productName: string) {
  return productName.replace(/PMC-/, "PMC").replace(/ DRY/, "");
}
