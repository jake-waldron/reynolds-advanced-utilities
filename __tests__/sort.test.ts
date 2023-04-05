import { sortBySize } from "@/lib/api/search/sort";

describe("sortBySize", () => {
  it("should sort 2-OZ before 4-OZ", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 4-OZ",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 2-OZ",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 2-OZ",
      "MOLD STAR 30 4-OZ",
    ]);
  });

  it("should sort 4-OZ before trials", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 TRIAL SIZE",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 4-OZ",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 4-OZ",
      "MOLD STAR 30 TRIAL SIZE",
    ]);
  });

  it("should sort pints before 1-gals", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 1-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 PINT",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 PINT",
      "MOLD STAR 30 1-GAL",
    ]);
  });

  it("should sort trials before 1-gals", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 1-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 TRIAL SIZE",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 TRIAL SIZE",
      "MOLD STAR 30 1-GAL",
    ]);
  });

  it("should sort 1-gals before 5-gals", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 1-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 5-GAL",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 1-GAL",
      "MOLD STAR 30 5-GAL",
    ]);
  });

  it("should sort 5-gals before 5-gal parts", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 5-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 5-GAL PART A",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 5-GAL",
      "MOLD STAR 30 5-GAL PART A",
    ]);
  });

  it("should sort 5-gal + 5-gal parts last", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 5-GAL PART A",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 5-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "SORTA CLEAR TRIAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "SMOOTH SIL TRIAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 TRIAL",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(
      sortBySize(arrayToSort)
        .map((product) => product.name)
        .slice(-2)
    ).toEqual(["MOLD STAR 30 5-GAL", "MOLD STAR 30 5-GAL PART A"]);
  });

  it("should sort by size", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 5-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 1-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 TRIAL SIZE",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 5-GAL PART A",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 4-OZ",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 30 2-OZ",
        partNum: "34343",
        score: 0.1,
      },
    ];
    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 30 2-OZ",
      "MOLD STAR 30 4-OZ",
      "MOLD STAR 30 TRIAL SIZE",
      "MOLD STAR 30 1-GAL",
      "MOLD STAR 30 5-GAL",
      "MOLD STAR 30 5-GAL PART A",
    ]);
  });

  it("should sort by groups", () => {
    const arrayToSort = [
      {
        name: "MOLD STAR 30 5-GAL",
        partNum: "34343",
        score: 0.29,
      },
      {
        name: "MOLD STAR 30 1-GAL",
        partNum: "34343",
        score: 0.29,
      },
      {
        name: "MOLD STAR 30 TRIAL SIZE",
        partNum: "34343",
        score: 0.29,
      },
      {
        name: "MOLD STAR 20 5-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 20 1-GAL",
        partNum: "34343",
        score: 0.1,
      },
      {
        name: "MOLD STAR 20 PINT UNIT",
        partNum: "34343",
        score: 0.1,
      },
    ];

    expect(sortBySize(arrayToSort).map((product) => product.name)).toEqual([
      "MOLD STAR 20 PINT UNIT",
      "MOLD STAR 20 1-GAL",
      "MOLD STAR 20 5-GAL",
      "MOLD STAR 30 TRIAL SIZE",
      "MOLD STAR 30 1-GAL",
      "MOLD STAR 30 5-GAL",
    ]);
  });
});
