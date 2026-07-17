"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export function LoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <span className="text-xl font-extrabold tracking-tight text-navy-800">
        AERO<span className="text-aero-500"> Fitness</span>
      </span>
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-aero-200 border-t-aero-500"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

/**
 * Client-side route guard.
 * - No session → /login
 * - requireProfile and no profile yet → /onboarding
 * - requireProfile=false (the onboarding page) and profile exists → /home
 */
export default function AuthGuard({
  children,
  requireProfile = true,
}: {
  children: React.ReactNode;
  requireProfile?: boolean;
}) {
  const { session, profile, loading } = useAuth();
  const router = useRouter();

  const allowed =
    !loading &&
    !!session &&
    (requireProfile ? !!profile : !profile);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/login");
    } else if (requireProfile && !profile) {
      router.replace("/onboarding");
    } else if (!requireProfile && profile) {
      router.replace("/home");
    }
  }, [loading, session, profile, requireProfile, router]);

  if (!allowed) return <LoadingScreen />;
  return <>{children}</>;
}
