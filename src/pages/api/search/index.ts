import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

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
  console.log(req.headers.origin);

  await runMiddleware(req, res, cors);

  const products = await prisma.product.findMany({
    where: {
      coreProduct: true,
    },
    include: {
      category: true,
    },
  });
  const response = {
    data: {
      products,
    },
  };

  return res.status(200).json(response);
}
