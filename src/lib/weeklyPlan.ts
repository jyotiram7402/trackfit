import { getSupabaseClient } from "@/lib/supabase/client";
import { addDays, getWeekStart, toISODate } from "@/lib/dates";
import { collectExerciseIds, generateWeeklyPlan } from "@/lib/planGenerator";
import { normalizeSplitKeys } from "@/data/weeklySplit";
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

function buildPlan(
  goal: Goal | null,
  fitnessLevel: FitnessLevel | null,
  splitKeys: string[] | null,
  weekStartISO: string,
  avoidExerciseIds?: Set<string>
): GeneratedPlan {
  return generateWeeklyPlan(goal ?? "maintain", fitnessLevel ?? "intermediate", {
    weekStart: weekStartISO,
    avoidExerciseIds,
    splitKeys: normalizeSplitKeys(splitKeys ?? undefined),
  });
}

/**
 * Return this calendar week's plan, generating and saving it exactly once.
 * The week stays fixed once created (changing goal/level/split only affects
 * future weeks — or use regenerateWeeklyPlan to rebuild now).
 */
export async function getOrCreateWeeklyPlan(
  userId: string,
  goal: Goal | null,
  fitnessLevel: FitnessLevel | null,
  splitKeys: string[] | null
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

  const plan = buildPlan(goal, fitnessLevel, splitKeys, weekStartISO, avoidExerciseIds);

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

/**
 * Force-rebuild the CURRENT week from scratch with the given settings —
 * used when a user changes their split and wants it to apply today (e.g. the
 * gym's chest machines are all taken). Logged workouts are untouched; only
 * the upcoming plan changes.
 */
export async function regenerateWeeklyPlan(
  userId: string,
  goal: Goal | null,
  fitnessLevel: FitnessLevel | null,
  splitKeys: string[] | null
): Promise<GeneratedPlan> {
  const supabase = getSupabaseClient();
  const weekStartISO = toISODate(getWeekStart(new Date()));

  const plan = buildPlan(goal, fitnessLevel, splitKeys, weekStartISO);

  const { error } = await supabase
    .from("weekly_plans")
    .upsert(
      { user_id: userId, week_start_date: weekStartISO, plan_json: plan },
      { onConflict: "user_id,week_start_date" }
    );

  if (error) throw new Error(error.message);
  return plan;
}
