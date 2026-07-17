import type { Goal } from "@/types/db";

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export type BmiLabel = "Underweight" | "Normal" | "Overweight";

export function bmiLabel(bmi: number): BmiLabel {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  return "Overweight";
}

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose weight",
  gain: "Gain muscle",
  maintain: "Maintain",
};

export function goalMessage(goal: Goal, name: string): string {
  switch (goal) {
    case "lose":
      return `${name}, every session burns a little more — stay consistent and the scale will follow. Let's get after it! 🔥`;
    case "gain":
      return `${name}, muscle is built one rep at a time — show up, lift, eat, repeat. Let's grow! 💪`;
    case "maintain":
      return `${name}, staying strong is a win in itself — keep moving and enjoy the routine. Let's keep it going! ⚡`;
  }
}
