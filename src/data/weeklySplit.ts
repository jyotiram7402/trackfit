import { CARDIO_BY_ID, EXERCISES, EXERCISES_BY_ID } from "@/data/exercises";
import type {
  DayWorkout,
  Exercise,
  MuscleGroup,
  SessionVariant,
  SplitDay,
  TrainingDay,
  Weekday,
} from "@/types/workout";

/**
 * The weekly split. Each muscle pair runs twice a week — variant "A" on the
 * first pass, "B" on the second — pulling different exercises from the pool
 * so nothing repeats within a week. Abs run on 4 of the 6 training days
 * (all 10 abs exercises used exactly once across the week); cardio is
 * ~30 min every training day, rotating through the cardio list.
 */
export const WEEKLY_SPLIT: SplitDay[] = [
  {
    day: "monday",
    kind: "training",
    label: "Chest & Triceps",
    focus: ["chest", "triceps"],
    variant: "A",
    absExerciseIds: ["abs-plank", "abs-crunches", "abs-lying-leg-raises"],
    cardioId: "cardio-treadmill-incline-walk",
    cardioMinutes: 30,
  },
  {
    day: "tuesday",
    kind: "training",
    label: "Back & Biceps",
    focus: ["back", "biceps"],
    variant: "A",
    absExerciseIds: [],
    cardioId: "cardio-steady-jog",
    cardioMinutes: 30,
  },
  {
    day: "wednesday",
    kind: "training",
    label: "Legs & Shoulders",
    focus: ["legs", "shoulders"],
    variant: "A",
    absExerciseIds: ["abs-russian-twists", "abs-bicycle-crunches", "abs-mountain-climbers"],
    cardioId: "cardio-cycling",
    cardioMinutes: 30,
  },
  {
    day: "thursday",
    kind: "training",
    label: "Chest & Triceps",
    focus: ["chest", "triceps"],
    variant: "B",
    absExerciseIds: ["abs-hanging-leg-raises", "abs-cable-crunches"],
    cardioId: "cardio-jump-rope",
    cardioMinutes: 30,
  },
  {
    day: "friday",
    kind: "training",
    label: "Back & Biceps",
    focus: ["back", "biceps"],
    variant: "B",
    absExerciseIds: [],
    cardioId: "cardio-hiit-circuit",
    cardioMinutes: 30,
  },
  {
    day: "saturday",
    kind: "training",
    label: "Legs & Shoulders",
    focus: ["legs", "shoulders"],
    variant: "B",
    absExerciseIds: ["abs-dead-bug", "abs-ab-wheel-rollout"],
    cardioId: "cardio-rowing-machine",
    cardioMinutes: 30,
  },
  {
    day: "sunday",
    kind: "rest",
    label: "Rest & Recovery",
  },
];

/** How many strength exercises each muscle group gets per session. */
export const EXERCISES_PER_MUSCLE = 3;

/**
 * Variant "A" sessions take pool indices 0-2, variant "B" takes 3-5,
 * guaranteeing zero exercise repeats when a muscle group recurs in the week.
 */
export function getExercisesForMuscle(
  muscleGroup: MuscleGroup,
  variant: SessionVariant
): Exercise[] {
  const start = variant === "A" ? 0 : EXERCISES_PER_MUSCLE;
  return EXERCISES[muscleGroup].slice(start, start + EXERCISES_PER_MUSCLE);
}

export function getSplitDay(day: Weekday): SplitDay {
  // WEEKLY_SPLIT covers all seven weekdays, so this always finds a match.
  return WEEKLY_SPLIT.find((d) => d.day === day)!;
}

/** Resolve a weekday into the concrete workout: strength + abs + cardio. */
export function getWorkoutForDay(day: Weekday): DayWorkout {
  const splitDay = getSplitDay(day);

  if (splitDay.kind === "rest") {
    return { day, label: splitDay.label, strength: [], abs: [], cardio: null };
  }

  const strength = splitDay.focus.flatMap((muscle) =>
    getExercisesForMuscle(muscle, splitDay.variant)
  );
  const abs = splitDay.absExerciseIds
    .map((id) => EXERCISES_BY_ID.get(id))
    .filter((e): e is Exercise => e !== undefined);
  const cardio = CARDIO_BY_ID.get(splitDay.cardioId) ?? null;

  return { day, label: splitDay.label, strength, abs, cardio };
}

export function isTrainingDay(splitDay: SplitDay): splitDay is TrainingDay {
  return splitDay.kind === "training";
}

/** Map JS Date.getDay() (0 = Sunday) to our Weekday union. */
export const WEEKDAY_FROM_INDEX: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function getTodayWeekday(now: Date = new Date()): Weekday {
  return WEEKDAY_FROM_INDEX[now.getDay()];
}

// ------------------------------------------------------------------
// Customizable split
// ------------------------------------------------------------------

export type FocusPairKey = "chest_triceps" | "back_biceps" | "legs_shoulders";
export type SplitDayKey = FocusPairKey | "rest";

export interface FocusPair {
  label: string;
  focus: [MuscleGroup, MuscleGroup];
}

/** The three trainable focus pairs a day can be assigned. */
export const FOCUS_PAIRS: Record<FocusPairKey, FocusPair> = {
  chest_triceps: { label: "Chest & Triceps", focus: ["chest", "triceps"] },
  back_biceps: { label: "Back & Biceps", focus: ["back", "biceps"] },
  legs_shoulders: { label: "Legs & Shoulders", focus: ["legs", "shoulders"] },
};

/** Weekdays a user can assign (Sunday stays a rest day). */
export const WEEKDAYS_MON_SAT: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const ALL_WEEKDAYS: Weekday[] = [...WEEKDAYS_MON_SAT, "sunday"];

/** The classic default: Chest&Tri / Back&Bi / Legs&Sho, twice through. */
export const DEFAULT_SPLIT_KEYS: SplitDayKey[] = [
  "chest_triceps",
  "back_biceps",
  "legs_shoulders",
  "chest_triceps",
  "back_biceps",
  "legs_shoulders",
];

const VALID_KEYS: SplitDayKey[] = [
  "chest_triceps",
  "back_biceps",
  "legs_shoulders",
  "rest",
];

/** Coerce stored/user input into a safe 6-length Mon–Sat key array. */
export function normalizeSplitKeys(input: unknown): SplitDayKey[] {
  if (!Array.isArray(input) || input.length !== 6) return [...DEFAULT_SPLIT_KEYS];
  return input.map((k) =>
    VALID_KEYS.includes(k as SplitDayKey) ? (k as SplitDayKey) : "rest"
  );
}

export function focusPairLabel(key: SplitDayKey): string {
  return key === "rest" ? "Rest" : FOCUS_PAIRS[key].label;
}
