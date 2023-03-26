// LEAVING THIS AS AN EXAMPLE

import { Prisma, PrismaClient } from "@prisma/client";
import fs from "fs";
import Papa from "papaparse";

// const prisma = new PrismaClient();
import { prisma } from "../src/lib/prisma";

const productPath = "./prisma/data/products_raw.data.csv";
const productFile = fs.readFileSync(productPath, "utf8");
const categoryPath = "./prisma/data/categories.data.csv";
const categoryFile = fs.readFileSync(categoryPath, "utf8");
const coreProductsPath = "./prisma/data/core_products.data.csv";
const coreProductsFile = fs.readFileSync(coreProductsPath, "utf8");

function seedFromFiles() {
  // ------- SEED CATEGORY TABLE -------
  Papa.parse(categoryFile, {
    header: false, // Set to true if the CSV file has a header row
    dynamicTyping: true, // Automatically convert values to their appropriate data types
    complete: function (results) {
      const data = results.data;
      data.forEach(async (line: any) => {
        const [categoryId, months] = line;
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
  let coreProducts: any[] = [];
  Papa.parse(coreProductsFile, {
    header: true,
    // dynamicTyping: true,
    complete: (results) => {
      coreProducts = results.data;
    },
  });

  // ------- SEED PRODUCT TABLE -------
  Papa.parse(productFile, {
    header: true,
    dynamicTyping: true,
    complete: async (results) => {
      const data = results.data;
      const uploadData = data.map((line: any) => {
        if (line.vendor !== "SMOOTH-ON") return;
        const { partNum, name, categoryId, weight, productPK } = line;
        const searchName = name?.replace(/ \((?!.*\().*?\)/, "") || name;
        const isCoreProduct = coreProducts.find(
          (coreProduct) => coreProduct.partNum.toString() === partNum.toString()
        );
        return {
          partNum: partNum.toString(),
          name,
          categoryId,
          weight,
          coreProduct: isCoreProduct ? true : false,
          productPK,
          searchName,
        };
      });
      await prisma.product.createMany({
        data: uploadData,
      } as Prisma.ProductCreateManyArgs);
    },
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
