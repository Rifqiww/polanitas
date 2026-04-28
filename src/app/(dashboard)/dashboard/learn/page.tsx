"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ── 12 Modules ──────────────────────────────────────────────────────────────
const MODULES = [
  { id: "ai-orchestration", num: 1, title: "Orkestrasi AI", subtitle: "Belajar mendelegasikan tugas ke agen AI otonom untuk efisiensi.", color: "#84CC16", available: true },
  { id: "trend-signal", num: 2, title: "Deteksi Tren Dini", subtitle: "Mendeteksi noise vs. sinyal tren nyata di sosial media.", color: "#F97316", available: true },
  { id: "marketplace-whitespace", num: 3, title: "Whitespace Marketplace", subtitle: "Menemukan celah pasar dengan kompetisi konten rendah.", color: "#EF4444", available: true },
  { id: "eye-tracking", num: 4, title: "Psikologi Visual", subtitle: "Optimasi hierarki visual menggunakan prinsip eye tracking.", color: "#0EA5E9", available: true },
  { id: "llm-copywriting", num: 5, title: "Copywriting LLM", subtitle: "Otomatisasi pembuatan ribuan caption personalisasi.", color: "#8B5CF6", available: true },
  { id: "content-atomization", num: 6, title: "Content Atomization", subtitle: "Memecah satu ide besar menjadi puluhan aset multi-platform.", color: "#EC4899", available: true },
  { id: "neuromarketing", num: 7, title: "Neuromarketing", subtitle: "Desain analitik untuk pengambilan keputusan instan.", color: "#14B8A6", available: true },
  { id: "crisis-management", num: 8, title: "Manajemen Krisis", subtitle: "Sistem AI untuk memantau dan merespon sentimen negatif.", color: "#EAB308", available: true },
  { id: "roi-attribution", num: 9, title: "Atribusi ROI", subtitle: "Menghubungkan metrik engagement dengan penjualan nyata.", color: "#6366F1", available: true },
  { id: "ai-ethics", num: 10, title: "Etika AI & Organisasi", subtitle: "Kebijakan penggunaan AI yang aman untuk reputasi brand.", color: "#64748B", available: true },
  { id: "influencer-dna", num: 11, title: "Influencer Matching", subtitle: "Pencocokan vibe dengan influencer menggunakan vector search.", color: "#D946EF", available: true },
  { id: "ab-testing", num: 12, title: "A/B Testing Agresif", subtitle: "Menjalankan variasi iklan masif untuk iterasi otomatis.", color: "#06B6D4", available: true },
] as const;

export default function LearnIndexPage() {
  return (
    <div className="animate-fade-in-up flex flex-col gap-14 pb-16">
      
      {/* ── Minimalist Header ──────────────────────────────────────────── */}
      <div className="max-w-[640px]">
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold text-primary tracking-[-0.04em] mb-4 leading-[1.1]">
          Kurikulum Polanitas
        </h1>
        <p className="text-[1.0625rem] text-secondary leading-relaxed">
          12 modul esensial yang dirancang secara profesional. Dari fundamental analitik hingga kepemimpinan orkestrasi AI tingkat lanjut.
        </p>
      </div>

      {/* ── Modules Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {MODULES.map((m) => {
          const Content = (
            <div
              className={`module-card relative flex flex-col h-full bg-surface border border-border rounded-[18px] transition-all overflow-hidden cursor-pointer ${m.available ? "hover:border-border-2 hover:-translate-y-1 hover:shadow-lg" : "opacity-60 grayscale-[30%] cursor-not-allowed"}`}
            >
              {/* Colored Top Block */}
              <div
                className="h-[130px] flex items-end p-5 relative overflow-hidden shrink-0"
                style={{ background: m.color }}
              >
                {/* Large Text Effect */}
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-[4.5rem] font-extrabold text-white/90 leading-[0.8] tracking-[-0.05em] font-sans">
                    {m.num}
                  </span>
                  <span className="text-[1.5rem] font-bold text-white/70">
                    mod
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-[20px_14px_10px] flex flex-col flex-1">
                <h3 className="text-[1.0625rem] font-extrabold text-primary mb-2 leading-[1.3]">
                  {m.title}
                </h3>
                <p className="text-[0.875rem] text-muted leading-relaxed mb-6 flex-1">
                  {m.subtitle}
                </p>

                {/* CTA Link */}
                <div
                  className={`flex items-center gap-1 text-[0.8125rem] font-bold ${m.available ? "" : "text-muted"}`}
                  style={{ color: m.available ? m.color : undefined }}
                >
                  {m.available ? "Pelajari" : "Segera Hadir"}
                  {m.available && <ChevronRight size={14} />}
                </div>
              </div>
            </div>
          );

          if (m.available) {
            return (
              <Link key={m.id} href={`/dashboard/learn/${m.id}`} className="no-underline">
                {Content}
              </Link>
            );
          }
          
          return <div key={m.id}>{Content}</div>;
        })}
      </div>
    </div>
  );
}
