"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Layers, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#EC4899"; const CL="rgba(236,72,153,";
const PLATFORMS = [
  { name: "TikTok", icon: "logos:tiktok-icon", color: "#000" },
  { name: "Reels", icon: "logos:instagram-icon", color: "#E4405F" },
  { name: "YouTube", icon: "logos:youtube-icon", color: "#FF0000" },
  { name: "X / Twitter", icon: "logos:twitter", color: "#1DA1F2" },
  { name: "LinkedIn", icon: "logos:linkedin-icon", color: "#0A66C2" },
  { name: "Blog", icon: "solar:document-bold-duotone", color: "#F59E0B" },
  { name: "Carousel", icon: "solar:gallery-wide-bold-duotone", color: "#8B5CF6" },
  { name: "Podcast", icon: "solar:videocamera-record-bold-duotone", color: "#1DB954" },
  { name: "Newsletter", icon: "solar:letter-bold-duotone", color: "#6366F1" },
  { name: "Infografis", icon: "solar:chart-square-bold-duotone", color: "#14B8A6" },
  { name: "Live", icon: "solar:play-circle-bold-duotone", color: "#EF4444" },
  { name: "Threads", icon: "logos:threads-icon", color: "#000" },
];
const LESSONS = [
  { id: "prinsip", title: "Prinsip Content Atomization", concept: "Memaksimalkan ROI dari Satu Ide", body: `**Content Atomization** adalah strategi memecah satu ide besar (atom content) menjadi puluhan aset konten yang lebih kecil dan platform-specific. Prinsip dasarnya: satu kali effort kreatif, distribusi di belasan channel.

Bayangkan kamu membuat satu video YouTube berdurasi 15 menit tentang "Cara Memulai Bisnis Skincare". Dari video itu, kamu bisa menghasilkan: 5 clip TikTok (1 per tips), 3 carousel Instagram, 1 thread Twitter, 10 quote image, 1 blog post, dan 1 newsletter. Total: 21 aset konten dari 1 ide.

Ini bukan sekadar repurposing — setiap atom konten harus di-**adapt** agar native di platformnya. Clip TikTok butuh hook 1 detik. Carousel butuh visual hierarchy. Thread butuh narasi yang bisa berdiri sendiri.`, insight: "Brand yang menerapkan atomization menghasilkan 11x lebih banyak konten dengan hanya 2x effort tambahan", challenge: "**ATOMIZATION MAP:** Pilih satu ide konten. Buat daftar minimal 10 format turunan yang bisa dihasilkan beserta platform targetnya!", quiz: { question: "Apa perbedaan utama antara 'repurposing' dan 'atomization'?", options: ["Tidak ada perbedaan, keduanya sama", "Repurposing = copy-paste konten ke platform lain. Atomization = mengadaptasi setiap atom agar native di platform tujuannya", "Atomization hanya untuk video, repurposing untuk semua format", "Repurposing lebih efektif daripada atomization"], correct: 1, explanation: "Repurposing often means posting the same content everywhere. Atomization is strategic: each piece is adapted to fit the platform's native format, audience behavior, and content expectations." } },
  { id: "satu-ke-banyak", title: "Satu Ide → Puluhan Format", concept: "Framework Piramida Konten", body: `**Content Pyramid** adalah framework untuk mengekstrak konten secara sistematis:

**Tier 1 — Pillar Content (1 aset besar):** Video panjang, webinar, ebook, atau riset original. Ini membutuhkan effort terbesar tapi menjadi sumber dari segalanya.

**Tier 2 — Derivative Content (3-5 aset medium):** Blog post, YouTube clip, podcast episode, carousel. Diekstrak dari angle berbeda dalam pillar content.

**Tier 3 — Micro Content (10-20 aset kecil):** Quote image, short clip, tweet, story, meme. Setiap poin kunci dalam pillar content bisa menjadi 1 micro content.

**Tier 4 — Reactive Content (∞ aset):** Respons terhadap komentar, Q&A, behind-the-scenes tentang proses pembuatan pillar content itu sendiri.

Dengan agen AI, Tier 2-4 bisa diotomatisasi sebagian — kamu fokus membuat Tier 1 yang berkualitas tinggi.`, insight: "Content Pyramid yang baik bisa membuat 1 jam kerja pillar content bertahan menghasilkan konten selama 2-4 minggu", challenge: "**BUILD PYRAMID:** Pilih satu topik. Buat konten piramida lengkap: 1 pillar, 3 derivative, dan 5 micro content. Tentukan platform untuk masing-masing!", quiz: { question: "Mengapa Tier 1 (Pillar Content) harus dibuat dengan kualitas paling tinggi?", options: ["Karena pillar content mendapat views paling banyak", "Karena semua konten turunan bergantung pada kualitas pillar — jika pillar lemah, seluruh piramida collapse", "Karena hanya Tier 1 yang dilihat algoritma", "Pillar content sebenarnya tidak perlu berkualitas tinggi"], correct: 1, explanation: "Pillar content is the foundation. Every derivative and micro content inherits its quality, insights, and value. A weak pillar means every derived piece will also be weak — garbage in, garbage out at scale." } },
  { id: "platform-native", title: "Platform-Native Adaptation", concept: "Satu Pesan, Bahasa Berbeda", body: `Setiap platform memiliki **bahasa native** yang berbeda — bukan hanya format, tapi juga: panjang ideal, tone, hook style, CTA, dan behavior audiens yang dominan.

**Platform Adaptation Matrix:**
- **TikTok:** 15-60 detik, hook di 1 detik pertama, trend-riding, casual/authentic
- **Instagram Reels:** 15-30 detik, visual quality lebih tinggi, aspirasional
- **YouTube Shorts:** 30-60 detik, sedikit lebih educational, hook + payoff structure
- **X/Twitter:** 280 karakter per tweet, thread 5-10 tweet, insight-driven, controversial hooks
- **LinkedIn:** 1500+ karakter, professional storytelling, data-backed insight
- **Carousel IG:** 7-10 slides, visual hierarchy per slide, swipe-worthy hook di slide 1

Kesalahan fatal: membuat satu konten dan mendistribusikan verbatim ke semua platform. Audiens setiap platform punya ekspektasi berbeda — konten yang viral di TikTok bisa flopped di LinkedIn.`, insight: "Konten yang diadaptasi native mendapat 2.5x engagement dibanding konten cross-posted tanpa adaptasi", challenge: "**ADAPTATION DRILL:** Ambil satu paragraf dari blog kamu. Adaptasi menjadi: 1 tweet, 1 caption IG, dan 1 script TikTok 15 detik. Perhatikan perbedaan tone dan strukturnya!", quiz: { question: "Kamu punya video YouTube 10 menit. Saat mengadaptasi ke TikTok, apa yang paling penting?", options: ["Upload versi pendek dari video YouTube apa adanya", "Identifikasi 1 momen paling impactful, buat hook baru yang native TikTok, dan format vertikal", "TikTok audience sama dengan YouTube, tidak perlu adaptasi", "Tambahkan teks overlay saja sudah cukup"], correct: 1, explanation: "TikTok has its own language: vertical format, 1-second hook, pattern interrupts, and trend audio. Simply shortening a YouTube video won't work — you need to create something that feels native to TikTok's culture." } },
  { id: "workflow-ai", title: "Workflow Atomisasi dengan AI", concept: "Pipeline Otomatis dari Ide ke Distribusi", body: `Dengan AI agents, proses atomization bisa diakselerasi secara dramatis. Berikut pipeline yang bisa kamu implementasikan:

**Step 1 — Input:** Kamu membuat atau mendeskripsikan pillar content (brief, transkrip video, atau draft blog post).

**Step 2 — AI Decomposition:** Agen AI memecah konten menjadi poin-poin kunci, quote-worthy statements, dan data points yang bisa berdiri sendiri.

**Step 3 — Platform Mapping:** Agen mencocokkan setiap atom dengan platform paling cocok berdasarkan format dan audiens.

**Step 4 — Native Adaptation:** Untuk setiap atom-platform pair, agen menulis draft yang sudah disesuaikan tone, panjang, dan format platform target.

**Step 5 — Quality Gate (Manusia):** Kamu review output, edit yang perlu, dan approve untuk scheduling.

**Step 6 — Auto-Schedule:** Konten dijadwalkan secara optimal berdasarkan peak engagement time per platform.

Dengan pipeline ini, dari 1 pillar content, kamu bisa menghasilkan 15-20 aset siap publish dalam waktu 2-3 jam (termasuk QC manual).`, insight: "Pipeline AI atomization mengurangi waktu produksi konten dari 40 jam/minggu menjadi 12 jam/minggu untuk output yang sama", challenge: "**DESIGN PIPELINE:** Rancang pipeline atomization kamu sendiri. Tentukan: trigger input, agen apa yang dibutuhkan per step, dan quality gate apa yang kamu terapkan!", quiz: { question: "Di mana posisi quality gate manusia yang paling kritis dalam pipeline atomization AI?", options: ["Sebelum Step 1 — sebelum membuat pillar content", "Antara Step 4 dan Step 5 — setelah AI mengadaptasi tapi sebelum publish", "Setelah Step 6 — setelah konten sudah terposting", "Quality gate tidak diperlukan jika prompt-nya sudah bagus"], correct: 1, explanation: "Quality gate paling kritis adalah setelah AI menghasilkan output tapi sebelum publishing. Di titik ini, manusia bisa menangkap hallucination, brand voice drift, atau kesalahan adaptasi platform sebelum konten menjadi publik." } },
];

function AtomizationViz() {
  const [idea, setIdea] = useState("");
  const [exploded, setExploded] = useState(false);
  function handleExplode() { if (!idea.trim()) return; setExploded(false); setTimeout(() => setExploded(true), 100); }
  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem" }}>Content Atomization Simulator</div>
        <div className="caption" style={{ marginTop: 4 }}>Masukkan ide utama dan lihat proses atomisasi</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input value={idea} onChange={e => setIdea(e.target.value)} placeholder="Masukkan ide konten utama..." className="input" style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && handleExplode()} />
          <button onClick={handleExplode} disabled={!idea.trim()} className="btn btn-primary" style={{ gap: 6 }}><Layers size={15} /> Atomisasi!</button>
        </div>
        <div style={{ position: "relative", minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AnimatePresence mode="wait">
            {!exploded ? (
              <motion.div key="core" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, opacity: 0, borderRadius: "50%" }} transition={{ duration: 0.4 }}
                style={{ width: 180, height: 80, background: `linear-gradient(135deg, ${C}, #BE185D)`, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, textAlign: "center" }}>
                <span style={{ color: "#FFF", fontWeight: 800, fontSize: "0.875rem" }}>{idea || "Ide Utama Kamu"}</span>
              </motion.div>
            ) : (
              <motion.div key="atoms" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 500 }}>
                {PLATFORMS.map((p, i) => (
                  <motion.div key={p.name} initial={{ scale: 0, opacity: 0, y: 0 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                    style={{ width: 90, padding: "12px 8px", background: "var(--color-surface-2)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default" }}>
                    <Icon icon={p.icon} width={24} />
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-secondary)", textAlign: "center" }}>{p.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {exploded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ marginTop: 16, padding: "14px 16px", background: `${CL}0.06)`, border: `1px solid ${CL}0.2)`, borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <strong style={{ color: C }}>Hasil:</strong> <span style={{ color: "var(--color-text-secondary)" }}>"{idea}" berhasil diatomisasi menjadi <strong>{PLATFORMS.length} aset konten</strong> untuk {PLATFORMS.length} platform berbeda!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AILab() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ai", content: "Halo! Aku AI Tutor untuk modul Content Atomization. Tanyakan tentang cara memecah konten, adaptasi platform, atau workflow atomisasi!", timestamp: new Date() }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  async function handleSend() { if(!input.trim()||loading)return; const um=input.trim(); setInput(""); setError(null); setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]); setLoading(true); const r=await askModuleAI("content-atomization",um); setLoading(false); if(r.error)setError(r.error); else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]); }
  return (
    <div style={{ border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden", background:"var(--color-surface)", boxShadow:"var(--shadow-md)" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", display:"flex", alignItems:"center", gap:12, background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)" }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:`${CL}0.3)`, border:`1px solid ${CL}0.5)`, display:"flex", alignItems:"center", justifyContent:"center" }}><Bot size={18} color="#F9A8D4"/></div>
        <div><div style={{ fontWeight:800, fontSize:"0.9375rem", color:"#F8F9FA" }}>AI Tutor Lab</div><div style={{ fontSize:"0.75rem", color:"#9CA3AF" }}>Konteks: Content Atomization</div></div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, background:"rgba(110,225,43,0.15)", border:"1px solid rgba(110,225,43,0.3)", borderRadius:100, padding:"3px 10px" }}><div style={{ width:6, height:6, borderRadius:"50%", background:"#6EE12B", animation:"pulse 2s infinite" }}/><span style={{ fontSize:"0.6875rem", fontWeight:700, color:"#6EE12B" }}>Online</span></div>
      </div>
      <div style={{ height:360, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:16, background:"var(--color-surface-2)" }}>
        {messages.map((msg,i)=>(<div key={i} style={{ display:"flex", gap:10, flexDirection:msg.role==="user"?"row-reverse":"row", alignItems:"flex-start" }}><div style={{ width:32, height:32, borderRadius:"50%", background:msg.role==="ai"?`linear-gradient(135deg,${C},#BE185D)`:"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid var(--color-border)" }}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{ maxWidth:"78%", padding:"12px 16px", borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px", background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#BE185D)`, border:"1px solid var(--color-border)" }}><div style={{ fontSize:"0.875rem", color:msg.role==="ai"?"var(--color-text-primary)":"#FFF", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{ display:"flex", gap:10 }}><div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C},#BE185D)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={15} color="#FFF"/></div><div style={{ padding:"14px 18px", background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"4px 16px 16px 16px", display:"flex", gap:6 }}>{[0,1,2].map(ii=><div key={ii} style={{ width:8, height:8, borderRadius:"50%", background:C, animation:`pulse 1.2s ${ii*0.2}s infinite`, opacity:0.6 }}/>)}</div></div>}
        {error&&<div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"color-mix(in srgb,var(--color-error) 10%,transparent)", border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)", borderRadius:"var(--radius-md)", fontSize:"0.8125rem", color:"var(--color-error)" }}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--color-border)", display:"flex", gap:10, background:"var(--color-surface)" }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang content atomization..." disabled={loading} rows={2} style={{ flex:1, border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", padding:"10px 14px", fontSize:"0.875rem", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)", background:"var(--color-surface-2)", resize:"none", outline:"none", lineHeight:1.5 }}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{ width:44, height:44, borderRadius:"var(--radius-md)", background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#BE185D)`, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:loading||!input.trim()?"not-allowed":"pointer", flexShrink:0, alignSelf:"flex-end" }}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function ContentAtomizationPage() {
  const [currentLesson,setCurrentLesson]=useState(0); const [completed,setCompleted]=useState<Set<number>>(new Set()); const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null); const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson]; const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return (
    <div className="animate-fade-in-up" style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <Link href="/dashboard/learn" style={{ display:"flex", alignItems:"center", gap:8, color:"var(--color-text-secondary)", textDecoration:"none", fontSize:"0.875rem", fontWeight:600 }}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}><div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.875rem", color:"var(--color-text-muted)" }}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{ width:120, height:6, background:"var(--color-surface-3)", borderRadius:999, overflow:"hidden" }}><div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C},#BE185D)`, borderRadius:999, transition:"width 0.5s ease" }}/></div></div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)", borderRadius:"var(--radius-xl)", padding:"32px 36px", marginBottom:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)` }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${CL}0.2)`, border:`1px solid ${CL}0.4)`, borderRadius:100, padding:"4px 14px", marginBottom:12 }}><Layers size={13} color="#F9A8D4"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"#F9A8D4", letterSpacing:"0.06em" }}>MODUL 6 · ATOMIZATION</span></div>
          <h1 style={{ fontSize:"clamp(1.375rem,3vw,1.875rem)", color:"#F8F9FA", letterSpacing:"-0.04em", marginBottom:8 }}>Content Atomization</h1>
          <p style={{ color:"#9CA3AF", maxWidth:480 }}>Memecah satu ide besar menjadi puluhan aset konten multi-platform.</p>
          <div style={{ display:"flex", gap:20, marginTop:20 }}><span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><BookOpen size={14}/> 4 Materi</span><span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><Clock size={14}/> 2.5 jam</span><span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#F9A8D4", fontWeight:700 }}><Zap size={14}/> AI Tutor Lab</span></div>
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
              <div style={{ width:48, height:48, borderRadius:"var(--radius-md)", background:`${CL}0.15)`, border:`1px solid ${CL}0.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Layers size={22} color={C} strokeWidth={2}/></div>
              <div><div style={{ fontSize:"0.6875rem", fontWeight:700, color:C, letterSpacing:"0.08em", marginBottom:4 }}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{ fontSize:"1.25rem", letterSpacing:"-0.02em", color:"var(--color-text-primary)", marginBottom:2 }}>{lesson.title}</h2><div style={{ fontSize:"0.8125rem", color:"var(--color-text-muted)" }}>{lesson.concept}</div></div>
            </div>
            <div style={{ padding:28 }}>
              <div style={{ fontSize:"0.9375rem", lineHeight:1.75, color:"var(--color-text-secondary)", marginBottom:24, whiteSpace:"pre-wrap" }}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px 18px", background:`${CL}0.06)`, border:`1px solid ${CL}0.2)`, borderRadius:"var(--radius-md)", marginBottom:28 }}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{ fontSize:"0.875rem", color:"var(--color-text-primary)", fontStyle:"italic", fontWeight:600, lineHeight:1.6 }}>{lesson.insight}</p></div>
              <div style={{ marginBottom:28 }}><AtomizationViz/></div>
              <div style={{ padding:"20px 22px", background:"var(--color-surface-2)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", marginBottom:28 }}><div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}><Target size={15} color="var(--color-accent-text)"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--color-accent-text)", letterSpacing:"0.08em" }}>TANTANGAN PRAKTIK</span></div><div style={{ fontSize:"0.875rem", lineHeight:1.7, color:"var(--color-text-secondary)", whiteSpace:"pre-wrap" }}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderRadius:"var(--radius-md)", background:showAILab?`linear-gradient(135deg,${C},#BE185D)`:"var(--color-surface-3)", border:"1px solid", borderColor:showAILab?"transparent":"var(--color-border)", color:showAILab?"#FFF":"var(--color-text-secondary)", fontSize:"0.875rem", fontWeight:700, cursor:"pointer", width:"100%", justifyContent:"center", marginBottom:showAILab?20:0, fontFamily:"var(--font-sans)" }}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{ padding:0 }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)", display:"flex", alignItems:"center", gap:10 }}><Layers size={18} color="var(--color-accent-text)"/><span style={{ fontWeight:800, fontSize:"1rem" }}>Cek Pemahaman</span>{quizAnswer&&<span style={{ marginLeft:"auto", fontSize:"0.75rem", fontWeight:700, padding:"2px 10px", borderRadius:100, background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:quizAnswer.correct?"#16A34A":"#DC2626" }}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div>
            <div style={{ padding:"24px 28px" }}>
              <p style={{ fontWeight:700, fontSize:"1rem", color:"var(--color-text-primary)", marginBottom:20, lineHeight:1.5 }}>{lesson.quiz.question}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{ padding:"14px 18px", borderRadius:"var(--radius-md)", background:bg, border, color, fontSize:"0.875rem", fontWeight:500, cursor:quizAnswer?"not-allowed":"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, lineHeight:1.5, fontFamily:"var(--font-sans)" }}><span style={{ width:24, height:24, borderRadius:"50%", background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6875rem", fontWeight:800, color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)", flexShrink:0 }}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>
              {quizAnswer&&<div style={{ marginTop:20, padding:"16px 18px", background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)", border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`, borderRadius:"var(--radius-md)" }}><div style={{ fontSize:"0.75rem", fontWeight:700, color:quizAnswer.correct?"#16A34A":"#DC2626", marginBottom:6 }}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{ fontSize:"0.875rem", lineHeight:1.65, color:"var(--color-text-secondary)" }}>{lesson.quiz.explanation}</p></div>}
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
