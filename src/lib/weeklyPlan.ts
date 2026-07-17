import { getSupabaseClient } from "@/lib/supabase/client";
import { addDays, getWeekStart, toISODate } from "@/lib/dates";
import { collectExerciseIds, generateWeeklyPlan } from "@/lib/planGenerator";
import type { FitnessLevel, Goal } from "@/types/db";
import type { GeneratedPlan } from "@/types/plan";

async function fetchPlan(
  userId: string,
  weekStartISO: string
): Promise<GeneratedPlan | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("weekly_plans")
    .select("plan_json")
    .eq("user_id", userId)
    .eq("week_start_date", weekStartISO)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data?.plan_json as GeneratedPlan) ?? null;
}

/**
 * Return this calendar week's plan, generating and saving it exactly once.
 *
 * - Already in weekly_plans → return it unchanged (the week stays fixed).
 * - Otherwise generate a fresh plan — passing last week's exercise ids so
 *   picks vary week to week — and insert it. The unique(user_id,
 *   week_start_date) constraint makes double-generation impossible: if a
 *   second tab races us, we re-read the winner's plan instead.
 */
export async function getOrCreateWeeklyPlan(
  userId: string,
  goal: Goal | null,
  fitnessLevel: FitnessLevel | null
): Promise<GeneratedPlan> {
  const supabase = getSupabaseClient();
  const weekStart = getWeekStart(new Date());
  const weekStartISO = toISODate(weekStart);

  const existing = await fetchPlan(userId, weekStartISO);
  if (existing) return existing;

  // Vary from the previous week when possible.
  let avoidExerciseIds: Set<string> | undefined;
  try {
    const previous = await fetchPlan(userId, toISODate(addDays(weekStart, -7)));
    if (previous) avoidExerciseIds = collectExerciseIds(previous);
  } catch {
    // Previous week is a nice-to-have; never block generation on it.
  }

  const plan = generateWeeklyPlan(goal ?? "maintain", fitnessLevel ?? "intermediate", {
    weekStart: weekStartISO,
    avoidExerciseIds,
  });

  const { error } = await supabase.from("weekly_plans").insert({
    user_id: userId,
    week_start_date: weekStartISO,
    plan_json: plan,
  });

  if (error) {
    // 23505 = unique violation: another tab/device generated first. Use theirs.
    if (error.code === "23505") {
      const winner = await fetchPlan(userId, weekStartISO);
      if (winner) return winner;
    }
    throw new Error(error.message);
  }

  return plan;
}
