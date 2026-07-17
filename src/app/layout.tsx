import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AERO Fitness",
    template: "%s | AERO Fitness",
  },
  description:
    "AERO Fitness — track your workouts, log your progress, and hit your goals.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AERO Fitness",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f3d40",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-aero-50 text-navy-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
