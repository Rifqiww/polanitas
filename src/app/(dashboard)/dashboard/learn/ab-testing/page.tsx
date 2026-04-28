"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { FlaskConical, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle, Play } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#06B6D4"; const CL="rgba(6,182,212,";

const LESSONS = [
  { id:"ab-tradisional", title:"A/B Testing Tradisional Lambat", concept:"Mengapa Pendekatan Lama Tidak Cukup", body:`**A/B testing tradisional** bekerja dengan cara sederhana: buat 2 versi (A dan B), bagi traffic 50/50, tunggu sampai statistical significance tercapai, pilih winner. Masalahnya: di dunia konten digital yang bergerak cepat, pendekatan ini **terlalu lambat**.

**Bottleneck A/B Testing Tradisional:**

**1. Sample Size Requirement:** Untuk mencapai signifikansi statistik (p < 0.05), kamu butuh ribuan impressions per variasi. Untuk micro/small account, ini bisa memakan waktu berminggu-minggu.

**2. Binary Outcome:** Hanya bisa A vs B. Bagaimana jika kamu ingin test 10 variasi headline atau 20 variasi thumbnail? Dengan pendekatan tradisional, butuh 10 test sequential = berbulan-bulan.

**3. Opportunity Cost:** Selama testing, 50% traffic diarahkan ke versi yang lebih buruk. Dalam konteks konten viral yang window-nya singkat, ini bisa berarti kehilangan momen.

**4. Static Decision:** Sekali winner dipilih, keputusan final. Tidak bisa beradaptasi jika perilaku audiens berubah mid-campaign.

Pendekatan modern hadir untuk mengatasi semua ini: **Multi-Armed Bandit** dan **AI-Driven Creative Iteration**.`, insight:"A/B test tradisional rata-rata membutuhkan 2-4 minggu untuk mencapai signifikansi — di era TikTok, tren bisa mati dalam 3 hari", challenge:"**HITUNG SENDIRI:** Jika konten kamu mendapat 500 impressions/hari, berapa hari yang dibutuhkan untuk A/B test dengan confidence level 95% dan minimum detectable effect 10%? (Hint: butuh ~1.600 samples per variasi)", quiz:{ question:"Brand menjalankan A/B test headline untuk 5 hari, total 400 impressions. Hasilnya: A=52% CTR, B=48% CTR. Apakah hasil ini reliable?", options:["Ya, A jelas lebih baik karena CTR-nya lebih tinggi","Tidak — 400 impressions terlalu sedikit dan perbedaan 4% tidak signifikan secara statistik","Ya, karena sudah berjalan 5 hari","Hanya reliable jika CTR di atas 50%"], correct:1, explanation:"Dengan 400 total impressions (200 per variasi), margin of error-nya sekitar ±7%. Perbedaan 4% jauh di dalam margin of error — hasilnya essentially random noise, bukan signal yang reliable. Butuh minimal 1.600 per variasi." } },
  { id:"multi-armed-bandit", title:"Multi-Armed Bandit vs A/B", concept:"Explore vs. Exploit secara Otomatis", body:`**Multi-Armed Bandit (MAB)** adalah pendekatan testing yang secara dinamis **mengalokasikan lebih banyak traffic ke versi yang performing lebih baik**, sambil tetap mengeksplor versi lain.

**Cara Kerja MAB:**
1. Mulai dengan distribusi traffic merata ke semua variasi (misal: 5 variasi × 20% each)
2. Setelah data awal terkumpul, secara bertahap alokasikan lebih banyak traffic ke variasi top-performing
3. Variasi yang buruk mendapat traffic semakin sedikit (tapi tidak nol — untuk memastikan tidak miss delayed signal)
4. Proses ini berjalan kontinyu dan otomatis

**Keunggulan MAB vs A/B tradisional:**
- <Icon icon="solar:check-circle-bold-duotone" className="inline-block mr-1" /> Bisa test 5-50 variasi sekaligus (bukan hanya 2)
- <Icon icon="solar:check-circle-bold-duotone" className="inline-block mr-1" /> Mengurangi opportunity cost — traffic otomatis dialihkan ke variasi terbaik
- <Icon icon="solar:check-circle-bold-duotone" className="inline-block mr-1" /> Lebih cepat menemukan winner
- <Icon icon="solar:check-circle-bold-duotone" className="inline-block mr-1" /> Adaptif — bisa bereaksi jika performa variasi berubah over time

**Kapan pakai MAB vs A/B:**
- MAB: kesempatan singkat, banyak variasi, optimasi real-time
- A/B: butuh statistical rigor, keputusan jangka panjang, sedikit variasi`, insight:"MAB menghasilkan 30-50% lebih banyak total conversions dibanding A/B selama periode testing yang sama karena mengurangi waktu di variasi yang buruk", challenge:"**SIMULASI:** Bayangkan kamu punya 5 variasi thumbnail. Hari 1: distribusi merata 20% each. Hari 2: performance data masuk. Rancang redistribusi traffic berdasarkan prinsip MAB!", quiz:{ question:"Dalam MAB, mengapa variasi yang performing buruk tetap mendapat sedikit traffic (bukan 0%)?", options:["Karena algoritmanya boros","Untuk memastikan tidak miss 'late bloomer' — variasi yang awalnya buruk tapi bisa improve seiring data bertambah (exploration vs exploitation tradeoff)","Karena semua variasi harus diperlakukan sama","Tidak ada alasan, sebaiknya langsung 0%"], correct:1, explanation:"Ini disebut exploration-exploitation tradeoff. Tanpa exploration (memberikan sedikit traffic ke variasi underperforming), kamu bisa terjebak di local optimum — ada kemungkinan variasi yang awalnya buruk sebenarnya lebih baik untuk segmen tertentu atau waktu tertentu." } },
  { id:"ai-creative-iteration", title:"AI-Driven Creative Iteration", concept:"50 Variasi Otomatis dengan Machine Learning", body:`Menggabungkan MAB dengan **AI creative generation** menciptakan pipeline test yang sangat powerful: AI menghasilkan puluhan variasi konten, MAB menentukan mana yang paling efektif, AI belajar dari hasilnya untuk menghasilkan variasi yang lebih baik lagi.

**Pipeline AI-Driven Creative Testing:**

**Step 1 — Seed Input:** Kamu memberikan brief konten, target audience, dan constraints (panjang, tone, CTA).

**Step 2 — AI Generation:** LLM menghasilkan 20-50 variasi headline, caption, atau script berdasarkan brief.

**Step 3 — Initial Deploy:** Semua variasi dideploy dengan distribusi MAB (mulai merata).

**Step 4 — Performance Monitoring:** MAB mengoptimasi distribusi traffic berdasarkan real-time performance.

**Step 5 — AI Learning Loop:** Setelah cukup data, analysis mengidentifikasi pattern — kata apa, format apa, hook apa yang perform terbaik.

**Step 6 — Iteration:** AI menghasilkan batch variasi baru yang di-inform oleh learnings dari batch sebelumnya.

Siklus ini bisa berjalan terus-menerus, menghasilkan creative improvement yang compound over time.`, insight:"Brand yang menjalankan AI-driven creative iteration mengalami peningkatan CTR compound 8-15% per bulan selama 6 bulan pertama", challenge:"**MINI PIPELINE:** Buat 5 variasi headline untuk konten kamu menggunakan AI Lab. Identifikasi: pola apa yang berbeda antar variasi (hook type, panjang, tone, CTA)?", quiz:{ question:"AI menghasilkan 30 variasi caption. Setelah MAB, variasi #17 menang dengan CTR 12% vs rata-rata 6%. Apa langkah selanjutnya?", options:["Deploy variasi #17 selamanya","Analisis MENGAPA variasi #17 menang (kata, hook, tone, CTA), lalu minta AI generate 30 variasi baru yang terinspirasi dari pola winning #17","Hentikan testing karena sudah ada winner","Generate 30 variasi baru secara random"], correct:1, explanation:"Winning variation adalah signal, bukan endpoint. Menganalisis pattern-nya (hook style, word choice, emotional trigger) dan membuat iterasi baru yang di-inform detail tersebut menghasilkan improvement compound — setiap batch lebih baik dari sebelumnya." } },
  { id:"statistical-significance", title:"Statistical Significance & Decision", concept:"Kapan Harus Berhenti Test dan Take Action", body:`Secanggih apa pun tools testing, pada akhirnya kamu harus membuat **keputusan** — dan keputusan itu harus didasarkan pada **statistical significance**, bukan gut feeling.

**Konsep Kunci:**

**Statistical Significance (p-value < 0.05):** Probabilitas bahwa perbedaan yang kamu amati terjadi secara KEBETULAN kurang dari 5%. Artinya: 95% yakin bahwa perbedaan itu nyata.

**Confidence Interval:** Range di mana true value kemungkinan berada. CTR 10% ± 2% berarti true CTR antara 8-12%.

**Minimum Detectable Effect (MDE):** Perbedaan terkecil yang secara statistik signifikan dan secara bisnis bermakna. Kenaikan CTR 0.1% mungkin signifikan tapi tidak bermakna.

**Dua Jenis Error:**
- **Type I (False Positive):** Menyimpulkan ada perbedaan padahal tidak — mengganti konten yang sebenarnya baik
- **Type II (False Negative):** Menyimpulkan tidak ada perbedaan padahal ada — melewatkan improvement

**Practical Decision Framework:**
1. Statistical significance tercapai → deploy winner
2. Significance tidak tercapai setelah batas waktu → default ke variasi yang lebih murah/mudah
3. Terjadi external event (viral moment, algoritma change) → reset test`, insight:"40% marketer membuat keputusan testing berdasarkan data yang belum mencapai significance — ini menghasilkan 'false optimization' yang sebenarnya tidak meningkatkan performa", challenge:"**DECISION MATRIX:** Untuk 3 skenario (significant + big effect, significant + small effect, not significant), tentukan aksi yang tepat. Diskusikan trade-off dengan AI Lab!", quiz:{ question:"Test menunjukkan variasi B +3% CTR vs A, p-value = 0.12. Waktu tinggal 24 jam sebelum campaign. Apa keputusan terbaik?", options:["Deploy B karena CTR-nya lebih tinggi","Deploy A karena B belum proven","p-value 0.12 menunjukkan 88% confidence — cukup tinggi untuk campaign singkat. Deploy B dengan monitoring ketat, tapi dokumentasikan bahwa keputusan ini below standard significance threshold","Extend test period meskipun melewati deadline campaign"], correct:2, explanation:"Dalam konteks time-sensitive campaign, 88% confidence (p=0.12) mungkin acceptable trade-off — lebih baik dari coin flip. Kuncinya: dokumentasikan bahwa ini bukan 'proven winner' dan lakukan full-significance test di campaign berikutnya untuk konfirmasi." } },
];

function RacingBarsViz() {
  const [running, setRunning] = useState(false);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [winner, setWinner] = useState<string|null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const startRace = useCallback(() => {
    setProgressA(0); setProgressB(0); setWinner(null); setRunning(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    let a = 0, b = 0;
    intervalRef.current = setInterval(() => {
      a += Math.random() * 4 + 1;
      b += Math.random() * 3.5 + 1.2;
      if (a > 100) a = 100;
      if (b > 100) b = 100;
      setProgressA(a); setProgressB(b);
      if (a >= 95 || b >= 95) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setWinner(a > b ? "Variasi A" : "Variasi B");
      }
    }, 100);
  }, []);

  useEffect(() => { return () => { if (intervalRef.current) clearInterval(intervalRef.current); }; }, []);

  return (
    <div style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)" }}>
        <div style={{ fontWeight:800, fontSize:"1rem" }}>A/B Test Racing Simulator</div>
        <div className="caption" style={{ marginTop:4 }}>Klik tombol untuk menjalankan simulasi A/B test real-time</div>
      </div>
      <div style={{ padding:24 }}>
        <button onClick={startRace} disabled={running} className="btn btn-primary" style={{ gap:8, marginBottom:24 }}>
          <Play size={15} /> {running ? "Simulasi berjalan..." : winner ? "Jalankan Ulang Simulasi" : "Jalankan Simulasi A/B Test"}
        </button>
        {/* Racing bars */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:"0.8125rem", fontWeight:700, color:"#06B6D4", display:"flex", alignItems:"center", gap:6 }}><Icon icon="solar:letter-a-circle-bold-duotone" width={18} /> Variasi A — "Diskon 50% Hari Ini!"</span>
              <span style={{ fontSize:"0.875rem", fontWeight:800, color:"#06B6D4", fontFamily:"var(--font-mono)" }}>{progressA.toFixed(1)}%</span>
            </div>
            <div style={{ height:32, background:"var(--color-surface-2)", borderRadius:"var(--radius-sm)", border:"1px solid var(--color-border)", overflow:"hidden", position:"relative" }}>
              <motion.div animate={{ width:`${progressA}%` }} transition={{ duration:0.1 }}
                style={{ height:"100%", background:"linear-gradient(90deg, #06B6D4, #0891B2)", borderRadius:"var(--radius-sm)", position:"relative" }}>
                {progressA > 20 && <div style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", fontSize:"0.6875rem", fontWeight:800, color:"#FFF" }}>CTR: {(3 + progressA * 0.08).toFixed(1)}%</div>}
              </motion.div>
            </div>
          </div>
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:"0.8125rem", fontWeight:700, color:"#8B5CF6", display:"flex", alignItems:"center", gap:6 }}><Icon icon="solar:letter-b-circle-bold-duotone" width={18} /> Variasi B — "Terakhir 3 Jam Lagi"</span>
              <span style={{ fontSize:"0.875rem", fontWeight:800, color:"#8B5CF6", fontFamily:"var(--font-mono)" }}>{progressB.toFixed(1)}%</span>
            </div>
            <div style={{ height:32, background:"var(--color-surface-2)", borderRadius:"var(--radius-sm)", border:"1px solid var(--color-border)", overflow:"hidden" }}>
              <motion.div animate={{ width:`${progressB}%` }} transition={{ duration:0.1 }}
                style={{ height:"100%", background:"linear-gradient(90deg, #8B5CF6, #7C3AED)", borderRadius:"var(--radius-sm)", position:"relative" }}>
                {progressB > 20 && <div style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", fontSize:"0.6875rem", fontWeight:800, color:"#FFF" }}>CTR: {(2.8 + progressB * 0.09).toFixed(1)}%</div>}
              </motion.div>
            </div>
          </div>
        </div>
        {/* Significance meter */}
        <div style={{ marginTop:20, padding:"12px 16px", background:"var(--color-surface-2)", borderRadius:"var(--radius-md)", border:"1px solid var(--color-border)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--color-text-muted)" }}>Statistical Significance</span>
            <span style={{ fontSize:"0.75rem", fontWeight:800, color: Math.max(progressA,progressB) > 80 ? "#16A34A" : "#F59E0B" }}>
              {Math.max(progressA,progressB) > 80 ? "p < 0.05 ✓ Signifikan" : `p = ${(0.5 - Math.abs(progressA-progressB)*0.005).toFixed(2)} — Belum signifikan`}
            </span>
          </div>
          <div style={{ height:6, background:"var(--color-surface-3)", borderRadius:999, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min(100, Math.max(progressA,progressB))}%`, background: Math.max(progressA,progressB) > 80 ? "linear-gradient(90deg, #22C55E, #16A34A)" : "linear-gradient(90deg, #F59E0B, #D97706)", borderRadius:999, transition:"width 0.1s" }} />
          </div>
        </div>
        {winner && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} style={{ marginTop:16, padding:"16px 20px", background: winner==="Variasi A" ? "rgba(6,182,212,0.08)" : "rgba(139,92,246,0.08)", border:`1px solid ${winner==="Variasi A" ? "rgba(6,182,212,0.3)" : "rgba(139,92,246,0.3)"}`, borderRadius:"var(--radius-md)", textAlign:"center" }}>
            <div style={{ fontWeight:900, fontSize:"1.125rem", color: winner==="Variasi A" ? "#06B6D4" : "#8B5CF6", marginBottom:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><Icon icon="solar:cup-bold-duotone" width={22} /> {winner} Menang!</div>
            <div style={{ fontSize:"0.8125rem", color:"var(--color-text-secondary)" }}>Statistical significance tercapai. Winner bisa di-deploy dengan confidence 95%.</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul A/B Testing Agresif. Tanyakan tentang MAB, AI creative iteration, atau statistical significance!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("ab-testing",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#67E8F9"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: A/B Testing</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#0891B2)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#0891B2)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#0891B2)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang A/B testing..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#0891B2)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function ABTestingPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#0891B2)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><FlaskConical size={13} color="#67E8F9"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#67E8F9",letterSpacing:"0.06em"}}>MODUL 12 · A/B TESTING</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>A/B Testing Agresif</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Menjalankan 50 variasi iklan dengan iterasi otomatis menggunakan AI dan MAB.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 3 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#67E8F9",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FlaskConical size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><RacingBarsViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#0891B2)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><FlaskConical size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
