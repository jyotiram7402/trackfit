import { CARDIO_ACTIVITIES, EXERCISES } from "@/data/exercises";
import {
  ALL_WEEKDAYS,
  DEFAULT_SPLIT_KEYS,
  FOCUS_PAIRS,
  WEEKDAYS_MON_SAT,
  normalizeSplitKeys,
  type SplitDayKey,
} from "@/data/weeklySplit";
import type { FitnessLevel, Goal } from "@/types/db";
import type {
  GeneratedDay,
  GeneratedPlan,
  PlannedExercise,
  Prescription,
} from "@/types/plan";
import type { Exercise, MuscleGroup, Weekday } from "@/types/workout";

/** Goal-driven prescriptions (intermediate/advanced baseline). */
export const PRESCRIPTIONS: Record<Goal, Prescription> = {
  lose: { sets: 3, reps: "12-15", rest: "45-60 sec", cardioMinutes: 30, absDaysPerWeek: 4 },
  gain: { sets: 4, reps: "6-10", rest: "90-120 sec", cardioMinutes: 20, absDaysPerWeek: 3 },
  maintain: { sets: 3, reps: "10-12", rest: "60-90 sec", cardioMinutes: 25, absDaysPerWeek: 3 },
};

/**
 * Beginner overrides: fewer/simpler exercises, moderate fixed reps, longer
 * rest, and gentler cardio regardless of goal.
 */
function prescriptionFor(goal: Goal, level: FitnessLevel): Prescription {
  const base = PRESCRIPTIONS[goal];
  if (level !== "beginner") return base;
  return {
    ...base,
    sets: 3,
    reps: "12",
    rest: "60-90 sec",
    cardioMinutes: Math.min(base.cardioMinutes, 20),
  };
}

const ABS_PER_DAY = 2;

/** Beginners get 2 exercises per muscle; everyone else gets 3. */
export function exercisesPerMuscle(level: FitnessLevel): number {
  return level === "beginner" ? 2 : 3;
}

const DAY_NAMES: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tierRank(exercise: Exercise, level: FitnessLevel): number {
  switch (level) {
    case "beginner":
      return exercise.difficulty === "beginner" ? 0 : exercise.difficulty === "intermediate" ? 1 : 2;
    case "intermediate":
      return exercise.difficulty === "advanced" ? 1 : 0;
    case "advanced":
      return exercise.difficulty === "beginner" ? 1 : 0;
  }
}

/** Shuffle, then rank by difficulty tier and freshness (new-this-week first). */
function rankPool(
  pool: Exercise[],
  level: FitnessLevel,
  usedLastWeek: Set<string>
): Exercise[] {
  return shuffle(pool).sort(
    (a, b) =>
      tierRank(a, level) - tierRank(b, level) ||
      Number(usedLastWeek.has(a.id)) - Number(usedLastWeek.has(b.id))
  );
}

/**
 * Take n exercises from a pool, ranked. Cycles (allowing repeats) only when
 * n exceeds the pool size — e.g. a user who trains one muscle 4+ days a week.
 */
function takeRanked(
  pool: Exercise[],
  level: FitnessLevel,
  usedLastWeek: Set<string>,
  n: number
): Exercise[] {
  const ranked = rankPool(pool, level, usedLastWeek);
  if (n <= ranked.length) return ranked.slice(0, n);
  const out: Exercise[] = [];
  for (let i = 0; out.length < n; i++) out.push(ranked[i % ranked.length]);
  return out;
}

/** Pick k evenly-spread items from a list (used to place abs days). */
function spreadPick<T>(items: T[], k: number): T[] {
  if (k >= items.length) return [...items];
  const out: T[] = [];
  const step = items.length / k;
  for (let i = 0; i < k; i++) out.push(items[Math.floor(i * step)]);
  return out;
}

function toPlanned(
  exercise: Exercise,
  sets: number,
  reps: string,
  includeStartingWeight: boolean
): PlannedExercise {
  return {
    exerciseId: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    sets,
    reps,
    ...(includeStartingWeight ? { startingWeight: exercise.startingWeight } : {}),
  };
}

/** Every exercise id used in a stored plan — fed back in next week as "avoid". */
export function collectExerciseIds(plan: GeneratedPlan): Set<string> {
  const ids = new Set<string>();
  for (const day of plan.days) {
    if (day.kind !== "training") continue;
    for (const e of [...day.exercises, ...day.abs]) ids.add(e.exerciseId);
  }
  return ids;
}

export interface GenerateOptions {
  /** Monday of the target week, "YYYY-MM-DD". */
  weekStart: string;
  /** Exercise ids from the previous week's plan, to vary this week's picks. */
  avoidExerciseIds?: Set<string>;
  /** Custom Mon–Sat focus keys; defaults to the classic split. */
  splitKeys?: SplitDayKey[];
}

interface TrainingSlot {
  day: Weekday;
  label: string;
  focus: [MuscleGroup, MuscleGroup];
}

/**
 * Generate a full week from the (possibly customized) split.
 *
 * No-repeat guarantee: we count how many sessions each muscle gets across
 * the week, draw that many × (exercises-per-muscle) DISTINCT exercises up
 * front, and hand successive sessions non-overlapping slices — so a muscle
 * never repeats an exercise in a week (it only cycles if a user trains one
 * muscle so often that the 10-exercise pool runs out). Abs and cardio are
 * drawn the same way.
 */
export function generateWeeklyPlan(
  goal: Goal,
  level: FitnessLevel,
  options: GenerateOptions
): GeneratedPlan {
  const prescription = prescriptionFor(goal, level);
  const avoid = options.avoidExerciseIds ?? new Set<string>();
  const perMuscle = exercisesPerMuscle(level);
  const isBeginner = level === "beginner";

  const splitKeys = normalizeSplitKeys(options.splitKeys ?? DEFAULT_SPLIT_KEYS);

  // Mon–Sat training slots (Sunday is always rest).
  const slots: TrainingSlot[] = [];
  WEEKDAYS_MON_SAT.forEach((day, i) => {
    const key = splitKeys[i];
    if (key !== "rest") {
      slots.push({ day, label: FOCUS_PAIRS[key].label, focus: FOCUS_PAIRS[key].focus });
    }
  });

  // Count sessions per muscle, then build one distinct queue per muscle.
  const muscleCount = new Map<MuscleGroup, number>();
  for (const slot of slots) {
    for (const m of slot.focus) muscleCount.set(m, (muscleCount.get(m) ?? 0) + 1);
  }
  const muscleQueue = new Map<MuscleGroup, Exercise[]>();
  for (const [m, count] of muscleCount) {
    muscleQueue.set(m, takeRanked(EXERCISES[m], level, avoid, count * perMuscle));
  }
  const muscleCursor = new Map<MuscleGroup, number>();

  // Abs: spread across a subset of the training days.
  const absDayCount = Math.min(prescription.absDaysPerWeek, slots.length);
  const absDays = new Set(spreadPick(slots.map((s) => s.day), absDayCount));
  const absQueue = takeRanked(EXERCISES.abs, level, avoid, absDayCount * ABS_PER_DAY);
  let absCursor = 0;

  // Cardio: one different activity per training day.
  const cardioQueue = shuffle(
    isBeginner ? CARDIO_ACTIVITIES.filter((c) => !c.intense) : CARDIO_ACTIVITIES
  );
  let cardioCursor = 0;

  const slotByDay = new Map(slots.map((s) => [s.day, s]));
  const firstDayForLabel = new Map<string, Weekday>();

  const days: GeneratedDay[] = ALL_WEEKDAYS.map((day) => {
    const slot = slotByDay.get(day);
    if (!slot) {
      return { day, kind: "rest" as const, label: "Rest & Recovery" };
    }

    const exercises = slot.focus.flatMap((muscle) => {
      const cursor = muscleCursor.get(muscle) ?? 0;
      muscleCursor.set(muscle, cursor + perMuscle);
      return muscleQueue
        .get(muscle)!
        .slice(cursor, cursor + perMuscle)
        .map((e) => toPlanned(e, prescription.sets, prescription.reps, isBeginner));
    });

    let repeatNote: string | null = null;
    const firstDay = firstDayForLabel.get(slot.label);
    if (firstDay) {
      repeatNote = `Different from ${DAY_NAMES[firstDay]}'s ${slot.label.toLowerCase()} exercises`;
    } else {
      firstDayForLabel.set(slot.label, day);
    }

    const abs = absDays.has(day)
      ? absQueue
          .slice(absCursor, (absCursor += ABS_PER_DAY))
          .map((e) => toPlanned(e, e.defaultSets, e.defaultReps, isBeginner))
      : [];

    const activity = cardioQueue[cardioCursor++ % cardioQueue.length];
    const cardio = {
      id: activity.id,
      name: activity.name,
      durationMinutes: prescription.cardioMinutes,
    };

    return {
      day,
      kind: "training" as const,
      label: slot.label,
      focus: slot.focus,
      exercises,
      abs,
      cardio,
      repeatNote,
    };
  });

  return {
    weekStart: options.weekStart,
    goal,
    fitnessLevel: level,
    prescription,
    days,
    generatedAt: new Date().toISOString(),
  };
}
