import { CARDIO_ACTIVITIES, EXERCISES } from "@/data/exercises";
import { WEEKLY_SPLIT } from "@/data/weeklySplit";
import type { FitnessLevel, Goal } from "@/types/db";
import type {
  GeneratedDay,
  GeneratedPlan,
  PlannedExercise,
  Prescription,
} from "@/types/plan";
import type { Exercise, MuscleGroup, Weekday } from "@/types/workout";

/** Goal-driven prescriptions (intermediate/advanced baseline). */
export const PRESCRIPTIONS: Record<Goal, Prescription> = {
  lose: { sets: 3, reps: "12-15", rest: "45-60 sec", cardioMinutes: 30, absDaysPerWeek: 4 },
  gain: { sets: 4, reps: "6-10", rest: "90-120 sec", cardioMinutes: 20, absDaysPerWeek: 3 },
  maintain: { sets: 3, reps: "10-12", rest: "60-90 sec", cardioMinutes: 25, absDaysPerWeek: 3 },
};

/**
 * Beginner overrides: fewer/simpler exercises, moderate fixed reps, longer
 * rest, and gentler cardio regardless of goal.
 */
function prescriptionFor(goal: Goal, level: FitnessLevel): Prescription {
  const base = PRESCRIPTIONS[goal];
  if (level !== "beginner") return base;
  return {
    ...base,
    sets: 3,
    reps: "12",
    rest: "60-90 sec",
    cardioMinutes: Math.min(base.cardioMinutes, 20),
  };
}

/** Which training days carry abs work, per goal. */
const ABS_DAYS: Record<Goal, Weekday[]> = {
  lose: ["monday", "tuesday", "thursday", "friday"],
  gain: ["monday", "wednesday", "friday"],
  maintain: ["monday", "wednesday", "friday"],
};

const ABS_PER_DAY = 2;

/** Beginners get 2 exercises per muscle; everyone else gets 3. */
export function exercisesPerMuscle(level: FitnessLevel): number {
  return level === "beginner" ? 2 : 3;
}

const DAY_NAMES: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Difficulty preference by level. Lower rank = picked first.
 * - Beginners strongly prefer beginner-tagged (machines, bodyweight, cables);
 *   every pool has ≥4 of them, enough for a full beginner week (2 × 2 days).
 * - Intermediates draw from beginner+intermediate before advanced lifts.
 * - Advanced prefers the heavier intermediate/advanced lifts, using
 *   beginner-tagged staples as the fallback.
 */
function tierRank(exercise: Exercise, level: FitnessLevel): number {
  switch (level) {
    case "beginner":
      return exercise.difficulty === "beginner" ? 0 : exercise.difficulty === "intermediate" ? 1 : 2;
    case "intermediate":
      return exercise.difficulty === "advanced" ? 1 : 0;
    case "advanced":
      return exercise.difficulty === "beginner" ? 1 : 0;
  }
}

/**
 * Shuffle a pool, then (stable-)sort by difficulty-tier for the user's level,
 * with exercises NOT used last week ahead of repeats within each tier.
 */
function rankPool(
  pool: Exercise[],
  level: FitnessLevel,
  usedLastWeek: Set<string>
): Exercise[] {
  return shuffle(pool).sort(
    (a, b) =>
      tierRank(a, level) - tierRank(b, level) ||
      Number(usedLastWeek.has(a.id)) - Number(usedLastWeek.has(b.id))
  );
}

function toPlanned(
  exercise: Exercise,
  sets: number,
  reps: string,
  includeStartingWeight: boolean
): PlannedExercise {
  return {
    exerciseId: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    sets,
    reps,
    ...(includeStartingWeight ? { startingWeight: exercise.startingWeight } : {}),
  };
}

/** Every exercise id used in a stored plan — fed back in next week as "avoid". */
export function collectExerciseIds(plan: GeneratedPlan): Set<string> {
  const ids = new Set<string>();
  for (const day of plan.days) {
    if (day.kind !== "training") continue;
    for (const e of [...day.exercises, ...day.abs]) ids.add(e.exerciseId);
  }
  return ids;
}

export interface GenerateOptions {
  /** Monday of the target week, "YYYY-MM-DD". */
  weekStart: string;
  /** Exercise ids from the previous week's plan, to vary this week's picks. */
  avoidExerciseIds?: Set<string>;
}

/**
 * Generate a full week honoring the split (Mon–Sat, Sunday rest).
 *
 * No-repeat guarantee: each muscle group appears on two days per week; we
 * draw its two sessions' exercises from one ranked pool without replacement,
 * so the same muscle never sees the same exercise twice in one week. Abs
 * draws 2 per abs day from its own ranked queue, and cardio assigns a
 * different activity to each training day (beginners skip the high-impact
 * options).
 */
export function generateWeeklyPlan(
  goal: Goal,
  level: FitnessLevel,
  options: GenerateOptions
): GeneratedPlan {
  const prescription = prescriptionFor(goal, level);
  const absDays = ABS_DAYS[goal];
  const avoid = options.avoidExerciseIds ?? new Set<string>();
  const perMuscle = exercisesPerMuscle(level);
  const isBeginner = level === "beginner";

  // Distinct picks per muscle group, split between its two weekly sessions.
  const sessionPicks = new Map<MuscleGroup, [Exercise[], Exercise[]]>();
  const muscles: MuscleGroup[] = ["chest", "triceps", "back", "biceps", "legs", "shoulders"];
  for (const muscle of muscles) {
    const picks = rankPool(EXERCISES[muscle], level, avoid).slice(0, perMuscle * 2);
    sessionPicks.set(muscle, [picks.slice(0, perMuscle), picks.slice(perMuscle)]);
  }

  // Abs: one ranked queue consumed 2 at a time across the week's abs days.
  const absQueue = rankPool(EXERCISES.abs, level, avoid);
  let absCursor = 0;

  // Cardio: a different activity each training day; beginners get low-impact.
  const cardioQueue = shuffle(
    isBeginner ? CARDIO_ACTIVITIES.filter((c) => !c.intense) : CARDIO_ACTIVITIES
  );
  let cardioCursor = 0;

  // Second time a muscle pair appears, note which day had the first session.
  const firstSessionDay = new Map<string, Weekday>();
  const sessionIndex = new Map<MuscleGroup, number>();

  const days: GeneratedDay[] = WEEKLY_SPLIT.map((splitDay) => {
    if (splitDay.kind === "rest") {
      return { day: splitDay.day, kind: "rest" as const, label: splitDay.label };
    }

    const exercises = splitDay.focus.flatMap((muscle) => {
      const nth = sessionIndex.get(muscle) ?? 0;
      sessionIndex.set(muscle, nth + 1);
      return sessionPicks
        .get(muscle)!
        [Math.min(nth, 1)].map((e) =>
          toPlanned(e, prescription.sets, prescription.reps, isBeginner)
        );
    });

    let repeatNote: string | null = null;
    const pairKey = splitDay.focus.join("+");
    const firstDay = firstSessionDay.get(pairKey);
    if (firstDay) {
      repeatNote = `Different from ${DAY_NAMES[firstDay]}'s ${splitDay.label.toLowerCase()} exercises`;
    } else {
      firstSessionDay.set(pairKey, splitDay.day);
    }

    // Abs use their own defaults (planks are timed, not repped).
    const abs = absDays.includes(splitDay.day)
      ? absQueue
          .slice(absCursor, (absCursor += ABS_PER_DAY))
          .map((e) => toPlanned(e, e.defaultSets, e.defaultReps, isBeginner))
      : [];

    const activity = cardioQueue[cardioCursor++ % cardioQueue.length];
    const cardio = {
      id: activity.id,
      name: activity.name,
      durationMinutes: prescription.cardioMinutes,
    };

    return {
      day: splitDay.day,
      kind: "training" as const,
      label: splitDay.label,
      focus: splitDay.focus,
      exercises,
      abs,
      cardio,
      repeatNote,
    };
  });

  return {
    weekStart: options.weekStart,
    goal,
    fitnessLevel: level,
    prescription,
    days,
    generatedAt: new Date().toISOString(),
  };
}
