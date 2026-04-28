import type { Metadata } from "next";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "POLANITAS — Auth",
    template: "%s | POLANITAS",
  },
};

import { ParallaxBackground } from "@/components/layout/ParallaxBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col relative overflow-hidden selection:bg-accent-glow selection:text-accent-text">
      <ParallaxBackground />
      
      {/* Minimal top bar */}
      <header className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.05] bg-surface/60 backdrop-blur-xl relative z-20">
        <Link href="/" className="flex items-center transition-transform hover:scale-105 active:scale-95">
          <ThemeLogo height={26} />
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center py-10 px-6 relative z-20">
        <div className="w-full max-w-md animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-8 border-t border-border text-center text-[0.8125rem] text-muted bg-surface/50 backdrop-blur-sm relative z-20">
        © 2026 POLANITAS. All rights reserved.
      </footer>
    </div>
  );
}
