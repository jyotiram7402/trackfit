# Deploying AERO Fitness to Vercel (free tier)

Follow these steps in order. Total time: ~15 minutes.

## Before you start

You need:

- A [GitHub](https://github.com) account (free)
- A [Vercel](https://vercel.com) account (free — sign up **with** your GitHub account, it makes step 3 automatic)
- Your Supabase project's URL and anon key (dashboard → **Project Settings → API**)
- The database tables already created (you ran `supabase/schema.sql` and the
  `supabase/migration-b*.sql` files in the SQL Editor)

## Step 1 — Put the code on GitHub

**Option A — with git installed:**

```bash
git init
git add .
git commit -m "AERO Fitness v1"
```

Then create an empty repo on github.com (**+ → New repository**, private is fine, do NOT add a README), and:

```bash
git remote add origin https://github.com/YOUR-USERNAME/aero-fitness.git
git branch -M main
git push -u origin main
```

**Option B — no git on your machine (upload via the website):**

1. Go to github.com → **+ → New repository** → name it `aero-fitness` → Create.
2. Click **uploading an existing file** on the empty-repo page.
3. Drag the **contents** of the project folder into the upload area.
4. ⚠️ **Do NOT upload `.env.local`** if you've created one — that file holds
   your keys and must never leave your machine. (`.gitignore` protects you
   with git, but a manual web upload does not.) Also skip `node_modules`
   and `.next` if they exist.
5. Click **Commit changes**.

## Step 2 — Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Your `aero-fitness` repo appears in the list — click **Import**.
3. Vercel auto-detects Next.js. **Change nothing** — the defaults are correct.
4. **Don't click Deploy yet** — add the environment variables first (next step,
   it's on the same screen).

## Step 3 — Add the environment variables

Still on the import screen (or later under **Project → Settings → Environment
Variables**), add exactly these two, for all environments (Production,
Preview, Development):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon / public key |

Both values come from Supabase → **Project Settings → API**. Copy-paste them
exactly — no quotes, no spaces. (The anon key is designed to be public — Row
Level Security is what protects the data — but keep the habit of never
hardcoding keys anyway.)

## Step 4 — Deploy

Click **Deploy**. Vercel installs the packages and builds the app in the
cloud (~2 minutes). When it finishes you get a live URL like
`https://aero-fitness.vercel.app`.

> If the build fails, open the build log, copy the error, and fix it before
> retrying — the log always names the exact file and line.

## Step 5 — Tell Supabase about your live URL (login breaks without this)

In the Supabase dashboard → **Authentication → URL Configuration**:

1. **Site URL**: set to your Vercel URL, e.g. `https://aero-fitness.vercel.app`
2. **Redirect URLs**: add `https://aero-fitness.vercel.app/**`

This is what makes signup confirmation emails link back to your live site
instead of localhost. If you later add a custom domain, add it here too.

## Step 6 — Smoke-test the live site

Open the URL **on your phone** and run through this checklist:

- [ ] Landing page loads fast with AERO branding
- [ ] **Sign up** with a real email (confirm via the email link if
      confirmation is on)
- [ ] **Log in** → onboarding appears (name, numbers, level, goal) → BMI
      result screen shows
- [ ] **Home** shows this week's plan with today highlighted (this proves the
      weekly plan generated and saved to the database)
- [ ] **Today** → check off an exercise, tap "How to perform" (video plays),
      tap Finish Workout → "Workout saved 💪"
- [ ] Try **Guided Mode** for one set — rest timer counts down and beeps
- [ ] **Progress** → the workout you just logged appears in the charts; log a
      weight → the line chart updates
- [ ] **Profile** → your data is there; sign out and log back in
- [ ] Bonus: browser menu → **Add to Home screen** — the app installs with
      the AERO icon

If any step fails, note what you clicked and any red error text — the fix is
usually one of: env vars missing/typo'd (step 3), redirect URLs missing
(step 5), or a migration not run (see README's Supabase setup).

## Updating the app later

Push (or web-upload) new commits to `main` — Vercel redeploys automatically
on every push. Environment variables persist; you only set them once.
