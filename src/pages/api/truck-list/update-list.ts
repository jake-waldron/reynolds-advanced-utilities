import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

import { databaseId, notion } from "@/lib/notion";
import { removeParens } from "@/lib/utils/removeParens";

const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
  origin: [
    "https://amp.reynoldsam.com",
    "https://ram-bam-us-web-qa.azurewebsites.net",
  ],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// uses forEach because there could be multiple entries for the same product (ex. one with and without a note)
async function checkOffProducts(products: any) {
  products.forEach(async (product: any) => {
    const page_id = product.id;
    await notion.pages.update({
      page_id: page_id,
      properties: {
        "Added?": {
          checkbox: true,
        },
      },
    });
  });
}

// find item in database and update added checkbox to true if it exists
// query returns an array of results, usually only one, but could be more than one if there are multiple entries for the same product
async function findItem(text: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Product",
      title: {
        contains: text,
      },
    },
  });
  if (response.results.length > 0) {
    checkOffProducts(response.results);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = JSON.parse(req.body);
  const { products } = body;

  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products provided" });
  }
  try {
    for (const product of products) {
      const productName = removeParens(product);
      await findItem(productName);
    }
    return res.status(200).json({ message: "List updated" });
  } catch (error) {
    return res.status(400).json({ error });
  }
}
