"use client";

// Loaded via next/dynamic from the Progress page so Recharts (the heaviest
// dependency in the app) stays out of the initial bundle and streams in
// after the stats tiles have painted.

import { useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toISODate } from "@/lib/dates";
import type { WeightLog } from "@/types/db";

// Chart colors — brand teal for marks, navy-based ink for text, faint grid.
const TEAL = "#26a8a3";
const NAVY = "#16324f";
const GRID = "#d7f6f2";
const TICK = { fontSize: 11, fill: "rgba(22, 50, 79, 0.55)" };
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #b0ede6",
  fontSize: 12,
  padding: "6px 10px",
};

export interface LabeledCount {
  label: string;
  count: number;
}

export default function ProgressCharts({
  perDay,
  perWeek,
  muscleData,
  hasLogs,
  weights,
  target,
  userId,
  onWeightSaved,
}: {
  perDay: LabeledCount[];
  perWeek: LabeledCount[];
  muscleData: LabeledCount[];
  hasLogs: boolean;
  weights: WeightLog[];
  target: number | null;
  userId: string;
  onWeightSaved: (log: WeightLog) => void;
}) {
  return (
    <>
      {!hasLogs ? (
        <div className="card mt-4 py-10 text-center">
          <p className="text-4xl" aria-hidden>
            🏋️
          </p>
          <p className="mt-3 text-base font-bold text-navy-900">
            No workouts logged yet — let&apos;s start today!
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-navy-700/60">
            Finish your first workout and your charts will light up here.
          </p>
          <Link href="/today" className="btn-primary mt-5">
            Go to today&apos;s workout
          </Link>
        </div>
      ) : (
        <>
          <ChartCard title="Exercises completed — this week">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={perDay} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
                <YAxis tick={TICK} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(38,168,163,0.08)" }} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Exercises" fill={TEAL} barSize={18} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Workouts per week — last 4 weeks">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={perWeek} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={GRID} />
                <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
                <YAxis tick={TICK} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(38,168,163,0.08)" }} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Workouts" fill={TEAL} barSize={28} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Muscle groups — this month">
            {muscleData.length === 0 ? (
              <EmptyNote text="Finish a workout and your muscle breakdown appears here." />
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(160, muscleData.length * 36)}>
                <BarChart
                  data={muscleData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} stroke={GRID} />
                  <XAxis type="number" tick={TICK} tickLine={false} axisLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={72}
                    tick={TICK}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: "rgba(38,168,163,0.08)" }} contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" name="Exercises" fill={TEAL} barSize={14} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </>
      )}

      <ChartCard title="Weight progress">
        {weights.length === 0 ? (
          <EmptyNote text="Log your first weigh-in below to start the chart." />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={weights.map((w) => ({
                label: new Date(`${w.date}T00:00:00`).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                }),
                kg: w.weight_kg,
              }))}
              margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
            >
              <CartesianGrid vertical={false} stroke={GRID} />
              <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis
                tick={TICK}
                tickLine={false}
                axisLine={false}
                domain={[
                  (dataMin: number) => Math.floor(Math.min(dataMin, target ?? dataMin) - 1),
                  (dataMax: number) => Math.ceil(Math.max(dataMax, target ?? dataMax) + 1),
                ]}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              {target !== null && (
                <ReferenceLine
                  y={target}
                  stroke={NAVY}
                  strokeDasharray="6 4"
                  label={{
                    value: `Target ${target} kg`,
                    position: "insideTopRight",
                    fontSize: 11,
                    fill: NAVY,
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="kg"
                name="Weight (kg)"
                stroke={TEAL}
                strokeWidth={2}
                dot={{ r: 3, fill: TEAL, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        <LogWeightForm userId={userId} onSaved={onWeightSaved} />
      </ChartCard>
    </>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card mt-4">
      <h2 className="mb-3 text-sm font-bold text-navy-800">{title}</h2>
      {children}
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="py-8 text-center text-sm text-navy-700/50">{text}</p>;
}

function LogWeightForm({
  userId,
  onSaved,
}: {
  userId: string;
  onSaved: (log: WeightLog) => void;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const kg = Number(value);
    if (!Number.isFinite(kg) || kg < 20 || kg > 400) {
      setError("Enter a weight between 20 and 400 kg.");
      return;
    }
    setSaving(true);
    setError(null);

    const todayISO = toISODate(new Date());
    const { data, error: err } = await getSupabaseClient()
      .from("weight_logs")
      .upsert(
        { user_id: userId, date: todayISO, weight_kg: kg },
        { onConflict: "user_id,date" }
      )
      .select()
      .single();

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSaved(data as WeightLog);
    setValue("");
    setSaved(true);
  }

  return (
    <div className="mt-4 border-t border-aero-100 pt-4">
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={20}
          max={400}
          step="0.1"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder="Today's weight (kg)"
          className="min-w-0 flex-1 rounded-xl border border-aero-200 bg-aero-50 px-4 py-3 text-sm outline-none placeholder:text-navy-700/40 focus:border-aero-500"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || value.trim() === ""}
          className="btn-primary shrink-0 px-6 py-3 text-sm disabled:opacity-50"
        >
          {saving ? "Saving…" : "Log"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      {saved && !error && (
        <p className="mt-2 text-sm font-semibold text-aero-700">
          Weigh-in saved ✓
        </p>
      )}
    </div>
  );
}
