"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import CoachInsights from "@/components/CoachInsights";
import SuggestionBox from "@/components/SuggestionBox";
import WelcomeTour, { useWelcomeTour } from "@/components/WelcomeTour";
import { useWeeklyPlan } from "@/lib/hooks/useWeeklyPlan";
import { getTodayWeekday } from "@/data/weeklySplit";
import { formatWeekRange, getWeekStart } from "@/lib/dates";
import { GOAL_LABELS } from "@/lib/bmi";
import type { GeneratedDay, GeneratedTrainingDay } from "@/types/plan";
import type { MuscleGroup } from "@/types/workout";

const DAY_SHORT: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default function HomePage() {
  const { profile } = useAuth();
  const { plan, loading, error } = useWeeklyPlan();
  const today = getTodayWeekday();
  const tour = useWelcomeTour();

  return (
    <section>
      {tour.show && <WelcomeTour onClose={tour.dismiss} />}
      <h1 className="text-2xl font-extrabold text-navy-900">
        This Week&apos;s Plan
      </h1>
      <p className="mt-1 text-sm text-navy-700/70">
        {formatWeekRange(getWeekStart())}
        {profile?.goal ? ` · Goal: ${GOAL_LABELS[profile.goal]}` : ""}
      </p>

      {plan && (
        <p className="mt-3 inline-block rounded-full bg-aero-100 px-4 py-1.5 text-xs font-semibold text-aero-800">
          {plan.prescription.sets} sets × {plan.prescription.reps} reps · rest{" "}
          {plan.prescription.rest} · cardio {plan.prescription.cardioMinutes} min
        </p>
      )}

      {profile && (
        <div className="mt-5">
          <SuggestionBox profile={profile} plan={plan} />
          <CoachInsights profile={profile} />
        </div>
      )}

      {loading && (
        <div className="mt-8 flex justify-center">
          <span
            className="h-8 w-8 animate-spin rounded-full border-[3px] border-aero-200 border-t-aero-500"
            role="status"
            aria-label="Loading plan"
          />
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Couldn&apos;t load your plan: {error}
        </p>
      )}

      {plan && (
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plan.days.map((day) => (
            <DayCard key={day.day} day={day} isToday={day.day === today} />
          ))}
        </div>
      )}
    </section>
  );
}

function DayCard({ day, isToday }: { day: GeneratedDay; isToday: boolean }) {
  const highlight = isToday ? "ring-2 ring-aero-500" : "";

  if (day.kind === "rest") {
    return (
      <div className={`card flex flex-col items-center justify-center py-8 text-center ${highlight}`}>
        <DayHeading day={day.day} label={day.label} isToday={isToday} center />
        <p className="mt-2 text-3xl">😴</p>
        <p className="mt-1 text-sm text-navy-700/60">
          Recover, stretch, hydrate.
        </p>
      </div>
    );
  }

  return (
    <div className={`card ${highlight}`}>
      <DayHeading day={day.day} label={day.label} isToday={isToday} />

      {day.repeatNote && (
        <p className="mt-2 inline-block rounded-full bg-aero-100 px-3 py-1 text-[11px] font-semibold text-aero-700">
          ✦ {day.repeatNote}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {day.focus.map((muscle) => (
          <MuscleBlock key={muscle} muscle={muscle} day={day} />
        ))}

        {day.abs.length > 0 && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-navy-700/50">
              Abs
            </p>
            <p className="text-sm text-navy-800">
              <ExerciseLinks
                exercises={day.abs.map((e) => ({ id: e.exerciseId, name: e.name }))}
              />
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl bg-aero-50 px-3 py-2">
          <span aria-hidden>🏃</span>
          <p className="text-sm font-semibold text-navy-800">
            {day.cardio.name}
            <span className="font-normal text-navy-700/60">
              {" "}
              · {day.cardio.durationMinutes} min
            </span>
          </p>
        </div>
      </div>

      {isToday && (
        <Link href="/today" className="btn-primary mt-4 w-full py-2.5 text-sm">
          Start today&apos;s workout
        </Link>
      )}
    </div>
  );
}

function DayHeading({
  day,
  label,
  isToday,
  center = false,
}: {
  day: string;
  label: string;
  isToday: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : "flex items-center justify-between"}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-aero-600">
          {DAY_SHORT[day]}
        </p>
        <h2 className="text-base font-bold text-navy-900">{label}</h2>
      </div>
      {isToday && (
        <span className="rounded-full bg-navy-800 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Today
        </span>
      )}
    </div>
  );
}

function MuscleBlock({
  muscle,
  day,
}: {
  muscle: MuscleGroup;
  day: GeneratedTrainingDay;
}) {
  const exercises = day.exercises.filter((e) => e.muscleGroup === muscle);
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-navy-700/50">
        {muscle}
      </p>
      <p className="text-sm text-navy-800">
        <ExerciseLinks
          exercises={exercises.map((e) => ({ id: e.exerciseId, name: e.name }))}
        />
      </p>
    </div>
  );
}

/** Tappable exercise names, separated by dots, opening each detail page. */
function ExerciseLinks({
  exercises,
}: {
  exercises: { id: string; name: string }[];
}) {
  return (
    <>
      {exercises.map((e, i) => (
        <span key={e.id}>
          {i > 0 && <span className="text-navy-700/40"> · </span>}
          <Link
            href={`/exercise/${e.id}`}
            className="hover:text-aero-700 hover:underline"
          >
            {e.name}
          </Link>
        </span>
      ))}
    </>
  );
}
