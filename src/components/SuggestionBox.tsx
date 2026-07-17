"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { bmiLabel, calculateBmi } from "@/lib/bmi";
import { getTodayWeekday } from "@/data/weeklySplit";
import type { Profile } from "@/types/db";
import type { GeneratedPlan } from "@/types/plan";

const TIPS = [
  "Warm up for 5 minutes before lifting — your joints will thank you.",
  "Form beats weight. Nail the movement before adding plates.",
  "Drink water between every set — small sips, big difference.",
  "Protein with every meal helps your muscles recover faster.",
  "Sleep 7–9 hours — that's where the real gains happen.",
  "Leave 1–2 reps in the tank; grinding to failure every set stalls progress.",
  "Log your weights honestly — future you needs the real numbers.",
  "Sore isn't the goal, consistency is. Show up anyway.",
  "Breathe out on the effort, in on the way down.",
  "A 10-minute walk after training speeds up recovery.",
];

const GOAL_ADVICE: Record<string, string[]> = {
  lose: [
    "🏃 Cardio is your fat-burner — hit the full 30 minutes every session.",
    "🔁 Higher reps (12–15) keep the burn going: lighter weight, more work.",
    "💪 Abs are in your plan 4×/week — don't skip them.",
    "🍎 Results happen in the kitchen too: keep a small calorie deficit.",
  ],
  gain: [
    "📈 Progressive overload: add a little weight or one rep each week.",
    "⏱️ Rest 90–120 sec between sets — recover enough to lift heavy again.",
    "🍗 Eat in a calorie surplus with plenty of protein.",
  ],
  maintain: [
    "⚡ Consistency beats intensity — keep showing up.",
    "🔁 Your 10–12 rep range and 25-min cardio keep everything balanced.",
    "😴 Fuel well and sleep 7–9 hours to stay at your best.",
  ],
};

function dayOfYear(d: Date): number {
  return Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
}

export default function SuggestionBox({
  profile,
  plan,
}: {
  profile: Profile;
  plan: GeneratedPlan | null;
}) {
  // Latest weigh-in (falls back to onboarding weight for the progress bar).
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    getSupabaseClient()
      .from("weight_logs")
      .select("weight_kg")
      .eq("user_id", profile.id)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setLatestWeight(data.weight_kg);
      });
    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  const goal = profile.goal ?? "maintain";
  const advice = GOAL_ADVICE[goal];
  const tip = TIPS[dayOfYear(new Date()) % TIPS.length];

  const bmi =
    profile.current_weight_kg && profile.height_cm
      ? calculateBmi(profile.current_weight_kg, profile.height_cm)
      : null;

  // Gentle BMI-aware nudge, never preachy.
  let bmiNote: string | null = null;
  if (bmi !== null) {
    const label = bmiLabel(bmi);
    if (goal === "lose" && label === "Underweight") {
      bmiNote =
        "Your BMI is already on the lower side — consider checking your target with a coach.";
    } else if (goal === "lose" && label === "Overweight") {
      bmiNote = "Every session moves your BMI the right way — trust the process.";
    } else if (goal === "gain" && label === "Underweight") {
      bmiNote = "Perfect goal for you — steady surplus, steady strength.";
    } else if (label === "Normal") {
      bmiNote = `BMI ${bmi} — you're in the healthy range. Keep it rolling!`;
    }
  }

  // Weight progress toward target (for lose/gain goals with data).
  const start = profile.current_weight_kg;
  const target = profile.target_weight_kg;
  const now = latestWeight ?? start;
  let progress: { pct: number; doneKg: number; toGoKg: number } | null = null;
  if (goal !== "maintain" && start != null && target != null && now != null) {
    const total = Math.abs(start - target);
    if (total > 0) {
      const done = goal === "lose" ? start - now : now - start;
      const pct = Math.min(100, Math.max(0, Math.round((done / total) * 100)));
      progress = {
        pct,
        doneKg: Math.max(0, Math.round(done * 10) / 10),
        toGoKg: Math.max(0, Math.round((total - done) * 10) / 10),
      };
    }
  }

  // Next workout: today if it's a training day, otherwise the next one.
  let nextWorkout: { when: string; label: string } | null = null;
  if (plan) {
    const order = plan.days.map((d) => d.day);
    const todayIdx = order.indexOf(getTodayWeekday());
    for (let offset = 0; offset < 7; offset++) {
      const day = plan.days[(todayIdx + offset) % 7];
      if (day.kind === "training") {
        nextWorkout = {
          when:
            offset === 0
              ? "Today"
              : offset === 1
                ? "Tomorrow"
                : day.day[0].toUpperCase() + day.day.slice(1),
          label: day.label,
        };
        break;
      }
    }
  }

  return (
    <div className="rounded-card bg-gradient-to-br from-navy-800 to-aero-700 p-5 text-white shadow-card">
      <p className="text-[11px] font-bold uppercase tracking-widest text-aero-300">
        Coach&apos;s corner
      </p>
      <h2 className="mt-1 text-lg font-bold">
        {profile.name.split(" ")[0]}, here&apos;s your edge today
      </h2>

      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-white/90">
        {advice.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {bmiNote && <p className="mt-3 text-sm font-semibold text-aero-200">{bmiNote}</p>}

      {progress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-white/80">
            <span>
              {progress.doneKg} kg {goal === "lose" ? "down" : "gained"}
            </span>
            <span>{progress.toGoKg} kg to go</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-aero-300 transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 rounded-xl bg-white/10 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-aero-300">
          Tip of the day
        </p>
        <p className="mt-0.5 text-sm text-white/90">{tip}</p>
      </div>

      {nextWorkout && (
        <Link
          href="/today"
          className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-navy-800 transition-colors hover:bg-aero-50"
        >
          <span>
            {nextWorkout.when}: {nextWorkout.label}
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
