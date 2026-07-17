"use client";

import { usePathname } from "next/navigation";

/** Re-keys on route change so each tab/page fades in gently. */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-in-up">
      {children}
    </div>
  );
}
