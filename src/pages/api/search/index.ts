import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

// next api handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.headers.origin);
  if (
    req.headers.origin !== "https://amp.reynoldsam.com" &&
    req.headers.origin !== "https://ram-bam-us-web-qa.azurewebsites.net"
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const products = await prisma.product.findMany({
    where: {
      coreProduct: true,
    },
    include: {
      category: true,
    },
  });

  return res.status(200).json(products);
}
