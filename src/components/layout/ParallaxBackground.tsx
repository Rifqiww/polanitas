"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Search, Brain, Eye, Activity } from "lucide-react";

export function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const glowScale = useTransform(smoothProgress, [0, 0.5], [1, 1.2]);
  const glowOpacity = useTransform(smoothProgress, [0, 0.6], [0.06, 0.02]);
  
  // Subtle movement instead of large floating
  const parallaxMove = useTransform(smoothProgress, [0, 1], [0, -100]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none">
      {/* ── Background Grid (Denser and static) ────────────────── */}
      <motion.div 
        style={{ y: parallaxMove }}
        className="absolute w-[200vw] h-[200vh] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] left-[-50vw] top-[-50vh]"
      />

      {/* ── Subtle Ambient Glows ──────────────── */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-accent-glow)] blur-[120px] opacity-15 dark:opacity-5" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-accent-glow)] blur-[120px] opacity-15 dark:opacity-5" />

      {/* ── Technical Icons (Integrated into corners) ──────────── */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.12] dark:opacity-[0.06]">
         
         {/* Center Left Subtle */}
         <div className="absolute top-[45%] left-[-2%] hidden lg:block">
           <Eye size={100} strokeWidth={0.5} className="text-accent-text opacity-40 rotate-6" />
         </div>

         {/* Top Right Subtle */}
         <div className="absolute top-[15%] right-[12%] hidden lg:block">
           <Activity size={80} strokeWidth={0.5} className="text-accent-text opacity-40" />
         </div>
      </div>

      {/* ── Analytical Chart Line (Grounding element) ─────────── */}
      <motion.svg
        style={{ y: useTransform(smoothProgress, [0, 1], [0, -150]) }}
        className="absolute top-[15%] md:top-[12%] left-1/2 -translate-x-1/2 w-[240%] sm:w-[180%] md:w-[140%] min-w-[1200px] h-auto stroke-[var(--color-accent-text)] opacity-[0.25] dark:opacity-[0.12] drop-shadow-[0_0_15px_rgba(var(--color-accent-glow-rgb),0.2)]"
        viewBox="0 0 1000 300"
        fill="none"
      >
        <path d="M0,220 C150,180 250,280 400,140 C550,0 650,250 800,90 C900,20 950,150 1000,50" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0,220 C150,180 250,280 400,140 C550,0 650,250 800,90 C900,20 L1000,300 L0,300 Z" fill="url(#grad)" stroke="none" className="opacity-10" />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-text)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-accent-text)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* ── Soft Center Glow (Behind the Form) ────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,var(--color-accent-text)_0%,transparent_70%)] pointer-events-none blur-[150px] opacity-[0.08] dark:opacity-[0.04]" />
    </div>
  );
}
