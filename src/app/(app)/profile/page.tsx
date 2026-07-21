"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { TOUR_SEEN_KEY } from "@/components/WelcomeTour";
import { getSupabaseClient } from "@/lib/supabase/client";
import { GOAL_LABELS, bmiLabel, calculateBmi } from "@/lib/bmi";
import type { FitnessLevel, Goal } from "@/types/db";

const LEVEL_LABELS: Record<FitnessLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const inputCls =
  "w-full rounded-xl border border-aero-200 bg-aero-50 px-4 py-3 text-sm outline-none placeholder:text-navy-700/40 focus:border-aero-500";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, session, signOut, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  // AuthGuard guarantees these exist, but keep TypeScript honest.
  if (!profile || !session) return null;

  const bmi =
    profile.current_weight_kg && profile.height_cm
      ? calculateBmi(profile.current_weight_kg, profile.height_cm)
      : null;

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold text-navy-900">Profile</h1>
      <p className="mt-1 text-sm text-navy-700/70">{session.user.email}</p>

      <AvatarUploader />


      {bmi !== null && (
        <div className="card mt-6 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full border-4 border-aero-200 bg-aero-50">
            <span className="text-xl font-extrabold text-navy-900">{bmi}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-navy-700/60">
              BMI
            </span>
          </div>
          <div>
            <p className="text-base font-bold text-navy-900">{bmiLabel(bmi)}</p>
            <p className="text-sm text-navy-700/60">
              Based on {profile.current_weight_kg} kg at {profile.height_cm} cm
            </p>
          </div>
        </div>
      )}

      {editing ? (
        <EditForm
          onDone={async (didSave) => {
            if (didSave) {
              await refreshProfile();
              setSaved(true);
            }
            setEditing(false);
          }}
        />
      ) : (
        <>
          <div className="card mt-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-navy-800">{profile.name}</h2>
              <button
                type="button"
                onClick={() => {
                  setSaved(false);
                  setEditing(true);
                }}
                className="rounded-full border-2 border-aero-300 px-4 py-1.5 text-xs font-bold text-aero-700 transition-colors hover:border-aero-500"
              >
                Edit
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Stat label="Age" value={profile.age ?? "—"} />
              <Stat
                label="Gender"
                value={
                  profile.gender
                    ? profile.gender[0].toUpperCase() + profile.gender.slice(1)
                    : "—"
                }
              />
              <Stat
                label="Height"
                value={profile.height_cm ? `${profile.height_cm} cm` : "—"}
              />
              <Stat
                label="Current weight"
                value={
                  profile.current_weight_kg ? `${profile.current_weight_kg} kg` : "—"
                }
              />
              <Stat
                label="Target weight"
                value={
                  profile.target_weight_kg ? `${profile.target_weight_kg} kg` : "—"
                }
              />
              <Stat
                label="Goal"
                value={profile.goal ? GOAL_LABELS[profile.goal] : "—"}
              />
              <Stat
                label="Fitness level"
                value={
                  profile.fitness_level
                    ? LEVEL_LABELS[profile.fitness_level]
                    : "—"
                }
              />
            </dl>
          </div>
          {saved && (
            <p className="mt-3 rounded-xl bg-aero-100 px-4 py-3 text-sm font-semibold text-aero-800">
              Profile updated ✓
            </p>
          )}
        </>
      )}

      <div className="card mt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-700/60">
          Training
        </h2>
        <Link
          href="/settings/split"
          className="mt-3 flex items-center justify-between rounded-xl border-2 border-aero-200 px-4 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-aero-400"
        >
          <span>🗓️ Customize weekly split — pick what you train each day</span>
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="card mt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-navy-700/60">
          Help
        </h2>
        <div className="mt-3 space-y-2">
          <Link
            href="/glossary"
            className="flex items-center justify-between rounded-xl border-2 border-aero-200 px-4 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-aero-400"
          >
            <span>📖 Gym glossary — every term in plain English</span>
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem(TOUR_SEEN_KEY);
              } catch {}
              router.push("/home");
            }}
            className="flex w-full items-center justify-between rounded-xl border-2 border-aero-200 px-4 py-3 text-left text-sm font-semibold text-navy-800 transition-colors hover:border-aero-400"
          >
            <span>🎈 Replay the welcome tour</span>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSignOut}
        className="btn-secondary mt-6 w-full md:w-auto"
      >
        Sign out
      </button>
    </section>
  );
}

function EditForm({ onDone }: { onDone: (didSave: boolean) => void }) {
  const { profile, session } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [height, setHeight] = useState(profile?.height_cm?.toString() ?? "");
  const [current, setCurrent] = useState(
    profile?.current_weight_kg?.toString() ?? ""
  );
  const [target, setTarget] = useState(
    profile?.target_weight_kg?.toString() ?? ""
  );
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? "maintain");
  const [level, setLevel] = useState<FitnessLevel>(
    profile?.fitness_level ?? "intermediate"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    name.trim().length > 0 &&
    Number(height) >= 80 &&
    Number(height) <= 260 &&
    Number(current) >= 20 &&
    Number(current) <= 400 &&
    Number(target) >= 20 &&
    Number(target) <= 400;

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    setError(null);

    const { error: err } = await getSupabaseClient()
      .from("profiles")
      .update({
        name: name.trim(),
        height_cm: Number(height),
        current_weight_kg: Number(current),
        target_weight_kg: Number(target),
        goal,
        fitness_level: level,
      })
      .eq("id", session.user.id);

    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onDone(true);
  }

  return (
    <div className="card mt-4">
      <h2 className="text-lg font-bold text-navy-800">Edit profile</h2>
      <div className="mt-4 space-y-4">
        <Field label="Name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Height (cm)">
            <input
              type="number"
              inputMode="decimal"
              min={80}
              max={260}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              inputMode="decimal"
              min={20}
              max={400}
              step="0.1"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Target (kg)">
            <input
              type="number"
              inputMode="decimal"
              min={20}
              max={400}
              step="0.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Goal">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                aria-pressed={goal === g}
                className={`rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-colors ${
                  goal === g
                    ? "border-aero-500 bg-aero-100 text-aero-800"
                    : "border-aero-200 bg-white text-navy-700/70 hover:border-aero-300"
                }`}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Fitness level">
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(LEVEL_LABELS) as FitnessLevel[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                aria-pressed={level === l}
                className={`rounded-xl border-2 px-2 py-3 text-xs font-semibold transition-colors ${
                  level === l
                    ? "border-aero-500 bg-aero-100 text-aero-800"
                    : "border-aero-200 bg-white text-navy-700/70 hover:border-aero-300"
                }`}
              >
                {LEVEL_LABELS[l]}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <p className="mt-3 text-xs text-navy-700/50">
        Changing your goal or fitness level reshapes next week&apos;s plan
        (exercise picks, sets, reps, cardio, abs days). This week&apos;s plan
        stays as generated.
      </p>

      {error && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => onDone(false)}
          className="btn-secondary flex-1 py-2.5 text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!valid || saving}
          onClick={handleSave}
          className="btn-primary flex-1 py-2.5 text-sm disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
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

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-navy-700/50">{label}</dt>
      <dd className="font-semibold text-navy-900">{value}</dd>
    </div>
  );
}

function AvatarUploader() {
  const { session, profile, refreshProfile } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!session) return null;
  const userId = session.user.id;

  const initials =
    (profile?.name ?? "?")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErr("Image must be under 3 MB.");
      return;
    }

    setUploading(true);
    setErr(null);
    const supabase = getSupabaseClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (upErr) {
      setErr(upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", userId);
    if (dbErr) {
      setErr(dbErr.message);
      setUploading(false);
      return;
    }

    await refreshProfile();
    setUploading(false);
  }

  return (
    <div className="mt-4 flex items-center gap-4">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-aero-200 bg-aero-100">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl font-extrabold text-aero-700">{initials}</span>
        )}
      </div>
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border-2 border-aero-300 px-4 py-2 text-sm font-bold text-aero-700 transition-colors hover:border-aero-500 disabled:opacity-60"
        >
          {uploading
            ? "Uploading…"
            : profile?.avatar_url
              ? "Change photo"
              : "Add photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
        />
        {err && <p className="mt-1 text-xs font-medium text-red-600">{err}</p>}
      </div>
    </div>
  );
}
