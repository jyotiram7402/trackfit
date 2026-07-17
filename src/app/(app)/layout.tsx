import BottomNav, { TopNav } from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/components/providers/AuthProvider";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="min-h-dvh">
          <TopNav />
          {/* pb-24 keeps content clear of the fixed bottom nav on mobile */}
          <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-6 md:pb-10">
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
