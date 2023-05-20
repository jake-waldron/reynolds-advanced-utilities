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

async function addProduct(product: string, addedBy: string, note = "") {
  if (!addedBy) {
    addedBy = "Unknown";
  }
  const res = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Product: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: product,
            },
          },
        ],
      },
      Notes: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: note,
            },
          },
        ],
      },
      Added_By: {
        type: "multi_select",
        multi_select: [
          {
            name: addedBy,
          },
        ],
      },
    },
  });
  return res;
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
  const { note, addedBy } = body;
  const product = removeParens(body.product);

  console.log(product);
  if (!product || product.trim() === "") {
    return res.status(400).json({ message: "No product provided" });
  }

  try {
    // check to see if it's already in the list
    const notionQueryResponse = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Product",
            title: {
              contains: product,
            },
          },
          {
            property: "Added?",
            checkbox: {
              equals: false,
            },
          },
        ],
      },
    });
    // if note, add product to database with note, whether it's already in there or not
    if (note !== undefined) {
      await addProduct(product, addedBy, note);
      return res.status(200).json({ message: "Added to list" });
    }

    if (notionQueryResponse.results.length === 0) {
      await addProduct(product, addedBy);
      return res.status(200).json({ message: "Added to list" });
    }
    if (notionQueryResponse.results.length > 0) {
      return res.status(200).json({ message: "Already on list" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Error adding product", error });
  }
}
