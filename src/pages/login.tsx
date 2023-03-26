import React from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";

export default function Login() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  if (session) {
    router.push("/");
  }

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      {session ? (
        <div className="text-center">
          <h1 className="text-3xl">Loading...</h1>
        </div>
      ) : (
        <>
          <h1 className="my-4 text-3xl">Login Page</h1>
          <Auth
            providers={[]}
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
            }}
            theme="default"
          />
        </>
      )}
    </main>
  );
}
