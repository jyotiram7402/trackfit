"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { addDays, getWeekStart, toISODate } from "@/lib/dates";
import type { WeightLog } from "@/types/db";

// Recharts is the heaviest dependency in the app — stream it in after the
// summary and stat tiles have painted.
const ProgressCharts = dynamic(() => import("@/components/ProgressCharts"), {
  ssr: false,
  loading: () => (
    <div className="mt-4 space-y-4">
      <div className="card h-56 animate-pulse bg-white/70" />
      <div className="card h-56 animate-pulse bg-white/70" />
    </div>
  ),
});

interface LogRow {
  date: string;
  muscle_group: string | null;
  completed: boolean;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProgressPage() {
  const { session, profile } = useAuth();
  const userId = session?.user.id;

  const [logs, setLogs] = useState<LogRow[] | null>(null);
  const [weights, setWeights] = useState<WeightLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weekStart = useMemo(() => getWeekStart(new Date()), []);
  // Fetch enough history for the 4-week chart AND the calendar-month stats.
  const fetchFrom = useMemo(() => {
    const fourWeeksAgo = addDays(weekStart, -21);
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return toISODate(fourWeeksAgo < monthStart ? fourWeeksAgo : monthStart);
  }, [weekStart]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = getSupabaseClient();

    Promise.all([
      supabase
        .from("workout_logs")
        .select("date, muscle_group, completed")
        .eq("user_id", userId)
        .gte("date", fetchFrom)
        .order("date"),
      supabase
        .from("weight_logs")
        .select("id, user_id, date, weight_kg")
        .eq("user_id", userId)
        .order("date")
        .limit(180),
    ]).then(([logsRes, weightsRes]) => {
      if (cancelled) return;
      if (logsRes.error || weightsRes.error) {
        setError((logsRes.error ?? weightsRes.error)!.message);
        return;
      }
      setLogs(logsRes.data as LogRow[]);
      setWeights(weightsRes.data as WeightLog[]);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, fetchFrom]);

  const stats = useMemo(() => {
    if (!logs) return null;

    const completed = logs.filter((l) => l.completed);
    const weekStartISO = toISODate(weekStart);
    const monthStartISO = toISODate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );

    const weekRows = completed.filter((l) => l.date >= weekStartISO);
    const monthRows = completed.filter((l) => l.date >= monthStartISO);
    const workoutDates = new Set(completed.map((l) => l.date));

    // Streak: consecutive training days with ≥1 completed exercise, walking
    // back from today. Sundays (rest days) don't break it; a not-yet-logged
    // today doesn't either.
    let streak = 0;
    let cursor = new Date();
    if (!workoutDates.has(toISODate(cursor))) cursor = addDays(cursor, -1);
    for (let i = 0; i < 366; i++) {
      if (cursor.getDay() === 0) {
        cursor = addDays(cursor, -1);
        continue;
      }
      if (!workoutDates.has(toISODate(cursor))) break;
      streak++;
      cursor = addDays(cursor, -1);
    }

    // Exercises completed per day, Mon–Sun of this week.
    const perDay = DAY_LABELS.map((label, i) => ({
      label,
      count: completed.filter((l) => l.date === toISODate(addDays(weekStart, i)))
        .length,
    }));

    // Distinct workout days per week, last 4 weeks (oldest → current).
    const perWeek = [3, 2, 1, 0].map((weeksAgo) => {
      const start = addDays(weekStart, -7 * weeksAgo);
      const end = addDays(start, 7);
      const days = new Set(
        completed
          .filter((l) => l.date >= toISODate(start) && l.date < toISODate(end))
          .map((l) => l.date)
      );
      return {
        label: start.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
        count: days.size,
      };
    });

    // Exercises per muscle group this month (cardio tracked separately).
    const byMuscle = new Map<string, number>();
    for (const row of monthRows) {
      if (!row.muscle_group || row.muscle_group === "cardio") continue;
      byMuscle.set(row.muscle_group, (byMuscle.get(row.muscle_group) ?? 0) + 1);
    }
    const muscleData = [...byMuscle.entries()]
      .map(([muscle, count]) => ({
        label: muscle[0].toUpperCase() + muscle.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      week: {
        exercises: weekRows.length,
        workouts: new Set(weekRows.map((l) => l.date)).size,
      },
      month: {
        exercises: monthRows.length,
        workouts: new Set(monthRows.map((l) => l.date)).size,
      },
      streak,
      perDay,
      perWeek,
      muscleData,
      hasLogs: completed.length > 0,
    };
  }, [logs, weekStart]);

  const latestWeight = weights?.length ? weights[weights.length - 1].weight_kg : null;
  const target = profile?.target_weight_kg ?? null;

  const summary = useMemo(() => {
    if (!stats) return null;
    const w = stats.month.workouts;
    const workoutsPart = `You've completed ${w} workout${w === 1 ? "" : "s"} this month`;
    if (target && latestWeight && profile?.goal !== "maintain") {
      const diff = Math.abs(latestWeight - target);
      const reached =
        profile?.goal === "lose" ? latestWeight <= target : latestWeight >= target;
      return reached
        ? `${workoutsPart} — and you've hit your target weight! 🎉`
        : `${workoutsPart} — ${diff.toFixed(1)} kg to your goal! 🔥`;
    }
    return `${workoutsPart} — keep the streak alive! ⚡`;
  }, [stats, target, latestWeight, profile?.goal]);

  if (error) {
    return (
      <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Couldn&apos;t load progress: {error}
      </p>
    );
  }

  if (!stats || !weights || !userId) {
    return (
      <div className="mt-16 flex justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-aero-200 border-t-aero-500"
          role="status"
          aria-label="Loading progress"
        />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-navy-900">Progress</h1>
      {summary && (
        <p className="mt-2 rounded-xl bg-aero-100 px-4 py-3 text-sm font-semibold text-aero-800">
          {summary}
        </p>
      )}

      {/* Stat tiles */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <StatTile
          value={stats.streak}
          label={`day streak${stats.streak > 0 ? " 🔥" : ""}`}
        />
        <StatTile
          value={stats.week.workouts}
          label="workouts this week"
          sub={`${stats.week.exercises} exercises`}
        />
        <StatTile
          value={stats.month.workouts}
          label="workouts this month"
          sub={`${stats.month.exercises} exercises`}
        />
      </div>

      <ProgressCharts
        perDay={stats.perDay}
        perWeek={stats.perWeek}
        muscleData={stats.muscleData}
        hasLogs={stats.hasLogs}
        weights={weights}
        target={target}
        userId={userId}
        onWeightSaved={(log) =>
          setWeights((prev) => {
            const rest = (prev ?? []).filter((w) => w.date !== log.date);
            return [...rest, log].sort((a, b) => a.date.localeCompare(b.date));
          })
        }
      />
    </section>
  );
}

function StatTile({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub?: string;
}) {
  return (
    <div className="card px-3 py-4 text-center">
      <p className="text-3xl font-extrabold text-navy-900">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold leading-tight text-navy-700/60">
        {label}
      </p>
      {sub && <p className="mt-1 text-[11px] text-aero-700">{sub}</p>}
    </div>
  );
}
