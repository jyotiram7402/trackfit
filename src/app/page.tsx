import Link from "next/link";

const features = [
  {
    title: "Today's Workout",
    description: "See exactly what to train today and check off every set.",
    icon: "🏋️",
  },
  {
    title: "Track Progress",
    description: "Charts of your lifts, weight, and streaks over time.",
    icon: "📈",
  },
  {
    title: "Your Goals",
    description: "Personalized onboarding tunes the plan to your goals.",
    icon: "🎯",
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-6 animate-fade-in">
      {/* Top bar */}
      <header className="flex items-center justify-between py-6">
        <span className="text-xl font-extrabold tracking-tight text-navy-800">
          AERO<span className="text-aero-500"> Fitness</span>
        </span>
        <Link
          href="/login"
          className="text-sm font-semibold text-aero-700 hover:text-aero-600"
        >
          Log in
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-10 py-12 text-center md:flex-row md:gap-16 md:text-left">
        <div className="max-w-xl">
          <p className="mb-3 inline-block rounded-full bg-aero-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-aero-700">
            Train smarter
          </p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-navy-900 md:text-6xl">
            AERO <span className="text-aero-500">Fitness</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-700/80">
            Your gym, in your pocket. Log every workout, watch your progress
            climb, and never miss a training day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
            <Link href="/login" className="btn-primary w-full sm:w-auto">
              Get Started
            </Link>
            <Link href="/login" className="btn-secondary w-full sm:w-auto">
              Log in
            </Link>
          </div>
        </div>

        {/* Brand visual placeholder */}
        <div
          aria-hidden
          className="hidden h-72 w-72 shrink-0 items-center justify-center rounded-card bg-gradient-to-br from-aero-400 via-aero-500 to-navy-800 shadow-card md:flex"
        >
          <span className="text-7xl font-extrabold text-white/90">A</span>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-4 pb-14 sm:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="card text-left">
            <div className="mb-3 text-3xl">{feature.icon}</div>
            <h2 className="text-lg font-bold text-navy-800">{feature.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-navy-700/70">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      <footer className="border-t border-aero-200 py-6 text-center text-xs text-navy-700/60">
        © {new Date().getFullYear()} AERO Fitness. Built to move.
      </footer>
    </main>
  );
}
