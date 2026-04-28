"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { MessageSquare, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role: "user"|"ai"; content: string; timestamp: Date; }
interface QuizAnswer { questionIndex: number; selected: number; correct: boolean; }
const C = "#8B5CF6"; const CL = "rgba(139,92,246,";

const TONES: Record<string, { label: string; icon: string; sample: string; emotionWords: string[] }> = {
  aggressive: { label: "Agresif", icon: "solar:fire-bold-duotone", sample: "STOP scroll sekarang! Kamu sedang kehilangan ribuan pelanggan setiap hari karena caption yang membosankan. Waktu kamu TERBATAS — pesaing sudah bergerak. Ambil keputusan SEKARANG atau tertinggal selamanya!", emotionWords: ["STOP", "kehilangan", "TERBATAS", "SEKARANG", "tertinggal"] },
  casual: { label: "Santai", icon: "solar:emoji-funny-circle-bold-duotone", sample: "Eh, pernah nggak sih ngerasa caption kamu tuh gitu-gitu aja? Tenang, kamu nggak sendirian kok. Yuk coba cara baru yang lebih fun dan lebih nyambung sama audiens kamu~", emotionWords: ["nggak sih", "Tenang", "fun", "nyambung"] },
  empathetic: { label: "Empatis", icon: "solar:heart-bold-duotone", sample: "Kami memahami betapa lelahnya kamu mencoba membuat konten yang benar-benar terasa personal. Perasaan itu valid. Biarkan kami membantu kamu menemukan suara autentik brand-mu — satu langkah ringan di satu waktu.", emotionWords: ["memahami", "lelahnya", "valid", "autentik", "ringan"] },
};

const LESSONS = [
  { id: "prompt-architecture", title: "Arsitektur Prompt untuk Copywriting", concept: "Dari Brief ke Output LLM yang Presisi", body: `Membuat copy yang efektif dengan LLM bukan sekadar mengetik "buatkan caption bagus". Dibutuhkan **arsitektur prompt** yang tersistematiskan agar output konsisten dan berkualitas tinggi.

**Framework CRISP untuk prompt copywriting:**
- **Context** — Siapa brand-nya, apa produknya, siapa audiens target
- **Role** — Peran apa yang dimainkan AI (copywriter senior, brand strategist, dll)
- **Instruction** — Tugas spesifik dengan batasan jelas (panjang, tone, format)
- **Style** — Contoh gaya bahasa yang diinginkan (berikan sample)
- **Parameters** — Variabel yang bisa diubah (nama produk, benefit, CTA)

Dengan framework ini, kamu bisa menghasilkan ratusan variasi caption yang konsisten secara brand voice tapi unik secara konten.`, insight: "Prompt yang terstruktur menghasilkan output 3x lebih konsisten dan mengurangi editing time sebesar 70%", challenge: "**LATIHAN PROMPT:** Tulis prompt CRISP untuk brand skincare yang menarget Gen Z. Pastikan setiap elemen CRISP terisi dengan spesifik!", quiz: { question: "Elemen mana dalam CRISP yang paling sering dilewatkan tapi paling berdampak pada kualitas output?", options: ["Context — karena AI tidak perlu tahu tentang brand", "Style — memberikan contoh gaya bahasa membuat output jauh lebih aligned dengan brand voice", "Parameters — variabel tidak penting untuk copywriting", "Role — AI tahu kalau diminta menulis pasti berperan sebagai penulis"], correct: 1, explanation: "Tanpa Style example, AI mengandalkan 'default voice' yang generic. Memberikan 2-3 contoh kalimat referensi membuat output sangat aligned dengan brand personality yang diinginkan." } },
  { id: "personalization", title: "Personalisasi per Segmen Audiens", concept: "Satu Produk, Seribu Pesan Berbeda", body: `Kekuatan terbesar LLM untuk copywriting adalah kemampuan menghasilkan **variasi massal** yang dipersonalisasi per segmen audiens tanpa mengorbankan kualitas.

**Framework Personalisasi 3-Layer:**

**Layer 1 — Demographic:** Umur, lokasi, gender → mengubah bahasa dan referensi budaya. Gen Z Jakarta vs Ibu rumah tangga Surabaya membutuhkan framing yang berbeda total.

**Layer 2 — Psychographic:** Pain points, aspirasi, values → mengubah angle dan emotional trigger. Audiens yang price-sensitive vs quality-focused membutuhkan CTA berbeda.

**Layer 3 — Behavioral:** Power user vs first-timer, cart abandoner vs browser → mengubah urgency level dan offer structure.

Dengan LLM, kamu bisa mengkombinasikan 3 layer ini untuk menghasilkan 50-100 variasi caption yang masing-masing terasa "ditulis khusus" untuk segmen tertentu.`, insight: "Caption yang dipersonalisasi per segmen menghasilkan engagement rate 2.8x lebih tinggi dari caption generic one-size-fits-all", challenge: "**SEGMENTASI:** Pilih satu produk. Definisikan 3 segmen audiens berbeda. Untuk setiap segmen, tulis pain point utama dan emotional trigger yang paling efektif.", quiz: { question: "Apa risiko terbesar dari personalisasi berlebihan dengan LLM?", options: ["Biaya API yang terlalu mahal", "Output yang terlalu banyak sehingga tidak bisa dikelola", "Inkonsistensi brand voice — setiap variasi terasa seperti brand berbeda jika tidak ada style guide yang kuat", "Personalisasi selalu lebih baik, tidak ada risiko"], correct: 2, explanation: "Personalisasi tanpa guardrails brand voice akan menghasilkan 100 caption yang terasa seperti 100 brand berbeda. Solusinya: style guide yang ketat + few-shot examples di setiap prompt." } },
  { id: "viral-hooks", title: "Viral Hook Engineering", concept: "Hook × CTA × Urgency Formula", body: `Sebuah copy yang viral memiliki tiga komponen yang bekerja sinergis: **Hook** yang menghentikan scroll, **CTA** yang memaksa aksi, dan **Urgency** yang menciptakan kebutuhan bertindak sekarang.

**Hook Pattern Library:**
- **Contrarian Hook:** "Yang kamu tahu tentang X itu salah..."
- **Curiosity Gap:** "Ada satu hal tentang X yang brand besar sembunyikan..."
- **Social Proof:** "10.000 orang sudah mencoba ini dan 87% melihat perubahan..."
- **Direct Challenge:** "Kamu pikir X kamu sudah bagus? Cek ini."
- **Story Lead:** "3 bulan lalu, aku hampir menyerah..."

Rahasia: hook yang efektif menciptakan **open loop** di otak audiens — mereka HARUS menyelesaikan membaca untuk menutup loop tersebut.`, insight: "Hook di 3 detik pertama menentukan 80% keberhasilan konten — investasikan waktu terbesar di sini", challenge: "**HOOK BATTLE:** Tulis 5 variasi hook untuk satu produk menggunakan 5 pattern berbeda. Tanyakan ke AI Lab mana yang paling kuat dan mengapa!", quiz: { question: "Mengapa 'Curiosity Gap' menjadi salah satu hook paling efektif di konten digital?", options: ["Karena orang suka rahasia", "Karena menciptakan open loop kognitif yang secara neurologis memaksa otak untuk mencari penutupnya (Zeigarnik Effect)", "Karena algoritmanya memprioritaskan konten mysterious", "Karena mudah dibuat oleh AI"], correct: 1, explanation: "Zeigarnik Effect: otak manusia secara natural cenderung mengingat dan memprioritaskan tugas/informasi yang belum selesai. Curiosity Gap exploit efek ini — audiens harus terus menonton/membaca untuk 'menutup' loop yang dibuka oleh hook." } },
  { id: "quality-control", title: "Quality Control Output LLM", concept: "Dari Draft AI ke Publishing-Ready", body: `Output LLM, sehebat apa pun prompt-nya, selalu membutuhkan **quality control** sebelum publishing. Tanpa QC, risiko terbesar adalah: hallucination (fakta palsu), brand voice drift, dan tonal inconsistency.

**Framework QC 4-Layer:**

**Layer 1 — Fact Check:** Verifikasi setiap klaim, statistik, dan pernyataan. LLM sering "mengarang" angka yang terdengar masuk akal tapi tidak factual.

**Layer 2 — Brand Alignment:** Cek apakah tone, vocabulary, dan messaging sesuai brand guidelines. Red flags: kata-kata yang brand kamu tidak akan pernah gunakan.

**Layer 3 — Legal Compliance:** Pastikan tidak ada klaim kesehatan yang berlebihan, perbandingan kompetitor yang ilegal, atau pelanggaran UU ITE.

**Layer 4 — A/B Readiness:** Format output agar siap untuk split testing — setiap variasi harus cukup berbeda untuk menghasilkan insight yang bermakna.

Automasi QC: buat checklist template yang bisa di-reuse untuk setiap batch output LLM.`, insight: "Tim yang menerapkan QC 4-Layer mengurangi 'content recall' (konten yang harus ditarik setelah publish) sebesar 95%", challenge: "**QC PRACTICE:** Minta AI Lab menghasilkan 5 caption untuk produk kamu. Terapkan QC 4-Layer pada setiap caption. Berapa yang lolos semua layer?", quiz: { question: "Pada Layer QC mana kamu paling mungkin menemukan masalah kritis yang bisa merugikan brand secara legal?", options: ["Layer 1 — Fact Check", "Layer 2 — Brand Alignment", "Layer 3 — Legal Compliance, karena klaim berlebihan dan pelanggaran regulasi bisa berujung sanksi hukum", "Layer 4 — A/B Readiness"], correct: 2, explanation: "Legal Compliance adalah layer paling kritis karena pelanggaran bisa berujung pada tuntutan hukum, denda, atau pencabutan izin. Contoh: klaim 'menyembuhkan jerawat dalam 3 hari' untuk produk skincare bisa melanggar regulasi BPOM." } },
];

function TypewriterViz() {
  const [tone, setTone] = useState<string>("aggressive");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const t = TONES[tone];

  useEffect(() => {
    const words = t.sample.split(" ");
    setDisplayedWords([]);
    setIsTyping(true);
    
    const timeouts: NodeJS.Timeout[] = [];
    words.forEach((_, i) => {
      const timeout = setTimeout(() => {
        setDisplayedWords(prev => [...prev, words[i]]);
        if (i === words.length - 1) setIsTyping(false);
      }, i * 100);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [tone]);

  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem" }}>Tone of Voice Generator</div>
        <div className="caption" style={{ marginTop: 4 }}>Pilih tone untuk melihat efek pada copy yang dihasilkan</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(TONES).map(([key, val]) => (
            <button key={key} onClick={() => setTone(key)} style={{ padding: "8px 20px", borderRadius: 100, border: tone === key ? `2px solid ${C}` : "1px solid var(--color-border)", background: tone === key ? `${CL}0.1)` : "var(--color-surface-2)", color: tone === key ? C : "var(--color-text-secondary)", fontWeight: 700, fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon icon={val.icon} width={18} />
              {val.label}
            </button>
          ))}
        </div>
        <div style={{ minHeight: 120, padding: "20px 24px", background: "var(--color-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", lineHeight: 1.8, fontSize: "1rem" }}>
          <AnimatePresence mode="wait">
            <motion.div key={tone} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {displayedWords.map((word, i) => {
                const isEmotion = t.emotionWords.some(ew => word.toLowerCase().includes(ew.toLowerCase()));
                return (
                  <motion.span key={i} initial={{ opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.3 }}
                    style={{ color: isEmotion ? C : "var(--color-text-primary)", fontWeight: isEmotion ? 800 : 400, textShadow: isEmotion ? `0 0 12px ${CL}0.4)` : "none" }}>
                    {word}{" "}
                  </motion.span>
                );
              })}
              {isTyping && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: C, fontWeight: 700 }}>|</motion.span>}
            </motion.div>
          </AnimatePresence>
        </div>
        {!isTyping && displayedWords.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16, padding: "14px 16px", background: `${CL}0.06)`, border: `1px solid ${CL}0.2)`, borderRadius: "var(--radius-sm)" }}>
            <strong style={{ color: C, fontSize: "0.875rem" }}>Analisis Tone:</strong>
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginLeft: 8 }}>
              {tone === "aggressive" ? "Menggunakan urgency words dan KAPITAL untuk memaksa aksi. Cocok untuk flash sale dan limited offer." : tone === "casual" ? "Bahasa kolokial dan friendly. Cocok untuk brand yang menarget Gen Z dan membangun community." : "Menunjukkan understanding dan empati. Cocok untuk produk personal care dan layanan konsultasi."}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AILab() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "ai", content: "Halo! Aku AI Tutor untuk modul Copywriting LLM. Tanyakan tentang prompt engineering, personalisasi copy, atau minta review hook kamu!", timestamp: new Date() }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState<string|null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  async function handleSend() { if (!input.trim()||loading) return; const um=input.trim(); setInput(""); setError(null); setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]); setLoading(true); const r=await askModuleAI("llm-copywriting",um); setLoading(false); if(r.error)setError(r.error); else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]); }
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--color-surface)", boxShadow: "var(--shadow-md)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #1A1D23 0%, #2D2F3A 100%)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${CL}0.3)`, border: `1px solid ${CL}0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={18} color="#C4B5FD" /></div>
        <div><div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#F8F9FA" }}>AI Tutor Lab</div><div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Konteks: Copywriting LLM</div></div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "rgba(110,225,43,0.15)", border: "1px solid rgba(110,225,43,0.3)", borderRadius: 100, padding: "3px 10px" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6EE12B", animation: "pulse 2s infinite" }}/><span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#6EE12B" }}>Online</span></div>
      </div>
      <div style={{ height: 360, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "var(--color-surface-2)" }}>
        {messages.map((msg,i)=>(<div key={i} style={{ display:"flex", gap:10, flexDirection:msg.role==="user"?"row-reverse":"row", alignItems:"flex-start" }}><div style={{ width:32, height:32, borderRadius:"50%", background:msg.role==="ai"?`linear-gradient(135deg,${C},#7C3AED)`:"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:"1px solid var(--color-border)" }}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{ maxWidth:"78%", padding:"12px 16px", borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px", background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#7C3AED)`, border:"1px solid var(--color-border)" }}><div style={{ fontSize:"0.875rem", color:msg.role==="ai"?"var(--color-text-primary)":"#FFF", lineHeight:1.65, whiteSpace:"pre-wrap" }}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{ display:"flex", gap:10 }}><div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C},#7C3AED)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Bot size={15} color="#FFF"/></div><div style={{ padding:"14px 18px", background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"4px 16px 16px 16px", display:"flex", gap:6 }}>{[0,1,2].map(ii=><div key={ii} style={{ width:8, height:8, borderRadius:"50%", background:C, animation:`pulse 1.2s ${ii*0.2}s infinite`, opacity:0.6 }}/>)}</div></div>}
        {error&&<div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"color-mix(in srgb,var(--color-error) 10%,transparent)", border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)", borderRadius:"var(--radius-md)", fontSize:"0.8125rem", color:"var(--color-error)" }}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"16px 20px", borderTop:"1px solid var(--color-border)", display:"flex", gap:10, background:"var(--color-surface)" }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang copywriting LLM..." disabled={loading} rows={2} style={{ flex:1, border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", padding:"10px 14px", fontSize:"0.875rem", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)", background:"var(--color-surface-2)", resize:"none", outline:"none", lineHeight:1.5 }}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{ width:44, height:44, borderRadius:"var(--radius-md)", background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#7C3AED)`, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:loading||!input.trim()?"not-allowed":"pointer", flexShrink:0, alignSelf:"flex-end" }}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function LLMCopywritingPage() {
  const [currentLesson,setCurrentLesson]=useState(0); const [completed,setCompleted]=useState<Set<number>>(new Set()); const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null); const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson]; const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return (
    <div className="animate-fade-in-up" style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <Link href="/dashboard/learn" style={{ display:"flex", alignItems:"center", gap:8, color:"var(--color-text-secondary)", textDecoration:"none", fontSize:"0.875rem", fontWeight:600 }}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}><div style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.875rem", color:"var(--color-text-muted)" }}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{ width:120, height:6, background:"var(--color-surface-3)", borderRadius:999, overflow:"hidden" }}><div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C},#7C3AED)`, borderRadius:999, transition:"width 0.5s ease" }}/></div></div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)", borderRadius:"var(--radius-xl)", padding:"32px 36px", marginBottom:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)` }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${CL}0.2)`, border:`1px solid ${CL}0.4)`, borderRadius:100, padding:"4px 14px", marginBottom:12 }}><MessageSquare size={13} color="#C4B5FD"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"#C4B5FD", letterSpacing:"0.06em" }}>MODUL 5 · LLM COPYWRITING</span></div>
          <h1 style={{ fontSize:"clamp(1.375rem,3vw,1.875rem)", color:"#F8F9FA", letterSpacing:"-0.04em", marginBottom:8 }}>Copywriting Hiper-Personalisasi LLM</h1>
          <p style={{ color:"#9CA3AF", maxWidth:480 }}>Otomatisasi pembuatan ribuan caption personalisasi dengan framework prompt engineering.</p>
          <div style={{ display:"flex", gap:20, marginTop:20 }}>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><BookOpen size={14}/> 4 Materi</span>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#9CA3AF" }}><Clock size={14}/> 3 jam</span>
            <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.8125rem", color:"#C4B5FD", fontWeight:700 }}><Zap size={14}/> AI Tutor Lab</span>
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
              <div style={{ width:48, height:48, borderRadius:"var(--radius-md)", background:`${CL}0.15)`, border:`1px solid ${CL}0.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><MessageSquare size={22} color={C} strokeWidth={2}/></div>
              <div><div style={{ fontSize:"0.6875rem", fontWeight:700, color:C, letterSpacing:"0.08em", marginBottom:4 }}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{ fontSize:"1.25rem", letterSpacing:"-0.02em", color:"var(--color-text-primary)", marginBottom:2 }}>{lesson.title}</h2><div style={{ fontSize:"0.8125rem", color:"var(--color-text-muted)" }}>{lesson.concept}</div></div>
            </div>
            <div style={{ padding:28 }}>
              <div style={{ fontSize:"0.9375rem", lineHeight:1.75, color:"var(--color-text-secondary)", marginBottom:24, whiteSpace:"pre-wrap" }}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"16px 18px", background:`${CL}0.06)`, border:`1px solid ${CL}0.2)`, borderRadius:"var(--radius-md)", marginBottom:28 }}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{ fontSize:"0.875rem", color:"var(--color-text-primary)", fontStyle:"italic", fontWeight:600, lineHeight:1.6 }}>{lesson.insight}</p></div>
              <div style={{ marginBottom:28 }}><TypewriterViz/></div>
              <div style={{ padding:"20px 22px", background:"var(--color-surface-2)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", marginBottom:28 }}><div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}><Target size={15} color="var(--color-accent-text)"/><span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--color-accent-text)", letterSpacing:"0.08em" }}>TANTANGAN PRAKTIK</span></div><div style={{ fontSize:"0.875rem", lineHeight:1.7, color:"var(--color-text-secondary)", whiteSpace:"pre-wrap" }}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderRadius:"var(--radius-md)", background:showAILab?`linear-gradient(135deg,${C},#7C3AED)`:"var(--color-surface-3)", border:"1px solid", borderColor:showAILab?"transparent":"var(--color-border)", color:showAILab?"#FFF":"var(--color-text-secondary)", fontSize:"0.875rem", fontWeight:700, cursor:"pointer", width:"100%", justifyContent:"center", marginBottom:showAILab?20:0, fontFamily:"var(--font-sans)" }}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{ padding:0 }}>
            <div style={{ padding:"20px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)", display:"flex", alignItems:"center", gap:10 }}><MessageSquare size={18} color="var(--color-accent-text)"/><span style={{ fontWeight:800, fontSize:"1rem" }}>Cek Pemahaman</span>{quizAnswer&&<span style={{ marginLeft:"auto", fontSize:"0.75rem", fontWeight:700, padding:"2px 10px", borderRadius:100, background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)", color:quizAnswer.correct?"#16A34A":"#DC2626" }}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div>
            <div style={{ padding:"24px 28px" }}>
              <p style={{ fontWeight:700, fontSize:"1rem", color:"var(--color-text-primary)", marginBottom:20, lineHeight:1.5 }}>{lesson.quiz.question}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{ padding:"14px 18px", borderRadius:"var(--radius-md)", background:bg, border, color, fontSize:"0.875rem", fontWeight:500, cursor:quizAnswer?"not-allowed":"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10, lineHeight:1.5, fontFamily:"var(--font-sans)" }}><span style={{ width:24, height:24, borderRadius:"50%", background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6875rem", fontWeight:800, color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)", flexShrink:0 }}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}
              </div>
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
