"use client";

import { useEffect, useState } from "react";

/** localStorage flag — cleared by Profile's "replay tour" button. */
export const TOUR_SEEN_KEY = "aero-tour-seen";

const STEPS = [
  {
    emoji: "🗓️",
    title: "Your week lives here",
    body: "Home shows your full training week — what you're training each day, with today highlighted. A fresh plan is generated every Monday, personalized to your level and goal.",
  },
  {
    emoji: "📖",
    title: "Never guess how to do an exercise",
    body: "Tap any exercise name — anywhere in the app — to open its how-to page: demo video, step-by-step instructions, breathing, and the mistakes to avoid. Tap \"mark as learned\" once you've got it.",
  },
  {
    emoji: "🎯",
    title: "Guided Mode does the thinking",
    body: "On the Today tab, hit the Guided Mode button. It walks you through warm-up, every set with rest timers, and cool-down — one screen at a time. Perfect for your first weeks.",
  },
  {
    emoji: "📈",
    title: "Watch yourself get stronger",
    body: "The Progress tab has your streak, charts, and weight tracking — log your weight there daily-ish. Confused by a gym word? The Glossary in your Profile explains everything in plain English.",
  },
];

export function useWelcomeTour() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_SEEN_KEY)) setShow(true);
    } catch {
      // Storage blocked — skip the tour rather than nag every visit.
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {}
    setShow(false);
  };

  return { show, dismiss };
}

export default function WelcomeTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/70 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome tour"
    >
      <div className="w-full max-w-sm rounded-card bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-aero-600">
            Welcome to AERO
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-navy-700/50 hover:text-navy-700"
          >
            Skip
          </button>
        </div>

        <p className="mt-5 text-center text-5xl" aria-hidden>
          {current.emoji}
        </p>
        <h2 className="mt-3 text-center text-xl font-extrabold text-navy-900">
          {current.title}
        </h2>
        <p className="mt-2 min-h-[7rem] text-center text-sm leading-relaxed text-navy-700/80">
          {current.body}
        </p>

        {/* Progress dots */}
        <div className="mt-2 flex justify-center gap-2" aria-hidden>
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-6 bg-aero-500" : "w-2 bg-aero-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn-secondary flex-1 py-3 text-sm"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? onClose() : setStep((s) => s + 1))}
            className="btn-primary flex-1 py-3 text-sm"
          >
            {last ? "Let's go 💪" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
