"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Lock, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#64748B"; const CL="rgba(100,116,139,";

const LESSONS = [
  { id:"kenapa-etika", title:"Kenapa Etika AI Penting", concept:"Risiko Reputasi dan Regulasi", body:`AI yang powerful tanpa **guardrails etis** adalah bom waktu reputasi. Case study global menunjukkan: chatbot yang menjadi rasis, AI-generated content yang menyebarkan misinformasi, dan deepfake yang merusak kepercayaan publik.

Di Indonesia, risiko ini semakin nyata dengan adanya **UU PDP (Perlindungan Data Pribadi)** yang mengatur bagaimana data personal boleh dikumpulkan, diproses, dan digunakan oleh AI. Pelanggaran bisa berujung denda hingga 2% dari pendapatan tahunan.

**3 Risiko Utama AI Tanpa Etika:**
1. **Bias Amplification:** AI memperkuat bias yang ada di training data — stereotip gender, ras, atau ekonomi bisa terrefleksi dalam output konten.
2. **Hallucination as Fact:** AI menghasilkan informasi palsu yang terdengar meyakinkan, bisa merusak kredibilitas brand jika dipublish tanpa verifikasi.
3. **Privacy Violation:** Menggunakan data customer tanpa consent untuk personalisasi bisa melanggar UU PDP.

Brand yang proaktif membangun **AI governance** sebelum krisis terjadi memiliki competitive advantage — trust is a moat.`, insight:"73% konsumen Indonesia menyatakan akan berhenti membeli dari brand yang terbukti menyalahgunakan data personal mereka (survey 2024)", challenge:"**AUDIT ETIKA:** Review 3 output AI yang kamu generate (copy, konten, dsb). Cek: apakah ada bias, klaim yang tidak terverifikasi, atau penggunaan data tanpa consent?", quiz:{ question:"Brand menggunakan data browsing customer tanpa consent untuk personalisasi iklan AI. Apa risikonya?", options:["Tidak ada risiko karena semua brand melakukannya","Melanggar UU PDP — bisa dikenai denda dan merusak brand trust secara permanen","Risikonya hanya kecil jika hasilnya akurat","UU PDP tidak berlaku untuk AI marketing"], correct:1, explanation:"UU PDP Pasal 5 mewajibkan consent eksplisit untuk pemrosesan data pribadi. AI marketing yang menggunakan data browsing tanpa consent melanggar ini. Selain denda, damage reputasi bisa jauh lebih mahal." } },
  { id:"guardrails", title:"Guardrails & Content Filtering", concept:"Membangun Pagar Pengaman untuk AI", body:`**Guardrails** adalah aturan dan filter yang mencegah AI menghasilkan output berbahaya. Tanpa guardrails, AI bisa menghasilkan konten yang merusak brand, melanggar regulasi, atau menyinggung audiens.

**Framework Guardrails 3-Layer:**

**Layer 1 — Input Filtering:** Mencegah prompt yang bisa menghasilkan output berbahaya. Contoh: block request yang mengandung hate speech, adult content, atau competitive bashing.

**Layer 2 — Output Monitoring:** Setiap output AI dicheck sebelum publish. Automated check: profanity filter, fact-check against knowledge base, brand voice alignment score.

**Layer 3 — Human-in-the-Loop (HITL):** Untuk konten berisiko tinggi (iklan berbayar, press release, product claim), WAJIB ada approval manusia sebelum publish.

**Implementasi Teknis:**
- System prompt yang jelas tentang batasan (apa yang TIDAK boleh di-generate)
- Blocklist kata dan frasa yang brand kamu tidak boleh gunakan
- Confidence threshold — output di bawah threshold tertentu otomatis di-flag untuk review manual`, insight:"Brand dengan guardrails AI yang ketat memiliki 85% lebih sedikit 'content recall incidents' dibanding yang tanpa guardrails", challenge:"**DESIGN GUARDRAILS:** Buat daftar 10 aturan guardrail untuk AI di brand kamu: 5 untuk input filtering, 5 untuk output monitoring. Diskusikan dengan AI Lab!", quiz:{ question:"AI menghasilkan copy 'Produk kami TERBUKTI menyembuhkan diabetes'. Apa yang salah?", options:["Tidak ada masalah jika produknya memang bagus","Klaim kesehatan tanpa bukti ilmiah melanggar regulasi BPOM dan UU Perlindungan Konsumen — guardrails output harus menangkap ini","Hanya masalah jika diposting di marketplace","Cukup tambahkan disclaimer 'hasil bervariasi'"], correct:1, explanation:"Klaim 'TERBUKTI menyembuhkan' untuk produk non-obat melanggar regulasi BPOM dan berpotensi UU Perlindungan Konsumen. Output guardrails harus memiliki healthcare claim detector yang otomatis flag kalimat seperti ini untuk review legal." } },
  { id:"uu-pdp", title:"UU PDP & Compliance Digital", concept:"Regulasi yang Wajib Dipahami", body:`**UU PDP (Undang-Undang Perlindungan Data Pribadi)** Indonesia yang disahkan 2022 mengatur bagaimana data pribadi warga Indonesia boleh dikumpulkan, diproses, dan disebarkan. Bagi AI marketers, ini berdampak langsung pada operasional sehari-hari.

**Prinsip Kunci UU PDP:**
- **Consent:** Data hanya boleh diproses berdasarkan persetujuan eksplisit subjek data
- **Purpose Limitation:** Data hanya boleh digunakan untuk tujuan yang disampaikan saat pengumpulan
- **Data Minimization:** Hanya kumpulkan data yang benar-benar diperlukan
- **Right to Deletion:** Subjek data berhak meminta penghapusan data mereka
- **Breach Notification:** Wajib notifikasi dalam 72 jam jika terjadi kebocoran data

**Dampak untuk AI Marketing:**
- Personalisasi AI harus berbasis data yang di-consent
- Training AI dengan data customer memerlukan legal basis
- Profiling otomatis (segmentasi audiens) harus transparan
- Cookie tracking harus mendapat consent aktif (bukan default)

**Sanksi:** Denda administratif hingga 2% pendapatan tahunan dan/atau pidana.`, insight:"Hanya 23% bisnis digital Indonesia yang sudah fully compliant dengan UU PDP — ini berarti 77% masih berisiko terkena sanksi", challenge:"**COMPLIANCE CHECK:** Audit website/platform kamu: (1) Apakah ada privacy policy yang jelas? (2) Apakah cookie consent menjelaskan tujuan? (3) Apakah ada mekanisme data deletion request?", quiz:{ question:"Brand menggunakan AI untuk membuat segmentasi audiens otomatis berdasarkan behavior data tanpa menginformasikan ke user. Ini melanggar prinsip UU PDP yang mana?", options:["Purpose Limitation saja","Consent dan Transparency — profiling otomatis harus diinformasikan dan disetujui oleh subjek data","Data Minimization saja","Tidak melanggar UU PDP karena data behavior bukan data pribadi"], correct:1, explanation:"Profiling otomatis (automated decision-making) termasuk pemrosesan data yang memerlukan consent dan transparency. User harus tahu bahwa data mereka digunakan untuk segmentasi dan memiliki hak untuk menolak." } },
  { id:"governance", title:"Framework Governance AI", concept:"Kebijakan Organisasi untuk AI yang Bertanggung Jawab", body:`**AI Governance** adalah framework kebijakan organisasi yang memastikan penggunaan AI berjalan etis, legal, dan aligned dengan values perusahaan. Tanpa governance, setiap tim akan membuat keputusan AI sendiri-sendiri — menghasilkan inkonsistensi dan risiko.

**Framework SAFE untuk AI Governance:**

**S — Standards:** Tetapkan standar kualitas output AI: accuracy threshold, brand voice compliance, factual verification requirement.

**A — Accountability:** Siapa yang bertanggung jawab jika AI menghasilkan output bermasalah? Setiap use case AI harus memiliki designated owner.

**F — Fairness:** Audit bias secara reguler. Apakah AI kamu menarget/menghindari segmen tertentu secara tidak fair? Apakah training data representatif?

**E — Explainability:** Bisa menjelaskan MENGAPA AI menghasilkan output tertentu. Ini penting untuk audit, debugging, dan transparansi ke stakeholder.

**Implementasi Praktis:**
1. Buat AI Usage Policy tertulis (1-2 halaman)
2. Training wajib untuk semua tim yang menggunakan AI
3. Quarterly AI audit: review output, check compliance, update guardrails
4. Incident response plan: apa yang dilakukan jika AI menghasilkan output bermasalah yang sudah terpublikasi`, insight:"Organisasi dengan AI governance formal mengalami 60% lebih sedikit incident AI-related dan recover 3x lebih cepat ketika incident terjadi", challenge:"**DRAFT POLICY:** Tulis draft 1-halaman AI Usage Policy untuk tim kamu menggunakan framework SAFE. Minta AI Lab review dan berikan saran improvement!", quiz:{ question:"Tim marketing menggunakan ChatGPT dengan API key perusahaan tanpa policy tertulis. Apa risiko terbesar?", options:["Tidak ada risiko karena ChatGPT aman","Tanpa policy, setiap orang menggunakan AI secara berbeda — risiko data leak, brand inconsistency, dan legal violation menjadi tidak terkontrol","Risikonya hanya biaya API yang membengkak","Cukup buat policy lisan saja"], correct:1, explanation:"Tanpa policy tertulis: (1) anggota tim bisa menginput data sensitif perusahaan ke AI, (2) output AI tidak ter-QC secara konsisten, (3) tidak ada accountability jika terjadi masalah. Policy tertulis = standar yang bisa diaudit dan dienforce." } },
];

function EthicalShieldViz() {
  const [autonomy, setAutonomy] = useState(50);
  const getLabel = () => {
    if (autonomy < 30) return { text: "Kontrol Manusia Dominan", desc: "Aman tapi lambat. Risiko rendah, skalabilitas minimal.", color: "#22C55E", icon: "solar:user-bold-duotone" };
    if (autonomy < 60) return { text: "Keseimbangan Optimal", desc: "AI efisien dengan panduan manusia. Ideal untuk operasional harian.", color: "#06B6D4", icon: "solar:shield-check-bold-duotone" };
    if (autonomy < 80) return { text: "Otonomi AI Tinggi", desc: "Sangat cepat, namun audit berkala wajib dilakukan.", color: "#F59E0B", icon: "solar:danger-bold-duotone" };
    return { text: "Otonomi Tanpa Filter", desc: "Berbahaya! Risiko bias dan hallusinasi sangat tinggi tanpa HITL.", color: "#EF4444", icon: "solar:fire-bold-duotone" };
  };
  const info = getLabel();

  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)", background: "var(--color-surface-2)" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem" }}>Ethical Guardrail Shield Hub</div>
        <div className="caption" style={{ marginTop: 4 }}>Atur tingkat otonomi AI dan lihat integritas brand Anda</div>
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#22C55E", display: "flex", alignItems: "center", gap: 6 }}><Icon icon="solar:user-bold-duotone" width={16} /> Human-in-the-loop</span>
            <span style={{ fontSize: "0.875rem", fontWeight: 800, color: info.color }}>{autonomy}% Agency</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#EF4444", display: "flex", alignItems: "center", gap: 6 }}>Full Autonomy <Icon icon="solar:bot-bold-duotone" width={16} /></span>
          </div>
          <input type="range" min={0} max={100} value={autonomy} onChange={e => setAutonomy(+e.target.value)} style={{ width: "100%", accentColor: info.color, cursor: "grab" }} />
        </div>

        {/* Shield Visualizer */}
        <div style={{ height: 260, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-surface-2)", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px inset var(--color-border)" }}>
          {/* Background Grid */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          
          {/* Central Core */}
          <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: `0 0 ${20 + (autonomy/2)}px ${info.color}60` }} transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${info.color}, #1A1D23)`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, border: `2px solid ${info.color}` }}>
            <Icon icon="solar:globus-bold-duotone" width={40} color="#FFF" />
          </motion.div>

          {/* Protection Rings */}
          <AnimatePresence>
            {autonomy < 90 && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.2, opacity: 0.3 }} exit={{ scale: 1.5, opacity: 0 }}
                style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", border: `2px dashed ${autonomy > 70 ? "#F59E0B" : "#22C55E"}`, zIndex: 5 }} />
            )}
            {autonomy < 50 && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.8, opacity: 0.15 }} exit={{ scale: 2, opacity: 0 }}
                style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", border: "4px double #22C55E", zIndex: 4 }} />
            )}
          </AnimatePresence>

          {/* Risk Particles - Visible at high autonomy */}
          {autonomy > 60 && Array.from({length: 6}).map((_, i) => (
            <motion.div key={i} animate={{ x: [0, (i%2?1:-1)*120], y: [0, (i<3?1:-1)*120], opacity: [0, 0.8, 0] }} transition={{ duration: 2 + (i*0.2), repeat: Infinity, delay: i*0.3 }}
              style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", background: "#EF4444", filter: "blur(2px)" }} />
          ))}

          {/* Static Labels */}
          <div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", padding: "0 20px" }}>
             <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-muted)", letterSpacing: "1px" }}>
               {autonomy > 80 ? "!!! SHIELD COMPROMISED !!!" : autonomy > 50 ? "MONITORING ACTIVE" : "SECURE INFRASTRUCTURE"}
             </div>
          </div>
        </div>

        <motion.div key={info.text} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24, padding: "16px 20px", background: `${info.color}10`, border: `1px solid ${info.color}30`, borderRadius: "var(--radius-md)", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: "1.125rem", color: info.color, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Icon icon={info.icon} width={24} />
            {info.text}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{info.desc}</div>
        </motion.div>
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul Etika AI & Organisasi. Tanyakan tentang guardrails, UU PDP, atau governance framework!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("ai-ethics",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#CBD5E1"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: Etika AI</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#475569)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#475569)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#475569)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang etika AI..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#475569)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function AIEthicsPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#475569)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><Lock size={13} color="#CBD5E1"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#CBD5E1",letterSpacing:"0.06em"}}>MODUL 10 · AI ETHICS</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>Etika AI & Brand Safety</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Guardrails, UU PDP, dan compliance untuk penggunaan AI yang bertanggung jawab.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 2 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#CBD5E1",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Lock size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><EthicalShieldViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#475569)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><Lock size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
