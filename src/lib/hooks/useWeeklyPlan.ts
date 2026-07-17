"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getOrCreateWeeklyPlan } from "@/lib/weeklyPlan";
import type { GeneratedPlan } from "@/types/plan";

/**
 * This calendar week's plan for the signed-in user — generated and saved on
 * first use, then read back unchanged for the rest of the week.
 */
export function useWeeklyPlan() {
  const { session, profile } = useAuth();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id;
  const goal = profile?.goal ?? null;
  const fitnessLevel = profile?.fitness_level ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    setLoading(true);
    getOrCreateWeeklyPlan(userId, goal, fitnessLevel)
      .then((p) => {
        if (!cancelled) setPlan(p);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load your plan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, goal, fitnessLevel]);

  return { plan, loading, error };
}
