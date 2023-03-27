import React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  async function handleSignout() {
    await supabase.auth.signOut();
    // if (router.pathname === "/") router.reload();
    router.push("/");
  }
  return (
    <>
      <Head>
        <title>Reynolds Advanced Utilities</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="absolute top-0 flex w-full  items-baseline justify-between bg-slate-700 px-10 py-6 text-white">
        <Link href="/">
          <h1 className="text-2xl">Reynolds Advanced Utilities</h1>
        </Link>
        <ul className="flex gap-10">
          <li>
            <Link href="/">Put</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/">Profile</Link>
              </li>
              <li>
                <button onClick={handleSignout}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/">Links Here</Link>
            </li>
          )}
        </ul>
      </nav>
      {children}
    </>
  );
}
