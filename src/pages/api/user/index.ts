import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

// next api handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    res
      .status(401)
      .json({ error: "Not logged in", message: "You're not logged in!" });
    return;
  }
  const user = session.user;

  const { method } = req;
  const { name } = req.body;

  if (method === "PATCH") {
    // do something
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    return res.status(200).json(updatedUser);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
