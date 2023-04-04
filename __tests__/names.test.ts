import { fixRomanNumerals } from "@/lib/utils/converRomanNumerals";

describe("fixRomanNumerals", () => {
  it('should convert "III" to "3"', () => {
    expect(fixRomanNumerals("III")).toBe("3");
  });
  it('should convert "IV" to "4"', () => {
    expect(fixRomanNumerals("IV")).toBe("4");
  });
  it('should convert "V" to "5"', () => {
    expect(fixRomanNumerals("V")).toBe("5");
  });
  it('should convert "VI" to "6"', () => {
    expect(fixRomanNumerals("VI")).toBe("6");
  });
  it('should convert "VII" to "7"', () => {
    expect(fixRomanNumerals("VII")).toBe("7");
  });
  it('should convert "VIII" to "8"', () => {
    expect(fixRomanNumerals("VIII")).toBe("8");
  });
  it('should convert "IX" to "9"', () => {
    expect(fixRomanNumerals("IX")).toBe("9");
  });
  it('should convert "X" to "10"', () => {
    expect(fixRomanNumerals("X")).toBe("10");
  });
  it("should convert numeral in the middle of string", () => {
    expect(fixRomanNumerals("FLEX FOAM-IT! VIII PILLOW SOFT TRIAL SIZE")).toBe(
      "FLEX FOAM-IT! 8 PILLOW SOFT TRIAL SIZE"
    );
  });
  it("shouldn't convert if roman numeral is connected to other text", () => {
    expect(fixRomanNumerals("FLESHING TOOL 421-X")).toBe("FLESHING TOOL 421-X");
  });
});
