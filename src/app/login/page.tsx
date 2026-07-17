"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

async function destinationFor(userId: string): Promise<string> {
  // Existing profile → straight to the app; otherwise onboarding.
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  return data ? "/home" : "/onboarding";
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Already signed in? Skip this screen.
  useEffect(() => {
    let cancelled = false;
    getSupabaseClient()
      .auth.getSession()
      .then(async ({ data: { session } }) => {
        if (session && !cancelled) {
          router.replace(await destinationFor(session.user.id));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    const supabase = getSupabaseClient();
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
        });
        if (err) throw err;
        if (!data.session) {
          // Email confirmation is enabled on the Supabase project.
          setNotice(
            "Almost there! Check your inbox for a confirmation link, then log in."
          );
          setMode("login");
          return;
        }
        router.replace(await destinationFor(data.session.user.id));
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        router.replace(await destinationFor(data.session.user.id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10 animate-fade-in-up">
      <Link
        href="/"
        className="mb-8 text-center text-2xl font-extrabold tracking-tight text-navy-800"
      >
        AERO<span className="text-aero-500"> Fitness</span>
      </Link>

      <div className="card">
        {/* Mode toggle */}
        <div className="mb-6 grid grid-cols-2 rounded-full bg-aero-100 p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setNotice(null);
              }}
              className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === m
                  ? "bg-navy-800 text-white"
                  : "text-navy-700/60 hover:text-navy-800"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <h1 className="text-xl font-bold text-navy-900">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-navy-700/70">
          {mode === "login"
            ? "Log in to see today's workout."
            : "Sign up to start training with AERO."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-navy-800"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-aero-200 bg-aero-50 px-4 py-3 text-sm outline-none placeholder:text-navy-700/40 focus:border-aero-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-navy-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-aero-200 bg-aero-50 px-4 py-3 text-sm outline-none placeholder:text-navy-700/40 focus:border-aero-500"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-xl bg-aero-100 px-4 py-3 text-sm font-medium text-aero-800">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting
              ? "One moment…"
              : mode === "login"
                ? "Log in"
                : "Sign up"}
          </button>
        </form>
      </div>
    </main>
  );
}
