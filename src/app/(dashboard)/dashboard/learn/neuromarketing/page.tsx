"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { BarChart2, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#14B8A6"; const CL="rgba(20,184,166,";

const LESSONS = [
  { id:"cognitive-load", title:"Beban Kognitif & Keputusan", concept:"Mengapa Otak Menghindari Kompleksitas", body:`**Beban kognitif** mengacu pada jumlah usaha mental yang diperlukan untuk memproses informasi. Dalam konteks digital marketing, setiap elemen visual, teks, dan interaksi yang kamu tampilkan menambah beban kognitif audiens.

Riset neurosains menunjukkan bahwa otak manusia bisa memproses maksimal **4±1 chunk informasi** secara simultan (George Miller's Law yang diperbarui). Lebih dari itu, otak masuk ke mode "cognitive overload" — hasilnya: decision paralysis, bounce, atau close tab.

Implikasi praktis: dashboard analitik yang menampilkan 20 metrik sekaligus sebenarnya KURANG informatif dibanding dashboard yang menampilkan 3-4 metrik kunci dengan konteks yang jelas. Paradoksnya: **kurang informasi = lebih banyak insight**.

Prinsip ini disebut **Progressive Disclosure** — tampilkan informasi secara bertahap, mulai dari yang paling penting. Detail tersedia on-demand, bukan by-default.`, insight:"Mengurangi pilihan dari 24 menjadi 6 meningkatkan conversion sebesar 600% (Jam Experiment, Iyengar & Lepper)", challenge:"**AUDIT DASHBOARD:** Buka dashboard analitik yang kamu gunakan. Hitung berapa metrik yang ditampilkan di halaman pertama. Apakah lebih dari 5? Identifikasi mana yang bisa disembunyikan di second-level.", quiz:{ question:"Sebuah landing page menampilkan 8 benefit produk, 3 CTA button, dan 2 testimonial di above the fold. Apa masalah utamanya?", options:["Tidak ada masalah, semakin lengkap informasi semakin baik","Cognitive overload — terlalu banyak elemen menyebabkan otak tidak bisa memprioritaskan dan user tidak mengambil aksi apapun","Masalahnya hanya di jumlah CTA, benefit dan testimonial tidak bermasalah","8 benefit terlalu sedikit, seharusnya tampilkan semua"], correct:1, explanation:"13 elemen visual di above the fold jauh melampaui kapasitas working memory (4±1 items). User akan merasa overwhelmed dan meninggalkan halaman tanpa mengambil aksi. Solusi: pilih 1 benefit utama, 1 CTA, 1 social proof." } },
  { id:"color-psychology", title:"Psikologi Warna dalam Marketing", concept:"Bagaimana Warna Memicu Respons Emosional", body:`Warna bukan sekadar estetika — warna adalah **trigger neurologis** yang mempengaruhi emosi, persepsi, dan keputusan pembelian dalam milidetik.

**Red (Merah):** Meningkatkan heart rate, menciptakan urgency. Efektif untuk: flash sale, limited offer, food brand. Aktivasi: amygdala (fight-or-flight).

**Blue (Biru):** Menurunkan heart rate, membangun trust. Efektif untuk: fintech, healthcare, corporate. Aktivasi: prefrontal cortex (rational thinking).

**Green:** Asosiasi dengan keamanan dan persetujuan. Efektif untuk: CTA "confirm", eco-friendly brand, health product.

**Orange/Yellow:** Optimisme dan energi tanpa agresivitas merah. Efektif untuk: subscription CTA, free trial, youth brand.

Yang penting dipahami: efek warna bukan universal — konteks budaya dan personal sangat mempengaruhi. Di Indonesia, merah bisa berarti keberuntungan (konteks Imlek) atau bahaya (konteks lalu lintas). Selalu **A/B test warna CTA** daripada mengandalkan teori general.`, insight:"Mengubah warna CTA dari hijau ke merah meningkatkan conversion 21% di satu studi — tapi hasilnya bisa berbeda untuk setiap audiens", challenge:"**EKSPERIMEN WARNA:** Siapkan 2 versi CTA button — merah dan biru — untuk konten yang sama. Jalankan selama 3 hari dan bandingkan CTR-nya!", quiz:{ question:"Sebuah brand skincare premium menggunakan CTA warna merah terang dengan teks 'BELI SEKARANG!!!'. Apa potensi masalahnya?", options:["Tidak ada masalah, merah selalu meningkatkan urgency","Warna merah agresif + teks caps lock bisa menciptakan 'desperation signal' yang menurunkan perceived brand value untuk produk premium","Seharusnya menggunakan warna hijau karena skincare = health","Caps lock meningkatkan readability di mobile"], correct:1, explanation:"Untuk brand premium, urgency yang terlalu agresif justru menurunkan persepsi luxury. Brand premium lebih efektif menggunakan warna muted (navy, forest green, gold) dengan CTA yang tenang: 'Discover Now' atau 'Elevate Your Routine'." } },
  { id:"dashboard-design", title:"Desain Dashboard yang Efektif", concept:"Data yang Actionable, Bukan Sekadar Informatif", body:`Dashboard analitik yang baik bukan yang menampilkan DATA paling banyak, tapi yang menghasilkan **AKSI paling cepat**. Prinsip neuromarketing berlaku di sini: kurangi cognitive load, tingkatkan signal-to-noise ratio.

**Framework Dashboard A.C.T.:**

**A — Actionable:** Setiap metrik yang ditampilkan harus menjawab "Apa yang harus saya lakukan?" Jika metrik hanya informatif tanpa implikasi aksi → pindahkan ke detail page.

**C — Contextual:** Angka tanpa konteks tidak bermakna. "10.000 views" — bagus atau buruk? Tambahkan: perbandingan dengan periode lalu, benchmark industri, atau target yang ditetapkan.

**T — Timely:** Informasi yang ditampilkan harus relevan dengan timeframe keputusan user. Dashboard harian menampilkan metrik harian, bukan lifetime stats.

**Anti-pattern yang harus dihindari:** pie chart untuk lebih dari 4 segmen, angka tanpa trend direction, metrik yang tidak bisa dipengaruhi oleh user.`, insight:"Dashboard yang mengikuti framework A.C.T. mengurangi waktu pengambilan keputusan dari rata-rata 15 menit menjadi 3 menit", challenge:"**REDESAIN:** Ambil screenshot salah satu dashboard analitik kamu. Evaluasi setiap metrik: apakah Actionable, Contextual, dan Timely? Hilangkan yang tidak memenuhi minimal 2 dari 3 kriteria.", quiz:{ question:"Dashboard menampilkan 'Total Views: 150.000' tanpa konteks tambahan. Bagaimana cara memperbaikinya?", options:["Tambahkan warna agar angka lebih menarik","Ganti font menjadi lebih besar","Tambahkan konteks: perbandingan vs minggu lalu (+12%), vs target (75% tercapai), dan trend arrow","Pindahkan angka ke sidebar"], correct:2, explanation:"Angka mentah tanpa konteks tidak actionable. Dengan menambahkan comparison (vs period lalu), progress (vs target), dan visual direction (trend arrow), user bisa langsung menilai apakah performa baik/buruk dan apakah perlu adjustment." } },
  { id:"nudge-theory", title:"Nudge Theory untuk Konversi", concept:"Mengarahkan Keputusan Tanpa Memaksa", body:`**Nudge theory** (Richard Thaler, Nobel Prize 2017) menjelaskan bagaimana perubahan kecil dalam cara opsi disajikan (**choice architecture**) bisa secara signifikan mengubah perilaku manusia — tanpa larangan atau mandat.

**Nudge Patterns untuk Digital Marketing:**

**Default Bias:** Jadikan opsi yang kamu inginkan sebagai default. Contoh: checkbox "Subscribe to newsletter" sudah tercentang by default.

**Anchoring:** Tampilkan harga tertinggi terlebih dahulu, sehingga harga menengah terasa "murah". Contoh: Paket Gold (Rp999rb) → Paket Silver (Rp499rb) → Paket Bronze (Rp199rb).

**Social Proof Nudge:** "847 orang sedang melihat produk ini" → menciptakan FOMO tanpa memaksa.

**Decoy Effect:** Tambahkan opsi "decoy" yang sengaja tidak menarik untuk membuat opsi target terlihat lebih bernilai.

**Scarcity Nudge:** "Tersisa 3 item" → mengaktifkan loss aversion yang lebih kuat dari gain motivation.

Kunci etis: nudge harus **transparan** dan **menguntungkan user**, bukan manipulatif.`, insight:"Decoy pricing meningkatkan pemilihan paket premium sebesar 40-70% di berbagai studi e-commerce", challenge:"**IDENTIFIKASI NUDGE:** Buka 3 halaman produk di marketplace favorit kamu. Identifikasi minimal 5 nudge yang digunakan. Mana yang etis dan mana yang borderline manipulatif?", quiz:{ question:"Toko online menampilkan 'Hanya tersisa 2!' padahal stoknya sebenarnya masih banyak. Ini termasuk nudge yang bagaimana?", options:["Nudge efektif yang harus selalu digunakan","Nudge tidak etis — false scarcity bisa merusak kepercayaan jika buyer menyadarinya","Bukan nudge, ini adalah strategi marketing standar","Etis selama meningkatkan penjualan"], correct:1, explanation:"False scarcity melanggar prinsip transparansi nudge theory. Jika buyer menemukan bahwa scarcity-nya palsu (misal: produk selalu 'tersisa 2'), trust collapse terjadi dan brand reputation rusak jangka panjang. Gunakan real scarcity atau time-based urgency." } },
];

function HeartbeatViz() {
  const [ctaColor, setCtaColor] = useState<"red"|"blue">("red");
  const bpm = ctaColor === "red" ? 95 : 65;
  const speed = ctaColor === "red" ? 0.6 : 1.0;
  return (
    <div style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)" }}>
        <div style={{ fontWeight:800, fontSize:"1rem" }}>CTA Color × Heart Rate Simulator</div>
        <div className="caption" style={{ marginTop:4 }}>Toggle warna CTA dan lihat dampaknya pada respons fisiologis</div>
      </div>
      <div style={{ padding:24 }}>
        <div style={{ display:"flex", gap:12, marginBottom:24, justifyContent:"center" }}>
          <button onClick={()=>setCtaColor("red")} style={{ padding:"12px 28px", borderRadius:"var(--radius-md)", background:ctaColor==="red"?"#EF4444":"var(--color-surface-2)", color:ctaColor==="red"?"#FFF":"var(--color-text-secondary)", border:ctaColor==="red"?"2px solid #EF4444":"1px solid var(--color-border)", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", fontFamily:"var(--font-sans)", display:"flex", alignItems:"center", gap:8 }}><Icon icon="solar:button-bold-duotone" width={18} /> CTA Merah</button>
          <button onClick={()=>setCtaColor("blue")} style={{ padding:"12px 28px", borderRadius:"var(--radius-md)", background:ctaColor==="blue"?"#3B82F6":"var(--color-surface-2)", color:ctaColor==="blue"?"#FFF":"var(--color-text-secondary)", border:ctaColor==="blue"?"2px solid #3B82F6":"1px solid var(--color-border)", fontWeight:700, fontSize:"0.875rem", cursor:"pointer", fontFamily:"var(--font-sans)", display:"flex", alignItems:"center", gap:8 }}><Icon icon="solar:button-bold-duotone" width={18} /> CTA Biru</button>
        </div>
        {/* Heartbeat SVG */}
        <div style={{ position:"relative", height:120, display:"flex", alignItems:"center", justifyContent:"center", background:"var(--color-surface-2)", borderRadius:"var(--radius-md)", border:"1px solid var(--color-border)", overflow:"hidden" }}>
          <svg width="100%" height="80" viewBox="0 0 400 80" style={{ maxWidth:400 }}>
            <motion.path
              d="M0,40 L60,40 L80,40 L90,15 L100,65 L110,25 L120,55 L130,40 L200,40 L220,40 L230,15 L240,65 L250,25 L260,55 L270,40 L340,40 L360,40 L370,15 L380,65 L390,25 L400,40"
              fill="none" stroke={ctaColor==="red"?"#EF4444":"#3B82F6"} strokeWidth="2.5" strokeLinecap="round"
              initial={{ pathLength:0, opacity:0 }}
              animate={{ pathLength:1, opacity:1 }}
              transition={{ duration:speed*2, repeat:Infinity, ease:"linear" }}
            />
          </svg>
          <div style={{ position:"absolute", right:16, top:12, display:"flex", alignItems:"center", gap:6 }}>
            <motion.div animate={{ scale:[1,1.3,1] }} transition={{ duration:speed, repeat:Infinity }} style={{ width:10, height:10, borderRadius:"50%", background:ctaColor==="red"?"#EF4444":"#3B82F6" }} />
            <span style={{ fontWeight:800, fontSize:"1.25rem", color:ctaColor==="red"?"#EF4444":"#3B82F6", fontFamily:"var(--font-mono)" }}>{bpm} BPM</span>
          </div>
        </div>
        <motion.div key={ctaColor} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ marginTop:16, padding:"14px 16px", background:ctaColor==="red"?"rgba(239,68,68,0.08)":"rgba(59,130,246,0.08)", border:`1px solid ${ctaColor==="red"?"rgba(239,68,68,0.25)":"rgba(59,130,246,0.25)"}`, borderRadius:"var(--radius-sm)", textAlign:"center" }}>
          <div style={{ fontWeight:700, fontSize:"0.875rem", color:ctaColor==="red"?"#EF4444":"#3B82F6", marginBottom:4 }}>{ctaColor==="red"?"Respons Urgency Tinggi":"Respons Trust & Calm"}</div>
          <div style={{ fontSize:"0.8125rem", color:"var(--color-text-secondary)" }}>{ctaColor==="red"?"Warna merah mengaktifkan amygdala — meningkatkan heart rate dan menciptakan sense of urgency. Cocok untuk flash sale.":"Warna biru mengaktifkan prefrontal cortex — menurunkan anxiety dan membangun trust. Cocok untuk produk premium dan fintech."}</div>
        </motion.div>
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul Neuromarketing. Tanyakan tentang beban kognitif, psikologi warna, atau nudge theory!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("neuromarketing",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#5EEAD4"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: Neuromarketing</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#0D9488)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#0D9488)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#0D9488)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang neuromarketing..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#0D9488)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function NeuromarketingPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#0D9488)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><BarChart2 size={13} color="#5EEAD4"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#5EEAD4",letterSpacing:"0.06em"}}>MODUL 7 · NEUROMARKETING</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>Neuromarketing & Beban Kognitif</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Desain analitik untuk pengambilan keputusan instan menggunakan prinsip neurosains.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 3 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#5EEAD4",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}>
            <div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BarChart2 size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><HeartbeatViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#0D9488)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><BarChart2 size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
