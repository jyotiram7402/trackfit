import { addDays, getWeekStart, toISODate } from "@/lib/dates";
import type { Feeling, Profile, WeightLog } from "@/types/db";

// Rule-based coaching — no AI, just the data we already store.
// Tone rule: supportive coach. Suggest, never scold.

/** The slice of workout_logs the coach needs. */
export interface CoachLog {
  exercise_id: string;
  exercise_name: string;
  date: string; // "YYYY-MM-DD"
  weight_used: number | null;
  feeling: Feeling | null;
  completed: boolean;
}

export interface Insight {
  id: string;
  emoji: string;
  title: string;
  body: string;
}

export interface WeeklyCheckin {
  summary: string;
  tip: string;
}

function daysBetween(fromISO: string, toISO: string): number {
  return Math.round(
    (new Date(`${toISO}T00:00:00`).getTime() -
      new Date(`${fromISO}T00:00:00`).getTime()) /
      86_400_000
  );
}

/** Most recent feeling logged per exercise (for form reminders). */
export function latestFeelingByExercise(logs: CoachLog[]): Map<string, Feeling> {
  const map = new Map<string, { date: string; feeling: Feeling }>();
  for (const log of logs) {
    if (!log.feeling) continue;
    const current = map.get(log.exercise_id);
    if (!current || log.date > current.date) {
      map.set(log.exercise_id, { date: log.date, feeling: log.feeling });
    }
  }
  return new Map([...map.entries()].map(([id, v]) => [id, v.feeling]));
}

/** Exercises whose most recent session felt too hard. */
export function hardLastTimeIds(logs: CoachLog[]): Set<string> {
  const ids = new Set<string>();
  for (const [id, feeling] of latestFeelingByExercise(logs)) {
    if (feeling === "hard") ids.add(id);
  }
  return ids;
}

/** Sensible next-weight jump: small dumbbells go up little, big lifts more. */
function nextWeight(weight: number): number {
  const step = weight < 10 ? 1 : weight < 20 ? 2 : 2.5;
  return Math.round((weight + step) * 10) / 10;
}

/**
 * Progressive-overload suggestions: same weight for the last 2 sessions of
 * an exercise, latest marked "too easy" → suggest going up. Two sessions in
 * a row "too hard" → suggest holding or dropping and focusing on form.
 */
export function buildOverloadInsights(logs: CoachLog[], todayISO: string): Insight[] {
  const byExercise = new Map<string, CoachLog[]>();
  for (const log of logs) {
    if (!log.completed) continue;
    const sessions = byExercise.get(log.exercise_id);
    if (sessions) sessions.push(log);
    else byExercise.set(log.exercise_id, [log]);
  }

  const insights: Insight[] = [];
  for (const [id, sessions] of byExercise) {
    sessions.sort((a, b) => a.date.localeCompare(b.date));
    if (sessions.length < 2) continue;
    const [prev, last] = sessions.slice(-2);
    // Only coach on recent work.
    if (daysBetween(last.date, todayISO) > 14) continue;

    if (
      last.feeling === "easy" &&
      last.weight_used != null &&
      prev.weight_used === last.weight_used
    ) {
      insights.push({
        id: `overload-up-${id}`,
        emoji: "📈",
        title: "Ready to level up",
        body: `You've mastered ${last.weight_used} kg on ${last.exercise_name} — try ${nextWeight(last.weight_used)} kg next time.`,
      });
    } else if (last.feeling === "hard" && prev.feeling === "hard") {
      insights.push({
        id: `overload-hold-${id}`,
        emoji: "🧘",
        title: "No rush on this one",
        body: `${last.exercise_name} has felt tough twice in a row. Keep the weight (or drop a step) and focus on smooth form — strength follows.`,
      });
    }
  }

  // Most recent first, max two so the coach never floods the screen.
  return insights.slice(0, 2);
}

/** Streak nudge or a warm comeback — never guilt. */
export function buildConsistencyInsight(
  logs: CoachLog[],
  todayISO: string
): Insight | null {
  const workoutDates = [...new Set(logs.filter((l) => l.completed).map((l) => l.date))].sort();

  if (workoutDates.length === 0) {
    return {
      id: "consistency-first",
      emoji: "🚀",
      title: "Your plan is ready",
      body: "Log your first workout today — the first one is the one that matters most.",
    };
  }

  const lastDate = workoutDates[workoutDates.length - 1];
  const gap = daysBetween(lastDate, todayISO);
  if (gap >= 4) {
    return {
      id: "consistency-comeback",
      emoji: "💚",
      title: "Welcome back",
      body: "A few days off happens to everyone — it changes nothing. Today is a perfect restart.",
    };
  }

  const weekStartISO = toISODate(getWeekStart(new Date(`${todayISO}T00:00:00`)));
  const thisWeek = workoutDates.filter((d) => d >= weekStartISO).length;
  if (thisWeek >= 6) {
    return {
      id: "consistency-perfect",
      emoji: "🏆",
      title: "Perfect week",
      body: "All 6 training days done this week. That's how results are made.",
    };
  }
  if (thisWeek >= 1) {
    const left = 6 - thisWeek;
    return {
      id: "consistency-nudge",
      emoji: "🔥",
      title: "Keep the week rolling",
      body: `You've trained ${thisWeek} day${thisWeek === 1 ? "" : "s"} this week — ${left} more to a full week!`,
    };
  }
  return null;
}

/** Realistic weight-pace feedback vs the target. */
export function buildWeightPaceInsight(
  weights: WeightLog[],
  profile: Profile,
  todayISO: string
): Insight | null {
  const goal = profile.goal;
  if (!goal || goal === "maintain" || weights.length < 2) return null;

  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1];
  // Baseline: the oldest entry within the last ~35 days (or the first ever).
  const cutoff = toISODate(addDays(new Date(`${todayISO}T00:00:00`), -35));
  const baseline = sorted.find((w) => w.date >= cutoff) ?? sorted[0];
  if (baseline.date === latest.date || daysBetween(baseline.date, latest.date) < 7)
    return null;

  const delta = Math.round((latest.weight_kg - baseline.weight_kg) * 10) / 10;
  const target = profile.target_weight_kg;
  const toward = target ? ` toward ${target} kg` : "";

  if (goal === "lose") {
    if (delta <= -0.3) {
      return {
        id: "pace-lose-good",
        emoji: "🎯",
        title: "The scale is moving",
        body: `You're down ${Math.abs(delta)} kg this month — steady, healthy progress${toward}. Keep doing what you're doing.`,
      };
    }
    return {
      id: "pace-lose-flat",
      emoji: "🌱",
      title: "Trust the process",
      body: "The scale's been holding steady this month — completely normal. Keep the cardio consistent and give it time; trends beat single weigh-ins.",
    };
  }

  // goal === "gain"
  if (delta >= 0.3) {
    return {
      id: "pace-gain-good",
      emoji: "🎯",
      title: "Building nicely",
      body: `You're up ${delta} kg this month — steady, quality progress${toward}. Keep eating and lifting.`,
    };
  }
  return {
    id: "pace-gain-flat",
    emoji: "🍗",
    title: "Fuel the machine",
    body: "Weight's been flat this month. If gaining is the goal, add a little more food on training days — the lifts are doing their part.",
  };
}

/**
 * The Sunday/Monday check-in: last week in one line + ONE tip for the week
 * ahead. Returns null on other days.
 */
export function buildWeeklyCheckin(
  logs: CoachLog[],
  weights: WeightLog[],
  todayISO: string
): WeeklyCheckin | null {
  const today = new Date(`${todayISO}T00:00:00`);
  const dow = today.getDay(); // 0 = Sunday, 1 = Monday
  if (dow !== 0 && dow !== 1) return null;

  // Sunday reviews the week that's ending; Monday reviews last week.
  const weekStart =
    dow === 0 ? getWeekStart(today) : addDays(getWeekStart(today), -7);
  const startISO = toISODate(weekStart);
  const endISO = toISODate(addDays(weekStart, 6));

  const weekLogs = logs.filter(
    (l) => l.completed && l.date >= startISO && l.date <= endISO
  );
  const workouts = new Set(weekLogs.map((l) => l.date)).size;
  const exercises = weekLogs.length;

  const weekWeights = weights
    .filter((w) => w.date >= startISO && w.date <= endISO)
    .sort((a, b) => a.date.localeCompare(b.date));
  const weightDelta =
    weekWeights.length >= 2
      ? Math.round(
          (weekWeights[weekWeights.length - 1].weight_kg - weekWeights[0].weight_kg) * 10
        ) / 10
      : null;

  const parts = [
    workouts === 0
      ? "A quiet week — that's okay, they happen."
      : `You trained ${workouts} day${workouts === 1 ? "" : "s"} and completed ${exercises} exercises.`,
  ];
  if (weightDelta !== null && weightDelta !== 0) {
    parts.push(`Weight: ${weightDelta > 0 ? "+" : "−"}${Math.abs(weightDelta)} kg.`);
  }

  // ONE tip, picked by priority.
  const overload = buildOverloadInsights(logs, todayISO);
  const hardCount = hardLastTimeIds(logs).size;
  let tip: string;
  if (overload.length > 0 && overload[0].id.startsWith("overload-up")) {
    tip = overload[0].body.replace("next time", "this week");
  } else if (hardCount >= 2) {
    tip = "Pick one exercise that felt tough and re-read its how-to page before your next session — small form fixes make hard lifts feel lighter.";
  } else if (workouts < 4) {
    tip = "Aim for just one more training day than last week. Small steps, stacked weekly, become big results.";
  } else {
    tip = "Keep doing exactly what you're doing — consistency is your superpower.";
  }

  return { summary: parts.join(" "), tip };
}
