import { Category, Prisma, Product } from "@prisma/client";
import fs from "fs";
import Papa from "papaparse";

import { convertRomanNumerals } from "@/lib/utils/converRomanNumerals";
import { fixPMCName } from "@/lib/utils/fixPMCname";
import { removeParens } from "@/lib/utils/removeParens";

import { prisma } from "../src/lib/prisma";

type CoreProductCsvData = {
  partNum: string;
  name: string;
  productPK: number;
};

type ProductCsvData = {
  partNum: string;
  name: string;
  vendor: string;
  categoryId: string;
  weight: string;
  productPK: string;
};

const productPath = "./prisma/data/products_raw.data.csv";
const productFile = fs.readFileSync(productPath, "utf8");
const categoryPath = "./prisma/data/categories.data.csv";
const categoryFile = fs.readFileSync(categoryPath, "utf8");
const coreProductsPath = "./prisma/data/core_products.data.csv";
const coreProductsFile = fs.readFileSync(coreProductsPath, "utf8");

async function seedFromFiles() {
  // ------- SEED CATEGORY TABLE -------
  Papa.parse(categoryFile, {
    header: true, // Set to true if the CSV file has a header row
    dynamicTyping: true, // Automatically convert values to their appropriate data types
    complete: function (results) {
      const data = results.data as Array<Category>;
      data.forEach(async (line) => {
        const { categoryId, months } = line;
        await prisma.category.create({
          data: {
            categoryId,
            months,
          },
        });
      });
    },
  });

  // get core products
  let coreProducts: CoreProductCsvData[];
  Papa.parse(coreProductsFile, {
    header: true,
    // dynamicTyping: true,
    complete: (results) => {
      coreProducts = results.data as CoreProductCsvData[];
    },
  });

  // ------- SEED PRODUCT TABLE -------
  Papa.parse(productFile, {
    header: true,
    dynamicTyping: false,
    complete: async (results) => {
      const data = results.data as ProductCsvData[];
      const uploadData = data
        .filter((product) => product.vendor === "SMOOTH-ON")
        .map((line): Product => {
          const { partNum, name, categoryId, weight, productPK } = line;
          const searchName = removeParens(name);
          const isCoreProduct = coreProducts.find(
            (coreProduct) => coreProduct.partNum === partNum
          );
          return {
            partNum: partNum,
            name,
            categoryId: categoryId || "MISCELLANEOUS",
            weight: parseFloat(weight),
            coreProduct: isCoreProduct ? true : false,
            productPK: parseInt(productPK),
            searchName,
          };
        });
      await prisma.product.createMany({
        data: uploadData,
      } as Prisma.ProductCreateManyArgs);
    },
  });

  // ------- UPDATE SEARCH NAMES -------
  // update Flex foams (convert roman numerals to numbers)
  // update PMC (remove "-" and "DRY")

  const flexFoams = await prisma.product.findMany({
    where: {
      name: {
        startsWith: "FLEX FOAM-IT!",
      },
    },
  });

  flexFoams.forEach(async (product) => {
    const { searchName, partNum } = product;

    await prisma.product.update({
      where: {
        partNum,
      },
      data: {
        searchName: convertRomanNumerals(searchName),
      },
    });
  });

  const pmcs = await prisma.product.findMany({
    where: {
      name: {
        startsWith: "PMC-",
      },
    },
  });

  pmcs.forEach(async (product) => {
    const { searchName, partNum } = product;

    await prisma.product.update({
      where: {
        partNum,
      },
      data: {
        searchName: fixPMCName(searchName),
      },
    });
  });
}

// // this is where it takes the data and uploads it
async function main() {
  console.log(`Start seeding ...`);
  seedFromFiles();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// export {};
