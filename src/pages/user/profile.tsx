import React from "react";
import { Prisma, User } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";

import prisma from "@/lib/prisma";

export default function NewUser({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = React.useState(user.name || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const user: Prisma.UserUpdateInput = {
      name,
    };
    await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    setName("");
    router.push("/");
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-3xl">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="my-10 flex flex-col gap-3 rounded-3xl bg-slate-300 p-10"
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-slate-500 p-2"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
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
