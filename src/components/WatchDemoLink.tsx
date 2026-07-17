/**
 * Opens the exercise's demo search on YouTube in a new tab (the YouTube app
 * on phones). Used instead of an embed — YouTube no longer supports
 * search-based embeds, and hardcoded video ids rot.
 */
export default function WatchDemoLink({
  url,
  name,
  hero = false,
}: {
  url: string;
  name: string;
  /** hero = big video-shaped panel; otherwise a compact button. */
  hero?: boolean;
}) {
  if (hero) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-card bg-gradient-to-br from-navy-800 to-aero-700 text-white shadow-card transition-opacity hover:opacity-95"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 pl-1 text-2xl" aria-hidden>
          ▶
        </span>
        <span className="text-base font-bold">Watch demo on YouTube</span>
        <span className="px-6 text-center text-xs text-white/70">
          Opens the top &ldquo;{name}&rdquo; form videos in a new tab
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 rounded-xl bg-navy-800 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-700"
    >
      ▶ How to perform
    </a>
  );
}
