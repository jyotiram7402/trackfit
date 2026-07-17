"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { addDays, toISODate } from "@/lib/dates";
import {
  buildConsistencyInsight,
  buildOverloadInsights,
  buildWeeklyCheckin,
  buildWeightPaceInsight,
  type CoachLog,
  type Insight,
} from "@/lib/coach";
import type { Profile, WeightLog } from "@/types/db";

/**
 * Rule-based coaching cards for the Home screen: weekly check-in
 * (Sunday/Monday) plus up to three insights from logged data.
 */
export default function CoachInsights({ profile }: { profile: Profile }) {
  const [logs, setLogs] = useState<CoachLog[] | null>(null);
  const [weights, setWeights] = useState<WeightLog[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseClient();
    const from = toISODate(addDays(new Date(), -42));

    Promise.all([
      supabase
        .from("workout_logs")
        .select("exercise_id, exercise_name, date, weight_used, feeling, completed")
        .eq("user_id", profile.id)
        .gte("date", from)
        .order("date"),
      supabase
        .from("weight_logs")
        .select("id, user_id, date, weight_kg")
        .eq("user_id", profile.id)
        .gte("date", toISODate(addDays(new Date(), -90)))
        .order("date"),
    ]).then(([logsRes, weightsRes]) => {
      if (cancelled) return;
      setLogs((logsRes.data as CoachLog[]) ?? []);
      setWeights((weightsRes.data as WeightLog[]) ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, [profile.id]);

  const todayISO = toISODate(new Date());

  const { checkin, insights } = useMemo(() => {
    if (!logs || !weights) return { checkin: null, insights: [] as Insight[] };

    const list: Insight[] = [
      ...buildOverloadInsights(logs, todayISO),
    ];
    const consistency = buildConsistencyInsight(logs, todayISO);
    if (consistency) list.push(consistency);
    const pace = buildWeightPaceInsight(weights, profile, todayISO);
    if (pace) list.push(pace);

    return {
      checkin: buildWeeklyCheckin(logs, weights, todayISO),
      insights: list.slice(0, 3),
    };
  }, [logs, weights, profile, todayISO]);

  if (!logs || !weights) return null; // quiet while loading — no spinner needed
  if (!checkin && insights.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {checkin && (
        <div className="rounded-card border-2 border-aero-300 bg-white p-5 shadow-card">
          <p className="text-[11px] font-bold uppercase tracking-widest text-aero-600">
            📋 Weekly check-in
          </p>
          <p className="mt-2 text-sm leading-relaxed text-navy-800">
            {checkin.summary}
          </p>
          <p className="mt-3 rounded-xl bg-aero-50 px-4 py-3 text-sm font-semibold text-aero-800">
            This week&apos;s tip: {checkin.tip}
          </p>
        </div>
      )}

      {insights.map((insight) => (
        <div key={insight.id} className="card flex gap-3">
          <span className="text-2xl" aria-hidden>
            {insight.emoji}
          </span>
          <div>
            <p className="text-sm font-bold text-navy-900">{insight.title}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-navy-700/80">
              {insight.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
