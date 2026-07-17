# AERO Fitness

Mobile-first workout tracker for AERO Fitness, built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase, and Recharts. Deployed on Vercel.

## Status

Project skeleton only:

- ✅ Landing page with AERO Fitness branding and Get Started / Log in buttons
- ✅ Mobile-first app shell — bottom nav on mobile (Home, Today, Progress, Profile), top nav on desktop
- ✅ Placeholder pages for each tab and for Login
- ✅ Supabase client helper (`src/lib/supabase/client.ts`)
- ✅ Static exercise database + weekly training split (`src/data/`)
- ✅ Email + password auth (login / signup), session guard
- ✅ Multi-step onboarding with BMI result, saved to `profiles`
- ✅ Database schema + Row Level Security (`supabase/schema.sql`)
- ✅ Weekly plan generator — goal-personalized, no exercise repeats within a
  week, generated once per calendar week and frozen in `weekly_plans`
- ✅ "This week's plan" screen (Home tab) with today highlighted
- ✅ Today's Workout screen — checkable exercise cards, lazy "how to perform"
  videos, set/rep/weight logging, progress bar, saves to `workout_logs`
- ✅ Progress screen — streak + week/month stat tiles, Recharts bar charts
  (per-day, per-week, per-muscle), weight line chart with target reference
  line and a "log today's weight" input (upserts into `weight_logs`)
- ✅ Editable profile (name, height, weights, goal) with live BMI
- ✅ "Coach's corner" suggestion box on Home — goal/BMI-tailored advice,
  weight-progress bar, tip of the day, next-workout shortcut
- ✅ Fitness levels (B1) — onboarding asks experience; beginners get 2
  simpler exercises per muscle (machines/bodyweight/cables), 3×12, longer
  rest, gentler cardio, and per-exercise starting-weight guidance
- ✅ Exercise detail pages (B2) — `/exercise/[id]` with demo video, badges,
  step-by-step instructions, breathing cues, common mistakes + fixes, form
  tips for all 70 exercises (`src/data/exerciseGuides.ts`), and a "mark as
  learned" button (`learned_exercises` table); unlearned exercises are
  flagged on Today's list
- ✅ Guided Mode (B3) — `/today/guided`: warm-up checklist → one exercise at
  a time (video, set counter, form cues) → auto rest timer with countdown
  ring + beep/vibration → "How did that feel?" feedback (saved as `feeling`
  on `workout_logs`) → cardio → cool-down → celebration + save
- ✅ Rule-based coach (B4, `src/lib/coach.ts`) — progressive-overload
  suggestions from repeated weights + feelings, "felt tough last time"
  reminders on Today/Guided, streak & comeback nudges, weight-pace feedback,
  and a Sunday/Monday weekly check-in card with one tip
- ✅ Welcome tour (4-card overlay on first Home visit, replayable from
  Profile) and a searchable plain-English gym glossary at `/glossary`
- ✅ Polish pass — CSS-only page/tab transitions (reduced-motion aware),
  pill-style bottom nav, Recharts split out of the initial bundle via
  `next/dynamic`, friendly empty states, PWA manifest + SVG app icon
  (installable from the browser menu)

## Supabase setup (do this once)

### 1. Paste your keys

Copy `.env.local.example` to `.env.local` (same folder as `package.json`) and paste your values — both are on the Supabase dashboard under **Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon / public key>
```

Use exactly those two names. `.env.local` is git-ignored, so your keys never leave your machine.

> **Reminder for later:** when you deploy, add the same two variables in Vercel under **Project → Settings → Environment Variables**, then redeploy. The app cannot log anyone in without them.

### 2. Create the tables

Open the Supabase dashboard → your project → **SQL Editor** (left sidebar) → **New query**. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) into the editor and click **Run**. That creates `profiles`, `workout_logs`, `weight_logs`, and `weekly_plans`, and enables Row Level Security so every user can only read/write their own rows.

> **Already ran schema.sql before a later update?** Run the migration files
> the same way (each is safe to run twice):
> [`migration-b1-fitness-level.sql`](supabase/migration-b1-fitness-level.sql)
> adds the `fitness_level` column;
> [`migration-b2-learned-exercises.sql`](supabase/migration-b2-learned-exercises.sql)
> adds the `learned_exercises` table;
> [`migration-b3-feeling.sql`](supabase/migration-b3-feeling.sql) adds the
> `feeling` column to `workout_logs`.

### 3. (Optional) Email confirmation

By default Supabase requires new users to confirm their email before logging in — the signup screen handles this and shows a "check your inbox" notice. If you want signups to work instantly while testing, turn it off under **Authentication → Providers → Email → Confirm email**.

## Project structure

```
src/
  app/
    layout.tsx           # Root layout (Inter font, brand background)
    globals.css          # Tailwind + brand component classes (.card, .btn-primary)
    page.tsx             # Public landing page
    login/page.tsx       # Email + password login / signup
    onboarding/page.tsx  # First-login multi-step profile setup + BMI result
    (app)/               # Authenticated app shell (bottom/top nav, auth-guarded)
      layout.tsx
      home/page.tsx
      today/page.tsx
      progress/page.tsx
      profile/page.tsx
  components/
    BottomNav.tsx        # Mobile bottom nav + desktop top nav
    AuthGuard.tsx        # Redirects: no session → /login, no profile → /onboarding
    providers/AuthProvider.tsx  # Session + profile context
  data/
    exercises.ts         # Static exercise catalog (10 per muscle group) + cardio list
    weeklySplit.ts       # Mon-Sat split definition + getWorkoutForDay() resolver
  lib/
    supabase/client.ts   # Browser Supabase client (env-driven)
    bmi.ts               # BMI calculation, labels, goal messages
    dates.ts             # Local-time week helpers (Monday week start)
    planGenerator.ts     # Builds a goal-personalized week, no repeats
    weeklyPlan.ts        # Generate-once-per-week persistence (weekly_plans)
    hooks/useWeeklyPlan.ts  # React hook exposing the current week's plan
  types/
    index.ts             # Shared types
    workout.ts           # Exercise / split / DayWorkout types
    db.ts                # Supabase row types (Profile, WorkoutLog, ...)
supabase/
  schema.sql             # Tables + RLS — paste into the Supabase SQL Editor
```

## Running it

> Note: this repo was scaffolded by hand (no local build tooling available). `npm install` has not been run yet — do it on a machine with Node 18.17+, or let Vercel do it on deploy.

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + anon key
npm run dev                        # http://localhost:3000
```

The landing page renders without Supabase env vars, but login/onboarding require them (see Supabase setup above).

## Deploying to Vercel

Full step-by-step walkthrough (GitHub → Vercel → env vars → Supabase URLs →
smoke test): see [DEPLOYMENT.md](DEPLOYMENT.md).

## Brand

Teal & navy palette defined in `tailwind.config.ts` under `aero.*` and `navy.*` (light teal `aero-50` background, primary teal `aero-500`, navy `navy-800` accents). Rounded cards use the `.card` class; CTAs use `.btn-primary` / `.btn-secondary`.
