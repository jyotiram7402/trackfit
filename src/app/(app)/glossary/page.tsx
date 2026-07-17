"use client";

import { useMemo, useState } from "react";
import { GLOSSARY } from "@/data/glossary";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-navy-900">Gym Glossary</h1>
      <p className="mt-1 text-sm text-navy-700/70">
        Every gym word, in plain English. No jargon allowed.
      </p>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a term… (e.g. reps, RPE, superset)"
        aria-label="Search glossary"
        className="mt-4 w-full rounded-xl border border-aero-200 bg-white px-4 py-3 text-sm shadow-card outline-none placeholder:text-navy-700/40 focus:border-aero-500"
      />

      {results.length === 0 ? (
        <p className="mt-8 text-center text-sm text-navy-700/50">
          No matches for &ldquo;{query}&rdquo; — try a shorter word.
        </p>
      ) : (
        <dl className="mt-4 space-y-3">
          {results.map((t) => (
            <div key={t.term} className="card py-4">
              <dt className="text-base font-bold text-navy-900">{t.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-navy-700/80">
                {t.definition}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
