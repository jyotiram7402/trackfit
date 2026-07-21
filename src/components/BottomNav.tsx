"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/today", label: "Today", icon: DumbbellIcon },
  { href: "/explore", label: "Explore", icon: CompassIcon },
  { href: "/progress", label: "Progress", icon: ChartIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-aero-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-transform active:scale-95 ${
                  active ? "text-aero-700" : "text-navy-700/50 hover:text-navy-700"
                }`}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                    active ? "bg-aero-100" : "bg-transparent"
                  }`}
                >
                  <Icon className="h-6 w-6" filled={active} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Desktop top nav sharing the same tabs — shown md and up. */
export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-aero-200 bg-white/95 backdrop-blur md:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/home" className="text-lg font-extrabold tracking-tight text-navy-800">
          AERO<span className="text-aero-500"> Fitness</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-6">
            {tabs.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm font-semibold transition-colors ${
                      active ? "text-aero-600" : "text-navy-700/60 hover:text-navy-800"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

type IconProps = { className?: string; filled?: boolean };

function HomeIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function DumbbellIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="5.5" y="7" width="3" height="10" rx="1" />
      <rect x="15.5" y="7" width="3" height="10" rx="1" />
      <path d="M8.5 12h7" />
    </svg>
  );
}

function CompassIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11z" fill={filled ? "#ffffff" : "none"} />
    </svg>
  );
}

function ChartIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20H2" />
    </svg>
  );
}

function UserIcon({ className, filled }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  );
}
