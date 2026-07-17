"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useWeeklyPlan } from "@/lib/hooks/useWeeklyPlan";
import { getSupabaseClient } from "@/lib/supabase/client";
import { getTodayWeekday } from "@/data/weeklySplit";
import { CARDIO_BY_ID, EXERCISES_BY_ID, demoVideoUrl } from "@/data/exercises";
import { getExerciseGuide } from "@/data/exerciseGuides";
import { addDays, toISODate } from "@/lib/dates";
import { hardLastTimeIds, type CoachLog } from "@/lib/coach";
import type { Feeling } from "@/types/db";

// ---------- session model ----------

interface GuidedItem {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  videoUrl: string;
  startingTip?: string;
}

interface ItemResult {
  setsDone: number;
  reps: string;
  weight: string;
  feeling: Feeling | null;
  skipped: boolean;
}

type Phase =
  | { kind: "warmup" }
  | { kind: "exercise"; index: number; set: number }
  | { kind: "rest"; index: number; set: number }
  | { kind: "feedback"; index: number }
  | { kind: "cardio" }
  | { kind: "cooldown" }
  | { kind: "celebrate" };

const WARMUP_ITEMS = [
  "2–3 min easy cardio (walk, bike, or row)",
  "10 arm circles forward + 10 backward",
  "10 leg swings per leg",
  "10 slow bodyweight squats",
  "10 shoulder rolls",
];

const COOLDOWN_ITEMS = [
  "30 sec chest stretch (doorway or wall)",
  "30 sec quad stretch per leg",
  "30 sec hamstring stretch per leg",
  "30 sec shoulder / cross-body stretch per arm",
  "5 slow, deep breaths",
];

/** "60-90 sec" → 90 (beginners' longer rest comes from their plan). */
function parseRestSeconds(rest: string): number {
  const nums = rest.match(/\d+/g);
  return nums && nums.length > 0 ? Number(nums[nums.length - 1]) : 60;
}

// ---------- page ----------

export default function GuidedModePage() {
  const router = useRouter();
  const { session } = useAuth();
  const { plan, loading } = useWeeklyPlan();
  const userId = session?.user.id;
  const todayISO = toISODate(new Date());

  const day = plan?.days.find((d) => d.day === getTodayWeekday()) ?? null;
  const trainingDay = day && day.kind === "training" ? day : null;

  const items: GuidedItem[] = useMemo(() => {
    if (!trainingDay) return [];
    return [...trainingDay.exercises, ...trainingDay.abs].map((e) => ({
      id: e.exerciseId,
      name: e.name,
      muscleGroup: e.muscleGroup,
      sets: e.sets,
      reps: e.reps,
      videoUrl: EXERCISES_BY_ID.get(e.exerciseId)?.videoUrl ?? demoVideoUrl(e.name),
      startingTip: e.startingWeight,
    }));
  }, [trainingDay]);

  const restSeconds = plan ? parseRestSeconds(plan.prescription.rest) : 60;

  const [phase, setPhase] = useState<Phase>({ kind: "warmup" });
  const [results, setResults] = useState<Record<string, ItemResult>>({});
  const [hardIds, setHardIds] = useState<Set<string>>(new Set());

  // Exercises that felt too hard last time get a gentle start-lighter note.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getSupabaseClient()
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
  const [cardioDone, setCardioDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Audio must be unlocked by a user gesture; we create the context on tap
  // and reuse it when the rest timer fires.
  const audioRef = useRef<AudioContext | null>(null);
  const ensureAudio = useCallback(() => {
    try {
      if (!audioRef.current) {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioRef.current = new Ctx();
      }
      void audioRef.current.resume();
    } catch {
      // No audio — vibration still works.
    }
  }, []);

  const restOver = useCallback(() => {
    try {
      const ctx = audioRef.current;
      if (ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {}
    navigator.vibrate?.([300, 100, 300]);
  }, []);

  // ----- progress across the whole session -----
  const totalUnits = items.reduce((sum, i) => sum + i.sets, 0) + 1; // +1 cardio
  const doneUnits =
    Object.entries(results).reduce((sum, [, r]) => sum + r.setsDone, 0) +
    (cardioDone ? 1 : 0);
  const progress = Math.round((doneUnits / Math.max(1, totalUnits)) * 100);

  function recordSet(index: number) {
    const item = items[index];
    setResults((prev) => {
      const r = prev[item.id] ?? {
        setsDone: 0,
        reps: "",
        weight: "",
        feeling: null,
        skipped: false,
      };
      return { ...prev, [item.id]: { ...r, setsDone: r.setsDone + 1 } };
    });
  }

  function handleSetDone(index: number, set: number) {
    ensureAudio();
    recordSet(index);
    const item = items[index];
    if (set >= item.sets) {
      setPhase({ kind: "feedback", index });
    } else {
      setPhase({ kind: "rest", index, set });
    }
  }

  function nextAfter(index: number) {
    if (index + 1 < items.length) {
      setPhase({ kind: "exercise", index: index + 1, set: 1 });
    } else {
      setPhase({ kind: "cardio" });
    }
  }

  function skipExercise(index: number) {
    const item = items[index];
    setResults((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] ?? {
          setsDone: 0,
          reps: "",
          weight: "",
          feeling: null,
          skipped: false,
        }),
        skipped: true,
      },
    }));
    nextAfter(index);
  }

  async function saveWorkout() {
    if (!userId || !trainingDay) return;
    setSaving(true);
    setSaveError(null);

    const toNum = (v: string) => {
      const n = Number(v);
      return v.trim() !== "" && Number.isFinite(n) ? n : null;
    };

    interface InsertRow {
      user_id: string;
      date: string;
      day_type: string;
      exercise_id: string;
      exercise_name: string;
      muscle_group: string;
      sets_done: number | null;
      reps_done: number | null;
      weight_used: number | null;
      completed: boolean;
      feeling: Feeling | null;
    }

    const rows: InsertRow[] = items.map((item) => {
      const r = results[item.id];
      return {
        user_id: userId,
        date: todayISO,
        day_type: trainingDay.label,
        exercise_id: item.id,
        exercise_name: item.name,
        muscle_group: item.muscleGroup,
        sets_done: r ? r.setsDone : 0,
        reps_done: r ? toNum(r.reps) : null,
        weight_used: r ? toNum(r.weight) : null,
        completed: !!r && !r.skipped && r.setsDone >= item.sets,
        feeling: r?.feeling ?? null,
      };
    });
    rows.push({
      user_id: userId,
      date: todayISO,
      day_type: trainingDay.label,
      exercise_id: trainingDay.cardio.id,
      exercise_name: trainingDay.cardio.name,
      muscle_group: "cardio",
      sets_done: null,
      reps_done: null,
      weight_used: null,
      completed: cardioDone,
      feeling: null,
    });

    const supabase = getSupabaseClient();
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
    setPhase({ kind: "celebrate" });
  }

  // ----- render -----

  if (loading) {
    return (
      <div className="mt-16 flex justify-center">
        <span
          className="h-8 w-8 animate-spin rounded-full border-[3px] border-aero-200 border-t-aero-500"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!trainingDay || items.length === 0) {
    return (
      <section className="flex flex-col items-center py-16 text-center">
        <p className="text-5xl" aria-hidden>
          💤
        </p>
        <h1 className="mt-3 text-xl font-extrabold text-navy-900">
          No workout to guide today
        </h1>
        <Link href="/today" className="btn-secondary mt-6">
          Back to Today
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-9rem)] max-w-lg flex-col">
      {/* Header: exit + session progress */}
      <div className="flex items-center gap-3">
        <Link
          href="/today"
          aria-label="Exit guided mode"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-700/70 shadow-card"
        >
          ✕
        </Link>
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-aero-100"
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
        <span className="text-xs font-bold text-navy-700/60">{progress}%</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {phase.kind === "warmup" && (
          <ChecklistScreen
            emoji="🔥"
            title="Warm-up first"
            subtitle="5 minutes to wake your body up — your joints and muscles will work better and safer."
            itemsList={WARMUP_ITEMS}
            buttonLabel="Done, let's start →"
            onDone={() => setPhase({ kind: "exercise", index: 0, set: 1 })}
          />
        )}

        {phase.kind === "exercise" && (
          <ExerciseScreen
            item={items[phase.index]}
            position={`${phase.index + 1} of ${items.length}`}
            set={phase.set}
            feltHard={hardIds.has(items[phase.index].id)}
            onSetDone={() => handleSetDone(phase.index, phase.set)}
            onSkip={() => skipExercise(phase.index)}
          />
        )}

        {phase.kind === "rest" && (
          <RestScreen
            seconds={restSeconds}
            nextUp={`Set ${phase.set + 1} of ${items[phase.index].sets} — ${items[phase.index].name}`}
            onDone={() => {
              restOver();
              setPhase({ kind: "exercise", index: phase.index, set: phase.set + 1 });
            }}
            onSkip={() =>
              setPhase({ kind: "exercise", index: phase.index, set: phase.set + 1 })
            }
          />
        )}

        {phase.kind === "feedback" && (
          <FeedbackScreen
            item={items[phase.index]}
            result={results[items[phase.index].id]}
            onSubmit={(patch) => {
              const item = items[phase.index];
              setResults((prev) => ({
                ...prev,
                [item.id]: { ...prev[item.id], ...patch },
              }));
              nextAfter(phase.index);
            }}
          />
        )}

        {phase.kind === "cardio" && (
          <CardioScreen
            name={trainingDay.cardio.name}
            minutes={trainingDay.cardio.durationMinutes}
            videoUrl={
              CARDIO_BY_ID.get(trainingDay.cardio.id)?.videoUrl ??
              demoVideoUrl(trainingDay.cardio.name)
            }
            onDone={() => {
              setCardioDone(true);
              setPhase({ kind: "cooldown" });
            }}
            onSkip={() => setPhase({ kind: "cooldown" })}
          />
        )}

        {phase.kind === "cooldown" && (
          <ChecklistScreen
            emoji="🧘"
            title="Cool down"
            subtitle="Two minutes of stretching now saves you soreness tomorrow."
            itemsList={COOLDOWN_ITEMS}
            buttonLabel={saving ? "Saving…" : "Finish workout"}
            buttonDisabled={saving}
            error={saveError}
            onDone={saveWorkout}
          />
        )}

        {phase.kind === "celebrate" && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-7xl" aria-hidden>
              🎉
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy-900">
              Workout complete!
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-navy-700/70">
              {doneUnits} sets in the bag. Logged and saved — your progress
              charts just got better.
            </p>
            <button
              type="button"
              onClick={() => router.replace("/progress")}
              className="btn-primary mt-8 w-full"
            >
              See my progress
            </button>
            <Link href="/home" className="mt-3 text-sm font-semibold text-aero-700">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- screens ----------

function ChecklistScreen({
  emoji,
  title,
  subtitle,
  itemsList,
  buttonLabel,
  buttonDisabled,
  error,
  onDone,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  itemsList: string[];
  buttonLabel: string;
  buttonDisabled?: boolean;
  error?: string | null;
  onDone: () => void;
}) {
  const [checked, setChecked] = useState<boolean[]>(itemsList.map(() => false));

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-5xl" aria-hidden>
        {emoji}
      </p>
      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">{title}</h1>
      <p className="mt-1 text-sm leading-relaxed text-navy-700/70">{subtitle}</p>

      <div className="mt-5 space-y-2.5">
        {itemsList.map((text, i) => (
          <button
            key={text}
            type="button"
            onClick={() =>
              setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)))
            }
            aria-pressed={checked[i]}
            className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-colors ${
              checked[i]
                ? "border-aero-400 bg-aero-50 text-navy-700/60 line-through"
                : "border-aero-200 bg-white text-navy-800"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                checked[i]
                  ? "border-aero-500 bg-aero-500 text-white"
                  : "border-aero-300 text-transparent"
              }`}
            >
              ✓
            </span>
            {text}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&apos;t save: {error}
        </p>
      )}

      <button
        type="button"
        onClick={onDone}
        disabled={buttonDisabled}
        className="btn-primary mt-auto w-full py-4 disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function ExerciseScreen({
  item,
  position,
  set,
  feltHard,
  onSetDone,
  onSkip,
}: {
  item: GuidedItem;
  position: string;
  set: number;
  feltHard: boolean;
  onSetDone: () => void;
  onSkip: () => void;
}) {
  const guide = getExerciseGuide(item.id);

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-xs font-bold uppercase tracking-widest text-aero-600">
        Exercise {position} · {item.muscleGroup}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold text-navy-900">
        <Link href={`/exercise/${item.id}`} className="hover:text-aero-700">
          {item.name}
        </Link>
      </h1>

      {/* Only the current exercise's video is ever mounted */}
      <div className="mt-3 aspect-video overflow-hidden rounded-card bg-navy-900 shadow-card">
        <iframe
          src={item.videoUrl}
          title={`How to perform ${item.name}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="card mt-4 bg-aero-50 py-4 text-center">
        <p className="text-lg font-extrabold text-navy-900">
          Set {set} of {item.sets} — aim for {item.reps} reps
        </p>
        {item.startingTip && set === 1 && (
          <p className="mt-1 text-xs font-medium text-aero-700">
            💡 {item.startingTip}
          </p>
        )}
        {feltHard && set === 1 && (
          <p className="mt-1 text-xs font-medium text-orange-700">
            🧘 This felt tough last time — start a little lighter and focus on
            form.
          </p>
        )}
      </div>

      {guide && (
        <ul className="mt-3 space-y-1">
          {guide.tips.slice(0, 2).map((tip) => (
            <li key={tip} className="text-sm text-navy-700/80">
              ✓ {tip}
            </li>
          ))}
          <li className="text-sm text-red-700/80">✗ {guide.mistakes[0].mistake}</li>
        </ul>
      )}

      <div className="mt-auto pt-4">
        <button type="button" onClick={onSetDone} className="btn-primary w-full py-4 text-lg">
          Set done ✓
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="mt-2 w-full py-2 text-center text-sm font-semibold text-navy-700/50 hover:text-navy-700"
        >
          Skip this exercise
        </button>
      </div>
    </div>
  );
}

function RestScreen({
  seconds,
  nextUp,
  onDone,
  onSkip,
}: {
  seconds: number;
  nextUp: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const doneRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer);
          if (!doneRef.current) {
            doneRef.current = true;
            // Defer past render so state updates in the parent are safe.
            setTimeout(onDone, 0);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDone]);

  const R = 84;
  const circumference = 2 * Math.PI * R;
  const fraction = remaining / seconds;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-aero-600">
        Rest
      </p>

      <div className="relative mt-4 h-56 w-56">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="#d7f6f2" strokeWidth="12" />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="#26a8a3"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-extrabold tabular-nums text-navy-900">
            {remaining}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">
            seconds
          </span>
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-navy-800">
        Next: {nextUp}
      </p>
      <p className="mt-1 text-xs text-navy-700/50">
        Shake your arms out, sip some water.
      </p>

      <button
        type="button"
        onClick={onSkip}
        className="btn-secondary mt-8 w-full"
      >
        Skip rest →
      </button>
    </div>
  );
}

function FeedbackScreen({
  item,
  result,
  onSubmit,
}: {
  item: GuidedItem;
  result: ItemResult | undefined;
  onSubmit: (patch: Partial<ItemResult>) => void;
}) {
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const options: { value: Feeling; label: string; emoji: string }[] = [
    { value: "easy", label: "Too easy", emoji: "😅" },
    { value: "right", label: "Just right", emoji: "💪" },
    { value: "hard", label: "Too hard", emoji: "🥵" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-5xl" aria-hidden>
        ✅
      </p>
      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">
        {item.name} done!
      </h1>
      <p className="mt-1 text-sm text-navy-700/70">
        {result?.setsDone ?? item.sets} sets finished. How did that feel?
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFeeling(o.value)}
            aria-pressed={feeling === o.value}
            className={`rounded-xl border-2 px-2 py-4 text-center transition-colors ${
              feeling === o.value
                ? "border-aero-500 bg-aero-100"
                : "border-aero-200 bg-white hover:border-aero-300"
            }`}
          >
            <span className="block text-2xl">{o.emoji}</span>
            <span className="mt-1 block text-xs font-bold text-navy-800">
              {o.label}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm font-semibold text-navy-800">
        Log what you actually did <span className="font-normal text-navy-700/50">(optional)</span>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-navy-700/60">
            Reps per set
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder={item.reps}
            className="w-full rounded-xl border border-aero-200 bg-white px-3 py-3 text-center text-sm font-semibold outline-none placeholder:font-normal placeholder:text-navy-700/30 focus:border-aero-500"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-navy-700/60">
            Weight (kg)
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="20"
            className="w-full rounded-xl border border-aero-200 bg-white px-3 py-3 text-center text-sm font-semibold outline-none placeholder:font-normal placeholder:text-navy-700/30 focus:border-aero-500"
          />
        </label>
      </div>

      <button
        type="button"
        disabled={feeling === null}
        onClick={() => onSubmit({ feeling, reps, weight })}
        className="btn-primary mt-auto w-full py-4 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}

function CardioScreen({
  name,
  minutes,
  videoUrl,
  onDone,
  onSkip,
}: {
  name: string;
  minutes: number;
  videoUrl: string;
  onDone: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-xs font-bold uppercase tracking-widest text-aero-600">
        Last block · Cardio
      </p>
      <h1 className="mt-1 text-2xl font-extrabold text-navy-900">{name}</h1>

      <div className="mt-3 aspect-video overflow-hidden rounded-card bg-navy-900 shadow-card">
        <iframe
          src={videoUrl}
          title={`How to perform ${name}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="card mt-4 bg-aero-50 py-4 text-center">
        <p className="text-lg font-extrabold text-navy-900">🏃 {minutes} minutes</p>
        <p className="mt-1 text-xs text-navy-700/60">
          A steady pace you could hold a conversation at is perfect.
        </p>
      </div>

      <div className="mt-auto pt-4">
        <button type="button" onClick={onDone} className="btn-primary w-full py-4 text-lg">
          Cardio done ✓
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="mt-2 w-full py-2 text-center text-sm font-semibold text-navy-700/50 hover:text-navy-700"
        >
          Skip cardio
        </button>
      </div>
    </div>
  );
}
