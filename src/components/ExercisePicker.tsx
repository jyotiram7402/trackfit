"use client";

import { useState } from "react";
import Link from "next/link";
import { EXERCISES } from "@/data/exercises";
import { MUSCLE_INFO, difficultyLabel, exerciseRating } from "@/data/exerciseMeta";
import type { MuscleGroup } from "@/types/workout";

/**
 * Full-screen picker: choose which exercises to perform today from the full
 * pool for each focus muscle (+ abs). Exercises already completed earlier
 * this week are flagged so users can vary their picks on a repeated muscle
 * day — but repeats are allowed.
 */
export default function ExercisePicker({
  focusMuscles,
  includeAbs,
  initialSelectedIds,
  doneThisWeek,
  saving,
  onCancel,
  onSave,
  onReset,
}: {
  focusMuscles: MuscleGroup[];
  includeAbs: boolean;
  initialSelectedIds: string[];
  doneThisWeek: Map<string, string>;
  saving: boolean;
  onCancel: () => void;
  onSave: (ids: string[]) => void;
  onReset?: () => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSelectedIds)
  );

  const groups: MuscleGroup[] = includeAbs ? [...focusMuscles, "abs"] : focusMuscles;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSave() {
    // Preserve group order (focus muscles, then abs), pool order within.
    const ordered: string[] = [];
    for (const g of groups) {
      for (const ex of EXERCISES[g]) {
        if (selected.has(ex.id)) ordered.push(ex.id);
      }
    }
    onSave(ordered);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-aero-50"
      role="dialog"
      aria-modal="true"
      aria-label="Choose today's exercises"
    >
      {/* Sticky header */}
      <div className="flex items-center justify-between border-b border-aero-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-lg font-extrabold text-navy-900">
            Choose your exercises
          </h2>
          <p className="text-xs text-navy-700/60">
            {selected.size} selected · tap to add or remove
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-aero-100 text-navy-700/70"
        >
          ✕
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {groups.map((group) => (
          <div key={group} className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-navy-700/60">
              {MUSCLE_INFO[group].label}
            </h3>
            <div className="space-y-2">
              {EXERCISES[group].map((ex) => {
                const isSelected = selected.has(ex.id);
                const doneDay = doneThisWeek.get(ex.id);
                return (
                  <div
                    key={ex.id}
                    className={`flex items-center gap-3 rounded-xl border-2 px-3 py-3 transition-colors ${
                      isSelected
                        ? "border-aero-500 bg-aero-100"
                        : "border-aero-200 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(ex.id)}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? "Remove" : "Add"} ${ex.name}`}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                        isSelected
                          ? "border-aero-500 bg-aero-500 text-white"
                          : "border-aero-300 bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(ex.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate text-sm font-bold text-navy-900">
                        {ex.name}
                      </span>
                      <span className="block text-xs text-navy-700/60">
                        ★ {exerciseRating(ex).toFixed(1)} · {difficultyLabel(ex.difficulty)}
                      </span>
                      {doneDay && (
                        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          ✓ Done {doneDay} — try something new
                        </span>
                      )}
                    </button>
                    <Link
                      href={`/exercise/${ex.id}`}
                      aria-label={`How to perform ${ex.name}`}
                      className="shrink-0 rounded-full bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      How-to
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer */}
      <div className="border-t border-aero-200 bg-white px-5 py-4">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mb-2 w-full py-2 text-center text-sm font-semibold text-navy-700/60 hover:text-navy-700"
          >
            Reset to the app&apos;s suggested exercises
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || selected.size === 0}
          className="btn-primary w-full disabled:opacity-50"
        >
          {saving ? "Saving…" : `Use these ${selected.size} exercises`}
        </button>
      </div>
    </div>
  );
}
