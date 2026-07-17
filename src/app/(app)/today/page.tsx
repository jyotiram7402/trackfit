"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useWeeklyPlan } from "@/lib/hooks/useWeeklyPlan";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getTodayWeekday } from "@/data/weeklySplit";
import { CARDIO_BY_ID, EXERCISES_BY_ID, demoVideoUrl } from "@/data/exercises";
import { addDays, toISODate } from "@/lib/dates";
import { hardLastTimeIds, type CoachLog } from "@/lib/coach";
import type { GeneratedTrainingDay } from "@/types/plan";

/** One loggable item on today's list (strength, abs, or cardio). */
interface TodayItem {
  id: string;
  name: string;
  muscleGroup: string;
  /** e.g. "3 × 12-15" or "30 min" for cardio. */
  target: string;
  videoUrl: string;
  isCardio: boolean;
  /** Beginner starting-weight guidance from the plan, if any. */
  startingTip?: string;
}

interface Entry {
  completed: boolean;
  sets: string;
  reps: string;
  weight: string;
}

const EMPTY_ENTRY: Entry = { completed: false, sets: "", reps: "", weight: "" };

function toNumberOrNull(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function TodayPage() {
  const { session } = useAuth();
  const { plan, loading, error } = useWeeklyPlan();
  const today = getTodayWeekday();
  const todayISO = toISODate(new Date());

  const day = plan?.days.find((d) => d.day === today) ?? null;

  const items: TodayItem[] = useMemo(() => {
    if (!day || day.kind !== "training") return [];
    const strengthAndAbs = [...day.exercises, ...day.abs].map((e) => ({
      id: e.exerciseId,
      name: e.name,
      muscleGroup: e.muscleGroup,
      target: `${e.sets} × ${e.reps}`,
      videoUrl: EXERCISES_BY_ID.get(e.exerciseId)?.videoUrl ?? demoVideoUrl(e.name),
      isCardio: false,
      startingTip: e.startingWeight,
    }));
    const cardio = {
      id: day.cardio.id,
      name: day.cardio.name,
      muscleGroup: "cardio",
      target: `${day.cardio.durationMinutes} min`,
      videoUrl: CARDIO_BY_ID.get(day.cardio.id)?.videoUrl ?? demoVideoUrl(day.cardio.name),
      isCardio: true,
    };
    return [...strengthAndAbs, cardio];
  }, [day]);

  const [entries, setEntries] = useState<Record<string, Entry>>({});
  const [learnedIds, setLearnedIds] = useState<Set<string> | null>(null);
  const [hardIds, setHardIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Restore anything already logged for today (e.g. after a refresh).
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getSupabaseClient()
      .from("workout_logs")
      .select("exercise_id, sets_done, reps_done, weight_used, completed")
      .eq("user_id", userId)
      .eq("date", todayISO)
      .then(({ data }) => {
        if (cancelled || !data || data.length === 0) return;
        const restored: Record<string, Entry> = {};
        for (const row of data) {
          restored[row.exercise_id] = {
            completed: row.completed,
            sets: row.sets_done?.toString() ?? "",
            reps: row.reps_done?.toString() ?? "",
            weight: row.weight_used?.toString() ?? "",
          };
        }
        setEntries(restored);
        setSavedAt(new Date());
      });

    return () => {
      cancelled = true;
    };
  }, [userId, todayISO]);

  // Which exercises the user has reviewed, and which felt too hard last
  // time (before today) — both drive gentle reminders on the cards.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = getSupabaseClient();

    supabase
      .from("learned_exercises")
      .select("exercise_id")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (!cancelled && data)
          setLearnedIds(new Set(data.map((r) => r.exercise_id)));
      });

    supabase
      .from("workout_logs")
      .select("exercise_id, exercise_name, date, weight_used, feeling, completed")
      .eq("user_id", userId)
      .gte("date", toISODate(addDays(new Date(), -30)))
      .lt("date", todayISO)
      .then(({ data }) => {
        if (!cancelled && data) setHardIds(hardLastTimeIds(data as CoachLog[]));
      });

    return () => {
      cancelled = true;
    };
  }, [userId, todayISO]);

  function updateEntry(id: string, patch: Partial<Entry>) {
    setEntries((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_ENTRY), ...patch },
    }));
    setSavedAt(null);
  }

  const doneCount = items.filter((i) => entries[i.id]?.completed).length;
  const progress = items.length === 0 ? 0 : Math.round((doneCount / items.length) * 100);

  async function handleFinish() {
    if (!userId || !day || day.kind !== "training") return;
    setSaving(true);
    setSaveError(null);

    const supabase = getSupabaseClient();
    const rows = items.map((item) => {
      const entry = entries[item.id] ?? EMPTY_ENTRY;
      return {
        user_id: userId,
        date: todayISO,
        day_type: day.label,
        exercise_id: item.id,
        exercise_name: item.name,
        muscle_group: item.muscleGroup,
        sets_done: item.isCardio ? null : toNumberOrNull(entry.sets),
        reps_done: item.isCardio ? null : toNumberOrNull(entry.reps),
        weight_used: item.isCardio ? null : toNumberOrNull(entry.weight),
        completed: entry.completed,
      };
    });

    // Replace today's rows so re-finishing updates instead of duplicating.
    const { error: delError } = await supabase
      .from("workout_logs")
      .delete()
      .eq("user_id", userId)
      .eq("date", todayISO);

    if (delError) {
      setSaving(false);
      setSaveError(delError.message);
      return;
    }

    const { error: insError } = await supabase.from("workout_logs").insert(rows);
    setSaving(false);
    if (insError) {
      setSaveError(insError.message);
      return;
    }
    setSavedAt(new Date());
  }

  if (loading) {
    return (
      <div className="mt-16 flex justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-aero-200 border-t-aero-500"
          role="status"
          aria-label="Loading workout"
        />
      </div>
    );
  }

  if (error || !plan || !day) {
    return (
      <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        Couldn&apos;t load today&apos;s workout{error ? `: ${error}` : "."}
      </p>
    );
  }

  if (day.kind === "rest") {
    return (
      <section className="flex flex-col items-center py-16 text-center">
        <p className="text-6xl" aria-hidden>
          💤
        </p>
        <h1 className="mt-4 text-2xl font-extrabold text-navy-900">Rest Day</h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-navy-700/70">
          Recover well — sleep, stretch, hydrate, and eat right. Your muscles
          grow on days like this. See you tomorrow! 💪
        </p>
      </section>
    );
  }

  const trainingDay = day as GeneratedTrainingDay;
  const sections: { title: string; items: TodayItem[] }[] = [
    ...trainingDay.focus.map((muscle) => ({
      title: muscle[0].toUpperCase() + muscle.slice(1),
      items: items.filter((i) => i.muscleGroup === muscle),
    })),
    ...(trainingDay.abs.length > 0
      ? [{ title: "Abs", items: items.filter((i) => i.muscleGroup === "abs") }]
      : []),
    { title: "Cardio", items: items.filter((i) => i.isCardio) },
  ];

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-navy-900">{trainingDay.label}</h1>
      <p className="mt-1 text-sm text-navy-700/70">
        {doneCount} of {items.length} done
      </p>

      {plan.fitnessLevel === "beginner" && (
        <p className="mt-3 rounded-xl bg-aero-100 px-4 py-3 text-sm font-medium text-aero-800">
          🌱 Start light and master the movement first — the weight will come.
          Each exercise below has a suggested starting weight.
        </p>
      )}

      {/* Progress bar */}
      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-aero-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-aero-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Link
        href="/today/guided"
        className="mt-4 flex items-center justify-between rounded-card bg-gradient-to-r from-navy-800 to-aero-700 px-5 py-4 text-white shadow-card transition-opacity hover:opacity-95"
      >
        <span>
          <span className="block text-base font-bold">🎯 Guided Mode</span>
          <span className="block text-xs text-white/80">
            One step at a time — warm-up, rest timers, form cues
          </span>
        </span>
        <span className="text-xl" aria-hidden>
          →
        </span>
      </Link>

      {sections.map((section) => (
        <div key={section.title} className="mt-7">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-700/60">
            {section.title}
          </h2>
          <div className="space-y-4">
            {section.items.map((item) => (
              <ExerciseCard
                key={item.id}
                item={item}
                entry={entries[item.id] ?? EMPTY_ENTRY}
                needsReview={
                  !item.isCardio &&
                  learnedIds !== null &&
                  !learnedIds.has(item.id)
                }
                feltHard={hardIds.has(item.id)}
                onChange={(patch) => updateEntry(item.id, patch)}
              />
            ))}
          </div>
        </div>
      ))}

      {saveError && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&apos;t save: {saveError}
        </p>
      )}
      {savedAt && !saveError && (
        <p className="mt-6 rounded-xl bg-aero-100 px-4 py-3 text-center text-sm font-semibold text-aero-800">
          Workout saved 💪 Great job!
        </p>
      )}

      <button
        type="button"
        onClick={handleFinish}
        disabled={saving}
        className="btn-primary mt-4 w-full disabled:opacity-60"
      >
        {saving ? "Saving…" : savedAt ? "Update Workout" : "Finish Workout"}
      </button>
    </section>
  );
}

function ExerciseCard({
  item,
  entry,
  needsReview,
  feltHard,
  onChange,
}: {
  item: TodayItem;
  entry: Entry;
  needsReview: boolean;
  feltHard: boolean;
  onChange: (patch: Partial<Entry>) => void;
}) {
  const [showVideo, setShowVideo] = useState(false);
  const [showLog, setShowLog] = useState(false);

  return (
    <div
      className={`card transition-colors ${
        entry.completed ? "bg-aero-50 ring-1 ring-aero-300" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-aero-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-aero-700">
            {item.muscleGroup}
          </span>
          <h3
            className={`mt-1.5 text-base font-bold ${
              entry.completed ? "text-navy-700/60 line-through" : "text-navy-900"
            }`}
          >
            {item.isCardio ? (
              item.name
            ) : (
              <Link
                href={`/exercise/${item.id}`}
                className="underline decoration-aero-300 decoration-2 underline-offset-4 hover:text-aero-700"
              >
                {item.name}
              </Link>
            )}
          </h3>
          {needsReview && (
            <Link
              href={`/exercise/${item.id}`}
              className="mt-1 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-700"
            >
              📖 New to you? Learn it first
            </Link>
          )}
          <p className="text-sm text-navy-700/60">{item.target}</p>
          {feltHard && (
            <p className="mt-1 text-xs font-medium text-orange-700">
              🧘 Felt tough last time — start a little lighter and focus on
              form.{" "}
              <Link href={`/exercise/${item.id}`} className="underline">
                Review the how-to
              </Link>
            </p>
          )}
          {item.startingTip && (
            <p className="mt-1 text-xs font-medium text-aero-700">
              💡 {item.startingTip}
            </p>
          )}
        </div>

        {/* Big thumb-friendly done toggle */}
        <button
          type="button"
          onClick={() => onChange({ completed: !entry.completed })}
          aria-pressed={entry.completed}
          aria-label={`Mark ${item.name} as ${entry.completed ? "not done" : "done"}`}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-xl transition-colors ${
            entry.completed
              ? "border-aero-500 bg-aero-500 text-white"
              : "border-aero-300 bg-white text-transparent hover:border-aero-500"
          }`}
        >
          ✓
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setShowVideo((v) => !v)}
          className="flex-1 rounded-xl bg-navy-800 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-700"
        >
          {showVideo ? "Hide video" : "▶ How to perform"}
        </button>
        {!item.isCardio && (
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            className="flex-1 rounded-xl border-2 border-aero-200 px-3 py-2.5 text-sm font-semibold text-aero-700 transition-colors hover:border-aero-400"
          >
            {showLog ? "Hide log" : "Log sets"}
          </button>
        )}
      </div>

      {/* Video iframe only mounts when opened — nothing loads up front */}
      {showVideo && (
        <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-navy-900">
          <iframe
            src={item.videoUrl}
            title={`How to perform ${item.name}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {showLog && !item.isCardio && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <LogInput
            label="Sets"
            value={entry.sets}
            placeholder="3"
            onChange={(v) => onChange({ sets: v })}
          />
          <LogInput
            label="Reps"
            value={entry.reps}
            placeholder="12"
            onChange={(v) => onChange({ reps: v })}
          />
          <LogInput
            label="Weight (kg)"
            value={entry.weight}
            placeholder="20"
            step="0.5"
            onChange={(v) => onChange({ weight: v })}
          />
        </div>
      )}
    </div>
  );
}

function LogInput({
  label,
  value,
  placeholder,
  step,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  step?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-navy-700/60">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-aero-200 bg-white px-3 py-2.5 text-center text-sm font-semibold outline-none placeholder:font-normal placeholder:text-navy-700/30 focus:border-aero-500"
      />
    </label>
  );
}
