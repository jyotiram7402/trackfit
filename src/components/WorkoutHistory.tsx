"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { addDays, getWeekStart, toISODate } from "@/lib/dates";
import type { SetDetail } from "@/types/db";

type Range = "week" | "month" | "3mo";

interface HistoryRow {
  date: string;
  day_type: string | null;
  exercise_name: string;
  muscle_group: string | null;
  sets_done: number | null;
  weight_used: number | null;
  sets_detail: SetDetail[] | null;
  completed: boolean;
}

const RANGES: { key: Range; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "3mo", label: "3 months" },
];

function rangeStartISO(range: Range): string {
  const now = new Date();
  if (range === "week") return toISODate(getWeekStart(now));
  if (range === "month")
    return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
  return toISODate(addDays(now, -90));
}

/** Human summary of one exercise's sets, e.g. "20×12 · 30×10 · 40×8". */
function setsSummary(row: HistoryRow): string {
  if (row.muscle_group === "cardio") return "done";
  if (row.sets_detail && row.sets_detail.length > 0) {
    return row.sets_detail
      .map((s) => {
        const w = s.weight != null ? `${s.weight}kg` : "";
        const r = s.reps != null ? `×${s.reps}` : "";
        return (w + r) || "✓";
      })
      .join(" · ");
  }
  if (row.sets_done) {
    return `${row.sets_done} set${row.sets_done === 1 ? "" : "s"}${
      row.weight_used != null ? ` · ${row.weight_used}kg` : ""
    }`;
  }
  return "done";
}

export default function WorkoutHistory({ userId }: { userId: string }) {
  const [range, setRange] = useState<Range>("week");
  const [rows, setRows] = useState<HistoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    setError(null);
    getSupabaseClient()
      .from("workout_logs")
      .select(
        "date, day_type, exercise_name, muscle_group, sets_done, weight_used, sets_detail, completed"
      )
      .eq("user_id", userId)
      .eq("completed", true)
      .gte("date", rangeStartISO(range))
      .order("date", { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else setRows((data as HistoryRow[]) ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, range]);

  // Group rows by date (already sorted newest-first).
  const days = useMemo(() => {
    const map = new Map<string, HistoryRow[]>();
    for (const row of rows ?? []) {
      const list = map.get(row.date);
      if (list) list.push(row);
      else map.set(row.date, [row]);
    }
    return [...map.entries()];
  }, [rows]);

  return (
    <div className="card mt-4">
      <h2 className="mb-3 text-sm font-bold text-navy-800">Workout history</h2>

      <div className="mb-4 grid grid-cols-3 gap-1 rounded-full bg-aero-100 p-1">
        {RANGES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`rounded-full py-1.5 text-xs font-semibold transition-colors ${
              range === r.key ? "bg-navy-800 text-white" : "text-navy-700/60"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {rows === null && !error && (
        <p className="py-6 text-center text-sm text-navy-700/50">Loading…</p>
      )}

      {rows !== null && days.length === 0 && (
        <p className="py-6 text-center text-sm text-navy-700/50">
          No workouts logged in this range yet.
        </p>
      )}

      <div className="space-y-4">
        {days.map(([date, dayRows]) => (
          <div key={date}>
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-bold text-navy-900">
                {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              {dayRows[0].day_type && (
                <span className="text-xs font-semibold text-aero-700">
                  {dayRows[0].day_type}
                </span>
              )}
            </div>
            <ul className="mt-1 space-y-1 border-l-2 border-aero-100 pl-3">
              {dayRows.map((row, i) => (
                <li key={i} className="flex justify-between gap-3 text-sm">
                  <span className="text-navy-800">{row.exercise_name}</span>
                  <span className="shrink-0 text-navy-700/60">{setsSummary(row)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
