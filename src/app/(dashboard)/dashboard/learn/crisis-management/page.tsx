"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Shield, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#F59E0B"; const CL="rgba(245,158,11,";

const NEGATIVE_WORDS = ["benci","jelek","buruk","mahal","tipu","penipuan","bohong","scam","gagal","kecewa","rugi","sampah","parah","zonk","menyesal","palsu","berbahaya","toxic","hoax","lambat","rusak","cacat"];
const POSITIVE_WORDS = ["bagus","suka","mantap","keren","senang","puas","berkualitas","terbaik","recommended","aman","nyaman","terpercaya","cepat","murah","asli","original","love","cantik","efektif","bersih"];

const LESSONS = [
  { id:"anatomi-krisis", title:"Anatomi Krisis Digital", concept:"Bagaimana Krisis Muncul dan Berkembang", body:`**Krisis digital** tidak muncul tiba-tiba — ia mengikuti pola yang bisa diprediksi. Memahami anatomi ini memungkinkan tim kamu merespons sebelum krisis mencapai puncak.

**5 Fase Krisis Digital:**

**Fase 1 — Spark (0-2 jam):** Satu complaint viral, review negatif dari influencer, atau skandal bocor. Volume mention masih rendah tapi sentiment sangat negatif.

**Fase 2 — Kindling (2-6 jam):** Netizen mulai amplify. Screenshot dishare, thread dibuat, media online mulai melirik. Volume naik 5-10x.

**Fase 3 — Blaze (6-24 jam):** Trending topic. Media mainstream coverage. Hashtag negatif bermunculan. Volume naik 50-100x dari baseline.

**Fase 4 — Inferno (24-72 jam):** Puncak krisis. Semua membicarakan brand kamu secara negatif. Penjualan turun drastis. Investor khawatir.

**Fase 5 — Ember (72 jam+):** Volume menurun tapi sentimen negatif masih tersisa. Recovery dimulai di sini.

**Golden Window:** Respons terbaik terjadi di Fase 1-2 (0-6 jam pertama). Setelah Fase 3, damage control menjadi 10x lebih mahal dan 10x kurang efektif.`, insight:"Brand yang merespons dalam 1 jam pertama memiliki 70% peluang menghentikan krisis sebelum Fase 3", challenge:"**TIMELINE ANALYSIS:** Cari satu kasus krisis digital brand Indonesia dalam 6 bulan terakhir. Map ke 5 fase di atas: kapan setiap fase terjadi, apa trigger-nya, dan di fase mana brand mulai merespons?", quiz:{ question:"Sebuah brand menemukan tweet negatif viral (50 RT dalam 1 jam) tentang produk mereka. Apa respons terbaik?", options:["Tunggu sampai trending untuk memastikan ini bukan noise","Segera verifikasi fakta dan siapkan initial response — ini masih di Golden Window (Fase 1)","Hapus semua komentar negatif di akun brand","Diam saja, biasanya netizen akan lupa dalam 24 jam"], correct:1, explanation:"50 RT dalam 1 jam menunjukkan velocity tinggi — indikasi potensial memasuki Fase 2. Golden Window masih terbuka di Fase 1. Respons cepat (verifikasi + acknowledgement) bisa menghentikan eskalasi sebelum media mainstream ikut." } },
  { id:"deteksi-sentimen", title:"Deteksi Sentimen Real-Time", concept:"Monitoring Otomatis dengan AI", body:`**Deteksi sentimen** adalah kemampuan AI untuk mengklasifikasikan teks sebagai positif, negatif, atau netral secara otomatis. Dalam konteks crisis management, ini menjadi **early warning system** (EWS) yang berjalan 24/7.

**Arsitektur EWS Sentimen:**

**Input Layer:** Monitoring mention brand di Twitter/X, Instagram comments, TikTok comments, review marketplace, dan forum (Kaskus, Reddit Indonesia).

**Processing Layer:** NLP menganalisis setiap mention: sentiment score (-1 sampai +1), emotion detection (marah, kecewa, takut), dan topic extraction (apa yang dikeluhkan).

**Alert Layer:** Jika sentiment score rata-rata turun di bawah threshold (-0.3) atau volume mention negatif naik >200% dari baseline → trigger alert ke tim crisis management.

**Dashboard Layer:** Visualisasi real-time: sentiment trend, word cloud kata negatif, top complaints, dan sumber utama krisis.

Kunci efektivitas: **speed of detection**. Sistem yang mendeteksi anomali dalam 15 menit pertama memberi golden window penuh kepada tim responder.`, insight:"AI Sentiment Detection mengurangi waktu deteksi krisis dari rata-rata 4 jam (manual monitoring) menjadi 12 menit", challenge:"**SIMULASI:** Tulis 10 kalimat campuran (positif dan negatif) tentang brand fiktif. Gunakan AI Lab untuk menganalisis sentimen masing-masing. Seberapa akurat deteksinya?", quiz:{ question:"Sistem EWS mendeteksi lonjakan mention negatif 300% tapi sentiment score rata-rata hanya -0.15. Apa interpretasinya?", options:["Krisis besar sedang terjadi — volume tinggi berarti darurat","Volume tinggi tapi sentiment score rendah menunjukkan noise atau concern ringan, bukan krisis — perlu investigasi lebih dalam sebelum eskalasi","Sistem error, sentiment score seharusnya lebih negatif","Abaikan karena sentiment score masih di atas -0.3"], correct:1, explanation:"Diskoneksi antara volume (tinggi) dan sentiment score (moderate) menunjukkan bahwa meskipun banyak orang membicarakan brand, tone-nya bukan sangat negatif. Bisa jadi diskusi netral yang kebetulan tinggi volume-nya. Perlu investigasi manual sebelum eskalasi." } },
  { id:"framework-empati", title:"Framework Respons Empati", concept:"Cara Merespons yang Meredakan, Bukan Memperburuk", body:`Respons krisis yang efektif bukan sekadar menyampaikan fakta — ia harus **meredakan emosi** audiens. Di sinilah **empathetic response framework** berperan.

**Framework E.A.R.:**

**E — Empathize (Empati):** Akui perasaan audiens terlebih dahulu. "Kami memahami kekecewaan Anda" atau "Kami mendengar kekhawatiran Anda". JANGAN langsung defensif.

**A — Acknowledge (Akui):** Akui bahwa ada masalah, meskipun investigasi masih berlangsung. "Kami mengakui ada pengalaman yang tidak sesuai standar kami" lebih baik dari diam atau deny.

**R — Resolve (Selesaikan):** Berikan action plan konkret. Apa yang sedang dilakukan, timeline-nya, dan bagaimana audiens bisa mendapat update. "Tim kami sedang menginvestigasi dan kami akan memberikan update dalam 4 jam."

**Anti-Patterns yang WAJIB dihindari:**
- ❌ "Kami tidak bertanggung jawab" → defensif, memperburuk
- ❌ Menghapus komentar negatif → Streisand Effect, menjadi lebih viral
- ❌ Menyalahkan customer → reputational suicide
- ❌ Template response yang terasa bot → menunjukkan brand tidak peduli`, insight:"Respons E.A.R. menurunkan sentiment negatif 3x lebih cepat dibanding respons yang langsung defensif", challenge:"**ROLE PLAY:** Bayangkan 3 skenario krisis berbeda. Tulis respons E.A.R. untuk masing-masing. Minta AI Lab review apakah tone-nya sudah tepat!", quiz:{ question:"Pelanggan marah di Twitter: 'Produk @BrandX membuat kulit saya iritasi parah! JANGAN BELI!' Apa respons terbaik?", options:["'Mohon maaf, produk kami sudah lolos BPOM jadi aman digunakan'","'Kami sangat menyesal mendengar pengalaman Anda. Keselamatan pelanggan adalah prioritas kami. Bolehkah kami menghubungi Anda via DM untuk membantu dan menginvestigasi lebih lanjut?'","'Setiap kulit berbeda, bukan salah produk kami'","Tidak merespons dan berharap tweet itu tidak viral"], correct:1, explanation:"Respons ini mengikuti E.A.R.: Empathize ('sangat menyesal'), Acknowledge (mengakui ada pengalaman buruk), Resolve (menawarkan follow-up via DM). Memindahkan percakapan ke DM juga mengurangi public spectacle tanpa terkesan menghapus/menghindari." } },
  { id:"post-crisis", title:"Post-Crisis Recovery", concept:"Membangun Kembali Setelah Badai", body:`Krisis yang berhasil dikelola bukan akhir — justru fase **recovery** menentukan apakah brand akan lebih kuat atau lebih lemah jangka panjang.

**Framework Recovery 4R:**

**R1 — Rebuild Trust:** Aksi nyata yang membuktikan brand telah berubah. Jika krisis karena kualitas produk → tunjukkan improvement nyata dengan transparansi proses QC.

**R2 — Re-engage Community:** Libatkan kembali komunitas yang kecewa. Program compensation, early access, atau co-creation memberi rasa ownership dan mempercepat healing.

**R3 — Reframe Narrative:** Ubah narasi dari "brand yang gagal" menjadi "brand yang bertanggung jawab dan belajar dari kesalahan". Content strategy harus mendukung narasi baru ini.

**R4 — Reinforce Systems:** Perbaiki sistem agar krisis serupa tidak terulang. Implementasi EWS yang lebih baik, SOP respons yang lebih cepat, dan training tim crisis.

**Timeline Recovery (tipikal):**
- Minggu 1-2: Trust Rebuilding — aksi nyata + transparansi
- Minggu 3-4: Re-engagement — program pelibatan komunitas
- Bulan 2-3: Narrative reframing — konten positif konsisten
- Bulan 4+: System reinforcement — audit dan improvement`, insight:"Brand yang menerapkan Recovery 4R setelah krisis rata-rata mendapat 15-20% peningkatan brand loyalty — crisis bisa menjadi opportunity", challenge:"**RECOVERY PLAN:** Pilih satu kasus krisis digital yang pernah kamu pelajari. Rancang Recovery 4R plan dengan timeline dan aksi spesifik untuk setiap R!", quiz:{ question:"3 bulan pasca krisis, sentiment sudah kembali netral tapi penjualan masih di bawah pre-crisis. Apa langkah paling efektif?", options:["Iklan agresif untuk boost penjualan","Turunkan harga drastis","Re-engage community yang pernah loyal dengan program eksklusif dan co-creation — trust harus dibangun kembali sebelum conversion bisa pulih","Tidak perlu aksi khusus, penjualan akan recover sendiri"], correct:2, explanation:"Sentiment netral ≠ trust recovered. Penjualan yang belum pulih menunjukkan customer masih ragu meskipun sudah berhenti marah. Re-engagement (bukan hanya awareness) membangun trust kembali melalui experience positif langsung." } },
];

function SentimentPendulumViz() {
  const [text, setText] = useState("");
  const score = useMemo(() => {
    if (!text.trim()) return 0;
    const words = text.toLowerCase().split(/\s+/);
    let s = 0;
    words.forEach(w => { if (NEGATIVE_WORDS.some(nw => w.includes(nw))) s -= 1; if (POSITIVE_WORDS.some(pw => w.includes(pw))) s += 1; });
    return Math.max(-5, Math.min(5, s));
  }, [text]);
  const angle = score * 12;
  const getZone = () => {
    if (score <= -3) return { label: "BAHAYA KRITIS", icon: "solar:shield-warning-bold-duotone", color: "#EF4444", tip: "Sentimen sangat negatif! Aktivasi tim crisis management segera." };
    if (score <= -1) return { label: "WASPADA", icon: "solar:danger-bold-duotone", color: "#F59E0B", tip: "Beberapa sinyal negatif terdeteksi. Monitor dan siapkan respons E.A.R." };
    if (score === 0) return { label: "NETRAL", icon: "solar:wheel-bold-duotone", color: "#6B7280", tip: "Belum ada sinyal sentimen yang kuat." };
    if (score <= 2) return { label: "POSITIF", icon: "solar:smile-circle-bold-duotone", color: "#22C55E", tip: "Sentimen positif. Gunakan momentum ini untuk engagement." };
    return { label: "SANGAT POSITIF", icon: "solar:star-rainbow-bold-duotone", color: "#10B981", tip: "Sentimen sangat positif! Amplifikasi dengan user-generated content." };
  };
  const zone = getZone();
  return (
    <div style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)" }}>
        <div style={{ fontWeight:800, fontSize:"1rem" }}>Sentiment Pendulum Detector</div>
        <div className="caption" style={{ marginTop:4 }}>Ketik teks dan lihat pendulum bergerak berdasarkan sentimen</div>
      </div>
      <div style={{ padding:24 }}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Ketik komentar, review, atau mention brand..." rows={3} style={{ width:"100%", border:"1px solid var(--color-border)", borderRadius:"var(--radius-md)", padding:"12px 14px", fontSize:"0.875rem", color:"var(--color-text-primary)", fontFamily:"var(--font-sans)", background:"var(--color-surface-2)", resize:"none", outline:"none", lineHeight:1.5, marginBottom:20 }} />
        {/* Pendulum */}
        <div style={{ position:"relative", height:180, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start" }}>
          <div style={{ position:"absolute", top:0, width:"100%", display:"flex", justifyContent:"space-between", padding:"0 20px" }}>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#EF4444" }}>BAHAYA</span>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#6B7280" }}>NETRAL</span>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#22C55E" }}>AMAN</span>
          </div>
          {/* Gauge background */}
          <div style={{ width:240, height:120, borderRadius:"120px 120px 0 0", background:"linear-gradient(90deg, rgba(239,68,68,0.1) 0%, rgba(245,158,11,0.1) 25%, rgba(107,114,128,0.05) 50%, rgba(34,197,94,0.1) 75%, rgba(16,185,129,0.1) 100%)", border:"1px solid var(--color-border)", borderBottom:"none", marginTop:16, position:"relative", overflow:"hidden" }}>
            {/* Pendulum arm */}
            <motion.div animate={{ rotate: angle }} transition={{ type:"spring", stiffness:100, damping:15 }} style={{ position:"absolute", bottom:0, left:"50%", width:3, height:100, background:`linear-gradient(to top, ${zone.color}, transparent)`, transformOrigin:"bottom center", borderRadius:2 }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:zone.color, border:"3px solid var(--color-surface)", position:"absolute", top:-8, left:-6.5, boxShadow:`0 0 10px ${zone.color}60` }} />
            </motion.div>
          </div>
        </div>
        {text.trim() && (
          <motion.div key={zone.label} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ marginTop:16, padding:"14px 16px", background:`${zone.color}10`, border:`1px solid ${zone.color}30`, borderRadius:"var(--radius-sm)", textAlign:"center" }}>
            <div style={{ fontWeight:800, fontSize:"0.9375rem", color:zone.color, marginBottom:4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon icon={zone.icon} width={20} />
              {zone.label}
            </div>
            <div style={{ fontSize:"0.8125rem", color:"var(--color-text-secondary)" }}>{zone.tip}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul Manajemen Krisis. Tanyakan tentang deteksi sentimen, respons empati, atau post-crisis recovery!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("crisis-management",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#FDE68A"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: Manajemen Krisis</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#D97706)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#D97706)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#D97706)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang manajemen krisis..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#D97706)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function CrisisManagementPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#D97706)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><Shield size={13} color="#FDE68A"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#FDE68A",letterSpacing:"0.06em"}}>MODUL 8 · CRISIS MANAGEMENT</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>Manajemen Krisis Digital</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Sistem AI untuk memantau, mendeteksi, dan merespon sentimen negatif dengan empati.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 2 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#FDE68A",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}>
            <div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Shield size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><SentimentPendulumViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#D97706)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><Shield size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
