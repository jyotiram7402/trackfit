"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  getOrCreateWeeklyPlan,
  regenerateWeeklyPlan,
} from "@/lib/weeklyPlan";
import { normalizeSplitKeys } from "@/data/weeklySplit";
import type { GeneratedPlan } from "@/types/plan";

/**
 * This calendar week's plan for the signed-in user — generated and saved on
 * first use, then read back unchanged for the rest of the week. `rebuild`
 * force-regenerates the current week (e.g. after a split change).
 */
export function useWeeklyPlan() {
  const { session, profile } = useAuth();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id;
  const goal = profile?.goal ?? null;
  const fitnessLevel = profile?.fitness_level ?? null;
  // Stable string key so the effect re-runs when the split actually changes.
  const splitKey = JSON.stringify(profile?.custom_split ?? null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    setLoading(true);
    getOrCreateWeeklyPlan(userId, goal, fitnessLevel, profile?.custom_split ?? null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, goal, fitnessLevel, splitKey]);

  const rebuild = useCallback(async () => {
    if (!userId) return;
    setRebuilding(true);
    setError(null);
    try {
      const p = await regenerateWeeklyPlan(
        userId,
        goal,
        fitnessLevel,
        normalizeSplitKeys(profile?.custom_split ?? undefined)
      );
      setPlan(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to rebuild your plan.");
    } finally {
      setRebuilding(false);
    }
  }, [userId, goal, fitnessLevel, profile?.custom_split]);

  return { plan, loading, rebuilding, error, rebuild };
}
