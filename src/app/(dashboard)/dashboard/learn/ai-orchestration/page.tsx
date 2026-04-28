"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Brain,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Circle,
  Zap,
  Send,
  Bot,
  User,
  Lightbulb,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Network,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface QuizAnswer {
  questionIndex: number;
  selected: number;
  correct: boolean;
}

// ── Curriculum Data ───────────────────────────────────────────────────────────
const LESSONS = [
  {
    id: "apa-itu-dirigen",
    title: "Apa itu AI Orchestration?",
    concept: "Transformasi dari Eksekutor ke Dirigen",
    body: `Bayangkan seorang konduktor orkestra — ia tidak memainkan satu pun alat musik, namun seluruh harmoni terwujud karena arahannya. Inilah paradigma baru kepemimpinan digital: **Dirigen AI**.

Seorang pemimpin modern tidak lagi mengerjakan tugas manual satu per satu. Ia mendelegasikan, mengawasi, dan mengorkestrasi **jaringan agen otonom** yang bekerja paralel 24/7 — meneliti tren, menulis konten, menganalisis data, dan merespons audiens secara simultan.`,
    insight: "1 staf manusia + 3 agen AI = kapasitas setara tim 10 orang",
    challenge: `**STUDI KASUS:** Brand skincare lokal ingin meluncurkan kampanye untuk produk baru dalam 48 jam.

Sebagai Dirigen AI, bagaimana kamu mendelegasikan tugas ini ke tiga agen?
- Agen Riset
- Agen Strategi Konten  
- Agen Copywriting

Rancang pipeline-nya dan tentukan checkpoint yang kamu awasi!`,
    quiz: {
      question: "Apa perbedaan utama antara 'executional worker' dan 'AI orchestrator'?",
      options: [
        "Orchestrator menggunakan komputer, worker tidak",
        "Orchestrator mendelegasikan ke agen otonom dan mengawasi output, bukan mengerjakan tugas manual",
        "Orchestrator bekerja lebih cepat dari worker",
        "Keduanya sama, hanya berbeda nama jabatan",
      ],
      correct: 1,
      explanation: "Seorang AI Orchestrator berfokus pada desain pipeline, delegasi ke agen, pengawasan kualitas output, dan pengambilan keputusan strategis — bukan eksekusi teknis.",
    },
  },
  {
    id: "anatomy-pipeline",
    title: "Anatomi Pipeline Multi-Agent",
    concept: "Hierarki & Alur Komunikasi Agen",
    body: `Sebuah pipeline AI yang efektif memiliki tiga lapisan:

**1. Layer Orchestrator (Kamu)**  
Menerima tujuan bisnis, memecahnya menjadi mikro-tugas, mendistribusikan ke agen, lalu memvalidasi output akhir.

**2. Layer Agent**  
Setiap agen memiliki spesialisasi: Researcher (mengumpulkan data), Strategist (menganalisis & merekomendasikan), Copywriter (mengeksekusi narasi), Analyst (mengukur performa).

**3. Layer Tool**  
Agen mengakses tools eksternal: API TikTok, database keyword Shopee, WebGazer.js, hingga Groq untuk inference LLM.`,
    insight: "Bottleneck terbesar bukan kapasitas agen, tapi kualitas instruksi yang diberikan orchestrator",
    challenge: `**LATIHAN MAPPING:** Gambarlah (atau deskripsikan) alur pipeline untuk skenario ini:

*"Kamu memiliki data penjualan bulan lalu dan ingin mengetahui konten mana yang paling berkontribusi pada penjualan, lalu membuat strategi konten bulan depan."*

Tentukan: agen apa saja yang dibutuhkan, urutan eksekusi, dan data apa yang di-handoff antar agen.`,
    quiz: {
      question: "Mengapa 'handoff data' antar agen sangat kritis dalam pipeline multi-agent?",
      options: [
        "Karena agen tidak bisa bekerja tanpa internet",
        "Karena kualitas output agen berikutnya sangat bergantung pada kelengkapan dan akurasi data dari agen sebelumnya",
        "Karena handoff data memakan banyak biaya API",
        "Handoff data tidak penting, setiap agen bekerja mandiri",
      ],
      correct: 1,
      explanation: "Dalam pipeline, setiap agen membangun di atas output agen sebelumnya. Jika Agen Riset memberikan data yang salah, Agen Strategi akan menghasilkan rekomendasi yang menyesatkan — efek domino negatif.",
    },
  },
  {
    id: "goal-decomposition",
    title: "Dekomposisi Tujuan Bisnis",
    concept: "Dari Visi Besar ke Mikro-Tugas Agen",
    body: `Skill terpenting seorang Dirigen AI adalah **goal decomposition** — kemampuan memecah satu tujuan besar menjadi ratusan instruksi spesifik yang dapat dieksekusi agen.

**Teknik OKR untuk AI:**
- **Objective:** "Meningkatkan penjualan produk X sebesar 30% dalam 60 hari"
- **Key Result 1:** Identifikasi 50 topik konten yang relevan dengan audiens target
- **Key Result 2:** Produksi 200 variasi copy untuk A/B testing
- **Key Result 3:** Analisis performa hari ke-7, ke-30, ke-60

Setiap Key Result kemudian dipecah menjadi **task-level instructions** yang dikirim ke agen spesifik.`,
    insight: "Semakin spesifik instruksi, semakin presisi output agen — hindari instruksi ambigu",
    challenge: `**PRAKTIK DEKOMPOSISI:**

Tujuan bisnis: *"Meningkatkan awareness brand di kalangan Gen Z Jabodetabek melalui TikTok dalam 30 hari."*

Buatlah:
1. Minimal 3 Key Results yang terukur
2. Untuk setiap KR, tulis 2-3 instruksi spesifik untuk agen

Gunakan AI Lab di bawah untuk mendapatkan feedback atas draft dekomposisi kamu!`,
    quiz: {
      question: "Mengapa instruksi yang ambigu berbahaya untuk AI agent?",
      options: [
        "Agen tidak bisa membaca teks ambigu",
        "Agen akan menginterpretasikan instruksi secara literal dan menghasilkan output yang tidak sesuai ekspektasi",
        "Instruksi ambigu memperlambat kecepatan processing",
        "Agen akan meminta klarifikasi terus-menerus",
      ],
      correct: 1,
      explanation: "AI agent bekerja berdasarkan teks instruksi. Ambiguitas membuat agen membuat asumsi yang mungkin salah, menghasilkan output yang tidak aligned dengan tujuan bisnis.",
    },
  },
  {
    id: "manajemen-kualitas",
    title: "Quality Gate & Human Oversight",
    concept: "Kapan Manusia Harus Mengintervensikan",
    body: `Orkestrasi bukan berarti menyerahkan segalanya ke AI. Seorang Dirigen yang baik merancang **Quality Gates** — checkpoint wajib di mana keputusan manusia diperlukan.

**Kapan intervensi manusia WAJIB:**
- Output agen menyentuh reputasi brand (press release, crisis response)
- Keputusan dengan implikasi hukum atau keuangan besar
- Saat konflik antar rekomendasi agen tidak dapat diselesaikan otomatis
- Ketika metrik performa turun drastis di luar threshold

**Kapan bisa diotomatisasi penuh:**
- Pembuatan variasi copy iklan untuk A/B testing
- Pengumpulan dan agregasi data tren
- Scheduling dan publishing konten rutin`,
    insight: "Rule of thumb: otomatiskan tugas berulang & terukur, pertahankan oversight manusia untuk keputusan high-stakes",
    challenge: `**AUDIT WORKFLOW KAMU:**

Bayangkan workflow tim konten kamu saat ini. Identifikasi:
1. Tugas apa yang bisa LANGSUNG diotomatiskan ke agen (low-risk, repetitive)
2. Tugas apa yang perlu HUMAN-IN-THE-LOOP (approval manusia di tengah proses)
3. Tugas apa yang TETAP dikerjakan manusia sepenuhnya (high creative / high-stakes)

Tanyakan ke AI Lab untuk panduan lebih lanjut!`,
    quiz: {
      question: "Manakah contoh situasi yang PALING tepat untuk 'human-in-the-loop'?",
      options: [
        "Membuat 100 variasi judul A/B test",
        "Mengagregasi data views dari TikTok Analytics",
        "Memutuskan respons resmi brand saat ada kontroversi di media sosial",
        "Menerjemahkan caption ke 3 bahasa berbeda",
      ],
      correct: 2,
      explanation: "Respons brand saat krisis atau kontroversi memiliki implikasi reputasi yang sangat tinggi. Ini adalah keputusan high-stakes yang membutuhkan judgement manusia, meskipun AI bisa mendraft opsi responnya.",
    },
  },
  {
    id: "kasus-nyata",
    title: "Studi Kasus: Kampanye 48 Jam",
    concept: "Orkestrasi End-to-End dalam Praktik",
    body: `**Skenario:** Brand kosmetik lokal, "Luminara Beauty", butuh kampanye TikTok untuk peluncuran produk sunscreen baru dalam waktu 48 jam dengan budget tim terbatas (1 orang + 3 agen AI).

**Timeline Orkestrasi:**

**T+0 (Jam 0):** Orchestrator mendefinisikan brief: target Gen Z wanita 18-25 Jakarta, tone casual & educational, USP "SPF 50 + Skincare dalam Satu"

**T+2:** Agen Riset menganalisis 500 video TikTok skincare terpopuler 30 hari terakhir → mengidentifikasi 12 hook yang viral

**T+6:** Agen Strategi merekomendasikan 3 content angles: "Morning Routine", "Skincare vs Makeup Lover", "Anti-Kusam Challenge"

**T+12:** Agen Copywriter menghasilkan 30 variasi script untuk setiap angle → orchestrator melakukan quality gate, memilih 5 terbaik

**T+24:** Konten diproduksi, diposting, agen monitoring aktivasi untuk memantau engagement setiap 2 jam

**T+48:** Orchestrator menerima laporan performa, agen mengoptimasi jadwal posting berdasarkan data real-time`,
    insight: "Hasil: 3 video mencapai 50.000+ views dalam 48 jam pertama — capai target sebelum deadline",
    challenge: `**ROLE-PLAY:** Kamu adalah orchestrator di kampanye Luminara Beauty.

Di T+12, kamu mendapat laporan bahwa Agen Copywriter menghasilkan 30 script, tapi 8 di antaranya menggunakan klaim kesehatan yang tidak bisa diverifikasi ("Sembuhkan kulit kusam dalam 3 hari").

Apa yang kamu lakukan? Bagaimana quality gate bekerja di sini? Diskusikan dengan AI Lab!`,
    quiz: {
      question: "Dalam studi kasus Luminara Beauty, mengapa orchestrator masih melakukan quality gate di T+12?",
      options: [
        "Karena agen copywriting sudah pasti salah",
        "Untuk memastikan output agen aligned dengan brand guidelines dan bebas dari klaim yang bermasalah sebelum diproduksi",
        "Hanya untuk memilih mana yang paling panjang",
        "Karena orchestrator tidak percaya pada AI",
      ],
      correct: 1,
      explanation: "Quality gate di T+12 memastikan bahwa sebelum sumber daya produksi diinvestasikan, konten yang dipilih sudah memenuhi standar brand, etika iklan, dan tidak mengandung klaim yang berpotensi masalah hukum.",
    },
  },
  {
    id: "membangun-sop",
    title: "Merancang SOP Orkestrasi",
    concept: "Sistem yang Bisa Direplikasi & Diskalakan",
    body: `Seorang Dirigen AI yang profesional tidak hanya berhasil sekali — ia membangun **Standard Operating Procedure (SOP)** yang bisa dijalankan oleh siapa pun di timnya.

**Komponen SOP Orkestrasi:**

**1. Agent Roster** — Daftar agen beserta capability, input yang dibutuhkan, dan output yang dihasilkan

**2. Pipeline Template** — Blueprint alur untuk berbagai skenario: kampanye launching, content routine, crisis response

**3. Quality Rubric** — Kriteria evaluasi untuk setiap jenis output agen (script, strategi, laporan)

**4. Escalation Matrix** — Kondisi apa yang trigger quality gate manusia, dan siapa yang bertanggung jawab

**5. Post-Mortem Framework** — Setelah tiap kampanye, apa yang di-review untuk perbaikan pipeline berikutnya`,
    insight: "SOP yang baik membuat orkestrasi bisa berjalan bahkan saat kamu sedang tidur",
    challenge: `**PROJECT AKHIR MODUL:**

Rancang SOP mini untuk satu workflow yang paling relevan dengan bisnis/pekerjaan kamu:

1. Definisikan tujuannya
2. Tentukan pipeline agen (minimal 2 agen)
3. Buat quality rubric sederhana (3 kriteria)
4. Tentukan 1 escalation point

Upload deskripsinya ke AI Lab untuk mendapat review dan saran penyempurnaan!`,
    quiz: {
      question: "Mengapa SOP orkestrasi AI penting untuk skalabilitas bisnis?",
      options: [
        "Karena AI membutuhkan dokumen formal untuk bekerja",
        "SOP tidak penting, yang penting hasilnya bagus",
        "SOP membuat pengetahuan tidak tersentralisasi di satu orang dan pipeline bisa direplikasi, dikembangkan, dan diperbaiki secara sistematis",
        "SOP hanya dibutuhkan perusahaan besar",
      ],
      correct: 2,
      explanation: "SOP mentransfer pengetahuan dari kepala orchestrator ke sistem yang terdokumentasi — memungkinkan onboarding anggota tim baru, perbaikan iteratif, dan scaling tanpa dependensi pada satu individu.",
    },
  },
];

// ── AI Lab Component ──────────────────────────────────────────────────────────
function AILab({ lessonId }: { lessonId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "Halo! Aku AI Tutor POLANITAS untuk modul ini, bertenaga Llama 3.3 70B. Tanyakan apa saja tentang AI Orchestration Leadership — konsep, studi kasus, atau minta review atas jawaban challenge kamu!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setLoading(true);

    const result = await askModuleAI("ai-orchestration", userMessage);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.answer) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: result.answer!, timestamp: new Date() },
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.3)",
            border: "1px solid rgba(99,102,241,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={18} color="#A5B4FC" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#F8F9FA" }}>
            AI Tutor Lab
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
            Llama 3.3 70B · Konteks: AI Orchestration
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(110,225,43,0.15)",
            border: "1px solid rgba(110,225,43,0.3)",
            borderRadius: 100,
            padding: "3px 10px",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#6EE12B",
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6EE12B" }}>
            Online
          </span>
        </div>
      </div>

      {/* Chat messages */}
      <div
        style={{
          height: 360,
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "var(--color-surface-2)",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  msg.role === "ai"
                    ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                    : "var(--color-surface-3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "1px solid var(--color-border)",
              }}
            >
              {msg.role === "ai" ? (
                <Bot size={15} color="#FFF" />
              ) : (
                <User size={15} color="var(--color-text-secondary)" />
              )}
            </div>
            <div
              style={{
                maxWidth: "78%",
                padding: "12px 16px",
                borderRadius:
                  msg.role === "ai"
                    ? "4px 16px 16px 16px"
                    : "16px 4px 16px 16px",
                background:
                  msg.role === "ai"
                    ? "var(--color-surface)"
                    : "linear-gradient(135deg, #6366F1, #4F46E5)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: msg.role === "ai" ? "var(--color-text-primary)" : "#FFF",
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot size={15} color="#FFF" />
            </div>
            <div
              style={{
                padding: "14px 18px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px 16px 16px 16px",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#6366F1",
                    animation: `pulse 1.2s ${i * 0.2}s infinite`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              background: "color-mix(in srgb, var(--color-error) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8125rem",
              color: "var(--color-error)",
            }}
          >
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          gap: 10,
          background: "var(--color-surface)",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan tentang AI Orchestration, minta review challenge kamu... (Enter untuk kirim)"
          disabled={loading}
          rows={2}
          style={{
            flex: 1,
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: "0.875rem",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-sans)",
            background: "var(--color-surface-2)",
            resize: "none",
            outline: "none",
            lineHeight: 1.5,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6366F1")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background:
              loading || !input.trim() ? "var(--color-surface-3)" : "linear-gradient(135deg, #6366F1, #4F46E5)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
            alignSelf: "flex-end",
            boxShadow: !loading && input.trim() ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
          }}
        >
          <Send size={18} color={loading || !input.trim() ? "var(--color-text-muted)" : "#FFF"} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIOrchestrationPage() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<QuizAnswer | null>(null);
  const [showAILab, setShowAILab] = useState(false);

  const lesson = LESSONS[currentLesson];
  const progress = (completed.size / LESSONS.length) * 100;

  function goToLesson(idx: number) {
    setCurrentLesson(idx);
    setQuizAnswer(null);
    setShowAILab(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleQuizAnswer(optionIdx: number) {
    if (quizAnswer) return;
    const correct = optionIdx === lesson.quiz.correct;
    setQuizAnswer({ questionIndex: currentLesson, selected: optionIdx, correct });
    if (correct) setCompleted((prev) => new Set([...prev, currentLesson]));
  }

  function nextLesson() {
    if (currentLesson < LESSONS.length - 1) goToLesson(currentLesson + 1);
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{ display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Link
          href="/dashboard/learn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
        >
          <ArrowLeft size={16} /> Kembali ke Kurikulum
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            <BookOpen size={15} />
            {completed.size}/{LESSONS.length} selesai
          </div>
          <div
            style={{
              width: 120,
              height: 6,
              background: "var(--color-surface-3)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
                borderRadius: 999,
                transition: "width 0.5s ease",
                boxShadow: "0 0 8px rgba(99,102,241,0.4)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Module Header ─────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)",
          borderRadius: "var(--radius-xl)",
          padding: "32px 36px",
          marginBottom: 32,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: 100,
              padding: "4px 14px",
              marginBottom: 12,
            }}
          >
            <Brain size={13} color="#A5B4FC" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#A5B4FC", letterSpacing: "0.06em" }}>
              MODUL 1 · AI LEADERSHIP
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.375rem, 3vw, 1.875rem)", color: "#F8F9FA", letterSpacing: "-0.04em", marginBottom: 8 }}>
            Kepemimpinan Orkestrasi AI
          </h1>
          <p style={{ color: "#9CA3AF", maxWidth: 480 }}>
            Belajar menjadi Dirigen AI — mengorkestrasi jaringan agen otonom untuk kampanye yang berskala jutaan audiens.
          </p>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}>
              <BookOpen size={14} /> 6 Materi
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}>
              <Clock size={14} /> 3 jam
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#A5B4FC", fontWeight: 700 }}>
              <Zap size={14} /> AI Tutor Lab Terintegrasi
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Lesson Sidebar ──────────────────────────────── */}
        <div
          style={{
            flex: "0 0 260px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            position: "sticky",
            top: 24,
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>
            DAFTAR MATERI
          </div>
          {LESSONS.map((l, i) => {
            const isDone = completed.has(i);
            const isActive = i === currentLesson;
            return (
              <button
                key={l.id}
                onClick={() => goToLesson(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: isActive ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent",
                  background: isActive
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  width: "100%",
                }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = "var(--color-surface-2)")}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = "transparent")}
              >
                {isDone ? (
                  <CheckCircle size={16} color="#6EE12B" style={{ flexShrink: 0 }} />
                ) : (
                  <Circle
                    size={16}
                    color={isActive ? "#6366F1" : "var(--color-border-2)"}
                    style={{ flexShrink: 0 }}
                  />
                )}
                <span
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#6366F1" : isDone ? "var(--color-text-secondary)" : "var(--color-text-secondary)",
                    lineHeight: 1.4,
                  }}
                >
                  {i + 1}. {l.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Main Content ─────────────────────────────────── */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>

          {/* Lesson card */}
          <div className="premium-card" style={{ padding: 0 }}>
            {/* Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid var(--color-border)",
                background: "rgba(99,102,241,0.05)",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Brain size={22} color="#6366F1" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6366F1", letterSpacing: "0.08em", marginBottom: 4 }}>
                  MATERI {currentLesson + 1} DARI {LESSONS.length}
                </div>
                <h2 style={{ fontSize: "1.25rem", letterSpacing: "-0.02em", color: "var(--color-text-primary)", marginBottom: 2 }}>
                  {lesson.title}
                </h2>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                  {lesson.concept}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "28px" }}>
              {/* Concept text */}
              <div
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.75,
                  color: "var(--color-text-secondary)",
                  marginBottom: 24,
                  whiteSpace: "pre-wrap",
                }}
              >
                {lesson.body.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>

              {/* Insight box */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 18px",
                  background: "rgba(99,102,241,0.06)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: 28,
                }}
              >
                <Lightbulb size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 1 }} />
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-primary)",
                    fontStyle: "italic",
                    fontWeight: 600,
                    lineHeight: 1.6,
                  }}
                >
                  {lesson.insight}
                </p>
              </div>

              {/* Challenge */}
              <div
                style={{
                  padding: "20px 22px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Target size={15} color="var(--color-accent-text)" />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--color-accent-text)",
                      letterSpacing: "0.08em",
                    }}
                  >
                    TANTANGAN PRAKTIK
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: "var(--color-text-secondary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {lesson.challenge.replace(/\*\*(.*?)\*\*/g, "$1")}
                </div>
              </div>

              {/* AI Lab Toggle */}
              <button
                onClick={() => setShowAILab((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  background: showAILab
                    ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                    : "var(--color-surface-3)",
                  border: "1px solid",
                  borderColor: showAILab ? "transparent" : "var(--color-border)",
                  color: showAILab ? "#FFF" : "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: showAILab ? 20 : 0,
                  boxShadow: showAILab ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
                }}
              >
                <Zap size={15} />
                {showAILab ? "Tutup AI Tutor Lab" : "Buka AI Tutor Lab — Tanya Langsung ke AI"}
              </button>

              {/* AI Lab */}
              {showAILab && <AILab lessonId={lesson.id} />}
            </div>
          </div>

          {/* ── Quiz ─────────────────────────────────────────── */}
          <div className="premium-card" style={{ padding: 0 }}>
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--color-surface-2)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Network size={18} color="var(--color-accent-text)" />
              <span style={{ fontWeight: 800, fontSize: "1rem" }}>Cek Pemahaman</span>
              {quizAnswer && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 100,
                    background: quizAnswer.correct
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(239,68,68,0.1)",
                    color: quizAnswer.correct ? "#16A34A" : "#DC2626",
                  }}
                >
                  {quizAnswer.correct ? "✓ Benar!" : "✗ Coba lagi"}
                </span>
              )}
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "var(--color-text-primary)",
                  marginBottom: 20,
                  lineHeight: 1.5,
                }}
              >
                {lesson.quiz.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {lesson.quiz.options.map((opt, i) => {
                  const isSelected = quizAnswer?.selected === i;
                  const isCorrect = i === lesson.quiz.correct;
                  const showResult = !!quizAnswer;

                  let bg = "var(--color-surface-2)";
                  let border = "1px solid var(--color-border)";
                  let color = "var(--color-text-secondary)";

                  if (showResult && isCorrect) {
                    bg = "rgba(34,197,94,0.08)";
                    border = "1px solid rgba(34,197,94,0.4)";
                    color = "#15803D";
                  } else if (showResult && isSelected && !isCorrect) {
                    bg = "rgba(239,68,68,0.08)";
                    border = "1px solid rgba(239,68,68,0.4)";
                    color = "#B91C1C";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      disabled={!!quizAnswer}
                      style={{
                        padding: "14px 18px",
                        borderRadius: "var(--radius-md)",
                        background: bg,
                        border,
                        color,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        cursor: quizAnswer ? "not-allowed" : "pointer",
                        textAlign: "left",
                        transition: "all 0.25s",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        lineHeight: 1.5,
                      }}
                      onMouseEnter={(e) => !quizAnswer && (e.currentTarget.style.borderColor = "#6366F1")}
                      onMouseLeave={(e) => !quizAnswer && (e.currentTarget.style.borderColor = "var(--color-border)")}
                    >
                      <span
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background:
                            showResult && isCorrect
                              ? "#16A34A"
                              : showResult && isSelected && !isCorrect
                              ? "#DC2626"
                              : "var(--color-surface-3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.6875rem",
                          fontWeight: 800,
                          color:
                            (showResult && isCorrect) || (showResult && isSelected && !isCorrect)
                              ? "#FFF"
                              : "var(--color-text-muted)",
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswer && (
                <div
                  style={{
                    marginTop: 20,
                    padding: "16px 18px",
                    background: quizAnswer.correct
                      ? "rgba(34,197,94,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: `1px solid ${quizAnswer.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: quizAnswer.correct ? "#16A34A" : "#DC2626",
                      marginBottom: 6,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {quizAnswer.correct ? "✓ PENJELASAN" : "✗ PENJELASAN"}
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {lesson.quiz.explanation}
                  </p>
                </div>
              )}

              {!quizAnswer && (
                <p style={{ marginTop: 16, fontSize: "0.75rem", color: "var(--color-text-muted)", textAlign: "center" }}>
                  Pilih jawaban untuk melanjutkan
                </p>
              )}
            </div>
          </div>

          {/* ── Navigation ──────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button
              onClick={() => goToLesson(currentLesson - 1)}
              disabled={currentLesson === 0}
              className="btn btn-secondary"
              style={{ gap: 8, opacity: currentLesson === 0 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>

            {currentLesson < LESSONS.length - 1 ? (
              <button
                onClick={nextLesson}
                disabled={!quizAnswer}
                className="btn btn-primary"
                style={{
                  gap: 8,
                  background: quizAnswer ? "linear-gradient(135deg, #6366F1, #4F46E5)" : undefined,
                  opacity: quizAnswer ? 1 : 0.5,
                  boxShadow: quizAnswer ? "0 4px 16px rgba(99,102,241,0.3)" : "none",
                }}
              >
                Materi Berikutnya <ChevronRight size={16} />
              </button>
            ) : (
              <Link
                href="/dashboard/learn"
                className="btn btn-primary"
                style={{ gap: 8, background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
              >
                Selesai! Kembali ke Kurikulum <CheckCircle size={16} />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
