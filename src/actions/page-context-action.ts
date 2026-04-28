"use server";

/**
 * POLANITAS — Page-Aware AI Assistant (Voice)
 */

import { getGeneralClient, GROQ_MODEL } from "@/lib/groq-client";
import { isQuestion as _isQuestion } from "@/lib/speech-utils";

// ── Page context definitions ──────────────────────────────────────────────────
const PAGE_CONTEXTS: Record<string, string> = {
  "/dashboard": `
Ini adalah halaman Dashboard utama POLANITAS.
Di sini user bisa melihat statistik belajar mereka (jumlah modul tersedia, modul yang sedang berjalan, dan status AI Tutor Lab).
User bisa mencari modul lewat kolom pencarian, memfilter berdasarkan level (Fundamental, Menengah, Lanjutan, Populer, Terbaru), dan membuka modul apa pun dari carousel horizontal.
Di panel kanan ada daftar modul yang sedang aktif beserta progress belajar, promo banner untuk melihat kurikulum lengkap, dan tombol untuk memulai Simulasi Agen AI.
Total tersedia 12 modul pembelajaran.
  `.trim(),

  "/dashboard/learn": `
Ini adalah halaman Kurikulum / Materi POLANITAS.
Semua 12 modul pembelajaran tersedia di sini:
1. Orkestrasi AI — Menjadi dirigen jaringan agen (Fundamental)
2. Deteksi Tren Dini — Sinyal tren TikTok sebelum viral (Menengah)
3. Whitespace Marketplace — Celah pasar Shopee & Tokopedia (Menengah)
4. Eye Tracking Mastery — F-Pattern, WebGazer, Heatmap (Lanjutan)
5. Copywriting LLM — 1.000 variasi caption via Llama 3 (Menengah)
6. Content Atomization — 1 ide menjadi Reels, TikTok, Live (Menengah)
7. Neuromarketing — Dashboard keputusan 30 detik (Lanjutan)
8. Manajemen Krisis — Respon sentimen otomatis (Lanjutan)
9. Atribusi ROI — Engagement ke sales marketplace (Lanjutan)
10. Etika AI & Brand Safety — Guardrails, UU PDP, Compliance (Fundamental)
11. Influencer DNA Matching — Vibe matching dengan vector search (Lanjutan)
12. A/B Testing Agresif — 50 variasi iklan, iterasi otomatis (Lanjutan)
User bisa membuka modul mana saja dengan menyebut nomornya.
  `.trim(),

  "/dashboard/sessions": `
Ini adalah halaman Sesi Riset POLANITAS.
Di sini user bisa memulai sesi riset baru menggunakan 3 AI Agent (Researcher, Strategist, Analyst).
User perlu mengisi: topik atau produk yang ingin diriset, memilih platform (TikTok, YouTube, Instagram, Shopee, Tokopedia), memilih fokus riset (Tren Konten, Whitespace Produk, Analisis Kompetitor, Strategi Hashtag, atau Segmentasi Audiens), memilih region (Indonesia, Malaysia, Singapura, Amerika), dan opsional mengisi deskripsi target audiens.
Setelah memulai, tiga agen AI akan berjalan secara berurutan dan hasilnya bisa dipantau secara real-time.
Di bawah form ada riwayat semua sesi riset sebelumnya.
  `.trim(),

  "/dashboard/heatmaps": `
Ini adalah halaman Heatmap Eye Tracking POLANITAS.
Di sini user bisa melihat visualisasi heatmap dari data eye tracking yang dikumpulkan selama sesi riset.
Heatmap menunjukkan area mana yang paling banyak dilihat oleh audiens saat membaca konten.
  `.trim(),

  "/dashboard/researcher": `
Ini adalah halaman Researcher Agent.
Agent Researcher bertugas mengumpulkan data tren, sinyal pasar, dan informasi kompetitor sesuai topik yang diberikan.
Hasilnya menjadi input untuk Agent Strategist.
  `.trim(),

  "/dashboard/strategist": `
Ini adalah halaman Strategist Agent.
Agent Strategist mengolah hasil riset dari Researcher dan merancang strategi konten yang optimal — termasuk pilihan format, jadwal posting, dan angle pemasaran.
Hasilnya diteruskan ke Agent Analyst untuk evaluasi akhir.
  `.trim(),

  "/dashboard/analyst": `
Ini adalah halaman Analyst Agent.
Agent Analyst mensintesis data dari Researcher dan Strategist, lalu melakukan evaluasi mendalam menggunakan simulasi heatmap visual.
Hasilnya adalah laporan komprehensif berisi rekomendasi konten berbasis data.
  `.trim(),

  "/dashboard/reports": `
Ini adalah halaman Laporan.
Di sini tersimpan semua laporan hasil analisis dari sesi riset yang sudah selesai.
User bisa mereview hasil kerja tiga AI Agent dalam format yang terstruktur.
  `.trim(),

  // ── Module contexts ──────────────────────────────────────────────────────
  "/dashboard/learn/ai-orchestration": `
Ini adalah Modul 1: Orkestrasi AI — Menjadi Dirigen Jaringan Agen.
Level: Fundamental. Terdiri dari 6 pelajaran, estimasi 3 jam.
Topik yang dibahas:
- Apa itu orchestration dalam sistem AI multi-agent
- Bagaimana membangun pipeline agen yang saling terhubung
- Pola desain: Sequential, Parallel, dan Hierarchical orchestration
- Membuat dirigen (orchestrator) yang mengontrol kapan agen berjalan
- Handling error dan fallback antar agen
- Studi kasus: pipeline 3 agen POLANITAS (Researcher → Strategist → Analyst)
Setelah menyelesaikan modul ini, user bisa merancang sistem multi-agent sendiri.
  `.trim(),

  "/dashboard/learn/trend-signal": `
Ini adalah Modul 2: Deteksi Tren Dini — Sinyal Tren TikTok Sebelum Viral.
Level: Menengah. Terdiri dari 6 pelajaran, estimasi 2,5 jam.
Topik yang dibahas:
- Cara kerja algoritma TikTok dalam mendistribusikan konten
- Membedakan noise dari sinyal tren yang nyata
- Tool dan teknik: social listening, hashtag velocity, engagement rate analysis
- Menggunakan AI untuk memproses data tren secara massal
- Identifikasi micro-trend sebelum mencapai puncak viral
- Membangun sistem alert tren otomatis
  `.trim(),

  "/dashboard/learn/marketplace-whitespace": `
Ini adalah Modul 3: Whitespace Marketplace — Celah Pasar Shopee & Tokopedia.
Level: Menengah. Terdiri dari 5 pelajaran, estimasi 2 jam.
Topik yang dibahas:
- Apa itu whitespace dan mengapa penting untuk seller
- Analisis gap antara demand konsumen dan supply produk
- Teknik riset keyword dengan volume tinggi tapi kompetisi rendah
- Membaca data penjualan dan review untuk menemukan peluang
- Strategi masuk ke celah pasar yang ditemukan
  `.trim(),

  "/dashboard/learn/eye-tracking": `
Ini adalah Modul 4: Eye Tracking Mastery — F-Pattern, WebGazer, Heatmap.
Level: Lanjutan. Terdiri dari 9 pelajaran, estimasi 4 jam.
Topik yang dibahas:
- Psikologi visual: bagaimana mata manusia membaca konten
- F-Pattern dan Z-Pattern dalam desain konten
- Implementasi WebGazer.js untuk eye tracking berbasis browser
- Mengumpulkan dan memvisualisasikan data gaze points
- Menganalisis heatmap untuk mengoptimalkan tata letak konten
- Mengintegrasikan data eye tracking dengan analisis engagement
  `.trim(),

  "/dashboard/learn/llm-copywriting": `
Ini adalah Modul 5: Copywriting LLM — 1.000 Variasi Caption via Llama 3.
Level: Menengah. Terdiri dari 7 pelajaran, estimasi 3 jam.
Topik yang dibahas:
- Arsitektur prompt yang efektif untuk copywriting (Framework CRISP)
- Personalisasi caption per segmen audiens menggunakan LLM
- Viral Hook Engineering: rumus Hook × CTA × Urgency
- Membuat ratusan variasi caption yang tetap konsisten dengan brand voice
- A/B testing copy menggunakan AI
- Mengintegrasikan tone of voice ke dalam prompt sistem
  `.trim(),
};

// (isQuestion is exported from @/lib/speech-utils for client-side use)
export async function askAboutPage(
  pathname: string,
  question: string
): Promise<{ answer: string }> {
  // Find the most specific matching context
  const context =
    PAGE_CONTEXTS[pathname] ??
    // Try prefix match (e.g. /dashboard/sessions/[id])
    Object.entries(PAGE_CONTEXTS).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Halaman ini adalah bagian dari platform POLANITAS untuk edukasi Data Analyst.";

  const groq = getGeneralClient();

  const systemPrompt = `
Kamu adalah asisten suara POLANITAS, platform edukasi Data Analyst berbasis AI Agent.
Tugasmu adalah menjawab pertanyaan user tentang konten halaman saat ini.

ATURAN PENTING:
- Jawab dalam Bahasa Indonesia yang natural dan jelas
- Maksimal 4 kalimat — jawaban harus ringkas agar nyaman didengar lewat text-to-speech
- Jangan gunakan bullet points, markdown, atau format yang tidak natural diucapkan
- Jika pertanyaan tentang modul, jelaskan topik-topiknya secara conversational
- Jika user minta "ajarkan", mulai dengan topik pertama dan tawarkan untuk lanjut

KONTEKS HALAMAN SAAT INI:
${context}
  `.trim();

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.6,
    max_tokens: 300,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
  });

  const answer = response.choices[0]?.message?.content ?? "Maaf, saya tidak bisa menjawab saat ini.";
  return { answer };
}
