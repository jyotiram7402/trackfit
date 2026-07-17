"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";
import { EXERCISES_BY_ID } from "@/data/exercises";
import { getExerciseGuide } from "@/data/exerciseGuides";

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: "bg-aero-100 text-aero-800",
  intermediate: "bg-blue-100 text-blue-800",
  advanced: "bg-orange-100 text-orange-800",
};

export default function ExerciseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;

  const exercise = EXERCISES_BY_ID.get(params.id);
  const guide = exercise ? getExerciseGuide(exercise.id) : undefined;

  const [learned, setLearned] = useState<boolean | null>(null);
  const [savingLearned, setSavingLearned] = useState(false);

  useEffect(() => {
    if (!userId || !exercise) return;
    let cancelled = false;
    getSupabaseClient()
      .from("learned_exercises")
      .select("exercise_id")
      .eq("user_id", userId)
      .eq("exercise_id", exercise.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setLearned(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, exercise]);

  if (!exercise) {
    return (
      <section className="mx-auto max-w-2xl">
        <BackButton onClick={() => router.back()} />
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Exercise not found.
        </p>
      </section>
    );
  }

  async function toggleLearned() {
    if (!userId || learned === null) return;
    setSavingLearned(true);
    const supabase = getSupabaseClient();
    if (learned) {
      await supabase
        .from("learned_exercises")
        .delete()
        .eq("user_id", userId)
        .eq("exercise_id", exercise!.id);
      setLearned(false);
    } else {
      const { error } = await supabase
        .from("learned_exercises")
        .upsert({ user_id: userId, exercise_id: exercise!.id });
      if (!error) setLearned(true);
    }
    setSavingLearned(false);
  }

  return (
    <section className="mx-auto max-w-2xl">
      <BackButton onClick={() => router.back()} />

      {/* Demo video */}
      <div className="mt-4 aspect-video overflow-hidden rounded-card bg-navy-900 shadow-card">
        <iframe
          src={exercise.videoUrl}
          title={`How to perform ${exercise.name}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <h1 className="mt-5 text-2xl font-extrabold text-navy-900">
        {exercise.name}
      </h1>

      {/* Badges: muscle, equipment, difficulty */}
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge className="bg-navy-800 text-white">
          {exercise.muscleGroup[0].toUpperCase() + exercise.muscleGroup.slice(1)}
        </Badge>
        <Badge className="bg-aero-100 text-aero-800">
          🏷 {exercise.equipment[0].toUpperCase() + exercise.equipment.slice(1)}
        </Badge>
        <Badge className={DIFFICULTY_BADGE[exercise.difficulty]}>
          {exercise.difficulty[0].toUpperCase() + exercise.difficulty.slice(1)}
        </Badge>
      </div>

      {/* Beginner start suggestion */}
      <div className="card mt-4 bg-aero-50">
        <p className="text-xs font-bold uppercase tracking-wider text-aero-700">
          Starting out
        </p>
        <p className="mt-1 text-sm font-medium text-navy-800">
          💡 {exercise.startingWeight}
        </p>
        <p className="mt-1 text-sm text-navy-700/60">
          Suggested: {exercise.defaultSets} sets × {exercise.defaultReps}. Start
          light, master the movement first.
        </p>
      </div>

      {guide?.safety && (
        <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800">
          ⚠️ {guide.safety}
        </p>
      )}

      {guide ? (
        <>
          <GuideSection title="How to do it">
            <ol className="space-y-2.5">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-navy-800">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-aero-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </GuideSection>

          <GuideSection title="Breathing">
            <p className="text-sm leading-relaxed text-navy-800">
              🌬️ {guide.breathing}
            </p>
          </GuideSection>

          <GuideSection title="Common mistakes to avoid">
            <ul className="space-y-3">
              {guide.mistakes.map((m) => (
                <li key={m.mistake} className="text-sm leading-relaxed">
                  <p className="font-semibold text-red-700">✗ {m.mistake}</p>
                  <p className="mt-0.5 text-navy-800">✓ {m.fix}</p>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection title="Form tips">
            <ul className="space-y-1.5">
              {guide.tips.map((tip) => (
                <li key={tip} className="text-sm leading-relaxed text-navy-800">
                  • {tip}
                </li>
              ))}
            </ul>
          </GuideSection>
        </>
      ) : (
        <p className="mt-6 text-sm text-navy-700/60">
          Detailed guide coming soon — watch the video above for form.
        </p>
      )}

      {/* Mark as learned */}
      <button
        type="button"
        onClick={toggleLearned}
        disabled={learned === null || savingLearned}
        className={`mt-6 w-full rounded-full px-8 py-4 text-base font-semibold transition-colors disabled:opacity-60 ${
          learned
            ? "bg-aero-100 text-aero-800"
            : "bg-navy-800 text-white hover:bg-navy-700"
        }`}
      >
        {learned === null
          ? "…"
          : savingLearned
            ? "Saving…"
            : learned
              ? "✓ Learned — tap to unmark"
              : "I understand — mark as learned"}
      </button>
      <p className="mt-2 pb-4 text-center text-xs text-navy-700/50">
        We&apos;ll gently flag exercises you haven&apos;t reviewed yet.
      </p>
    </section>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm font-semibold text-aero-700 hover:text-aero-600"
    >
      ← Back
    </button>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  );
}

function GuideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card mt-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-navy-700/60">
        {title}
      </h2>
      {children}
    </div>
  );
}
