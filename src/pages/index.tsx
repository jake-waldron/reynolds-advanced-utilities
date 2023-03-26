import React from "react";
import { User } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default function Home({ user }: { user: User }) {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      {user ? (
        <div className="text-center">
          <h1 className="text-3xl">Hey there, {user.name || user.email}!</h1>
          <p>You&apos;re signed in!</p>
        </div>
      ) : (
        <h1 className="my-4 text-3xl">Not signed in</h1>
      )}
    </main>
  );
}

export async function getServerSideProps({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const supabase = createServerSupabaseClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { props: {} };
  }
  const authUser = session.user;

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
  });

  return { props: { user } };
}
