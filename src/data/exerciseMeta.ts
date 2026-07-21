import type { Exercise, ExerciseDifficulty, MuscleGroup } from "@/types/workout";

/**
 * Which muscles each group primarily and secondarily works, plus a short
 * plain-English blurb. Used by the muscle-map diagram and detail pages.
 * Group-level (accurate enough for beginners) rather than per-exercise.
 */
export interface MuscleInfo {
  label: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
  blurb: string;
}

export const MUSCLE_INFO: Record<MuscleGroup, MuscleInfo> = {
  chest: {
    label: "Chest",
    primary: "chest",
    secondary: ["shoulders", "triceps"],
    blurb: "The pushing muscles across the front of your torso. Pressing and fly movements build them.",
  },
  triceps: {
    label: "Triceps",
    primary: "triceps",
    secondary: ["chest", "shoulders"],
    blurb: "The back of your upper arm — it straightens your elbow and drives every pressing lift.",
  },
  back: {
    label: "Back",
    primary: "back",
    secondary: ["biceps", "shoulders"],
    blurb: "Your lats and upper back — the pulling muscles behind good posture and a strong frame.",
  },
  biceps: {
    label: "Biceps",
    primary: "biceps",
    secondary: ["back"],
    blurb: "The front of your upper arm — it bends your elbow. Curls are its bread and butter.",
  },
  legs: {
    label: "Legs",
    primary: "legs",
    secondary: ["abs"],
    blurb: "Quads, hamstrings, glutes and calves — the biggest, most powerful muscles you have.",
  },
  shoulders: {
    label: "Shoulders",
    primary: "shoulders",
    secondary: ["triceps"],
    blurb: "The deltoids that cap your arms — they lift and rotate, giving you width and strength overhead.",
  },
  abs: {
    label: "Abs & Core",
    primary: "abs",
    secondary: [],
    blurb: "Your midsection — it stabilizes every lift and protects your lower back.",
  },
};

// Curated effectiveness ratings (editorial, not live worldwide votes).
// A few classics are pinned; the rest get a stable value from their id so
// they look varied without hand-writing all 70.
const RATING_OVERRIDES: Record<string, number> = {
  "chest-barbell-bench-press": 4.9,
  "back-deadlift": 4.9,
  "legs-barbell-squat": 4.9,
  "back-pull-ups": 4.8,
  "shoulders-overhead-barbell-press": 4.8,
  "legs-romanian-deadlift": 4.7,
  "back-lat-pulldown": 4.7,
  "legs-leg-press": 4.7,
  "chest-incline-dumbbell-press": 4.7,
  "biceps-barbell-curl": 4.6,
  "abs-plank": 4.7,
  "abs-hanging-leg-raises": 4.6,
};

const BASE: Record<ExerciseDifficulty, number> = {
  beginner: 4.3,
  intermediate: 4.5,
  advanced: 4.6,
};

function stableJitter(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 15) / 100; // 0.00–0.14
}

/** Curated 1-decimal rating in the 4.3–5.0 range, stable per exercise. */
export function exerciseRating(exercise: Exercise): number {
  const pinned = RATING_OVERRIDES[exercise.id];
  if (pinned !== undefined) return pinned;
  const raw = BASE[exercise.difficulty] + stableJitter(exercise.id);
  return Math.min(5, Math.round(raw * 10) / 10);
}

export function equipmentLabel(equipment: Exercise["equipment"]): string {
  return equipment[0].toUpperCase() + equipment.slice(1);
}

export function difficultyLabel(difficulty: ExerciseDifficulty): string {
  return difficulty[0].toUpperCase() + difficulty.slice(1);
}
