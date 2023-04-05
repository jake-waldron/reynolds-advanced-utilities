type Product = {
  name: string;
  score: number;
  partNum: string;
};

function sort(arrayToSort: Product[]): Product[][] {
  const scores = arrayToSort.map((product: Product) => product.score);

  const scoreSet = new Set(scores);

  const groupedByScore = [...scoreSet].map((score: number) => {
    return arrayToSort.filter((product: Product) => product.score === score);
  });

  const sortedArray = groupedByScore.map((group: Product[]) =>
    sortArray(group)
  );
  return sortedArray;
}

const sizeOrder: string[] = [
  "2-OZ",
  "4-OZ",
  "PINT",
  "TRIAL",
  "1-GAL",
  "5-GAL",
  "UNKNOWN",
  "PART",
];

function getSize(product: Product): string {
  if (product.name.includes("PART")) return "PART";
  const sizeRegex = /\b(2-OZ|4-OZ|PINT|TRIAL|1-GAL|5-GAL)\b/;
  const size = product.name.match(sizeRegex);
  return size ? size[1] : "UNKNOWN";
}

function sortArray(arr: Product[]): Product[] {
  return arr.sort((p1, p2) => {
    const size1 = getSize(p1);
    const size2 = getSize(p2);
    return sizeOrder.indexOf(size1) - sizeOrder.indexOf(size2);
  });
}

export function sortBySize(arrayToSort: Product[]): Product[] {
  return sort(arrayToSort).flat();
}
