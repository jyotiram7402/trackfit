import type { FitnessLevel, Goal } from "@/types/db";
import type { MuscleGroup, Weekday } from "@/types/workout";

// Shape of the generated week, stored as JSON in weekly_plans.plan_json.
// Snapshot everything needed to render the plan so it stays fixed all week
// even if the static catalog changes later.

export interface PlannedExercise {
  exerciseId: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  /** Starting-weight guidance, snapshotted into beginner plans. */
  startingWeight?: string;
}

export interface PlannedCardio {
  id: string;
  name: string;
  durationMinutes: number;
}

/** Goal-driven training parameters applied to the whole week. */
export interface Prescription {
  sets: number;
  reps: string;
  /** Rest between sets, e.g. "45-60 sec". */
  rest: string;
  cardioMinutes: number;
  absDaysPerWeek: number;
}

export interface GeneratedTrainingDay {
  day: Weekday;
  kind: "training";
  label: string;
  focus: [MuscleGroup, MuscleGroup];
  exercises: PlannedExercise[];
  abs: PlannedExercise[];
  cardio: PlannedCardio;
  /**
   * Set on the second session of a muscle pair, e.g.
   * "Different from Monday's chest & triceps exercises".
   */
  repeatNote: string | null;
}

export interface GeneratedRestDay {
  day: Weekday;
  kind: "rest";
  label: string;
}

export type GeneratedDay = GeneratedTrainingDay | GeneratedRestDay;

export interface GeneratedPlan {
  /** Monday of the plan's week, "YYYY-MM-DD". */
  weekStart: string;
  goal: Goal;
  /** Absent on plans generated before fitness levels existed. */
  fitnessLevel?: FitnessLevel;
  prescription: Prescription;
  days: GeneratedDay[];
  generatedAt: string;
}
