import Fuse from "fuse.js";

import prisma from "@/lib/prisma";

import { sortBySize } from "./sort";

type FuseResults = {
  item: {
    name: string;
    partNum: string;
  };
  score: number;
};

export async function getResults(query: string) {
  const productList = await prisma.product.findMany({
    where: {
      coreProduct: true,
    },
    select: {
      searchName: true,
      partNum: true,
    },
  });

  const products = productList.map((product) => ({
    partNum: product.partNum,
    name: product.searchName,
  }));

  const fuse = new Fuse(products, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true,
  });

  const searchResults = fuse.search(query).slice(0, 10) as FuseResults[];
  const filteredResults = filterResults(searchResults);
  const checkForScoreGaps = checkForGaps(filteredResults);
  const sortedResults = sortBySize(checkForScoreGaps);

  return sortedResults;
}

function filterResults(results: FuseResults[]) {
  const scores = getScores(results);
  if (results.some((result) => result.score <= 0.1)) {
    return filteredResults(results.filter((result) => result.score <= 0.1));
  }
  if (results.some((result) => result.score <= 0.4)) {
    return filteredResults(results.filter((result) => result.score <= 0.4));
  }
  if (scores[1] > 0.5 && scores[1] - scores[0] > 0.02) {
    return filteredResults(
      results.filter((result) => result.score === scores[0])
    );
  }

  return filteredResults(results);
}

function checkForGaps(results) {
  const scores = getScores(results);
  if (scores.at(-1) <= 0.1) return results;
  if (scores.length <= 1 || results.length <= 3) {
    return results;
  }
  if (scores.at(-1) - scores[0] < 0.05) return results;
  const returnedResults = [];
  // there's still something weird here I think
  scores.forEach((score, index) => {
    if (index === 0) return;
    const gap = score - scores[index - 1];
    if (gap > 0.04) {
      returnedResults.push(...results.filter((result) => result.score < score));
    }
  });
  return Array.from(new Set(returnedResults));
}

function getScores(results: FuseResults[]) {
  return Array.from(new Set(results.map((result) => result.score))).sort(
    (a, b) => a - b
  );
}

function filteredResults(results) {
  return results.map((result) => {
    return {
      name: result.item.name,
      partNum: result.item.partNum,
      score: result.score,
    };
  });
}
