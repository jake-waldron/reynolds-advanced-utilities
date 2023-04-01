import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

import { getResults } from "@/lib/api/search/search";

const cors = Cors({
  methods: ["GET", "HEAD"],
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

// next api handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const { q } = req.query;
  // if (!q) return res.status(400).json({ data: { error: "No query provided" } });

  if (typeof q !== "string")
    return res.status(400).json({ error: "Query must be a string" });

  // send products to fuse to filter out based on query
  const products = await getResults(q);

  const response = {
    searchTerm: q,
    products,
  };

  return res.status(200).json(response);
}
