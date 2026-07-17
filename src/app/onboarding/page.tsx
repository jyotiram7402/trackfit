"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/providers/AuthProvider";
import AuthGuard from "@/components/AuthGuard";
import { getSupabaseClient } from "@/lib/supabase/client";
import { GOAL_LABELS, bmiLabel, calculateBmi, goalMessage } from "@/lib/bmi";
import type { FitnessLevel, Gender, Goal } from "@/types/db";

const TOTAL_STEPS = 4; // form steps before the result screen

const LEVEL_OPTIONS: { value: FitnessLevel; label: string; hint: string }[] = [
  { value: "beginner", label: "Beginner", hint: "New to the gym, or coming back after a long break" },
  { value: "intermediate", label: "Intermediate", hint: "Training fairly consistently for 6+ months" },
  { value: "advanced", label: "Advanced", hint: "Years of serious lifting behind you" },
];

interface FormState {
  name: string;
  age: string;
  gender: Gender | null;
  heightCm: string;
  currentWeightKg: string;
  targetWeightKg: string;
  fitnessLevel: FitnessLevel | null;
  goal: Goal | null;
}

const INITIAL_FORM: FormState = {
  name: "",
  age: "",
  gender: null,
  heightCm: "",
  currentWeightKg: "",
  targetWeightKg: "",
  fitnessLevel: null,
  goal: null,
};

export default function OnboardingPage() {
  return (
    <AuthProvider>
      <AuthGuard requireProfile={false}>
        <OnboardingFlow />
      </AuthGuard>
    </AuthProvider>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const stepValid = [
    form.name.trim().length > 0 &&
      Number(form.age) >= 10 &&
      Number(form.age) <= 120 &&
      form.gender !== null,
    Number(form.heightCm) >= 80 &&
      Number(form.heightCm) <= 260 &&
      Number(form.currentWeightKg) >= 20 &&
      Number(form.currentWeightKg) <= 400 &&
      Number(form.targetWeightKg) >= 20 &&
      Number(form.targetWeightKg) <= 400,
    form.fitnessLevel !== null,
    form.goal !== null,
  ][step];

  async function handleFinish() {
    if (!session) return;
    setSaving(true);
    setError(null);

    const supabase = getSupabaseClient();
    const { error: err } = await supabase.from("profiles").upsert({
      id: session.user.id,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      height_cm: Number(form.heightCm),
      current_weight_kg: Number(form.currentWeightKg),
      target_weight_kg: Number(form.targetWeightKg),
      fitness_level: form.fitnessLevel,
      goal: form.goal,
    });

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSaved(true);
  }

  if (saved) {
    return (
      <ResultScreen
        name={form.name.trim()}
        goal={form.goal as Goal}
        bmi={calculateBmi(Number(form.currentWeightKg), Number(form.heightCm))}
        onContinue={() => router.replace("/home")}
      />
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10 animate-fade-in-up">
      <span className="mb-6 text-center text-xl font-extrabold tracking-tight text-navy-800">
        AERO<span className="text-aero-500"> Fitness</span>
      </span>

      {/* Progress dots */}
      <div className="mb-8 flex justify-center gap-2" aria-hidden>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? "w-8 bg-aero-500" : "w-2 bg-aero-200"
            }`}
          />
        ))}
      </div>

      <div className="card flex-1 md:flex-none">
        {step === 0 && (
          <StepShell
            title="Let's get to know you"
            subtitle="Tell us a little about yourself."
          >
            <Field label="Your name">
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Alex"
                autoFocus
                className={inputCls}
              />
            </Field>
            <Field label="Age">
              <input
                type="number"
                inputMode="numeric"
                min={10}
                max={120}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                placeholder="28"
                className={inputCls}
              />
            </Field>
            <Field label="Gender">
              <div className="grid grid-cols-3 gap-2">
                {(["male", "female", "other"] as const).map((g) => (
                  <ChoiceButton
                    key={g}
                    selected={form.gender === g}
                    onClick={() => set("gender", g)}
                  >
                    {g[0].toUpperCase() + g.slice(1)}
                  </ChoiceButton>
                ))}
              </div>
            </Field>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            title="Your numbers"
            subtitle="We'll use these to track your progress."
          >
            <Field label="Height (cm)">
              <input
                type="number"
                inputMode="decimal"
                min={80}
                max={260}
                value={form.heightCm}
                onChange={(e) => set("heightCm", e.target.value)}
                placeholder="175"
                autoFocus
                className={inputCls}
              />
            </Field>
            <Field label="Current weight (kg)">
              <input
                type="number"
                inputMode="decimal"
                min={20}
                max={400}
                step="0.1"
                value={form.currentWeightKg}
                onChange={(e) => set("currentWeightKg", e.target.value)}
                placeholder="80"
                className={inputCls}
              />
            </Field>
            <Field label="Target weight (kg)">
              <input
                type="number"
                inputMode="decimal"
                min={20}
                max={400}
                step="0.1"
                value={form.targetWeightKg}
                onChange={(e) => set("targetWeightKg", e.target.value)}
                placeholder="72"
                className={inputCls}
              />
            </Field>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            title="Have you worked out before?"
            subtitle="We'll match every exercise to your experience."
          >
            <div className="space-y-3">
              {LEVEL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => set("fitnessLevel", option.value)}
                  aria-pressed={form.fitnessLevel === option.value}
                  className={`w-full rounded-xl border-2 px-4 py-3.5 text-left transition-colors ${
                    form.fitnessLevel === option.value
                      ? "border-aero-500 bg-aero-100"
                      : "border-aero-200 bg-white hover:border-aero-300"
                  }`}
                >
                  <span className="block text-sm font-bold text-navy-900">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-navy-700/60">
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>
            {form.fitnessLevel === "beginner" && (
              <p className="rounded-xl bg-aero-100 px-4 py-3 text-sm font-medium text-aero-800">
                New to the gym? Perfect — we&apos;ll guide you through every
                exercise step by step. 💚
              </p>
            )}
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            title="What's your goal?"
            subtitle="We'll shape your plan and messages around it."
          >
            <div className="space-y-3">
              {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                <ChoiceButton
                  key={g}
                  selected={form.goal === g}
                  onClick={() => set("goal", g)}
                  className="w-full py-4 text-base"
                >
                  {GOAL_LABELS[g]}
                </ChoiceButton>
              ))}
            </div>
          </StepShell>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn-secondary flex-1"
            >
              Back
            </button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              disabled={!stepValid}
              onClick={() => setStep((s) => s + 1)}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              disabled={!stepValid || saving}
              onClick={handleFinish}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Finish"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function ResultScreen({
  name,
  goal,
  bmi,
  onContinue,
}: {
  name: string;
  goal: Goal;
  bmi: number;
  onContinue: () => void;
}) {
  const label = bmiLabel(bmi);
  const labelColor =
    label === "Normal"
      ? "text-aero-600"
      : label === "Overweight"
        ? "text-orange-600"
        : "text-blue-600";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10 animate-fade-in-up">
      <div className="card text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-aero-600">
          You&apos;re all set
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-navy-900">
          Welcome to AERO, {name}!
        </h1>

        <div className="mx-auto mt-6 flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 border-aero-200 bg-aero-50">
          <span className="text-3xl font-extrabold text-navy-900">{bmi}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-navy-700/60">
            BMI
          </span>
        </div>
        <p className={`mt-3 text-lg font-bold ${labelColor}`}>{label}</p>

        <p className="mt-5 text-sm leading-relaxed text-navy-700/80">
          {goalMessage(goal, name)}
        </p>

        <button type="button" onClick={onContinue} className="btn-primary mt-8 w-full">
          Start training
        </button>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-xl border border-aero-200 bg-aero-50 px-4 py-3 text-sm outline-none placeholder:text-navy-700/40 focus:border-aero-500";

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold text-navy-900">{title}</h1>
      <p className="mt-1 text-sm text-navy-700/70">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-semibold text-navy-800">
        {label}
      </span>
      {children}
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
        selected
          ? "border-aero-500 bg-aero-100 text-aero-800"
          : "border-aero-200 bg-white text-navy-700/70 hover:border-aero-300"
      } ${className}`}
    >
      {children}
    </button>
  );
}
