"use client";

import Link from "next/link";
import {
  Zap,
  Search,
  Brain,
  Eye,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { ThemeLogo } from "@/components/layout/ThemeLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { motion } from "framer-motion";
import { ParallaxBackground } from "@/components/layout/ParallaxBackground";

// ── Animation variants ───────────────────────────────────────────
import { Variants } from "framer-motion";

const customEase = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: customEase },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: customEase },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: customEase },
  },
};

const widthExpand: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: customEase },
  },
};

// ── Features data ────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: Search,
    title: "The Researcher",
    desc: "Kumpulkan dan baca data tren secara real-time. Pahami insight konsumen dengan akurat.",
    tag: "Data Scraping",
    color: "#3B82F6",
  },
  {
    Icon: Brain,
    title: "The Strategist",
    desc: "Rancang strategi copywriting viral. Latih pembuatan hook dengan AI terintegrasi.",
    tag: "AI Strategy",
    color: "#8B5CF6",
  },
  {
    Icon: Eye,
    title: "The Analyst",
    desc: "Evaluasi psikologi visual audiens menggunakan teknologi pelacakan mata presisi.",
    tag: "Visual Psych",
    color: "#22C55E",
  },
];

// ── Component ────────────────────────────────────────────────────
export default function LandingClient() {
  return (
    <div className="min-h-dvh bg-bg flex flex-col font-sans overflow-x-hidden relative z-0">
      {/* ── Navigation ─────────────────────────────────────────── */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={slideDown}
        className="flex items-center justify-between px-10 py-5 fixed top-0 left-0 right-0 z-[100] bg-surface backdrop-blur-[12px] border-b border-border"
      >
        <div className="flex items-center gap-4">
          <ThemeLogo height={24} />
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/dashboard"
              className="btn btn-primary btn-sm rounded-full px-4 py-2 font-semibold"
            >
              Masuk <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center pt-[140px] pb-20 relative z-10">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-[900px] text-center px-6 flex flex-col items-center gap-7"
        >
          {/* Badge */}
          <motion.div
            variants={scaleIn}
            className="py-1.5 px-3.5 rounded-full border border-border bg-surface-2 text-secondary text-[0.85rem] font-medium flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          >
            <span className="block w-2 h-2 rounded-full bg-accent-text animate-[pulse_2s_infinite]" />
            Simulasi Edukasi Live
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-[clamp(2.5rem,5vw,4rem)] tracking-[-0.03em] leading-[1.1] text-primary"
          >
            Bongkar Rahasia Konten Digital dengan
            <br />
            <motion.span
              className="glow-text italic font-extrabold inline-block"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Kecerdasan Buatan.
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-[640px] text-lg text-secondary leading-[1.6]"
          >
            Kuasai seni dan sains dari analitik media modern. Praktikkan strategi pemasaran
            visual melalui simulasi komprehensif bersama AI Agen & Eye Tracking. Minimalis, elegan, dan penuh data.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} custom={3} className="flex gap-4 mt-3 flex-wrap justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/dashboard"
                className="btn btn-primary btn-lg rounded-md px-8 h-[52px] text-base"
              >
                Coba Eksplorasi
                <Zap size={18} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ── Features Cards ───────────────────────────────────── */}
        <motion.section
          id="features"
          className="mt-[100px] w-full max-w-[1100px] px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            {FEATURES.map(({ Icon, title, desc, tag, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)",
                  transition: { duration: 0.25 },
                }}
                className="bg-surface rounded-3xl p-8 border border-border flex flex-col gap-6 cursor-default transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  <motion.div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `${color}15`, color }}
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
                  >
                    <Icon size={24} strokeWidth={1.5} />
                  </motion.div>
                  <span className="chip text-xs bg-bg m-0">{tag}</span>
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-primary font-semibold">{title}</h3>
                  <p className="text-secondary text-[0.9375rem] leading-[1.6]">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Statement Section ─────────────────────────────────── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-[60px] md:mt-[100px] w-full max-w-[850px] text-center py-[80px] px-6 relative z-10"
        >
          {/* Glowing subtle background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-accent-subtle)_0%,transparent_50%)] opacity-50 blur-[50px] -z-10 pointer-events-none" />
          
          {/* Animated top/bottom borders */}
          <motion.div
            variants={widthExpand}
            className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-border),transparent)]"
          />
          <motion.div
            variants={widthExpand}
            className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,var(--color-border),transparent)]"
          />

          <motion.div variants={fadeUp} custom={0}>
            <div className="w-20 h-20 mx-auto mb-8 rounded-[24px] bg-surface backdrop-blur-md border border-[var(--color-border)] shadow-[0_20px_40px_-15px_var(--color-accent-glow)] flex items-center justify-center text-[var(--color-accent-text)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-[var(--color-accent-glow)] opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500" />
               <TrendingUp size={36} strokeWidth={2} className="relative z-10 transition-transform duration-500 group-hover:scale-110" />
            </div>
          </motion.div>
          
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-[clamp(2rem,4vw,2.5rem)] font-bold tracking-tight text-primary mb-5"
          >
            Paradigma Baru Analitik Konten
          </motion.h2>
          
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-secondary text-[1.125rem] leading-[1.75] max-w-[700px] mx-auto opacity-90"
          >
            Desain elegan bukanlah sekadar estetika, melainkan kejernihan dalam membaca data.
            POLANITAS mengubah kerumitan algoritma menjadi antarmuka yang bersih, intuitif, dan semi-modern.
          </motion.p>
        </motion.section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-8 px-10 flex justify-between items-center flex-wrap gap-4 bg-surface border-t border-border"
      >
        <div className="flex items-center gap-3">
          <ThemeLogo height={16} />
          <span className="text-[0.85rem] text-muted">© 2026. All rights reserved.</span>
        </div>
        <div className="flex gap-6 text-[0.85rem] text-muted">
          <a href="#" className="text-muted no-underline hover:text-primary transition-colors">Platform</a>
          <a href="#" className="text-muted no-underline hover:text-primary transition-colors">Dokumentasi</a>
          <a href="#" className="text-muted no-underline hover:text-primary transition-colors">Ketentuan</a>
        </div>
      </motion.footer>

      {/* ── Background ────────────────────────────────────────── */}
      <ParallaxBackground />
    </div>
  );
}
