import Link from "next/link";
import { MUSCLE_INFO } from "@/data/exerciseMeta";
import type { MuscleGroup } from "@/types/workout";

export const metadata = { title: "Explore" };

const MUSCLES: { group: MuscleGroup; emoji: string }[] = [
  { group: "chest", emoji: "💪" },
  { group: "back", emoji: "🦾" },
  { group: "shoulders", emoji: "🏔️" },
  { group: "biceps", emoji: "💪" },
  { group: "triceps", emoji: "🔱" },
  { group: "legs", emoji: "🦵" },
  { group: "abs", emoji: "🎯" },
];

const EXTRAS = [
  { slug: "cardio", label: "Cardio", emoji: "🏃", blurb: "Fat-burning, heart-healthy options" },
  { slug: "warmups", label: "Warm-ups", emoji: "🔥", blurb: "Prep your body before every session" },
];

export default function ExplorePage() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold text-navy-900">Explore Exercises</h1>
      <p className="mt-1 text-sm text-navy-700/70">
        Browse every exercise by category — with demo videos, form guides, and
        the muscles each one works.
      </p>

      <h2 className="mt-6 mb-3 text-sm font-bold uppercase tracking-wider text-navy-700/60">
        By muscle group
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MUSCLES.map(({ group, emoji }) => (
          <Link
            key={group}
            href={`/explore/${group}`}
            className="card flex flex-col gap-1 py-5 transition-transform active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden>
              {emoji}
            </span>
            <span className="text-base font-bold text-navy-900">
              {MUSCLE_INFO[group].label}
            </span>
            <span className="text-xs text-navy-700/60">10 exercises</span>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-sm font-bold uppercase tracking-wider text-navy-700/60">
        More
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {EXTRAS.map(({ slug, label, emoji, blurb }) => (
          <Link
            key={slug}
            href={`/explore/${slug}`}
            className="card flex items-center gap-3 transition-transform active:scale-[0.98]"
          >
            <span className="text-2xl" aria-hidden>
              {emoji}
            </span>
            <span>
              <span className="block text-base font-bold text-navy-900">{label}</span>
              <span className="block text-xs text-navy-700/60">{blurb}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
