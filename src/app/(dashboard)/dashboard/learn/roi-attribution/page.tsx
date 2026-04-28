"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { DollarSign, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#6366F1"; const CL="rgba(99,102,241,";

const LESSONS = [
  { id:"engagement-revenue", title:"Engagement ke Revenue", concept:"Mitos vs. Realita Konversi", body:`Banyak marketer terjebak dalam **vanity metrics** — likes, views, followers — tanpa menghubungkannya dengan **revenue nyata**. Pertanyaan kritis yang jarang dijawab: "Berapa rupiah yang dihasilkan dari 1.000 likes?"

Realita yang harus dihadapi: **tidak semua engagement sama nilainya**. Save dan share jauh lebih bernilai dari like karena menunjukkan intent yang lebih tinggi. Comment dengan pertanyaan tentang produk lebih bernilai dari comment emoji.

**Hierarchy of Engagement Value:**
1. **Purchase** (konversi langsung) → highest value
2. **Add to Cart / Inquiry** → high commercial intent
3. **Save / Bookmark** → consideration stage
4. **Share** → advocacy, organic reach multiplier
5. **Comment** → engagement, bervariasi tergantung konten komentar
6. **Like** → awareness, lowest direct commercial value

Memahami hierarki ini membantu kamu mengalokasikan effort ke konten yang menghasilkan engagement BERNILAI TINGGI, bukan sekadar engagement BERJUMLAH BANYAK.`, insight:"Konten dengan save rate tinggi menghasilkan 4x lebih banyak konversi dibanding konten dengan like rate tinggi", challenge:"**AUDIT ENGAGEMENT:** Ambil 5 post terakhir kamu. Untuk setiap post, hitung: likes, comments, saves, shares. Hitung rasio save-to-like. Post mana yang paling 'valuable'?", quiz:{ question:"Post A: 10.000 likes, 20 saves. Post B: 1.000 likes, 200 saves. Mana yang lebih bernilai secara komersial?", options:["Post A karena likes-nya 10x lebih banyak","Post B — save rate 20% menunjukkan buying consideration yang jauh lebih tinggi dari Post A (save rate 0.2%)","Keduanya sama nilainya","Tidak bisa ditentukan tanpa data followers"], correct:1, explanation:"Save menunjukkan intent untuk kembali dan membeli. Post B memiliki save rate 20% vs Post A 0.2% — artinya audiens Post B 100x lebih mungkin dalam consideration stage. Dalam perspective revenue, Post B jauh lebih bernilai." } },
  { id:"attribution-models", title:"Model Atribusi", concept:"First-Touch, Last-Touch, Multi-Touch", body:`**Model atribusi** menentukan bagaimana kredit penjualan dibagi ke touchpoint marketing. Pilihan model yang salah bisa menyebabkan alokasi budget yang keliru.

**First-Touch Attribution:** 100% kredit ke touchpoint pertama (awareness). Kelebihan: mengidentifikasi channel terbaik untuk akuisisi. Kelemahan: mengabaikan semua nurturing yang terjadi setelahnya.

**Last-Touch Attribution:** 100% kredit ke touchpoint terakhir sebelum pembelian. Kelebihan: mudah diimplementasi. Kelemahan: mengabaikan semua effort yang membangun awareness dan consideration.

**Multi-Touch Attribution (MTA):** Kredit dibagi ke semua touchpoint. Variasi: Linear (sama rata), Time Decay (touchpoint terakhir lebih besar), U-Shaped (first+last touch masing-masing 40%, sisanya 20% dibagi rata ke tengah).

**Rekomendasi untuk bisnis kecil-menengah:** Mulai dengan **U-Shaped** karena memberikan bobot yang fair ke awareness (first touch) dan conversion (last touch) tanpa mengabaikan nurturing di tengah.`, insight:"Bisnis yang beralih dari Last-Touch ke Multi-Touch attribution mengalokasikan budget 30% lebih efisien — karena awareness channel yang sebelumnya undervalued akhirnya mendapat kredit", challenge:"**MAPPING JOURNEY:** Pilih satu pembelian terakhir yang kamu lakukan secara online. Trace balik: apa touchpoint pertama? Apa yang terjadi di tengah? Apa touchpoint terakhir sebelum beli? Apply 3 model atribusi.", quiz:{ question:"Brand kamu menjalankan TikTok ads (awareness) → Instagram retargeting → Google Search → Purchase. Dengan U-Shaped attribution, berapa kredit TikTok?", options:["100% karena first touch","0% karena bukan last touch","40% — U-Shaped memberikan 40% ke first touch dan 40% ke last touch","25% karena dibagi sama rata"], correct:2, explanation:"U-Shaped: First touch (TikTok ads) = 40%, Last touch (Google Search) = 40%, Middle touches (IG retargeting) membagi sisa 20%. Model ini menghargai TikTok sebagai driver awareness tanpa mengabaikan peran Google sebagai converter." } },
  { id:"roas-clv", title:"ROAS & Customer Lifetime Value", concept:"Metric yang Sebenarnya Penting", body:`**ROAS (Return On Ad Spend)** mengukur berapa rupiah revenue yang dihasilkan per rupiah yang dibelanjakan untuk iklan. Formula: Revenue / Ad Spend × 100%.

ROAS 300% berarti setiap Rp1.000 yang dibelanjakan menghasilkan Rp3.000 revenue. Tapi ROAS saja BUKAN indikator sukses yang lengkap.

**Mengapa ROAS bisa misleading:**
- ROAS tidak memperhitungkan COGS (biaya produksi)
- ROAS tinggi di channel kecil bisa kurang impactful dari ROAS rendah di channel besar
- ROAS tidak memperhitungkan repeat purchase (customer lifetime value)

**Customer Lifetime Value (CLV):** Total revenue yang dihasilkan satu customer selama hubungannya dengan brand kamu. Formula sederhana: Average Order Value × Purchase Frequency × Customer Lifespan.

**CLV vs CAC Ratio:** Jika CLV/CAC > 3, bisnis kamu sehat. Artinya setiap rupiah yang kamu keluarkan untuk akuisisi menghasilkan 3x revenue jangka panjang. Jika < 1, kamu mengeluarkan lebih banyak untuk mendapatkan customer daripada yang mereka hasilkan.`, insight:"Brand yang mengoptimasi CLV (bukan hanya ROAS) memiliki profitabilitas 2.5x lebih tinggi dalam jarak 12 bulan", challenge:"**HITUNG CLV:** Estimasi CLV untuk bisnis/niche kamu: rata-rata order value × frekuensi pembelian per tahun × rata-rata berapa tahun customer bertahan. Bandingkan dengan biaya akuisisi per customer.", quiz:{ question:"ROAS campaign A = 500% (revenue Rp5M dari spend Rp1M). ROAS campaign B = 200% tapi CLV customer-nya 3x lebih tinggi. Mana yang lebih baik jangka panjang?", options:["Campaign A karena ROAS-nya lebih tinggi","Campaign B — CLV 3x lebih tinggi berarti customer dari campaign B menghasilkan total revenue jauh lebih besar meski akuisisinya lebih mahal","Tidak bisa dibandingkan karena metriknya berbeda","ROAS selalu lebih penting dari CLV"], correct:1, explanation:"Campaign B menghasilkan customer yang membeli berulang kali. Jika CLV campaign B = Rp15M vs CLV campaign A = Rp5M, total return campaign B di Rp15M/Rp2.5M = 600% secara lifetime — lebih sustainable dan profitable." } },
  { id:"dashboard-attribution", title:"Dashboard Atribusi untuk Tim", concept:"Dari Data ke Keputusan Budget", body:`Dashboard atribusi yang efektif harus membantu tim menjawab satu pertanyaan: **"Di mana kami harus menginvestasikan rupiah berikutnya?"**

**Komponen Dashboard Atribusi:**

**Panel 1 — Channel Performance:** Tabel semua channel marketing dengan metrik: spend, revenue (attributed), ROAS, CLV rata-rata customer dari channel itu, dan tren bulan-ke-bulan.

**Panel 2 — Attribution Comparison:** Tampilkan revenue attribution dari 2-3 model berbeda side-by-side. Ini membantu menghindari bias dari satu model.

**Panel 3 — Budget Optimizer:** Simulasi "what-if" — jika budget dipindahkan dari channel A ke channel B, berapa estimasi perubahan total revenue?

**Panel 4 — Funnel Leaks:** Di mana customer drop-off terbanyak? Awareness → Consideration → Purchase. Channel mana yang bagus di awareness tapi jelek di conversion (dan sebaliknya)?

Kunci: dashboard harus **prescriptive**, bukan hanya descriptive. Setiap panel harus menyertakan rekomendasi aksi, bukan hanya menampilkan angka.`, insight:"Tim yang menggunakan dashboard atribusi prescriptive mengambil keputusan budget 60% lebih cepat dan 40% lebih akurat", challenge:"**DESIGN DASHBOARD:** Sketsa dashboard atribusi untuk bisnis kamu. Tentukan: 4 panel utama, metrik di setiap panel, dan rekomendasi otomatis apa yang ingin kamu tampilkan.", quiz:{ question:"Dashboard menunjukkan TikTok ads ROAS = 150% (di bawah breakeven) tapi menjadi first-touch untuk 60% customer yang akhirnya membeli via Google. Apa keputusan terbaik?", options:["Cut budget TikTok karena ROAS di bawah breakeven","Pertahankan TikTok budget — meskipun last-touch ROAS rendah, perannya sebagai awareness driver (first-touch) krusial untuk keseluruhan funnel","Pindahkan semua budget ke Google karena ROAS-nya lebih tinggi","TikTok hanya untuk brand awareness, jangan ukur ROAS"], correct:1, explanation:"Ini contoh bahaya last-touch attribution. TikTok sebagai first-touch driver untuk 60% customer berarti Google Search conversion bergantung pada TikTok awareness. Memotong TikTok budget akan menurunkan Google conversion juga — efek domino." } },
];

function FunnelViz() {
  const [budgets, setBudgets] = useState([40, 35, 25]);
  const labels = ["Awareness (TikTok/IG)", "Consideration (Retargeting)", "Conversion (Search/CTA)"];
  const colors = ["#818CF8", "#6366F1", "#4F46E5"];
  const total = budgets.reduce((a, b) => a + b, 0);
  return (
    <div style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)" }}>
        <div style={{ fontWeight:800, fontSize:"1rem" }}>Budget Allocation Funnel</div>
        <div className="caption" style={{ marginTop:4 }}>Atur alokasi budget dan lihat visualisasi funnel berubah</div>
      </div>
      <div style={{ padding:24 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:28 }}>
          {labels.map((label, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:colors[i], flexShrink:0 }} />
              <span style={{ fontSize:"0.8125rem", fontWeight:600, color:"var(--color-text-secondary)", flex:"0 0 200px" }}>{label}</span>
              <input type="range" min={5} max={80} value={budgets[i]} onChange={e => { const n=[...budgets]; n[i]=+e.target.value; setBudgets(n); }} style={{ flex:1, accentColor:colors[i], cursor:"grab" }} />
              <span style={{ fontSize:"0.875rem", fontWeight:800, color:colors[i], width:50, textAlign:"right" }}>{Math.round(budgets[i]/total*100)}%</span>
            </div>
          ))}
        </div>
        {/* Funnel */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          {budgets.map((b, i) => {
            const widthPct = 30 + (b / total) * 60;
            return (
              <motion.div key={i} animate={{ width: `${widthPct}%` }} transition={{ type:"spring", stiffness:200, damping:25 }}
                style={{ height:52, background:colors[i], borderRadius: i===0 ? "12px 12px 4px 4px" : i===budgets.length-1 ? "4px 4px 12px 12px" : 4, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <span style={{ fontSize:"0.75rem", fontWeight:800, color:"#FFF", textAlign:"center", padding:"0 8px" }}>
                  {labels[i].split("(")[0].trim()} — {Math.round(b/total*100)}%
                </span>
              </motion.div>
            );
          })}
        </div>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ marginTop:20, padding:"14px 16px", background:`${CL}0.06)`, border:`1px solid ${CL}0.2)`, borderRadius:"var(--radius-sm)", textAlign:"center" }}>
          <div style={{ fontSize:"0.8125rem", color:"var(--color-text-secondary)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {budgets[0]/total > 0.5 || budgets[2]/total > 0.5 ? (
              <Icon icon="solar:danger-triangle-bold-duotone" width={18} className="text-amber-500" />
            ) : (
              <Icon icon="solar:check-circle-bold-duotone" width={18} className="text-green-500" />
            )}
            {budgets[0]/total > 0.5 ? "Budget terlalu berat di Awareness. Pertimbangkan pindahkan sebagian ke Conversion untuk meningkatkan ROAS." :
             budgets[2]/total > 0.5 ? "Budget terlalu berat di Conversion. Tanpa Awareness yang cukup, funnel akan kering." :
             "Alokasi budget cukup seimbang. Pastikan setiap layer dioptimasi sesuai model atribusi yang dipilih."}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul Atribusi ROI. Tanyakan tentang model atribusi, ROAS, CLV, atau dashboard budgeting!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("roi-attribution",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#A5B4FC"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: Atribusi ROI</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#4F46E5)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#4F46E5)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#4F46E5)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang atribusi ROI..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#4F46E5)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function RoiAttributionPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#4F46E5)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><DollarSign size={13} color="#A5B4FC"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#A5B4FC",letterSpacing:"0.06em"}}>MODUL 9 · ROI ATTRIBUTION</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>Atribusi ROI & Revenue</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Menghubungkan metrik engagement dengan penjualan nyata menggunakan model atribusi.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 3.5 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#A5B4FC",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><DollarSign size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><FunnelViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#4F46E5)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><DollarSign size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
