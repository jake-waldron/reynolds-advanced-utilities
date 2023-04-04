const digits: Record<string, number> = {
  III: 3,
  IV: 4,
  V: 5,
  VI: 6,
  VII: 7,
  VIII: 8,
  IX: 9,
  X: 10,
};

export function fixRomanNumerals(productName: string) {
  const romanNumeralMatch = productName.match(
    /(?<!\S)(III|IV|V|VI|VII|VIII|IX|X)(?!\S)/
  );
  if (!romanNumeralMatch) return productName;
  return productName.replace(
    romanNumeralMatch[0],
    digits[romanNumeralMatch[0]].toString()
  );
}
