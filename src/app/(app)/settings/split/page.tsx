"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { regenerateWeeklyPlan } from "@/lib/weeklyPlan";
import {
  DEFAULT_SPLIT_KEYS,
  WEEKDAYS_MON_SAT,
  normalizeSplitKeys,
  type SplitDayKey,
} from "@/data/weeklySplit";

const OPTIONS: { key: SplitDayKey; label: string }[] = [
  { key: "chest_triceps", label: "Chest & Triceps" },
  { key: "back_biceps", label: "Back & Biceps" },
  { key: "legs_shoulders", label: "Legs & Shoulders" },
  { key: "rest", label: "Rest" },
];

const DAY_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
};

export default function SplitSettingsPage() {
  const router = useRouter();
  const { session, profile, refreshProfile } = useAuth();

  const [keys, setKeys] = useState<SplitDayKey[]>(
    normalizeSplitKeys(profile?.custom_split ?? DEFAULT_SPLIT_KEYS)
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!session) return null;

  function setDay(index: number, key: SplitDayKey) {
    setKeys((prev) => prev.map((k, i) => (i === index ? key : k)));
    setStatus(null);
  }

  async function persist(): Promise<boolean> {
    const { error: err } = await getSupabaseClient()
      .from("profiles")
      .update({ custom_split: keys })
      .eq("id", session!.user.id);
    if (err) {
      setError(err.message);
      return false;
    }
    await refreshProfile();
    return true;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const ok = await persist();
    setSaving(false);
    if (ok) setStatus("Saved — this takes effect from next week's plan.");
  }

  async function handleApplyNow() {
    setSaving(true);
    setError(null);
    const ok = await persist();
    if (!ok) {
      setSaving(false);
      return;
    }
    try {
      await regenerateWeeklyPlan(
        session!.user.id,
        profile?.goal ?? null,
        profile?.fitness_level ?? null,
        keys
      );
      router.push("/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't rebuild this week.");
      setSaving(false);
    }
  }

  const trainingDays = keys.filter((k) => k !== "rest").length;

  return (
    <section className="mx-auto max-w-lg">
      <Link href="/profile" className="text-sm font-semibold text-aero-700 hover:text-aero-600">
        ← Profile
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">
        Customize your split
      </h1>
      <p className="mt-1 text-sm leading-relaxed text-navy-700/70">
        Set what you train each day. Crowded gym? Move a muscle group to a
        different day so you never wait for a machine. Sunday stays rest.
      </p>

      <div className="mt-5 space-y-3">
        {WEEKDAYS_MON_SAT.map((day, i) => (
          <div key={day} className="card py-4">
            <p className="mb-2 text-sm font-bold text-navy-900">
              {DAY_LABELS[day]}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setDay(i, opt.key)}
                  aria-pressed={keys[i] === opt.key}
                  className={`rounded-xl border-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                    keys[i] === opt.key
                      ? "border-aero-500 bg-aero-100 text-aero-800"
                      : "border-aero-200 bg-white text-navy-700/70 hover:border-aero-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-navy-700/50">
        {trainingDays} training day{trainingDays === 1 ? "" : "s"} this week.
        Tip: training a muscle twice a week works best.
      </p>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      {status && (
        <p className="mt-4 rounded-xl bg-aero-100 px-4 py-3 text-sm font-semibold text-aero-800">
          {status}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleApplyNow}
          disabled={saving}
          className="btn-primary w-full disabled:opacity-60"
        >
          {saving ? "Working…" : "Save & rebuild this week now"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-secondary w-full disabled:opacity-60"
        >
          Save for next week only
        </button>
      </div>
      <p className="mt-3 pb-4 text-center text-xs text-navy-700/50">
        &ldquo;Rebuild now&rdquo; regenerates this week&apos;s exercises — your
        logged workouts stay safe.
      </p>
    </section>
  );
}
