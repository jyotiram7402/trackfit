"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CARDIO_ACTIVITIES, EXERCISES } from "@/data/exercises";
import { WARMUP_MOVES } from "@/data/warmups";
import {
  MUSCLE_INFO,
  difficultyLabel,
  equipmentLabel,
  exerciseRating,
} from "@/data/exerciseMeta";
import MuscleMap from "@/components/MuscleMap";
import WatchDemoLink from "@/components/WatchDemoLink";
import type { Exercise, MuscleGroup } from "@/types/workout";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "triceps",
  "back",
  "biceps",
  "legs",
  "shoulders",
  "abs",
];

function isMuscleGroup(value: string): value is MuscleGroup {
  return (MUSCLE_GROUPS as string[]).includes(value);
}

export default function ExploreCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;

  return (
    <section className="mx-auto max-w-2xl">
      <Link href="/explore" className="text-sm font-semibold text-aero-700 hover:text-aero-600">
        ← All categories
      </Link>

      {isMuscleGroup(category) ? (
        <MuscleCategory group={category} />
      ) : category === "cardio" ? (
        <CardioCategory />
      ) : category === "warmups" ? (
        <WarmupCategory />
      ) : (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Unknown category.
        </p>
      )}
    </section>
  );
}

function MuscleCategory({ group }: { group: MuscleGroup }) {
  const info = MUSCLE_INFO[group];
  return (
    <>
      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">{info.label}</h1>
      <p className="mt-1 text-sm leading-relaxed text-navy-700/70">{info.blurb}</p>

      <div className="card mt-4">
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-navy-700/60">
          Muscles worked
        </h2>
        <MuscleMap primary={info.primary} secondary={info.secondary} />
      </div>

      <div className="mt-4 space-y-3">
        {EXERCISES[group].map((ex) => (
          <ExerciseRow key={ex.id} exercise={ex} />
        ))}
      </div>
    </>
  );
}

function ExerciseRow({ exercise }: { exercise: Exercise }) {
  return (
    <Link
      href={`/exercise/${exercise.id}`}
      className="card flex items-center justify-between gap-3 transition-transform active:scale-[0.99]"
    >
      <div className="min-w-0">
        <p className="truncate text-base font-bold text-navy-900">{exercise.name}</p>
        <p className="mt-0.5 text-xs text-navy-700/60">
          {equipmentLabel(exercise.equipment)} · {difficultyLabel(exercise.difficulty)} ·{" "}
          {exercise.defaultSets} × {exercise.defaultReps}
        </p>
        <p className="mt-1 text-xs font-semibold text-aero-700">
          ★ {exerciseRating(exercise).toFixed(1)}
        </p>
      </div>
      <span className="shrink-0 text-navy-700/40" aria-hidden>
        →
      </span>
    </Link>
  );
}

function CardioCategory() {
  return (
    <>
      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">Cardio</h1>
      <p className="mt-1 text-sm leading-relaxed text-navy-700/70">
        Great for heart health and burning calories. Aim for a pace you could
        just about hold a conversation at.
      </p>
      <div className="mt-4 space-y-3">
        {CARDIO_ACTIVITIES.map((c) => (
          <div key={c.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-bold text-navy-900">{c.name}</p>
                <p className="text-xs text-navy-700/60">
                  ~{c.durationMinutes} min{c.intense ? " · higher intensity" : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 flex">
              <WatchDemoLink url={c.videoUrl} name={c.name} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function WarmupCategory() {
  return (
    <>
      <h1 className="mt-3 text-2xl font-extrabold text-navy-900">Warm-ups</h1>
      <p className="mt-1 text-sm leading-relaxed text-navy-700/70">
        Do a few of these for ~5 minutes before training. A good warm-up means
        better lifts and fewer injuries.
      </p>
      <div className="mt-4 space-y-3">
        {WARMUP_MOVES.map((w) => (
          <div key={w.id} className="card">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-base font-bold text-navy-900">{w.name}</p>
              <span className="shrink-0 text-xs font-semibold text-aero-700">
                {w.duration}
              </span>
            </div>
            <p className="mt-1 text-sm text-navy-700/70">{w.detail}</p>
            <div className="mt-3 flex">
              <WatchDemoLink url={w.videoUrl} name={w.name} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
