"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import {
  ShoppingBag,
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
  AlertCircle,
} from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";

interface ChatMessage { role: "user" | "ai"; content: string; timestamp: Date; }
interface QuizAnswer { questionIndex: number; selected: number; correct: boolean; }

const ACCENT = "#10B981";
const ACCENT_LIGHT = "rgba(16,185,129,";

const LESSONS = [
  {
    id: "apa-whitespace",
    title: "Apa itu Whitespace Marketplace",
    concept: "Celah Pasar yang Belum Tergarap",
    body: `**Whitespace** dalam konteks marketplace digital adalah area di mana **demand (permintaan) tinggi tapi supply konten/produk masih rendah**. Ini adalah zona emas bagi kreator dan seller — kompetisi rendah berarti biaya akuisisi murah dan organic visibility tinggi.

Di Shopee dan Tokopedia, whitespace bisa berupa: keyword dengan search volume tinggi tapi sedikit produk yang mengoptimasi SEO-nya, kategori produk yang trending tapi belum banyak review/konten edukatif, atau niche yang belum digarap oleh seller besar.

Menemukan whitespace bukan keberuntungan — ini adalah **proses analitik** yang bisa disistematiskan. Dengan tools yang tepat dan framework yang disiplin, kamu bisa secara konsisten menemukan peluang sebelum pasar menjadi ramai.`,
    insight: "Seller yang masuk ke whitespace 1 bulan lebih awal rata-rata mendapat 4x organic traffic dibanding late-mover",
    challenge: `**EKSPLORASI:** Buka Shopee Keyword Tool dan cari 5 keyword di niche kamu. Catat: search volume, jumlah produk yang muncul, dan rata-rata rating produk teratas. Mana yang menunjukkan tanda whitespace?`,
    quiz: {
      question: "Keyword 'serum bakuchiol' memiliki 12.000 pencarian/bulan di Shopee tapi hanya 45 produk yang muncul. Apa artinya?",
      options: [
        "Terlalu sedikit produk berarti tidak ada market untuk keyword ini",
        "Ini adalah whitespace — demand tinggi tapi supply rendah, peluang besar untuk masuk",
        "Kita harus menunggu sampai lebih banyak produk muncul baru ikut berjualan",
        "12.000 pencarian terlalu kecil untuk dijadikan target",
      ],
      correct: 1,
      explanation: "Rasio 12.000 pencarian vs 45 produk menunjukkan gap besar antara demand dan supply. Ini adalah sinyal whitespace klasik — peluang mendapat organic visibility tinggi dengan kompetisi rendah.",
    },
  },
  {
    id: "matriks-kompetisi",
    title: "Matriks Kompetisi vs. Demand",
    concept: "Framework Kuadran untuk Identifikasi Peluang",
    body: `Framework paling efektif untuk menemukan whitespace adalah **Matriks 2×2 Kompetisi-Demand**:

**Kuadran 1 — Red Ocean (Kanan Atas):** Demand tinggi, Kompetisi tinggi. Contoh: "skincare Korea". Butuh budget besar untuk bersaing.

**Kuadran 2 — Whitespace (Kiri Atas):** Demand tinggi, Kompetisi rendah. Ini target utama. Contoh: keyword long-tail yang belum dioptimasi seller besar.

**Kuadran 3 — Dead Zone (Kiri Bawah):** Demand rendah, Kompetisi rendah. Tidak layak karena pasarnya terlalu kecil.

**Kuadran 4 — Trap (Kanan Bawah):** Demand rendah, Kompetisi tinggi. Hindari — banyak seller tapi sedikit pembeli.

Tujuan kita: **konsisten menemukan keyword dan produk di Kuadran 2**, lalu bergerak cepat sebelum kuadran itu bergeser ke Red Ocean.`,
    insight: "80% seller fokus di Red Ocean. Top 5% seller menghabiskan waktu 2-3 jam/minggu secara khusus mencari Whitespace",
    challenge: `**MAPPING KUADRAN:** Ambil 10 keyword dari niche kamu. Plot masing-masing ke dalam matriks 2×2 berdasarkan volume pencarian (Y) dan jumlah kompetitor (X). Berapa yang masuk Whitespace?`,
    quiz: {
      question: "Keyword di kuadran 'Dead Zone' (demand rendah, kompetisi rendah) apakah selalu harus dihindari?",
      options: [
        "Ya, selalu hindari karena tidak ada pasar",
        "Tidak selalu — bisa menjadi emerging trend yang belum mainstream, perlu validasi dengan data tren",
        "Dead Zone adalah tempat terbaik karena tidak ada kompetisi",
        "Hanya hindari jika kompetisinya lebih dari 100 produk",
      ],
      correct: 1,
      explanation: "Dead Zone kadang berisi keyword yang baru muncul (emerging trend) yang belum terdeteksi mainstream. Cross-check dengan data tren dari Modul 2 — jika acceleration-nya positif, ini bisa jadi whitespace masa depan.",
    },
  },
  {
    id: "keyword-mining",
    title: "Teknik Mining Keyword Long-Tail",
    concept: "Menemukan Niche dalam Niche",
    body: `Keyword long-tail adalah **variasi spesifik dari keyword umum** yang biasanya memiliki: volume lebih kecil tapi conversion rate jauh lebih tinggi, dan kompetisi yang sangat rendah.

Contoh transformasi: "serum wajah" (volume tinggi, kompetisi gila) → "serum vitamin C untuk kulit berjerawat" (volume sedang, kompetisi rendah) → "serum bakuchiol retinol alternative sensitive skin" (volume kecil tapi buyer intent sangat tinggi).

**Teknik mining keyword long-tail:**  
1. **Autocomplete Mining** — Ketik keyword utama di search bar Shopee/Tokopedia, catat semua saran autocomplete  
2. **Review Mining** — Baca review produk kompetitor, catat bahasa yang digunakan buyer  
3. **Question Mining** — Lihat pertanyaan di Q&A produk kompetitor, setiap pertanyaan = potensi keyword  
4. **Variation Stacking** — Kombinasikan atribut: bahan + masalah kulit + tipe kulit + harga`,
    insight: "Keyword long-tail 4+ kata memiliki conversion rate 2.5x lebih tinggi dari keyword generic 1-2 kata",
    challenge: `**MINING CHALLENGE:** Pilih 1 keyword utama. Lakukan autocomplete mining di Shopee, temukan minimal 8 variasi long-tail. Urutkan berdasarkan potensi whitespace!`,
    quiz: {
      question: "Mana teknik yang PALING efektif untuk menemukan bahasa alami yang digunakan buyer?",
      options: [
        "Autocomplete Mining — karena langsung dari search bar",
        "Review Mining — karena buyer menulis dengan bahasa alami tentang masalah dan kebutuhan mereka",
        "Keyword Planner — karena memberikan volume pasti",
        "Melihat judul produk kompetitor",
      ],
      correct: 1,
      explanation: "Review Mining memberikan insight langsung ke bahasa alami buyer — bagaimana mereka mendeskripsikan masalah, kebutuhan, dan harapan mereka. Ini menghasilkan keyword yang sangat spesifik dan high-intent.",
    },
  },
  {
    id: "first-mover",
    title: "Strategi First-Mover di Celah Pasar",
    concept: "Eksekusi Cepat Sebelum Window Tertutup",
    body: `Menemukan whitespace baru setengah perjuangan. **Eksekusi cepat** adalah kunci — window of opportunity di marketplace digital biasanya hanya bertahan **4-8 minggu** sebelum kompetitor besar masuk.

**Framework First-Mover Execution:**

**Minggu 1 — Validasi & Listing:** Buat produk/konten dengan SEO yang sudah dioptimasi untuk keyword whitespace. Fokus pada kualitas foto dan deskripsi yang menjawab intent pencarian.

**Minggu 2-3 — Review Building:** Agresif kumpulkan review positif. Di marketplace, produk dengan 50+ review mendominasi search result. Gunakan follow-up message otomatis.

**Minggu 4-6 — Content Moat:** Buat konten edukatif di TikTok/Instagram tentang topik whitespace. Ini membangun authority dan membuat organic traffic dari luar marketplace.

**Minggu 7-8 — Defendable Position:** Ketika kompetitor mulai masuk, kamu sudah punya review, rating, dan content authority. Switching cost bagi buyer menjadi tinggi.`,
    insight: "First-mover di whitespace marketplace memiliki 70% probabilitas mempertahankan posisi Top 5 meski kompetitor masuk kemudian",
    challenge: `**RANCANG TIMELINE:** Pilih satu whitespace yang kamu temukan dari latihan sebelumnya. Buat timeline 8 minggu dengan milestone spesifik untuk setiap minggu!`,
    quiz: {
      question: "Mengapa 'content moat' penting dalam strategi first-mover marketplace?",
      options: [
        "Karena konten membuat produk terlihat lebih mahal",
        "Karena konten edukatif di platform external membangun authority dan organic traffic yang sulit ditiru kompetitor",
        "Karena marketplace mewajibkan seller membuat konten",
        "Content moat tidak penting jika produknya bagus",
      ],
      correct: 1,
      explanation: "Content moat menciptakan barrier of entry yang intangible. Ketika buyer sudah terbiasa melihat konten edukatif dari brand kamu tentang topik tertentu, mereka membentuk asosiasi mental yang sulit digeser oleh kompetitor yang datang belakangan.",
    },
  },
];

// ── Quadrant Matrix Visualization ─────────────────────────────────────────────
function QuadrantViz() {
  const [competition, setCompetition] = useState(30);
  const [volume, setVolume] = useState(70);

  const dotX = (competition / 100) * 280 + 30;
  const dotY = (1 - volume / 100) * 240 + 20;

  const getQuadrant = () => {
    if (volume > 50 && competition <= 50) return { name: "WHITESPACE", icon: "solar:target-bold-duotone", color: ACCENT, desc: "Demand tinggi, kompetisi rendah — zona emas!" };
    if (volume > 50 && competition > 50) return { name: "RED OCEAN", icon: "solar:danger-bold-duotone", color: "#EF4444", desc: "Demand tinggi tapi kompetisi sangat ketat" };
    if (volume <= 50 && competition <= 50) return { name: "DEAD ZONE", icon: "solar:ghost-bold-duotone", color: "#6B7280", desc: "Demand dan kompetisi rendah — perlu validasi tren" };
    return { name: "TRAP", icon: "solar:forbidden-circle-bold-duotone", color: "#F59E0B", desc: "Kompetisi tinggi tapi demand rendah — hindari!" };
  };
  const quad = getQuadrant();

  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem" }}>Matriks Kompetisi-Demand Interaktif</div>
        <div className="caption" style={{ marginTop: 4 }}>Geser slider untuk melihat posisi kuadran</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label className="label">Tingkat Kompetisi: {competition}%</label>
            <input type="range" min={0} max={100} value={competition} onChange={(e) => setCompetition(+e.target.value)} style={{ width: "100%", accentColor: "#EF4444", cursor: "grab" }} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label className="label">Volume Pencarian: {volume}%</label>
            <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(+e.target.value)} style={{ width: "100%", accentColor: ACCENT, cursor: "grab" }} />
          </div>
        </div>

        {/* Matrix */}
        <div style={{ position: "relative", width: "100%", maxWidth: 340, height: 280, margin: "0 auto", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          {/* Quadrant labels */}
          <div style={{ position: "absolute", left: 10, top: 10, fontSize: "0.6rem", fontWeight: 700, color: ACCENT, opacity: 0.6 }}>WHITESPACE</div>
          <div style={{ position: "absolute", right: 10, top: 10, fontSize: "0.6rem", fontWeight: 700, color: "#EF4444", opacity: 0.6 }}>RED OCEAN</div>
          <div style={{ position: "absolute", left: 10, bottom: 10, fontSize: "0.6rem", fontWeight: 700, color: "#6B7280", opacity: 0.6 }}>DEAD ZONE</div>
          <div style={{ position: "absolute", right: 10, bottom: 10, fontSize: "0.6rem", fontWeight: 700, color: "#F59E0B", opacity: 0.6 }}>TRAP</div>
          {/* Grid lines */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--color-border)", opacity: 0.5 }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--color-border)", opacity: 0.5 }} />
          {/* Axis labels */}
          <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Kompetisi →</div>
          <div style={{ position: "absolute", left: 2, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: "0.6rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Demand →</div>
          {/* Dot */}
          <motion.div
            animate={{ left: dotX, top: dotY }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ position: "absolute", width: 20, height: 20, borderRadius: "50%", background: quad.color, border: "3px solid #FFF", boxShadow: `0 0 16px ${quad.color}80`, transform: "translate(-50%, -50%)", zIndex: 10 }}
          />
        </div>

        {/* Result */}
        <motion.div key={quad.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20, padding: "14px 16px", background: `${quad.color}10`, border: `1px solid ${quad.color}30`, borderRadius: "var(--radius-sm)", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: "1rem", color: quad.color, marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon icon={quad.icon} width={20} />
            {quad.name}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>{quad.desc}</div>
        </motion.div>
      </div>
    </div>
  );
}

// ── AI Lab ─────────────────────────────────────────────────────────────────────
function AILab() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ai", content: "Halo! Aku AI Tutor untuk modul Whitespace Marketplace. Tanyakan tentang cara menemukan celah pasar, teknik mining keyword, atau strategi first-mover!", timestamp: new Date() }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  async function handleSend() {
    if (!input.trim() || loading) return; const userMessage = input.trim(); setInput(""); setError(null);
    setMessages((p) => [...p, { role: "user", content: userMessage, timestamp: new Date() }]); setLoading(true);
    const result = await askModuleAI("marketplace-whitespace", userMessage); setLoading(false);
    if (result.error) setError(result.error); else if (result.answer) setMessages((p) => [...p, { role: "ai", content: result.answer!, timestamp: new Date() }]);
  }
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${ACCENT_LIGHT}0.3)`, border: `1px solid ${ACCENT_LIGHT}0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={18} color={ACCENT} /></div>
        <div><div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#F8F9FA" }}>AI Tutor Lab</div><div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Konteks: Whitespace Marketplace</div></div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(110,225,43,0.15)", border: "1px solid rgba(110,225,43,0.3)", borderRadius: 100, padding: "3px 10px" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE12B", animation: "pulse 2s infinite" }} /><span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6EE12B" }}>Online</span></div>
      </div>
      <div style={{ height: 360, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--color-surface-2)" }}>
        {messages.map((msg, i) => (<div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "ai" ? `linear-gradient(135deg, ${ACCENT}, #059669)` : "var(--color-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--color-border)" }}>{msg.role === "ai" ? <Bot size={15} color="#FFF" /> : <User size={15} color="var(--color-text-secondary)" />}</div><div style={{ maxWidth: "78%", padding: "12px 16px", borderRadius: msg.role === "ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px", background: msg.role === "ai" ? "var(--color-surface)" : `linear-gradient(135deg, ${ACCENT}, #059669)`, border: "1px solid var(--color-border)" }}><div style={{ fontSize: "0.875rem", color: msg.role === "ai" ? "var(--color-text-primary)" : "#FFF", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.content.replace(/\*\*(.*?)\*\*/g, "$1")}</div></div></div>))}
        {loading && <div style={{ display: "flex", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${ACCENT}, #059669)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Bot size={15} color="#FFF" /></div><div style={{ padding: "14px 18px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "4px 16px 16px 16px", display: "flex", gap: 6 }}>{[0,1,2].map(ii => <div key={ii} style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, animation: `pulse 1.2s ${ii*0.2}s infinite`, opacity: 0.6 }} />)}</div></div>}
        {error && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "color-mix(in srgb, var(--color-error) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-error) 30%, transparent)", borderRadius: "var(--radius-md)", fontSize: "0.8125rem", color: "var(--color-error)" }}><AlertCircle size={15} />{error}</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--color-border)", display: "flex", gap: 10, background: "var(--color-surface)" }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}} placeholder="Tanyakan tentang whitespace marketplace..." disabled={loading} rows={2} style={{ flex: 1, border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: "0.875rem", color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", background: "var(--color-surface-2)", resize: "none", outline: "none", lineHeight: 1.5 }} />
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: loading || !input.trim() ? "var(--color-surface-3)" : `linear-gradient(135deg, ${ACCENT}, #059669)`, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0, alignSelf: "flex-end" }}><Send size={18} color={loading || !input.trim() ? "var(--color-text-muted)" : "#FFF"} /></button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketplaceWhitespacePage() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<QuizAnswer | null>(null);
  const [showAILab, setShowAILab] = useState(false);
  const lesson = LESSONS[currentLesson];
  const progress = (completed.size / LESSONS.length) * 100;
  function goToLesson(idx: number) { setCurrentLesson(idx); setQuizAnswer(null); setShowAILab(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function handleQuizAnswer(i: number) { if (quizAnswer) return; const correct = i === lesson.quiz.correct; setQuizAnswer({ questionIndex: currentLesson, selected: i, correct }); if (correct) setCompleted((p) => new Set([...p, currentLesson])); }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <Link href="/dashboard/learn" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}><ArrowLeft size={16} /> Kembali ke Kurikulum</Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: "var(--color-text-muted)" }}><BookOpen size={15} />{completed.size}/{LESSONS.length} selesai</div>
          <div style={{ width: 120, height: 6, background: "var(--color-surface-3)", borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${ACCENT}, #059669)`, borderRadius: 999, transition: "width 0.5s ease" }} /></div>
        </div>
      </div>

      <div style={{ background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)", borderRadius: "var(--radius-xl)", padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_LIGHT}0.3) 0%, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT_LIGHT}0.2)`, border: `1px solid ${ACCENT_LIGHT}0.4)`, borderRadius: 100, padding: "4px 14px", marginBottom: 12 }}>
            <ShoppingBag size={13} color="#6EE7B7" />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.06em" }}>MODUL 3 · MARKETPLACE</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.375rem, 3vw, 1.875rem)", color: "#F8F9FA", letterSpacing: "-0.04em", marginBottom: 8 }}>Whitespace Marketplace</h1>
          <p style={{ color: "#9CA3AF", maxWidth: 480 }}>Menemukan celah pasar di Shopee & Tokopedia sebelum kompetitor menyadarinya.</p>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}><BookOpen size={14} /> 4 Materi</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#9CA3AF" }}><Clock size={14} /> 2 jam</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "#6EE7B7", fontWeight: 700 }}><Zap size={14} /> AI Tutor Lab</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: 6, position: "sticky", top: 24 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "0.08em", marginBottom: 8 }}>DAFTAR MATERI</div>
          {LESSONS.map((l, i) => { const isDone = completed.has(i); const isActive = i === currentLesson; return (
            <button key={l.id} onClick={() => goToLesson(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-md)", border: isActive ? `1px solid ${ACCENT_LIGHT}0.5)` : "1px solid transparent", background: isActive ? `${ACCENT_LIGHT}0.1)` : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.2s", width: "100%", fontFamily: "var(--font-sans)" }}>
              {isDone ? <CheckCircle size={16} color="#6EE12B" style={{ flexShrink: 0 }} /> : <Circle size={16} color={isActive ? ACCENT : "var(--color-border-2)"} style={{ flexShrink: 0 }} />}
              <span style={{ fontSize: "0.8125rem", fontWeight: isActive ? 700 : 500, color: isActive ? ACCENT : "var(--color-text-secondary)", lineHeight: 1.4 }}>{i+1}. {l.title}</span>
            </button>); })}
        </div>

        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>
          <div className="premium-card" style={{ padding: 0 }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--color-border)", background: `${ACCENT_LIGHT}0.05)`, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: `${ACCENT_LIGHT}0.15)`, border: `1px solid ${ACCENT_LIGHT}0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ShoppingBag size={22} color={ACCENT} strokeWidth={2} /></div>
              <div><div style={{ fontSize: "0.6875rem", fontWeight: 700, color: ACCENT, letterSpacing: "0.08em", marginBottom: 4 }}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{ fontSize: "1.25rem", letterSpacing: "-0.02em", color: "var(--color-text-primary)", marginBottom: 2 }}>{lesson.title}</h2><div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{lesson.concept}</div></div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--color-text-secondary)", marginBottom: 24, whiteSpace: "pre-wrap" }}>{lesson.body.replace(/\*\*(.*?)\*\*/g, "$1")}</div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", background: `${ACCENT_LIGHT}0.06)`, border: `1px solid ${ACCENT_LIGHT}0.2)`, borderRadius: "var(--radius-md)", marginBottom: 28 }}>
                <Lightbulb size={18} color={ACCENT} style={{ flexShrink: 0, marginTop: 1 }} /><p style={{ fontSize: "0.875rem", color: "var(--color-text-primary)", fontStyle: "italic", fontWeight: 600, lineHeight: 1.6 }}>{lesson.insight}</p>
              </div>
              <div style={{ marginBottom: 28 }}><QuadrantViz /></div>
              <div style={{ padding: "20px 22px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><Target size={15} color="var(--color-accent-text)" /><span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-accent-text)", letterSpacing: "0.08em" }}>TANTANGAN PRAKTIK</span></div>
                <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g, "$1")}</div>
              </div>
              <button onClick={() => setShowAILab(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: "var(--radius-md)", background: showAILab ? `linear-gradient(135deg, ${ACCENT}, #059669)` : "var(--color-surface-3)", border: "1px solid", borderColor: showAILab ? "transparent" : "var(--color-border)", color: showAILab ? "#FFF" : "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: showAILab ? 20 : 0, fontFamily: "var(--font-sans)" }}><Zap size={15} /> {showAILab ? "Tutup AI Tutor Lab" : "Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab && <AILab />}
            </div>
          </div>

          <div className="premium-card" style={{ padding: 0 }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)", display: "flex", alignItems: "center", gap: 10 }}>
              <ShoppingBag size={18} color="var(--color-accent-text)" /><span style={{ fontWeight: 800, fontSize: "1rem" }}>Cek Pemahaman</span>
              {quizAnswer && <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, padding: "2px 10px", borderRadius: 100, background: quizAnswer.correct ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: quizAnswer.correct ? "#16A34A" : "#DC2626" }}>{quizAnswer.correct ? "✓ Benar!" : "✗ Coba lagi"}</span>}
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary)", marginBottom: 20, lineHeight: 1.5 }}>{lesson.quiz.question}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {lesson.quiz.options.map((opt, i) => { const isSelected = quizAnswer?.selected === i; const isCorrect = i === lesson.quiz.correct; const sr = !!quizAnswer; let bg = "var(--color-surface-2)"; let border = "1px solid var(--color-border)"; let color = "var(--color-text-secondary)"; if (sr && isCorrect) { bg = "rgba(34,197,94,0.08)"; border = "1px solid rgba(34,197,94,0.4)"; color = "#15803D"; } else if (sr && isSelected && !isCorrect) { bg = "rgba(239,68,68,0.08)"; border = "1px solid rgba(239,68,68,0.4)"; color = "#B91C1C"; } return (
                  <button key={i} onClick={() => handleQuizAnswer(i)} disabled={!!quizAnswer} style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", background: bg, border, color, fontSize: "0.875rem", fontWeight: 500, cursor: quizAnswer ? "not-allowed" : "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>
                    <span style={{ width: 24, height: 24, borderRadius: "50%", background: sr && isCorrect ? "#16A34A" : sr && isSelected ? "#DC2626" : "var(--color-surface-3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 800, color: (sr && isCorrect) || (sr && isSelected) ? "#FFF" : "var(--color-text-muted)", flexShrink: 0 }}>{String.fromCharCode(65+i)}</span>{opt}
                  </button>); })}
              </div>
              {quizAnswer && <div style={{ marginTop: 20, padding: "16px 18px", background: quizAnswer.correct ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${quizAnswer.correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "var(--radius-md)" }}><div style={{ fontSize: "0.75rem", fontWeight: 700, color: quizAnswer.correct ? "#16A34A" : "#DC2626", marginBottom: 6, letterSpacing: "0.06em" }}>{quizAnswer.correct ? "✓ PENJELASAN" : "✗ PENJELASAN"}</div><p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--color-text-secondary)" }}>{lesson.quiz.explanation}</p></div>}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button onClick={() => goToLesson(currentLesson - 1)} disabled={currentLesson === 0} className="btn btn-secondary" style={{ gap: 8, opacity: currentLesson === 0 ? 0.4 : 1 }}><ChevronLeft size={16} /> Sebelumnya</button>
            {currentLesson < LESSONS.length - 1 ? <button onClick={() => goToLesson(currentLesson + 1)} disabled={!quizAnswer} className="btn btn-primary" style={{ gap: 8, opacity: quizAnswer ? 1 : 0.5 }}>Materi Berikutnya <ChevronRight size={16} /></button> : <Link href="/dashboard/learn" className="btn btn-primary" style={{ gap: 8 }}>Selesai! Kembali ke Kurikulum <CheckCircle size={16} /></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
