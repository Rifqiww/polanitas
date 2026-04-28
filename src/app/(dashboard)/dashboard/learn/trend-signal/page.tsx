"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
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
  Search,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage { role: "user" | "ai"; content: string; timestamp: Date; }
interface QuizAnswer { questionIndex: number; selected: number; correct: boolean; }

// ── Curriculum Data ───────────────────────────────────────────────────────────
const LESSONS = [
  {
    id: "noise-vs-signal",
    title: "Noise vs. Sinyal Tren",
    concept: "Membedakan Hype Semu dari Tren Nyata",
    body: `Di lautan data sosial media, 95% dari apa yang kamu lihat adalah **noise** — fluktuasi acak, berita sesaat, dan trending topic yang mati dalam 24 jam. Hanya 5% yang merupakan **sinyal tren nyata** yang layak untuk diinvestasikan sebagai strategi konten.

Noise memiliki karakteristik: lonjakan tajam lalu jatuh kembali ke baseline, tidak ada korelasi lintas platform, dan biasanya dipicu oleh satu event spesifik. Sinyal tren sebaliknya: pertumbuhan gradual yang konsisten, muncul di multiple platform secara bersamaan, dan didukung oleh perubahan perilaku audiens yang lebih dalam.

Sebagai analis konten, kemampuan membedakan keduanya adalah **competitive advantage** terbesar. Brand yang bisa mendeteksi sinyal 2-4 minggu lebih awal dari kompetitor bisa menjadi first-mover dan mendapatkan organic reach yang masif sebelum pasar jenuh.`,
    insight: "Brand yang mendeteksi tren 2 minggu lebih awal mendapat 3-5x organic reach dibanding late-mover",
    challenge: `**LATIHAN DETEKSI:** Buka TikTok Creative Center dan pilih 3 keyword dari niche kamu. Amati: apakah grafiknya menunjukkan lonjakan tajam (noise) atau pertumbuhan stabil (sinyal)? Klasifikasikan masing-masing!`,
    quiz: {
      question: "Keyword 'AI Skincare' menunjukkan pertumbuhan stabil 15% per minggu selama 6 minggu di TikTok dan Google Trends. Apa kesimpulannya?",
      options: [
        "Ini noise karena pertumbuhannya kecil (hanya 15%/minggu)",
        "Ini sinyal tren nyata — pertumbuhan konsisten lintas platform menunjukkan perubahan minat yang sustain",
        "Tidak bisa ditentukan tanpa melihat jumlah views absolut",
        "Ini sudah terlambat, tren 6 minggu berarti sudah jenuh",
      ],
      correct: 1,
      explanation: "Pertumbuhan stabil 15%/minggu selama 6 minggu (bukan lonjakan tajam) yang terjadi di multiple platform adalah indikator klasik sinyal tren nyata. Compound growth 15%/minggu selama 6 minggu = pertumbuhan total ~132%.",
    },
  },
  {
    id: "velocity-acceleration",
    title: "Velocity & Acceleration Tren",
    concept: "Mengukur Kecepatan Pertumbuhan Topik",
    body: `**Velocity** mengukur seberapa cepat sebuah topik tumbuh — jumlah mention atau views per satuan waktu. Tapi velocity saja tidak cukup. Yang lebih penting adalah **acceleration** — apakah velocity-nya meningkat, stabil, atau menurun?

Bayangkan dua keyword: "Serum Retinol" mendapat 10.000 mention minggu ini (sama dengan minggu lalu). "Bakuchiol" mendapat 3.000 mention minggu ini (naik dari 1.500 minggu lalu). Meskipun Retinol punya volume lebih besar, Bakuchiol punya acceleration 100% — ini sinyal first-mover opportunity.

Formula sederhana: **Acceleration = (V₂ - V₁) / V₁ × 100%**. Dalam praktik, kamu mencari topik dengan acceleration positif yang konsisten selama minimal 3 periode berturut-turut.`,
    insight: "Acceleration > 50% selama 3 minggu berturut-turut = sinyal tren paling kuat di data sosial media",
    challenge: `**HITUNG ACCELERATION:** Dataset views keyword "AI Beauty" per minggu: [2100, 3400, 5800, 9200]. Hitung acceleration minggu ke minggu dan tentukan apakah ini sinyal tren!`,
    quiz: {
      question: "Keyword A: 50.000 views (stabil). Keyword B: 5.000 views (naik 80%/minggu). Mana yang lebih menarik untuk strategi konten?",
      options: [
        "Keyword A karena volume lebih besar secara absolut",
        "Keyword B karena acceleration tinggi menunjukkan potensi pertumbuhan eksponensial",
        "Keduanya sama baiknya",
        "Tidak bisa dibandingkan tanpa data engagement rate",
      ],
      correct: 1,
      explanation: "Keyword B dengan acceleration 80%/minggu akan melampaui Keyword A dalam beberapa minggu (5000 × 1.8⁴ ≈ 52.000 di minggu ke-4). First-mover advantage di topik yang sedang berakselerasi jauh lebih bernilai daripada bersaing di topik yang sudah saturated.",
    },
  },
  {
    id: "cross-platform",
    title: "Validasi Lintas Platform",
    concept: "TikTok × Google Trends × Marketplace",
    body: `Sinyal tren yang paling reliable muncul secara **simultan di multiple platform**. Ini disebut **cross-platform validation** — ketika sebuah topik trending di TikTok, sekaligus naik di Google Trends, dan menunjukkan peningkatan search volume di marketplace (Shopee/Tokopedia).

Framework validasi: **TikTok** = leading indicator (tren muncul di sini paling awal). **Google Trends** = confirmation signal (menunjukkan minat pencarian meningkat). **Marketplace Search** = commercial intent signal (orang mulai mencari untuk membeli).

Jika sebuah topik hanya trending di TikTok tapi flat di Google Trends dan marketplace — itu kemungkinan besar noise/entertainment, bukan tren yang bisa dimonetisasi. Sebaliknya, jika ketiga platform menunjukkan pertumbuhan bersamaan, kamu memiliki **high-confidence signal** untuk investasi konten.`,
    insight: "Tren yang tervalidasi di 3+ platform memiliki probabilitas 85% bertahan lebih dari 3 bulan",
    challenge: `**CROSS-PLATFORM CHECK:** Pilih satu topik yang sedang trending di TikTok kamu. Cek apakah topik itu juga naik di Google Trends Indonesia dan di pencarian Shopee. Dokumentasikan hasilnya!`,
    quiz: {
      question: "Topik 'Sunscreen Korea' trending di TikTok tapi flat di Google Trends dan Shopee. Apa interpretasinya?",
      options: [
        "Ini tren yang kuat, segera buat konten tentang sunscreen Korea",
        "Ini kemungkinan noise/entertainment — viral sesaat di TikTok tapi belum menunjukkan commercial intent",
        "Google Trends dan Shopee selalu ketinggalan, jadi TikTok cukup sebagai indikator",
        "Artinya tren sudah berlalu dan kita terlambat",
      ],
      correct: 1,
      explanation: "Sinyal yang hanya muncul di satu platform (TikTok) tanpa konfirmasi dari platform lain biasanya merupakan noise/hiburan sesaat. Tanpa peningkatan search intent (Google) dan buying intent (Marketplace), risiko investasi konten terlalu tinggi.",
    },
  },
  {
    id: "early-detection-framework",
    title: "Framework Deteksi Dini",
    concept: "Sistem Monitoring Tren Otomatis",
    body: `Seorang Dirigen AI tidak menunggu tren datang — ia membangun **sistem deteksi dini** yang berjalan 24/7. Framework ini terdiri dari tiga lapisan:

**Layer 1 — Data Collection (Agen Riset):** Monitoring otomatis terhadap keyword seed list (50-100 keyword inti niche kamu) di TikTok Creative Center, Google Trends API, dan Shopee Keyword Tool. Frekuensi: harian.

**Layer 2 — Signal Scoring (Agen Analis):** Setiap keyword diberi skor berdasarkan: velocity (bobot 30%), acceleration (bobot 40%), dan cross-platform confirmation (bobot 30%). Keyword dengan skor di atas threshold masuk ke "watchlist".

**Layer 3 — Strategic Action (Agen Strategi):** Keyword di watchlist yang bertahan 3+ hari secara otomatis di-escalate ke orchestrator untuk keputusan: buat konten segera, monitor lebih lanjut, atau abaikan.

Dengan framework ini, kamu tidak lagi reaktif terhadap tren — kamu menjadi **proaktif**, mendeteksi sinyal 2-4 minggu sebelum kompetitor sadar.`,
    insight: "Sistem deteksi dini yang baik menghasilkan 60-70% konten yang 'tepat waktu' vs. 15-20% tanpa sistem",
    challenge: `**RANCANG SISTEM KAMU:** Buat daftar 10 keyword seed untuk niche kamu. Tentukan: platform mana yang kamu monitoring, frekuensi pengecekan, dan threshold skor yang membuat kamu take action. Tanyakan ke AI Lab untuk review!`,
    quiz: {
      question: "Dalam framework deteksi dini, mengapa acceleration diberi bobot paling besar (40%)?",
      options: [
        "Karena acceleration paling mudah dihitung",
        "Karena acceleration menunjukkan momentum pertumbuhan — topik yang berakselerasi memiliki potensi paling besar untuk menjadi tren besar",
        "Karena velocity dan cross-platform tidak penting",
        "Bobot 40% adalah standar industri yang tidak bisa diubah",
      ],
      correct: 1,
      explanation: "Acceleration mengindikasikan momentum — apakah minat terhadap topik semakin kuat over time. Volume tinggi (velocity) tanpa akselerasi bisa berarti topik sudah mature/jenuh. Cross-platform penting tapi baru relevan setelah ada momentum yang terukur.",
    },
  },
];

// ── Trend Bubble Visualization ────────────────────────────────────────────────
function TrendBubbleViz() {
  const [keywords, setKeywords] = useState(["", "", ""]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ keyword: string; score: number; type: "trend" | "noise" }[] | null>(null);

  function analyze() {
    const filled = keywords.filter((k) => k.trim());
    if (filled.length === 0) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResults(
        filled.map((k) => {
          const hash = k.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
          const score = 20 + (hash % 80);
          return { keyword: k, score, type: score > 55 ? "trend" : "noise" };
        })
      );
      setAnalyzing(false);
    }, 1500);
  }

  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: "1rem" }}>Trend Signal Detector</div>
          <div className="caption" style={{ marginTop: 4 }}>Masukkan keyword untuk analisis sinyal vs. noise</div>
        </div>
        <Icon icon="solar:stars-bold-duotone" width={24} color="#F97316" />
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {keywords.map((kw, i) => (
            <input
              key={i}
              value={kw}
              onChange={(e) => { const n = [...keywords]; n[i] = e.target.value; setKeywords(n); }}
              placeholder={`Keyword ${i + 1}`}
              className="input"
              style={{ flex: "1 1 140px", minWidth: 120 }}
            />
          ))}
        </div>
        <button onClick={analyze} disabled={analyzing || keywords.every((k) => !k.trim())} className="btn btn-primary" style={{ gap: 8, alignSelf: "flex-start" }}>
          <Search size={15} /> {analyzing ? "Menganalisis..." : "Analisis Sinyal"}
        </button>

        {/* Bubble Visualization */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 32, minHeight: 220, flexWrap: "wrap", padding: "20px 0" }}
            >
              {results.map((r, i) => {
                const size = 60 + r.score * 1.4;
                const isTrend = r.type === "trend";
                return (
                  <motion.div
                    key={r.keyword}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      boxShadow: isTrend
                        ? ["0 0 0px #F97316", "0 0 30px rgba(249,115,22,0.5)", "0 0 0px #F97316"]
                        : "0 0 0px transparent",
                    }}
                    transition={{
                      scale: { delay: i * 0.2, type: "spring", stiffness: 200 },
                      boxShadow: { repeat: Infinity, duration: 2 },
                    }}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: "50%",
                      background: isTrend
                        ? "linear-gradient(135deg, #F97316, #EA580C)"
                        : "linear-gradient(135deg, var(--color-surface-3), var(--color-border))",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "default",
                      border: isTrend ? "2px solid #F97316" : "2px solid var(--color-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: isTrend ? "#FFF" : "var(--color-text-muted)", textAlign: "center", padding: "0 6px", lineHeight: 1.2 }}>
                      {r.keyword}
                    </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: isTrend ? "#FFF" : "var(--color-text-secondary)", marginTop: 2 }}>
                      {r.score}
                    </span>
                    <span style={{ fontSize: "0.55rem", fontWeight: 700, color: isTrend ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {isTrend ? "SINYAL" : "NOISE"}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {results && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{ padding: "14px 16px", background: "var(--color-accent-subtle)", border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)", borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-accent-text)" }}>Insight AI:</strong>{" "}
              {results.filter((r) => r.type === "trend").length > 0
                ? `Keyword "${results.filter((r) => r.type === "trend").map((r) => r.keyword).join(", ")}" menunjukkan sinyal tren dengan skor tinggi. Pertimbangkan untuk membuat konten tentang topik ini dalam 1-2 minggu ke depan sebelum kompetitor.`
                : "Semua keyword menunjukkan karakteristik noise — fluktuasi tanpa momentum. Lanjutkan monitoring atau coba keyword lain."}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── AI Lab Component ──────────────────────────────────────────────────────────
function AILab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", content: "Halo! Aku AI Tutor POLANITAS untuk modul Deteksi Tren Dini. Tanyakan apa saja tentang cara mendeteksi sinyal tren, menghitung velocity/acceleration, atau validasi lintas platform!", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput(""); setError(null);
    setMessages((p) => [...p, { role: "user", content: userMessage, timestamp: new Date() }]);
    setLoading(true);
    const result = await askModuleAI("trend-signal", userMessage);
    setLoading(false);
    if (result.error) setError(result.error);
    else if (result.answer) setMessages((p) => [...p, { role: "ai", content: result.answer!, timestamp: new Date() }]);
  }

  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(249,115,22,0.3)", border: "1px solid rgba(249,115,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Bot size={18} color="#FDBA74" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#F8F9FA" }}>AI Tutor Lab</div>
          <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Llama 3.3 70B · Konteks: Deteksi Tren</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(110,225,43,0.15)", border: "1px solid rgba(110,225,43,0.3)", borderRadius: 100, padding: "3px 10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE12B", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6EE12B" }}>Online</span>
        </div>
      </div>
      <div style={{ height: 360, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--color-surface-2)" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "ai" ? "linear-gradient(135deg, #F97316, #EA580C)" : "var(--color-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--color-border)" }}>
              {msg.role === "ai" ? <Bot size={15} color="#FFF" /> : <User size={15} color="var(--color-text-secondary)" />}
            </div>
            <div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: msg.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px", background: msg.role === "ai" ? "var(--color-surface)" : "linear-gradient(135deg, #F97316, #EA580C)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ fontSize: "0.875rem", color: msg.role === "ai" ? "var(--color-text-primary)" : "#FFF", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                {msg.content.replace(/\*\*(.*?)\*\*/g, "$1")}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={15} color="#FFF" />
            </div>
            <div style={{ padding: "14px 18px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "4px 16px 16px 16px", display: "flex", gap: 6 }}>
              {[0, 1, 2].map((ii) => (<div key={ii} style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", animation: `pulse 1.2s ${ii * 0.2}s infinite`, opacity: 0.6 }} />))}
            </div>
          </div>
        )}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "color-mix(in srgb, var(--color-error) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", color: "var(--color-error)" }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--color-border)", display: "flex", gap: 10, background: "var(--color-surface)" }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Tanyakan tentang deteksi tren..." disabled={loading} rows={2} style={{ flex: 1, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "0.875rem", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", background: "var(--color-surface-2)", resize: "none", outline: "none", lineHeight: 1.5 }} />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: loading || !input.trim() ? "var(--color-surface-3)" : "linear-gradient(135deg, #F97316, #EA580C)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0, alignSelf: "flex-end" }}>
          <Send size={18} color={loading || !input.trim() ? "var(--color-text-muted)" : "#FFF"} />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrendSignalPage() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<QuizAnswer | null>(null);
  const [showAILab, setShowAILab] = useState(false);

  const lesson = LESSONS[currentLesson];
  const progress = (completed.size / LESSONS.length) * 100;

  function goToLesson(idx: number) { setCurrentLesson(idx); setQuizAnswer(null); setShowAILab(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function handleQuizAnswer(optionIdx: number) { if (quizAnswer) return; const correct = optionIdx === lesson.quiz.correct; setQuizAnswer({ questionIndex: currentLesson, selected: optionIdx, correct }); if (correct) setCompleted((p) => new Set([...p, currentLesson])); }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <Link href="/dashboard/learn" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
          <ArrowLeft size={16} /> Kembali ke Kurikulum
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--color-text-muted)" }}><BookOpen size={15} />{completed.size}/{LESSONS.length} selesai</div>
          <div style={{ width: 120, height: 6, background: "var(--color-surface-3)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #F97316, #EA580C)", borderRadius: 999, transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      {/* Module Header */}
      <div style={{ background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)", borderRadius: "var(--radius-xl)", padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: 100, padding: "4px 14px", marginBottom: 12 }}>
            <TrendingUp size={13} color="#FDBA74" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FDBA74", letterSpacing: "0.06em" }}>MODUL 2 · TREND DETECTION</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.375rem, 3vw, 1.875rem)", color: "#F8F9FA", letterSpacing: "-0.04em", marginBottom: 8 }}>Deteksi Sinyal Tren Dini</h1>
          <p style={{ color: "#9CA3AF", maxWidth: 480 }}>Belajar mendeteksi noise vs. sinyal tren nyata sebelum kompetitor menyadarinya.</p>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}><BookOpen size={14} /> 4 Materi</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}><Clock size={14} /> 2.5 jam</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#FDBA74", fontWeight: 700 }}><Zap size={14} /> AI Tutor Lab</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Sidebar */}
        <div style={{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: 6, position: "sticky", top: 24 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>DAFTAR MATERI</div>
          {LESSONS.map((l, i) => {
            const isDone = completed.has(i); const isActive = i === currentLesson;
            return (
              <button key={l.id} onClick={() => goToLesson(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-md)", border: isActive ? "1px solid rgba(249,115,22,0.5)" : "1px solid transparent", background: isActive ? "rgba(249,115,22,0.1)" : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.2s", width: "100%", fontFamily: "var(--font-sans)" }}>
                {isDone ? <CheckCircle size={16} color="#6EE12B" style={{ flexShrink: 0 }} /> : <Circle size={16} color={isActive ? "#F97316" : "var(--color-border-2)"} style={{ flexShrink: 0 }} />}
                <span style={{ fontSize: "0.8125rem", fontWeight: isActive ? 700 : 500, color: isActive ? "#F97316" : "var(--color-text-secondary)", lineHeight: 1.4 }}>{i + 1}. {l.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          {/* Lesson Card */}
          <div className="premium-card" style={{ padding: 0 }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--color-border)", background: "rgba(249,115,22,0.05)", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TrendingUp size={22} color="#F97316" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#F97316", letterSpacing: "0.08em", marginBottom: 4 }}>MATERI {currentLesson + 1} DARI {LESSONS.length}</div>
                <h2 style={{ fontSize: "1.25rem", letterSpacing: "-0.02em", color: "var(--color-text-primary)", marginBottom: 2 }}>{lesson.title}</h2>
                <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{lesson.concept}</div>
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--color-text-secondary)", marginBottom: 24, whiteSpace: "pre-wrap" }}>{lesson.body.replace(/\*\*(.*?)\*\*/g, "$1")}</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "var(--radius-md)", marginBottom: 28 }}>
                <Lightbulb size={18} color="#F97316" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", fontStyle: "italic", fontWeight: 600, lineHeight: 1.6 }}>{lesson.insight}</p>
              </div>

              {/* Interactive Visualization */}
              <div style={{ marginBottom: 28 }}><TrendBubbleViz /></div>

              {/* Challenge */}
              <div style={{ padding: "20px 22px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Target size={15} color="var(--color-accent-text)" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent-text)", letterSpacing: "0.08em" }}>TANTANGAN PRAKTIK</span>
                </div>
                <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g, "$1")}</div>
              </div>

              {/* AI Lab Toggle */}
              <button onClick={() => setShowAILab((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: "var(--radius-md)", background: showAILab ? "linear-gradient(135deg, #F97316, #EA580C)" : "var(--color-surface-3)", border: "1px solid", borderColor: showAILab ? "transparent" : "var(--color-border)", color: showAILab ? "#FFF" : "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: showAILab ? 20 : 0, fontFamily: "var(--font-sans)" }}>
                <Zap size={15} /> {showAILab ? "Tutup AI Tutor Lab" : "Buka AI Tutor Lab — Tanya Langsung ke AI"}
              </button>
              {showAILab && <AILab />}
            </div>
          </div>

          {/* Quiz */}
          <div className="premium-card" style={{ padding: 0 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", display: "flex", alignItems: "center", gap: 10 }}>
              <TrendingUp size={18} color="var(--color-accent-text)" />
              <span style={{ fontWeight: 800, fontSize: "1rem" }}>Cek Pemahaman</span>
              {quizAnswer && <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: 100, background: quizAnswer.correct ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: quizAnswer.correct ? "#16A34A" : "#DC2626" }}>{quizAnswer.correct ? "✓ Benar!" : "✗ Coba lagi"}</span>}
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)", marginBottom: 20, lineHeight: 1.5 }}>{lesson.quiz.question}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {lesson.quiz.options.map((opt, i) => {
                  const isSelected = quizAnswer?.selected === i; const isCorrect = i === lesson.quiz.correct; const showResult = !!quizAnswer;
                  let bg = "var(--color-surface-2)"; let border = "1px solid var(--color-border)"; let color = "var(--color-text-secondary)";
                  if (showResult && isCorrect) { bg = "rgba(34,197,94,0.08)"; border = "1px solid rgba(34,197,94,0.4)"; color = "#15803D"; }
                  else if (showResult && isSelected && !isCorrect) { bg = "rgba(239,68,68,0.08)"; border = "1px solid rgba(239,68,68,0.4)"; color = "#B91C1C"; }
                  return (
                    <button key={i} onClick={() => handleQuizAnswer(i)} disabled={!!quizAnswer} style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", background: bg, border, color, fontSize: "0.875rem", fontWeight: 500, cursor: quizAnswer ? "not-allowed" : "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", background: showResult && isCorrect ? "#16A34A" : showResult && isSelected && !isCorrect ? "#DC2626" : "var(--color-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 800, color: (showResult && isCorrect) || (showResult && isSelected) ? "#FFF" : "var(--color-text-muted)", flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizAnswer && (
                <div style={{ marginTop: 20, padding: "16px 18px", background: quizAnswer.correct ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${quizAnswer.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: quizAnswer.correct ? "#16A34A" : "#DC2626", marginBottom: 6, letterSpacing: "0.06em" }}>{quizAnswer.correct ? "✓ PENJELASAN" : "✗ PENJELASAN"}</div>
                  <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>{lesson.quiz.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button onClick={() => goToLesson(currentLesson - 1)} disabled={currentLesson === 0} className="btn btn-secondary" style={{ gap: 8, opacity: currentLesson === 0 ? 0.4 : 1 }}><ChevronLeft size={16} /> Sebelumnya</button>
            {currentLesson < LESSONS.length - 1 ? (
              <button onClick={() => goToLesson(currentLesson + 1)} disabled={!quizAnswer} className="btn btn-primary" style={{ gap: 8, opacity: quizAnswer ? 1 : 0.5 }}>Materi Berikutnya <ChevronRight size={16} /></button>
            ) : (
              <Link href="/dashboard/learn" className="btn btn-primary" style={{ gap: 8 }}>Selesai! Kembali ke Kurikulum <CheckCircle size={16} /></Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
