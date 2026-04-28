"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Eye, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role: "user"|"ai"; content: string; timestamp: Date; }
interface QuizAnswer { questionIndex: number; selected: number; correct: boolean; }
const C = "#0EA5E9"; const CL = "rgba(14,165,233,";
const LESSONS = [
  { id: "f-pattern", title: "F-Pattern & Z-Pattern", concept: "Bagaimana Mata Membaca Layar Digital", body: `Riset eye-tracking menunjukkan bahwa pengguna web membaca konten dalam pola yang sangat prediktif. Dua pola paling dominan adalah **F-Pattern** dan **Z-Pattern**.

**F-Pattern** terjadi pada halaman berbasis teks: mata bergerak horizontal di baris pertama, turun sedikit lalu horizontal lagi (lebih pendek), lalu scanning vertikal ke bawah di sisi kiri. Implikasinya: informasi terpenting harus berada di baris pertama dan sisi kiri.

**Z-Pattern** terjadi pada halaman dengan sedikit teks dan banyak visual: mata bergerak dari kiri atas ke kanan atas, diagonal ke kiri bawah, lalu horizontal ke kanan bawah. Ini adalah pola alami untuk landing page dan iklan visual.

Memahami pola ini memungkinkan kamu menempatkan elemen – headline, CTA, harga, benefit utama – di posisi yang secara neurologis paling mungkin dilihat pertama kali oleh audiens.`, insight: "93% pengguna pertama kali melihat area top-left halaman — di sinilah brand identity dan headline utama harus berada", challenge: "**ANALISIS:** Buka 3 landing page brand yang kamu kagumi. Tandai di mana headline, CTA, dan gambar utama ditempatkan. Apakah mengikuti F-Pattern atau Z-Pattern?", quiz: { question: "Sebuah halaman produk Shopee menampilkan harga diskon di pojok kanan bawah. Berdasarkan eye-tracking, apa masalahnya?", options: ["Tidak masalah, buyer pasti akan scroll sampai bawah", "Harga diskon di kanan bawah merupakan area 'terakhir dilihat' di kedua pola, sehingga banyak user tidak menyadarinya", "Posisi kanan bawah justru bagus karena menjadi kesan terakhir", "Eye-tracking tidak relevan untuk halaman marketplace"], correct: 1, explanation: "Dalam F-Pattern maupun Z-Pattern, area kanan bawah adalah zona 'cold spot' — area yang paling sedikit mendapat atensi visual. Informasi kritis seperti harga diskon harus ditempatkan di hot spots: top-left atau inline dengan headline." } },
  { id: "fixation-points", title: "Fixation Points & Saccades", concept: "Memahami Mekanisme Mata Manusia", body: `Mata manusia tidak bergerak smooth saat membaca — ia melakukan **saccades** (lompatan cepat antar titik) dan **fixations** (jeda 200-300ms di mana informasi benar-benar diproses).

**Fixation points** adalah titik tempat mata berhenti dan otak memproses informasi visual. Rata-rata, pengguna melakukan 3-4 fixation points per detik saat browsing. Area dengan fixation density tertinggi adalah area yang paling efektif menyampaikan pesan.

Dalam konteks konten digital: **Wajah manusia** adalah magnet fixation terkuat — mata secara otomatis tertarik ke wajah dan mengikuti arah tatapan orang di foto. **Teks berukuran besar** mendapat fixation lebih lama. **Kontras warna tinggi** memaksa saccade ke area tersebut.

Dengan memahami fixation patterns, kamu bisa mendesain thumbnail, banner, dan landing page yang secara kognitif 'memaksa' mata melihat elemen yang kamu inginkan.`, insight: "Thumbnail dengan wajah manusia yang menatap langsung ke produk meningkatkan fixation pada produk sebesar 84%", challenge: "**EKSPERIMEN:** Minta teman melihat 3 thumbnail berbeda masing-masing 3 detik. Tanyakan elemen apa yang paling mereka ingat. Bandingkan hasilnya dengan teori fixation points!", quiz: { question: "Kenapa wajah manusia sangat efektif sebagai elemen visual di thumbnail?", options: ["Karena wajah membuat konten terlihat profesional", "Karena otak manusia memiliki area khusus (fusiform face area) yang secara otomatis memproses dan memprioritaskan wajah di atas elemen visual lain", "Karena algoritma TikTok memprioritaskan konten dengan wajah", "Wajah sebenarnya tidak lebih efektif dari elemen visual lain"], correct: 1, explanation: "Fusiform Face Area di otak adalah area yang secara evolusioner wired untuk mendeteksi wajah dengan sangat cepat. Ini terjadi secara pre-attentive — sebelum kamu sadar melihatnya. Inilah mengapa wajah menjadi magnet fixation terkuat." } },
  { id: "visual-hierarchy", title: "Hierarki Visual untuk Konten", concept: "Mengarahkan Mata dengan Desain", body: `**Hierarki visual** adalah teknik menata elemen desain sehingga mata pengguna mengikuti urutan yang kamu inginkan — dari yang paling penting ke yang kurang penting.

Empat alat utama hierarki visual:
1. **Ukuran** — Elemen lebih besar dilihat duluan. Headline > subheadline > body text.
2. **Warna & Kontras** — Warna yang menonjol dari background menarik fixation. CTA dengan warna kontras mendapat 32% lebih banyak klik.
3. **Posisi** — Area F-Pattern hot spots (top-left, horizontal atas) untuk elemen kritis.
4. **Whitespace** — Ruang kosong di sekitar elemen membuat elemen itu lebih menonjol.

Kesalahan umum: menempatkan terlalu banyak elemen dengan prioritas visual yang sama — ini menyebabkan **cognitive overload** dan pengguna justru tidak fokus pada apa pun.`, insight: "Mengurangi elemen visual di landing page dari 7 menjadi 3 meningkatkan conversion rate rata-rata 28%", challenge: "**REDESAIN:** Ambil screenshot konten/banner yang kamu buat. Identifikasi: apakah ada hierarki visual yang jelas? Berapa 'level' prioritas yang bisa kamu identifikasi? Idealnya maksimal 3 level.", quiz: { question: "Sebuah banner memiliki 5 elemen CTA dengan ukuran dan warna yang sama. Apa dampaknya?", options: ["Memberikan banyak pilihan ke user = bagus", "Menyebabkan cognitive overload — user tidak bisa menentukan prioritas dan conversion menurun", "Tidak ada dampak karena user akan membaca semuanya", "Hanya berdampak di mobile, bukan desktop"], correct: 1, explanation: "Paradox of choice: terlalu banyak opsi dengan prioritas visual sama menyebabkan decision paralysis. Hicks Law menunjukkan bahwa waktu pengambilan keputusan meningkat logaritmik dengan jumlah pilihan." } },
  { id: "layout-optimization", title: "Optimasi Layout Berbasis Data", concept: "Dari Teori ke Implementasi Iteratif", body: `Memahami teori eye-tracking tidak cukup — kamu perlu **mengimplementasikan dan mengiterasi** berdasarkan data performance nyata dari konten kamu.

**Framework Optimasi Layout:**

**Step 1 — Audit:** Analisis konten existing. Di mana elemen kritis berada? Apakah sesuai dengan pola eye-tracking?

**Step 2 — Hypothesis:** Berdasarkan teori (F-Pattern, fixation points, hierarki visual), rancang perubahan spesifik. Contoh: "Memindahkan CTA dari bawah ke inline dengan headline akan meningkatkan CTR."

**Step 3 — A/B Test:** Jalankan versi original vs. versi baru secara paralel. Ukur metrik: CTR, dwell time, bounce rate.

**Step 4 — Analyze & Iterate:** Versi mana yang menang? Mengapa? Gunakan insight ini untuk iterasi berikutnya.

Siklus ini harus berjalan terus — desain yang optimal hari ini bisa tidak efektif dalam 3 bulan karena perubahan perilaku audiens.`, insight: "Tim yang menjalankan audit layout setiap 2 minggu mendapat 40% improvement CTR dalam 3 bulan", challenge: "**ACTION PLAN:** Ambil satu konten kamu yang performa-nya paling rendah. Buat 2 hipotesis layout berdasarkan prinsip eye-tracking yang kamu pelajari. Diskusikan dengan AI Lab!", quiz: { question: "Setelah A/B test, versi B menang dengan CTR +15% tapi bounce rate naik 20%. Apa langkah terbaik?", options: ["Deploy versi B karena CTR lebih tinggi", "Kembali ke versi A karena bounce rate naik", "Investigasi mengapa bounce rate naik — mungkin CTA menarik klik tapi konten landing page tidak sesuai ekspektasi", "A/B test-nya gagal, ulangi dari awal"], correct: 2, explanation: "CTR naik tapi bounce rate naik menunjukkan disconnect antara promise (visual/CTA) dan delivery (landing page content). Solusinya bukan memilih salah satu versi, tapi mengoptimasi landing page agar sesuai dengan ekspektasi yang dibangun oleh versi B." } },
];

function HeatmapViz() {
  const [clicks, setClicks] = useState<{x:number;y:number;id:number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect(); if (!rect) return;
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    setClicks(p => [...p, { x, y, id: ++idRef.current }].slice(-15));
  }, []);
  const getZoneAnalysis = () => {
    if (clicks.length === 0) return null;
    const last = clicks[clicks.length - 1]; const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null; const px = last.x / rect.width; const py = last.y / rect.height;
    if (px < 0.5 && py < 0.33) return { zone: "Hot Zone (Top-Left)", tip: "Area dengan atensi tertinggi. Ideal untuk headline, logo, atau benefit utama.", color: "#EF4444" };
    if (px >= 0.5 && py < 0.33) return { zone: "Warm Zone (Top-Right)", tip: "Zona kedua F-Pattern. Cocok untuk CTA atau visual hook.", color: "#F59E0B" };
    if (py >= 0.33 && py < 0.66) return { zone: "Middle Zone", tip: "Zona scanning. Gunakan bullet points atau icons untuk menahan atensi.", color: "#0EA5E9" };
    return { zone: "Cold Zone (Bottom)", tip: "Area dengan atensi terendah. Hindari menaruh informasi kritis di sini.", color: "#6B7280" };
  };
  const analysis = getZoneAnalysis();
  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem" }}>Heatmap Simulator</div>
        <div className="caption" style={{ marginTop: 4 }}>Klik area wireframe untuk simulasi eye-tracking heatmap</div>
      </div>
      <div style={{ padding: 24 }}>
        <div ref={containerRef} onClick={handleClick} style={{ position: "relative", width: "100%", height: 300, background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", cursor: "crosshair", overflow: "hidden", userSelect: "none" }}>
          {/* Wireframe elements */}
          <div style={{ position: "absolute", top: 16, left: 16, width: "40%", height: 14, background: "var(--color-border-2)", borderRadius: 4, opacity: 0.6 }} />
          <div style={{ position: "absolute", top: 16, right: 16, width: 60, height: 14, background: "var(--color-border-2)", borderRadius: 4, opacity: 0.4 }} />
          <div style={{ position: "absolute", top: 48, left: 16, width: "70%", height: 20, background: "var(--color-border)", borderRadius: 4, opacity: 0.5 }} />
          <div style={{ position: "absolute", top: 80, left: 16, width: "55%", height: 10, background: "var(--color-border)", borderRadius: 3, opacity: 0.3 }} />
          <div style={{ position: "absolute", top: 96, left: 16, width: "60%", height: 10, background: "var(--color-border)", borderRadius: 3, opacity: 0.3 }} />
          <div style={{ position: "absolute", top: 130, left: 16, width: "45%", height: 100, background: "var(--color-border)", borderRadius: 8, opacity: 0.2 }} />
          <div style={{ position: "absolute", top: 130, right: 16, width: "40%", height: 100, background: "var(--color-border)", borderRadius: 8, opacity: 0.2 }} />
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: 100, height: 32, background: "var(--color-border-2)", borderRadius: 6, opacity: 0.4 }} />
          {/* Click ripples */}
          <AnimatePresence>
            {clicks.map(c => (
              <motion.div key={c.id} initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 3, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ position: "absolute", left: c.x - 20, top: c.y - 20, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(249,115,22,0.3) 40%, transparent 70%)", pointerEvents: "none" }} />
            ))}
          </AnimatePresence>
          {clicks.map(c => (<div key={`dot-${c.id}`} style={{ position: "absolute", left: c.x - 4, top: c.y - 4, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "2px solid #FFF", pointerEvents: "none", zIndex: 2 }} />))}
        </div>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={analysis.zone} style={{ marginTop: 16, padding: "14px 16px", background: `${analysis.color}10`, border: `1px solid ${analysis.color}30`, borderRadius: "var(--radius-sm)" }}>
            <div style={{ fontWeight: 800, fontSize: "0.875rem", color: analysis.color, marginBottom: 4 }}>{analysis.zone}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{analysis.tip}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AILab() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ai", content: "Halo! Aku AI Tutor untuk modul Psikologi Visual & Eye Tracking. Tanyakan tentang F-Pattern, fixation points, atau optimasi layout!", timestamp: new Date() }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  async function handleSend() { if (!input.trim()||loading) return; const um=input.trim(); setInput(""); setError(null); setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]); setLoading(true); const r=await askModuleAI("eye-tracking",um); setLoading(false); if(r.error)setError(r.error); else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]); }
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${CL}0.3)`, border: `1px solid ${CL}0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={18} color="#7DD3FC" /></div>
        <div><div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#F8F9FA" }}>AI Tutor Lab</div><div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Konteks: Psikologi Visual</div></div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(110,225,43,0.15)", border: "1px solid rgba(110,225,43,0.3)", borderRadius: 100, padding: "3px 10px" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE12B", animation: "pulse 2s infinite" }}/><span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6EE12B" }}>Online</span></div>
      </div>
      <div style={{ height: 360, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--color-surface-2)" }}>
        {messages.map((msg,i)=>(<div key={i} style={{ display:"flex", gap:10, flexDirection:msg.role==="user"?"row-reverse":"row", alignItems:"flex-start" }}><div style={{ width:32, height:32, borderRadius:"50%", background:msg.role==="ai"?`linear-gradient(135deg,${C},#0284C7)`:"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid var(--color-border)" }}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{ maxWidth:"78%", padding:"12px 16px", borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px", background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#0284C7)`, border:"1px solid var(--color-border)" }}><div style={{ fontSize:"0.875rem", color:msg.role==="ai"?"var(--color-text-primary)":"#FFF", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{ display:"flex", gap:10 }}><div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C},#0284C7)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={15} color="#FFF"/></div><div style={{ padding:"14px 18px", background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"4px 16px 16px 16px", display:"flex", gap:6 }}>{[0,1,2].map(ii=><div key={ii} style={{ width:8, height:8, borderRadius:"50%", background:C, animation:`pulse 1.2s ${ii*0.2}s infinite`, opacity:0.6 }}/>)}</div></div>}
        {error&&<div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"color-mix(in srgb,var(--color-error) 10%,transparent)", border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)", borderRadius:"var(--radius-md)", fontSize:"0.8125rem", color:"var(--color-error)" }}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--color-border)", display:"flex", gap:10, background:"var(--color-surface)" }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang eye tracking..." disabled={loading} rows={2} style={{ flex:1, border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", padding:"10px 14px", fontSize:"0.875rem", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)", background:"var(--color-surface-2)", resize:"none", outline:"none", lineHeight:1.5 }}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{ width:44, height:44, borderRadius:"var(--radius-md)", background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#0284C7)`, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:loading||!input.trim()?"not-allowed":"pointer", flexShrink:0, alignSelf:"flex-end" }}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function EyeTrackingPage() {
  const [currentLesson,setCurrentLesson]=useState(0); const [completed,setCompleted]=useState<Set<number>>(new Set()); const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null); const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson]; const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return (
    <div className="animate-fade-in-up" style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <Link href="/dashboard/learn" style={{ display:"flex", alignItems:"center", gap:8, color:"var(--color-text-secondary)", textDecoration:"none", fontSize:"0.875rem", fontWeight:600 }}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}><div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.875rem", color:"var(--color-text-muted)" }}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{ width:120, height:6, background:"var(--color-surface-3)", borderRadius:999, overflow:"hidden" }}><div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C},#0284C7)`, borderRadius:999, transition:"width 0.5s ease" }}/></div></div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)", borderRadius:"var(--radius-xl)", padding:"32px 36px", marginBottom:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)` }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${CL}0.2)`, border:`1px solid ${CL}0.4)`, borderRadius:100, padding:"4px 14px", marginBottom:12 }}><Eye size={13} color="#7DD3FC"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"#7DD3FC", letterSpacing:"0.06em" }}>MODUL 4 · EYE TRACKING</span></div>
          <h1 style={{ fontSize:"clamp(1.375rem,3vw,1.875rem)", color:"#F8F9FA", letterSpacing:"-0.04em", marginBottom:8 }}>Psikologi Visual & Eye Tracking</h1>
          <p style={{ color:"#9CA3AF", maxWidth:480 }}>Optimasi hierarki visual menggunakan prinsip eye tracking dan psikologi kognitif.</p>
          <div style={{ display:"flex", gap:20, marginTop:20 }}>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><BookOpen size={14}/> 4 Materi</span>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><Clock size={14}/> 4 jam</span>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#7DD3FC", fontWeight:700 }}><Zap size={14}/> AI Tutor Lab</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:28, alignItems:"flex-start", flexWrap:"wrap" }}>
        <div style={{ flex:"0 0 260px", display:"flex", flexDirection:"column", gap:6, position:"sticky", top:24 }}>
          <div style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--color-text-muted)", letterSpacing:"0.08em", marginBottom:8 }}>DAFTAR MATERI</div>
          {LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:"var(--radius-md)", border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent", background:isActive?`${CL}0.1)`:"transparent", cursor:"pointer", textAlign:"left", transition:"all 0.2s", width:"100%", fontFamily:"var(--font-sans)" }}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{ fontSize:"0.8125rem", fontWeight:isActive?700:500, color:isActive?C:"var(--color-text-secondary)", lineHeight:1.4 }}>{i+1}. {l.title}</span></button>);})}
        </div>
        <div style={{ flex:"1 1 400px", display:"flex", flexDirection:"column", gap:24, minWidth:0 }}>
          <div className="premium-card" style={{ padding:0 }}>
            <div style={{ padding:"24px 28px", borderBottom:"1px solid var(--color-border)", background:`${CL}0.05)`, display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:"var(--radius-md)", background:`${CL}0.15)`, border:`1px solid ${CL}0.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Eye size={22} color={C} strokeWidth={2}/></div>
              <div><div style={{ fontSize:"0.6875rem", fontWeight:700, color:C, letterSpacing:"0.08em", marginBottom:4 }}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{ fontSize:"1.25rem", letterSpacing:"-0.02em", color:"var(--color-text-primary)", marginBottom:2 }}>{lesson.title}</h2><div style={{ fontSize:"0.8125rem", color:"var(--color-text-muted)" }}>{lesson.concept}</div></div>
            </div>
            <div style={{ padding:28 }}>
              <div style={{ fontSize:"0.9375rem", lineHeight:1.75, color:"var(--color-text-secondary)", marginBottom:24, whiteSpace:"pre-wrap" }}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px 18px", background:`${CL}0.06)`, border:`1px solid ${CL}0.2)`, borderRadius:"var(--radius-md)", marginBottom:28 }}>
                <Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{ fontSize:"0.875rem", color:"var(--color-text-primary)", fontStyle:"italic", fontWeight:600, lineHeight:1.6 }}>{lesson.insight}</p>
              </div>
              <div style={{ marginBottom:28 }}><HeatmapViz/></div>
              <div style={{ padding:"20px 22px", background:"var(--color-surface-2)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", marginBottom:28 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}><Target size={15} color="var(--color-accent-text)"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--color-accent-text)", letterSpacing:"0.08em" }}>TANTANGAN PRAKTIK</span></div>
                <div style={{ fontSize:"0.875rem", lineHeight:1.7, color:"var(--color-text-secondary)", whiteSpace:"pre-wrap" }}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              </div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderRadius:"var(--radius-md)", background:showAILab?`linear-gradient(135deg,${C},#0284C7)`:"var(--color-surface-3)", border:"1px solid", borderColor:showAILab?"transparent":"var(--color-border)", color:showAILab?"#FFF":"var(--color-text-secondary)", fontSize:"0.875rem", fontWeight:700, cursor:"pointer", width:"100%", justifyContent:"center", marginBottom:showAILab?20:0, fontFamily:"var(--font-sans)" }}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{ padding:0 }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)", display:"flex", alignItems:"center", gap:10 }}><Eye size={18} color="var(--color-accent-text)"/><span style={{ fontWeight:800, fontSize:"1rem" }}>Cek Pemahaman</span>{quizAnswer&&<span style={{ marginLeft:"auto", fontSize:"0.75rem", fontWeight:700, padding:"2px 10px", borderRadius:100, background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:quizAnswer.correct?"#16A34A":"#DC2626" }}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div>
            <div style={{ padding:"24px 28px" }}>
              <p style={{ fontWeight:700, fontSize:"1rem", color:"var(--color-text-primary)", marginBottom:20, lineHeight:1.5 }}>{lesson.quiz.question}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{ padding:"14px 18px", borderRadius:"var(--radius-md)", background:bg, border, color, fontSize:"0.875rem", fontWeight:500, cursor:quizAnswer?"not-allowed":"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, lineHeight:1.5, fontFamily:"var(--font-sans)" }}><span style={{ width:24, height:24, borderRadius:"50%", background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6875rem", fontWeight:800, color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)", flexShrink:0 }}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}
              </div>
              {quizAnswer&&<div style={{ marginTop:20, padding:"16px 18px", background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, borderRadius:"var(--radius-md)" }}><div style={{ fontSize:"0.75rem", fontWeight:700, color:quizAnswer.correct?"#16A34A":"#DC2626", marginBottom:6, letterSpacing:"0.06em" }}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{ fontSize:"0.875rem", lineHeight:1.65, color:"var(--color-text-secondary)" }}>{lesson.quiz.explanation}</p></div>}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", gap:12 }}>
            <button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{ gap:8, opacity:currentLesson===0?0.4:1 }}><ChevronLeft size={16}/> Sebelumnya</button>
            {currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{ gap:8, opacity:quizAnswer?1:0.5 }}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{ gap:8 }}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}
