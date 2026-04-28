"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Brain,
  TrendingUp,
  BarChart2,
  BookOpen,
  Clock,
  PlayCircle,
  Zap,
  CheckCircle,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpRight,
  Target,
  Flame,
  ShoppingBag,
  MessageSquare,
  Layers,
  Shield,
  DollarSign,
  Lock,
  Users,
  FlaskConical,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────
interface Course {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  level: string;
  gradient: string;
  Icon: React.FC<any>;
  lessons: number;
  duration: string;
  tag: string;
  href: string;
  available: boolean;
}

interface ActiveCourse {
  id: string;
  title: string;
  desc: string;
  progress: number;
  gradient: string;
  href: string;
  Icon: React.FC<any>;
}

// ── All 12 modules ───────────────────────────────────────────────────
const COURSES: Course[] = [
  { id: "ai-orchestration", num: 1, title: "Orkestrasi AI", subtitle: "Menjadi Dirigen jaringan agen", level: "Fundamental", gradient: "linear-gradient(140deg, #818CF8 0%, #6366F1 100%)", Icon: Brain, lessons: 6, duration: "3 jam", tag: "Populer", href: "/dashboard/learn/ai-orchestration", available: true },
  { id: "trend-signal", num: 2, title: "Deteksi Tren Dini", subtitle: "Sinyal tren TikTok sebelum viral", level: "Menengah", gradient: "linear-gradient(140deg, #F97316 0%, #EA580C 100%)", Icon: TrendingUp, lessons: 6, duration: "2.5 jam", tag: "Terbaru", href: "/dashboard/learn/trend-signal", available: true },
  { id: "marketplace-whitespace", num: 3, title: "Whitespace Marketplace", subtitle: "Celah pasar Shopee & Tokopedia", level: "Menengah", gradient: "linear-gradient(140deg, #34D399 0%, #10B981 100%)", Icon: ShoppingBag, lessons: 5, duration: "2 jam", tag: "Terbaru", href: "/dashboard/learn/marketplace-whitespace", available: true },
  { id: "eye-tracking", num: 4, title: "Eye Tracking Mastery", subtitle: "F-Pattern · WebGazer · Heatmap", level: "Lanjutan", gradient: "linear-gradient(140deg, #FBBF24 0%, #D97706 100%)", Icon: BarChart2, lessons: 9, duration: "4 jam", tag: "Lanjutan", href: "/dashboard/learn/eye-tracking", available: true },
  { id: "llm-copywriting", num: 5, title: "Copywriting LLM", subtitle: "1.000 variasi caption via Llama 3", level: "Menengah", gradient: "linear-gradient(140deg, #F472B6 0%, #DB2777 100%)", Icon: MessageSquare, lessons: 7, duration: "3 jam", tag: "Populer", href: "/dashboard/learn/llm-copywriting", available: true },
  { id: "content-atomization", num: 6, title: "Content Atomization", subtitle: "1 ide → Reels + TikTok + Live", level: "Menengah", gradient: "linear-gradient(140deg, #C084FC 0%, #7C3AED 100%)", Icon: Layers, lessons: 6, duration: "2.5 jam", tag: "Terbaru", href: "/dashboard/learn/content-atomization", available: true },
  { id: "neuromarketing", num: 7, title: "Neuromarketing", subtitle: "Dashboard untuk keputusan 30 detik", level: "Lanjutan", gradient: "linear-gradient(140deg, #F87171 0%, #DC2626 100%)", Icon: BarChart2, lessons: 7, duration: "3 jam", tag: "Lanjutan", href: "/dashboard/learn/neuromarketing", available: true },
  { id: "crisis-management", num: 8, title: "Manajemen Krisis", subtitle: "Respon sentimen otomatis & empati", level: "Lanjutan", gradient: "linear-gradient(140deg, #FB923C 0%, #C2410C 100%)", Icon: Shield, lessons: 5, duration: "2 jam", tag: "Lanjutan", href: "/dashboard/learn/crisis-management", available: true },
  { id: "roi-attribution", num: 9, title: "Atribusi ROI", subtitle: "Engagement → sales marketplace", level: "Lanjutan", gradient: "linear-gradient(140deg, #2DD4BF 0%, #0D9488 100%)", Icon: DollarSign, lessons: 8, duration: "3.5 jam", tag: "Lanjutan", href: "/dashboard/learn/roi-attribution", available: true },
  { id: "ai-ethics", num: 10, title: "Etika AI & Brand Safety", subtitle: "Guardrails · UU PDP · Compliance", level: "Fundamental", gradient: "linear-gradient(140deg, #94A3B8 0%, #475569 100%)", Icon: Lock, lessons: 5, duration: "2 jam", tag: "Fundamental", href: "/dashboard/learn/ai-ethics", available: true },
  { id: "influencer-dna", num: 11, title: "Influencer DNA Matching", subtitle: "Vibe matching dengan vector search", level: "Lanjutan", gradient: "linear-gradient(140deg, #D946EF 0%, #9333EA 100%)", Icon: Users, lessons: 6, duration: "2.5 jam", tag: "Lanjutan", href: "/dashboard/learn/influencer-dna", available: true },
  { id: "ab-testing", num: 12, title: "A/B Testing Agresif", subtitle: "50 variasi iklan · iterasi otomatis", level: "Lanjutan", gradient: "linear-gradient(140deg, #22D3EE 0%, #0891B2 100%)", Icon: FlaskConical, lessons: 7, duration: "3 jam", tag: "Lanjutan", href: "/dashboard/learn/ab-testing", available: true },
];

const ACTIVE_COURSES: ActiveCourse[] = [
  { id: "ai-orchestration", title: "Orkestrasi AI", desc: "Selesaikan teori Dirigen AI sebelum simulasi agen", progress: 33, gradient: "linear-gradient(135deg, #818CF8 0%, #6366F1 100%)", href: "/dashboard/learn/ai-orchestration", Icon: Brain },
  { id: "trend-signal", title: "Deteksi Tren Dini", desc: "Mulai deteksi noise vs. sinyal tren nyata", progress: 0, gradient: "linear-gradient(135deg, #FB923C 0%, #EA580C 100%)", href: "/dashboard/learn/trend-signal", Icon: TrendingUp },
];

const FILTERS = ["Semua", "Populer", "Terbaru", "Fundamental", "Menengah", "Lanjutan"];

// ─── Progress Ring ────────────────────────────────────────────────────
function Ring({ pct, size = 52 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fff" strokeWidth="4"
        strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} className="transition-[stroke-dasharray] duration-[800ms] ease-out" />
      {pct === 100
        ? <path d={`M ${size/2-5} ${size/2+1} L ${size/2-1} ${size/2+5} L ${size/2+6} ${size/2-4}`} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        : <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="10" fontWeight="800" className="font-sans">{pct}%</text>
      }
    </svg>
  );
}

// ─── Skeleton Components ──────────────────────────────────────────────
function SkeletonDashboard() {
  return (
    <div className="dashboard-grid w-full max-w-full">
      {/* Left */}
      <div className="dashboard-col dashboard-col--left">
        {/* greeting */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="skeleton w-[60px] h-3.5 rounded-[6px]" />
            <div className="skeleton w-[180px] h-10 rounded-lg" />
          </div>
          <div className="skeleton w-[52px] h-[52px] rounded-full" />
        </div>
        {/* stats */}
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map(i => (
            <div key={i} className="bg-surface border border-border rounded-[var(--radius-lg)] py-4 px-[18px]">
              <div className="skeleton w-[30px] h-[30px] rounded-[var(--radius-sm)] mb-2.5" />
              <div className="skeleton w-10 h-6 rounded-[6px] mb-1.5" />
              <div className="skeleton w-20 h-3 rounded" />
            </div>
          ))}
        </div>
        {/* search */}
        <div className="skeleton h-11 rounded-[var(--radius-lg)]" />
        {/* cards row */}
        <div className="flex gap-3.5 overflow-x-hidden">
          {[0,1,2].map(i => (
            <div key={i} className="skeleton min-w-[200px] h-[240px] rounded-[22px] shrink-0" />
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="dashboard-col dashboard-col--right">
        <div className="skeleton w-[120px] h-6 rounded-[6px]" />
        <div className="skeleton h-11 rounded-full" />
        <div className="skeleton h-[120px] rounded-[20px]" />
        {[0,1].map(i => (
          <div key={i} className="skeleton h-[110px] rounded-[20px]" />
        ))}
        <div className="skeleton h-20 rounded-[20px]" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  if (loading) return <SkeletonDashboard />;

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Pengguna";
  const firstName = displayName.split(" ")[0];
  const defaultAvatar = firstName.length % 2 === 0 ? "/profile/boy.svg" : "/profile/girl.svg";
  const avatarUrl = user?.photoURL || defaultAvatar;

  const filtered = COURSES.filter((c) => {
    const matchFilter = activeFilter === "Semua" || c.tag === activeFilter || c.level === activeFilter;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="dashboard-grid w-full max-w-full">

      {/* ══ LEFT COLUMN ══════════════════════════════════════════════ */}
      <div className="dashboard-col dashboard-col--left">

        {/* Greeting */}
        <div className="animate-fade-in-up flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.9rem] text-muted mb-1 font-medium">Halo,</p>
            <h1 className="text-[clamp(1.75rem,3.5vw,2.25rem)] tracking-[-0.04em] font-extrabold leading-[1.1] flex items-center gap-2.5">
              {firstName} <span className="animate-[wave_2.5s_infinite] origin-[70%_70%] inline-block"></span>
            </h1>
          </div>
          <div className="w-[52px] h-[52px] rounded-full overflow-hidden border-[3px] border-surface shadow-md shrink-0">
            <img src={avatarUrl} alt={firstName} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-3 gap-3 [animation-delay:60ms]">
          {[
            { label: "Modul Tersedia", value: "12", Icon: BookOpen, color: "#6366F1" },
            { label: "Sedang Belajar", value: String(ACTIVE_COURSES.filter(c=>c.progress>0).length), Icon: Flame, color: "#F59E0B" },
            { label: "AI Tutor Lab", value: "Aktif", Icon: Zap, color: "#10B981" },
          ].map(({ label, value, Icon: I, color }) => (
            <div key={label} className="bg-surface border border-border rounded-[var(--radius-lg)] py-4 px-[18px] shadow-sm flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div
                className="w-[30px] h-[30px] rounded-[var(--radius-sm)] flex items-center justify-center mb-0 md:mb-2.5 shrink-0"
                style={{ background: `${color}15` }}
              >
                <I size={14} color={color} />
              </div>
              <div>
                <div className="font-extrabold text-xl text-primary leading-none">{value}</div>
                <div className="text-[0.7rem] text-muted mt-1 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="animate-fade-in-up flex gap-2.5 [animation-delay:120ms]">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" />
            <input
              type="text" placeholder="Cari modul pembelajaran..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-border rounded-[var(--radius-lg)] py-2.5 pl-[38px] pr-3.5 text-sm text-primary font-sans bg-surface outline-none shadow-sm transition-[border-color,box-shadow] duration-200 focus:border-[#6366F1] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
            />
          </div>
          <button className="w-[42px] h-[42px] rounded-[var(--radius-md)] bg-accent border-none flex items-center justify-center cursor-pointer shrink-0 shadow-[0_4px_12px_var(--color-accent-glow)] transition-transform duration-150 hover:scale-[1.06] active:scale-100">
            <SlidersHorizontal size={16} color="#1A2E0A" />
          </button>
        </div>

        {/* Courses horizontal scroll */}
        <div className="animate-fade-in-up [animation-delay:180ms]">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-extrabold text-[1.05rem]">Kurikulum — 12 Modul</h2>
            <Link href="/dashboard/learn" className="flex items-center gap-1 text-[0.78rem] font-bold text-accent-text no-underline">
              Lihat Semua <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-[18px] overflow-x-auto pb-1 [scrollbar-width:none]">
            {FILTERS.map(f => {
              const active = activeFilter === f;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`py-1.5 px-3.5 rounded-full text-[0.78rem] font-bold cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 font-sans ${
                    active
                      ? "border-none bg-accent text-[#12200A] shadow-[0_3px_10px_var(--color-accent-glow)]"
                      : "border border-border bg-surface text-secondary shadow-sm"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Horizontal scroll row */}
          <div className="flex gap-3.5 overflow-x-auto pb-3 [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] snap-x snap-mandatory">
            {filtered.map(({ id, num, title, subtitle, level, gradient, Icon, lessons, duration, href, available }) => (
              <Link key={id} href={available ? href : "/dashboard/learn"} className="no-underline shrink-0 snap-start">
                <div
                  className={`rounded-[22px] p-[22px_20px_18px] w-[230px] h-[250px] flex flex-col relative overflow-hidden cursor-pointer transition-[transform,box-shadow] duration-[220ms] ease-out hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.2)] ${!available ? "opacity-65 grayscale-[25%]" : ""}`}
                  style={{ background: gradient }}
                >
                  {/* decorative blob */}
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="absolute -right-6 -top-6 opacity-15 pointer-events-none">
                    <circle cx="60" cy="60" r="60" fill="#fff" />
                    <circle cx="60" cy="60" r="36" fill="none" stroke="#fff" strokeWidth="2" />
                  </svg>

                  {/* num + level */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[0.65rem] font-extrabold text-white/60 tracking-[0.1em]">#{String(num).padStart(2,"0")}</span>
                    {!available && <span className="text-[0.6rem] font-bold text-white/70 bg-black/20 py-0.5 px-2 rounded-full">Segera</span>}
                  </div>

                  {/* Icon */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="w-[60px] h-[60px] rounded-full bg-white/15 flex items-center justify-center">
                      <Icon size={28} color="#FFF" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative z-[1]">
                    <div className="font-extrabold text-[0.9375rem] text-white mb-[3px] leading-[1.3]">{title}</div>
                    <div className="text-[0.72rem] text-white/75 mb-3 leading-[1.4]">{subtitle}</div>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-white/85 bg-white/15 py-0.5 px-2 rounded-full">
                        <BookOpen size={10} /> {lessons}
                      </span>
                      <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-white/85 bg-white/15 py-0.5 px-2 rounded-full">
                        <Clock size={10} /> {duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT COLUMN ═════════════════════════════════════════════ */}
      <div className="dashboard-col dashboard-col--right animate-fade-in-up [animation-delay:240ms]">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-[1.05rem]">Modul Saya</h2>
          <Link href="/dashboard/learn" className="flex items-center gap-1 text-[0.78rem] font-semibold text-muted no-underline">
            Lihat Semua <ChevronRight size={13} />
          </Link>
        </div>

        {/* Tab pills */}
        <div className="flex p-1 rounded-full gap-[3px] bg-surface-2 border border-border">
          {[{ i:BookOpen, l:"Semua" }, { i:Zap, l:"Berlangsung" }, { i:CheckCircle, l:"Selesai" }].map(({ i: Ti, l },idx) => (
            <button
              key={l}
              className={`flex-1 py-[7px] px-2 rounded-full border-none text-[0.72rem] flex justify-center items-center gap-[5px] cursor-pointer font-sans ${
                idx===0
                  ? "bg-accent text-[#12200A] font-bold shadow-[0_3px_8px_var(--color-accent-glow)]"
                  : "bg-transparent text-muted font-medium"
              }`}
            >
              <Ti size={12} /> {l}
            </button>
          ))}
        </div>

        {/* Promo banner */}
        <div className="bg-[linear-gradient(135deg,#3B82F6_0%,#1D4ED8_100%)] rounded-[18px] p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-[100px] h-[100px] rounded-full bg-white/[0.08]" />
          <div className="absolute right-4 top-4 w-[52px] h-[52px] rounded-full bg-white/10 flex items-center justify-center">
            <Target size={24} className="text-white/65" />
          </div>
          <div className="relative z-[1] max-w-[72%]">
            <div className="font-extrabold text-[0.9375rem] text-white leading-[1.4] mb-3">
              Mulai jalur belajar barumu!
            </div>
            <Link
              href="/dashboard/learn"
              className="inline-flex items-center gap-[5px] bg-white text-[#1D4ED8] font-bold text-xs py-[7px] px-3.5 rounded-full no-underline shadow-[0_4px_10px_rgba(0,0,0,0.15)] transition-transform duration-150 hover:-translate-y-0.5"
            >
              Cek Kurikulum <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Active modules */}
        <div className="flex flex-col gap-3">
          {ACTIVE_COURSES.map(({ id, title, desc, progress, gradient, href, Icon: CourseIcon }) => (
            <Link key={id} href={href} className="no-underline">
              <div
                className="rounded-[18px] py-4 px-[18px] flex items-center gap-3.5 relative overflow-hidden transition-[transform,filter] duration-200 cursor-pointer hover:-translate-y-0.5 hover:brightness-[1.06]"
                style={{ background: gradient }}
              >
                <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-white/[0.08]" />

                <div className="flex-1 z-[1] min-w-0">
                  <div className="font-extrabold text-sm text-white mb-[3px]">{title}</div>
                  <div className="text-[0.72rem] text-white/[0.72] mb-2.5 overflow-hidden line-clamp-2 leading-[1.4]">{desc}</div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-white rounded-full transition-[width] duration-[800ms] ease-out" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-[0.65rem] text-white/65 font-bold">
                    {progress === 0 ? "Belum dimulai" : `Selesai ${progress}%`}
                  </div>
                </div>

                <Ring pct={progress} size={48} />
              </div>
            </Link>
          ))}
        </div>

        {/* AI Agents CTA */}
        <div className="border-[1.5px] border-dashed border-border rounded-[18px] py-4 px-[18px] flex items-center gap-3.5 bg-surface">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-accent-subtle border border-border flex items-center justify-center shrink-0">
            <PlayCircle size={20} className="text-accent-text" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[0.84rem] text-primary mb-0.5">Simulasi Agen AI</div>
            <div className="text-[0.72rem] text-muted leading-[1.4]">Selesaikan Modul 1 untuk membuka akses penuh.</div>
          </div>
          <Link href="/dashboard/sessions" className="btn btn-primary btn-sm shrink-0 gap-1 py-[7px] px-3 text-[0.72rem]">
            Mulai <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
