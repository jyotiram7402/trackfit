// Shared app types. These will grow as features are built.

export type FitnessGoal = "lose_weight" | "build_muscle" | "get_fit" | "endurance";

export interface UserProfile {
  id: string;
  displayName: string;
  goal: FitnessGoal;
  weightKg: number | null;
  heightCm: number | null;
  onboardedAt: string | null;
}
