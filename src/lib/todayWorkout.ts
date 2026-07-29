import { getSupabaseClient } from "@/lib/supabase/client";
import { getWeekStart, toISODate } from "@/lib/dates";
import { EXERCISES_BY_ID } from "@/data/exercises";
import type { GeneratedPlan, GeneratedTrainingDay, PlannedExercise } from "@/types/plan";

/**
 * Build a PlannedExercise from a catalog id, using the week's prescription
 * for sets/reps (abs keep their own defaults). Returns null for unknown ids.
 */
export function plannedFromId(id: string, plan: GeneratedPlan): PlannedExercise | null {
  const ex = EXERCISES_BY_ID.get(id);
  if (!ex) return null;
  const isAbs = ex.muscleGroup === "abs";
  const planned: PlannedExercise = {
    exerciseId: ex.id,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    sets: isAbs ? ex.defaultSets : plan.prescription.sets,
    reps: isAbs ? ex.defaultReps : plan.prescription.reps,
  };
  if (plan.fitnessLevel === "beginner") planned.startingWeight = ex.startingWeight;
  return planned;
}

/**
 * The effective strength+abs list for a training day: the user's hand-picked
 * selection if they made one, otherwise the auto-generated exercises.
 */
export function resolveStrength(
  plan: GeneratedPlan,
  day: GeneratedTrainingDay,
  selectionIds: string[] | null
): PlannedExercise[] {
  if (!selectionIds) return [...day.exercises, ...day.abs];
  return selectionIds.flatMap((id) => {
    const p = plannedFromId(id, plan);
    return p ? [p] : [];
  });
}

/** The chosen exercise ids for a date, or null if the user hasn't customized it. */
export async function fetchDaySelection(
  userId: string,
  dateISO: string
): Promise<string[] | null> {
  const { data } = await getSupabaseClient()
    .from("day_selections")
    .select("exercise_ids")
    .eq("user_id", userId)
    .eq("date", dateISO)
    .maybeSingle();
  const ids = data?.exercise_ids;
  return Array.isArray(ids) ? (ids as string[]) : null;
}

export async function saveDaySelection(
  userId: string,
  dateISO: string,
  exerciseIds: string[]
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from("day_selections")
    .upsert(
      { user_id: userId, date: dateISO, exercise_ids: exerciseIds, updated_at: new Date().toISOString() },
      { onConflict: "user_id,date" }
    );
  if (error) throw new Error(error.message);
}

export async function deleteDaySelection(userId: string, dateISO: string): Promise<void> {
  await getSupabaseClient()
    .from("day_selections")
    .delete()
    .eq("user_id", userId)
    .eq("date", dateISO);
}

/**
 * Map of exercise id → short weekday it was completed earlier THIS week
 * (e.g. "Mon"). Used to flag "already done this week" so users vary their
 * picks on a repeated muscle day. Resets automatically each new week.
 */
export async function fetchWeekDoneMap(userId: string): Promise<Map<string, string>> {
  const weekStartISO = toISODate(getWeekStart(new Date()));
  const { data } = await getSupabaseClient()
    .from("workout_logs")
    .select("exercise_id, date, completed")
    .eq("user_id", userId)
    .eq("completed", true)
    .gte("date", weekStartISO)
    .order("date");

  const map = new Map<string, string>();
  if (data) {
    for (const row of data as { exercise_id: string; date: string }[]) {
      if (map.has(row.exercise_id)) continue; // keep earliest day
      const label = new Date(`${row.date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "short",
      });
      map.set(row.exercise_id, label);
    }
  }
  return map;
}
