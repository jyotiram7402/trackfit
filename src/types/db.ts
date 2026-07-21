// Row types mirroring the Supabase tables (see supabase/schema.sql).

export type Goal = "lose" | "gain" | "maintain";
export type Gender = "male" | "female" | "other";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export interface Profile {
  id: string;
  name: string;
  age: number | null;
  gender: Gender | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  goal: Goal | null;
  fitness_level: FitnessLevel | null;
  /** Custom Mon–Sat split (6 focus keys); null = default split. */
  custom_split: string[] | null;
  /** Public URL of the uploaded profile photo; null = show initials. */
  avatar_url: string | null;
  created_at: string;
}

/** How a finished exercise felt — drives future plan adjustments. */
export type Feeling = "easy" | "right" | "hard";

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string; // "YYYY-MM-DD"
  day_type: string | null;
  exercise_id: string;
  exercise_name: string;
  muscle_group: string | null;
  sets_done: number | null;
  reps_done: number | null;
  weight_used: number | null;
  completed: boolean;
  feeling: Feeling | null;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
}

export interface WeeklyPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  plan_json: unknown;
  created_at: string;
}
