// Types for the static workout catalog and weekly training split.

export type MuscleGroup =
  | "chest"
  | "triceps"
  | "back"
  | "biceps"
  | "legs"
  | "shoulders"
  | "abs";

export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

export type Equipment = "machine" | "dumbbell" | "barbell" | "bodyweight" | "cable";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  defaultSets: number;
  /** Rep target — a range ("8-12"), a time ("45-60 sec"), or per-side ("10 per leg"). */
  defaultReps: string;
  /** Embeddable YouTube URL demonstrating proper form. */
  videoUrl: string;
  difficulty: ExerciseDifficulty;
  equipment: Equipment;
  /** Friendly starting-weight guidance for beginners. */
  startingWeight: string;
}

export interface CardioActivity {
  id: string;
  name: string;
  durationMinutes: number;
  videoUrl: string;
  /** High-impact options (HIIT, jump rope) are skipped for beginners. */
  intense: boolean;
}

export interface MistakeFix {
  mistake: string;
  fix: string;
}

/** Beginner-facing how-to content for one exercise. */
export interface ExerciseGuide {
  /** Numbered steps: setup → starting position → movement → return. */
  steps: string[];
  /** When to breathe in / out. */
  breathing: string;
  /** Common mistakes with the fix for each. */
  mistakes: MistakeFix[];
  /** Short form cues. */
  tips: string[];
  /** Extra safety warning for riskier lifts. */
  safety?: string;
}

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/**
 * Each muscle-group pair appears twice per week. Variant "A" days use the
 * first 3 exercises of each group's pool, variant "B" days the next 3 —
 * so the same muscle never repeats an exercise within the week.
 */
export type SessionVariant = "A" | "B";

export interface TrainingDay {
  day: Weekday;
  kind: "training";
  /** Display label, e.g. "Chest & Triceps". */
  label: string;
  focus: [MuscleGroup, MuscleGroup];
  variant: SessionVariant;
  /** Abs exercise ids for this day; empty on non-abs days. */
  absExerciseIds: string[];
  /** Cardio activity id for this day. */
  cardioId: string;
  cardioMinutes: number;
}

export interface RestDay {
  day: Weekday;
  kind: "rest";
  label: string;
}

export type SplitDay = TrainingDay | RestDay;

/** A fully resolved day: the concrete exercises to perform. */
export interface DayWorkout {
  day: Weekday;
  label: string;
  strength: Exercise[];
  abs: Exercise[];
  cardio: CardioActivity | null;
}
