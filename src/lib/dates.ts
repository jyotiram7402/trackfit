// Local-time date helpers (avoid toISOString(), which shifts to UTC and can
// land on the wrong day for evening users).

/** "YYYY-MM-DD" in the user's local timezone. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Monday 00:00 of the week containing `date` (weeks start Monday). */
export function getWeekStart(date: Date = new Date()): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** e.g. "13 Jul – 18 Jul" for the Mon–Sat span of the given week start. */
export function formatWeekRange(weekStart: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  return `${fmt(weekStart)} – ${fmt(addDays(weekStart, 5))}`;
}
