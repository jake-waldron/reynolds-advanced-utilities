export function removeParens(productName: string) {
  return productName.replace(/ ?\((?!.*\().*?\)/, "");
}
