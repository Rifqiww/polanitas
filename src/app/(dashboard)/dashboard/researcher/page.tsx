import type { Metadata } from "next";
import Link from "next/link";
import {
  Search, PlayCircle, TrendingUp, ShoppingBag, Hash,
  ArrowUpRight, Zap, Globe, Database, BarChart2,
} from "lucide-react";

export const metadata: Metadata = { title: "Researcher Agent — POLANITAS" };

// ── Brand Icons (SVG) ────────────────────────────────────────────────
const YoutubeIcon = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TiktokIcon = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color || "currentColor"} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.032 2.612-.02 3.914-.02.115 2.18.804 4.264 2.135 5.807 1.285 1.504 3.048 2.565 4.955 2.948V12.6c-1.283-.141-2.542-.51-3.693-1.09a9.404 9.404 0 0 1-3.151-2.354V18.2a6.64 6.64 0 0 1-5.64 6.54 6.66 6.66 0 0 1-7.23-4.52 6.66 6.66 0 0 1 1.94-7.44 6.66 6.66 0 0 1 7.15-1.04v4.06a2.64 2.64 0 0 0-2.88.54 2.64 2.64 0 0 0 1.25 4.39 2.64 2.64 0 0 0 3.09-2.59V.02Z"/>
  </svg>
);

const InstagramIcon = ({ size = 16, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TokopediaIcon = ({ size = 16 }: { size?: number }) => (
  <img src="/tokopedia.png" alt="Tokopedia" width={size} height={size} style={{ objectFit: "contain" }} />
);

const ShopeeIcon = ({ size = 16 }: { size?: number }) => (
  <img src="/shopee.png" alt="Shopee" width={size} height={size} style={{ objectFit: "contain" }} />
);

const DATA_SOURCES = [
  { platform: "YouTube", icon: YoutubeIcon, color: "#FF0000", desc: "Tren video populer berdasarkan region", tag: "YouTube Data API v3" },
  { platform: "TikTok", icon: TiktokIcon, color: "#010101", desc: "Hashtag viral dan volume penggunaan", tag: "Apify Scraper" },
  { platform: "Instagram", icon: InstagramIcon, color: "#E1306C", desc: "Reels & hashtag berbasis topik", tag: "Apify Scraper" },
  { platform: "Tokopedia", icon: TokopediaIcon, color: "#00AA5B", desc: "Produk terlaris dan analisis harga", tag: "Lexis Solutions" },
  { platform: "Shopee", icon: ShopeeIcon, color: "#EE4D2D", desc: "Kompetitor produk & whitespace gap", tag: "Apify Scraper" },
];

const PROCESS_STEPS = [
  { num: "01", title: "Scraping Paralel", desc: "Semua sumber data di-scrape secara simultan menggunakan Promise.allSettled — kecepatan maksimal tanpa blocking." },
  { num: "02", title: "AI Synthesis", desc: "Data mentah dirangkum dan dianalisis oleh Llama 3.3 70B (GROQ_API_KEY_MARKET_RESEARCH) untuk menghasilkan 5 trending keyword yang paling relevan." },
  { num: "03", title: "Handoff ke Strategist", desc: "Output disimpan ke Firestore (/research/output) dan Agen Strategist langsung diaktifkan untuk lanjut ke fase konten." },
];

export default function ResearcherPage() {
  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 40, paddingBottom: 64 }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--color-accent-subtle)", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={18} color="var(--color-accent-text)" />
            </div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Agen 01</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 10 }}>
            The Researcher
          </h1>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: 560, lineHeight: 1.7, fontSize: "1rem" }}>
            Mengumpulkan data tren secara real-time dari 5 sumber, lalu menggunakan AI untuk menyintesis sinyal pasar paling relevan sebelum dikirim ke Agen Strategist.
          </p>
        </div>
        <Link href="/dashboard/sessions" style={{ textDecoration: "none" }}>
          <div className="btn btn-primary" style={{ gap: 6, fontSize: "0.875rem" }}>
            Mulai Riset <ArrowUpRight size={15} />
          </div>
        </Link>
      </div>

      {/* ── Capabilities banner ─────────────────────────────────── */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { icon: Zap, label: "Groq Llama 3.3 70B — GROQ_API_KEY_MARKET_RESEARCH" },
          { icon: Globe, label: "5 Platform Simultan" },
          { icon: Database, label: "Output ke Firestore /research/output" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", borderRadius: 100, background: "var(--color-surface)", border: "1px solid var(--color-border)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
            <Icon size={13} color="var(--color-accent-text)" />
            {label}
          </div>
        ))}
      </div>

      {/* ── Data Sources grid ──────────────────────────────────── */}
      <div>
        <h2 style={{ fontWeight: 800, fontSize: "1.0625rem", marginBottom: 16 }}>Sumber Data</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {DATA_SOURCES.map(({ platform, icon: Icon, color, desc, tag }) => (
            <div key={platform} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 18, padding: "20px 20px", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--color-text-primary)" }}>{platform}</div>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: 12 }}>{desc}</p>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", borderRadius: 100, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)", letterSpacing: "0.05em" }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Process ────────────────────────────────────────────── */}
      <div>
        <h2 style={{ fontWeight: 800, fontSize: "1.0625rem", marginBottom: 16 }}>Cara Kerja</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {PROCESS_STEPS.map((step, i) => (
            <div key={step.num} style={{ display: "flex", gap: 20, position: "relative" }}>
              {/* Timeline dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-accent-subtle)", border: "1.5px solid var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem", color: "var(--color-accent-text)", zIndex: 1 }}>
                  {step.num}
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "var(--color-border)", margin: "4px 0", minHeight: 32 }} />
                )}
              </div>
              <div style={{ paddingBottom: 32, paddingTop: 8 }}>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--color-text-primary)", marginBottom: 6 }}>{step.title}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Output preview ─────────────────────────────────── */}
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 10 }}>
          <Hash size={16} color="var(--color-accent-text)" />
          <span style={{ fontWeight: 800, fontSize: "0.9375rem" }}>Contoh Output: Viral Keywords</span>
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", padding: "3px 10px", borderRadius: 100, background: "var(--color-accent-subtle)", color: "var(--color-accent-text)", fontWeight: 700 }}>via AI Synthesis</span>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["#skincareroutine", "#glowingskin", "#produklokal", "#skintokid", "#budgetskincare"].map(kw => (
            <span key={kw} style={{ padding: "8px 16px", borderRadius: 100, background: "var(--color-surface-2)", border: "1px solid var(--color-border)", fontWeight: 700, fontSize: "0.875rem", color: "var(--color-text-primary)" }}>{kw}</span>
          ))}
        </div>
        <div style={{ padding: "12px 24px", background: "var(--color-surface-2)", borderTop: "1px solid var(--color-border)", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
          Keywords ini di-generate dari sintesis data mentah seluruh platform oleh Llama 3.3 70B, bukan sekadar hasil scraping mentah.
        </div>
      </div>

    </div>
  );
}
