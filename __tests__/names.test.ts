import { convertRomanNumerals } from "@/lib/utils/converRomanNumerals";
import { fixPMCName } from "@/lib/utils/fixPMCname";
import { removeParens } from "@/lib/utils/removeParens";

describe("fixRomanNumerals", () => {
  it('should convert "III" to "3"', () => {
    expect(convertRomanNumerals("III")).toBe("3");
  });
  it('should convert "IV" to "4"', () => {
    expect(convertRomanNumerals("IV")).toBe("4");
  });
  it('should convert "V" to "5"', () => {
    expect(convertRomanNumerals("V")).toBe("5");
  });
  it('should convert "VI" to "6"', () => {
    expect(convertRomanNumerals("VI")).toBe("6");
  });
  it('should convert "VII" to "7"', () => {
    expect(convertRomanNumerals("VII")).toBe("7");
  });
  it('should convert "VIII" to "8"', () => {
    expect(convertRomanNumerals("VIII")).toBe("8");
  });
  it('should convert "IX" to "9"', () => {
    expect(convertRomanNumerals("IX")).toBe("9");
  });
  it('should convert "X" to "10"', () => {
    expect(convertRomanNumerals("X")).toBe("10");
  });
  it("should convert roman numeral surrounded by spaces", () => {
    expect(
      convertRomanNumerals("FLEX FOAM-IT! VIII PILLOW SOFT TRIAL SIZE")
    ).toBe("FLEX FOAM-IT! 8 PILLOW SOFT TRIAL SIZE");
  });
  it("shouldn't convert if roman numeral is connected to other text", () => {
    expect(convertRomanNumerals("FLESHING TOOL 421-X")).toBe(
      "FLESHING TOOL 421-X"
    );
  });
});

describe("fixPMCName", () => {
  it('should convert "PMC-" to "PMC"', () => {
    expect(fixPMCName("PMC-")).toBe("PMC");
  });
  it('should convert " DRY" to ""', () => {
    expect(fixPMCName(" DRY")).toBe("");
  });

  it('should convert both "PMC-"  and " DRY" in full product name', () => {
    expect(fixPMCName("PMC-780 DRY 1-GAL UNIT")).toBe("PMC780 1-GAL UNIT");
  });

  it("should only convert 'PMC-' if product name doesn't contain 'DRY'", () => {
    expect(fixPMCName("PMC-780 1-GAL UNIT")).toBe("PMC780 1-GAL UNIT");
  });
  it("should only convert 'PMC-' if product name contains 'WET'", () => {
    expect(fixPMCName("PMC-780 WET 1-GAL UNIT")).toBe("PMC780 WET 1-GAL UNIT");
  });

  it("shoudn't convert if product name doesn't contain 'PMC-' or 'DRY", () => {
    expect(fixPMCName("FLEX FOAM-IT! 8 PILLOW SOFT TRIAL SIZE")).toBe(
      "FLEX FOAM-IT! 8 PILLOW SOFT TRIAL SIZE"
    );
  });
  it('should leave any other "-" in the product name', () => {
    expect(fixPMCName("PMC-121-30 DRY 1-GAL UNIT")).toBe(
      "PMC121-30 1-GAL UNIT"
    );
  });
});

describe("removeParens", () => {
  it("should remove the last set of parens in a string", () => {
    expect(
      removeParens("FLEX FOAM-IT! VIII PILLOW SOFT TRIAL SIZE (3# 1.35KGS)")
    ).toBe("FLEX FOAM-IT! VIII PILLOW SOFT TRIAL SIZE");
  });

  it("should only remove the last set of parens if more than two sets of parens are present", () => {
    expect(removeParens("SO-STRONG (2-OZ BOTTLES) 8 PACK (1# 0.45KGS)")).toBe(
      "SO-STRONG (2-OZ BOTTLES) 8 PACK"
    );
  });

  it("should remove parens if touching text", () => {
    expect(removeParens("PMC-121-30 DRY 1-GAL(422324#)")).toBe(
      "PMC-121-30 DRY 1-GAL"
    );
  });
});
