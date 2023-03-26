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
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="absolute top-0 flex w-full  items-baseline justify-between bg-slate-700 px-10 py-6 text-white">
        <Link href="/">
          <h1 className="text-2xl">Hello World!</h1>
        </Link>
        <ul className="flex gap-10">
          <li>
            <Link href="/about">About</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link href="/user/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleSignout}>Sign Out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      {children}
    </>
  );
}
