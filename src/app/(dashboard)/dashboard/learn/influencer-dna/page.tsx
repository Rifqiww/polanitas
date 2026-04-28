"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Users, ArrowLeft, ChevronRight, ChevronLeft, CheckCircle, Circle, Zap, Send, Bot, User, Lightbulb, Target, BookOpen, Clock, AlertCircle } from "lucide-react";
import { askModuleAI } from "@/actions/learn-actions";
interface ChatMessage { role:"user"|"ai"; content:string; timestamp:Date; }
interface QuizAnswer { questionIndex:number; selected:number; correct:boolean; }
const C="#D946EF"; const CL="rgba(217,70,239,";

const BRAND_TAGS = ["Luxury","Eco-Friendly","Youth","Tech","Minimalist","Bold","Playful","Professional","Local","Global"];
const INFLUENCER_TAGS = ["Luxury","Eco-Friendly","Youth","Tech","Minimalist","Bold","Playful","Professional","Local","Global"];

const LESSONS = [
  { id:"evolusi-influencer", title:"Evolusi Influencer Marketing", concept:"Dari Endorsement ke DNA Matching", body:`Influencer marketing telah berevolusi dari sekadar **endorsement selebriti** menjadi ekosistem kompleks yang membutuhkan pendekatan data-driven. Era "kirim produk gratis ke influencer terkenal" sudah berakhir.

**3 Era Influencer Marketing:**

**Era 1 — Celebrity Endorsement (2010-2016):** Bayar selebriti mahal, harapkan exposure. Metrik: followers count. Masalah: ROI tidak terukur, audiens tidak targeted.

**Era 2 — Micro-Influencer Rise (2017-2022):** Fokus ke influencer kecil (10K-100K followers) dengan engagement rate tinggi. Metrik: engagement rate. Masalah: masih tebak-tebak vibes matching.

**Era 3 — DNA Matching (2023+):** Menggunakan AI dan vector search untuk mencocokkan "DNA brand" dengan "DNA influencer" secara multidimensional — bukan hanya followers atau engagement, tapi values, audiens overlap, content style, dan brand safety score.

Di Era 3, pertanyaannya bukan "influencer mana yang paling terkenal?" tapi **"influencer mana yang paling ALIGNED dengan brand DNA kita?"**`, insight:"Kolaborasi dengan influencer yang memiliki DNA match >80% menghasilkan conversion 5.2x lebih tinggi dari kolaborasi berbasis followers count saja", challenge:"**BRAND DNA MAP:** Definisikan 5 atribut DNA brand kamu (values, tone, audiens demographic, aesthetic, price positioning). Ini akan menjadi basis matching!", quiz:{ question:"Brand skincare premium natural ingin kolaborasi influencer. Pilihan: (A) Beauty influencer 500K followers, konten agresif/hard sell. (B) Lifestyle influencer 50K followers, konten mindful living & sustainability. Mana yang lebih aligned?", options:["A karena followers 10x lebih banyak","B — DNA 'mindful living & sustainability' match dengan brand skincare natural premium, meskipun followers lebih kecil","Gabungkan keduanya untuk coverage maksimal","Tidak bisa ditentukan tanpa data engagement rate"], correct:1, explanation:"DNA matching memprioritaskan alignment values dan audiens overlap di atas followers count. Influencer B memiliki audiens yang secara natural tertarik dengan produk skincare premium natural, sehingga conversion potential jauh lebih tinggi." } },
  { id:"vector-search", title:"Vector Search & Semantic Matching", concept:"Teknologi di Balik DNA Matching", body:`**Vector search** adalah teknologi AI yang mengubah teks, gambar, dan konten menjadi representasi numerik multidimensional (vectors). Dua vector yang "dekat" di ruang multidimensi berarti kontennya secara semantik mirip.

**Cara kerja untuk Influencer Matching:**

**Step 1 — Vectorize Brand DNA:** Konversi brand guidelines, past content, dan values statement menjadi vector menggunakan embedding model (misal: OpenAI Ada, Sentence-BERT).

**Step 2 — Vectorize Influencer DNA:** Konversi konten influencer (captions, video transcripts, bio, comments) menjadi vector.

**Step 3 — Similarity Search:** Hitung cosine similarity antara brand vector dan influencer vector. Skor 0-1, semakin mendekati 1 = semakin match.

**Step 4 — Multi-Dimensional Ranking:** Ranking influencer berdasarkan: content style match (30%), audiens overlap (25%), values alignment (25%), engagement quality (20%).

Keunggulan pendekatan ini vs manual: bisa memproses ribuan influencer dalam hitungan menit dan menangkap nuansa semantik yang manusia bisa lewatkan.`, insight:"Vector-based matching mengurangi waktu seleksi influencer dari 2 minggu menjadi 2 jam untuk database 10.000 influencer", challenge:"**SEMANTIC EXERCISE:** Tulis 3 kalimat yang mendeskripsikan brand kamu dan 3 kalimat dari konten influencer favorit. Tanyakan ke AI Lab: seberapa similar secara semantik?", quiz:{ question:"Cosine similarity antara brand vector dan influencer vector = 0.92. Apa interpretasinya?", options:["Match rendah, cari influencer lain","Match sangat tinggi (92%) — konten dan values influencer sangat aligned dengan brand DNA","Angka 0.92 tidak bermakna tanpa konteks","Perlu tambahan data engagement sebelum bisa interpretasi"], correct:1, explanation:"Cosine similarity 0.92 dari skala 0-1 menunjukkan alignment yang sangat kuat. Dalam praktik, skor di atas 0.8 sudah dianggap excellent match. Ini berarti konten, tone, dan values influencer secara semantik sangat mirip dengan brand." } },
  { id:"dna-matching", title:"DNA Matching: Vibe, Audiens, Values", concept:"Framework Multi-Dimensi untuk Seleksi", body:`DNA Matching melampaui similarity score tunggal — ia melihat **keselarasan di multiple dimensi** untuk memastikan kolaborasi yang authentic dan efektif.

**5 Dimensi DNA Matching:**

**1. Vibe Match (Content Style):** Apakah gaya visual dan narasi influencer selaras dengan brand aesthetic? Fashion minimalist brand × maximalist influencer = clash.

**2. Audiens Overlap:** Berapa persen audiens influencer yang match dengan target market brand? Tools seperti Modash atau HypeAuditor bisa menganalisis demografi dan interest audiens.

**3. Values Alignment:** Apakah values yang disuarakan influencer konsisten dengan brand values? Eco-friendly brand × influencer yang promosikan fast fashion = reputational risk.

**4. Engagement Quality:** Bukan hanya engagement rate, tapi KUALITAS — apakah komentar menunjukkan genuine interest atau hanya bot/generik?

**5. Brand Safety Score:** Riwayat kontroversi, konten sensitif, atau partnership dengan kompetitor. Satu skandal influencer bisa berdampak ke semua brand yang berasosiasi.

**Scoring Model:** Setiap dimensi diberi bobot, total score menentukan tier: Tier A (>85%), Tier B (70-85%), Tier C (<70%). Hanya Tier A yang masuk shortlist final.`, insight:"Brand yang menggunakan 5-dimensi DNA matching mengalami 73% lebih sedikit 'brand-influencer mismatch incidents' dibanding yang hanya berdasarkan engagement rate", challenge:"**SCORING CARD:** Buat scoring card untuk 3 influencer di niche kamu. Beri skor 1-10 untuk setiap dimensi DNA. Siapa yang mendapat total score tertinggi?", quiz:{ question:"Influencer memiliki engagement rate 8% (sangat tinggi) tapi 40% komentar terdeteksi dari bot. Apa dampaknya pada DNA matching?", options:["Tidak masalah karena engagement rate-nya tinggi","Engagement Quality score harus turun drastis — bot engagement menunjukkan audiens tidak genuine dan ROI kolaborasi akan rendah","Bot engagement justru bagus karena meningkatkan social proof","Hanya perlu diperhatikan jika bot percentage di atas 60%"], correct:1, explanation:"40% bot comments berarti hampir setengah 'engagement' itu palsu. Real engagement rate-nya sebenarnya sekitar 4.8%. Lebih penting, ini menunjukkan audiens yang tidak genuine — konten brand di akun ini akan ditampilkan ke banyak non-human viewers yang tidak bisa membeli." } },
  { id:"roi-kolaborasi", title:"Kalkulasi ROI Kolaborasi", concept:"Mengukur Keberhasilan Partnership", body:`Setiap kolaborasi influencer harus bisa diukur ROI-nya. Tanpa measurement, kamu tidak tahu apakah investasi menghasilkan return atau sekadar burning cash.

**Framework ROI Influencer:**

**Cost Input:** Fee influencer + produk gratis + biaya produksi konten + biaya manajemen campaign.

**Revenue Attribution:**
- **Direct:** Penjualan dari link tracking, kode promo unik, atau affiliate link
- **Indirect:** Peningkatan brand search volume, follower growth, website traffic spike selama dan setelah campaign
- **Long-term:** Brand awareness lift, consideration score improvement (butuh survey)

**Formula ROI:** (Total Revenue Attributed - Total Cost) / Total Cost × 100%

**Benchmarks:**
- ROI > 300% = Excellent, perpanjang kontrak
- ROI 100-300% = Good, optimalkan dan iterasi
- ROI 50-100% = Marginal, review DNA matching dan brief
- ROI < 50% = Poor, evaluasi apakah influencer match masih valid

**Pro tip:** Selalu berikan kode promo unik per influencer untuk direct tracking. Supplements dengan UTM links dan monitor brand mention volume 2 minggu sebelum vs selama vs 2 minggu setelah campaign.`, insight:"Campaign dengan kode promo unik per influencer memiliki 4x measurement accuracy dibanding campaign tanpa tracking mechanism", challenge:"**ROI CALCULATOR:** Estimasi biaya kolaborasi dengan 1 influencer di niche kamu. Tentukan: fee, produk, production cost. Lalu tentukan: berapa penjualan minimal yang dibutuhkan untuk ROI 200%?", quiz:{ question:"Campaign influencer menghasilkan ROI 80% dari direct sales. Tapi brand search volume naik 150% selama campaign. Bagaimana assessment-nya?", options:["ROI 80% berarti campaign gagal","Direct ROI 80% marginal, tapi indirect impact (brand search +150%) menunjukkan massive awareness lift — total ROI kemungkinan jauh lebih tinggi dari 80% jika indirect revenue dihitung","Brand search volume tidak relevan untuk ROI calculation","Hanya direct sales yang penting, indirect metrics tidak bisa diandalkan"], correct:1, explanation:"ROI 80% dari direct sales SAJA sudah mendekati breakeven. Brand search volume +150% menunjukkan bahwa banyak orang yang terpapar campaign lalu melakukan research sendiri — sebagian dari mereka akan convert melalui channel lain (organic, Google ads). True ROI kemungkinan 200-400% jika indirect dimasukkan." } },
];

function VennDiagramViz() {
  const [brandSelected, setBrandSelected] = useState<Set<string>>(new Set(["Eco-Friendly","Minimalist","Youth"]));
  const [influencerSelected, setInfluencerSelected] = useState<Set<string>>(new Set(["Bold","Youth","Eco-Friendly"]));
  const overlap = [...brandSelected].filter(t => influencerSelected.has(t));
  const matchRate = brandSelected.size > 0 && influencerSelected.size > 0 ? Math.round((overlap.length / Math.max(brandSelected.size, influencerSelected.size)) * 100) : 0;
  const separation = 100 - matchRate;
  const toggle = (set: Set<string>, setter: React.Dispatch<React.SetStateAction<Set<string>>>, tag: string) => {
    const n = new Set(set); if (n.has(tag)) n.delete(tag); else n.add(tag); setter(n);
  };
  return (
    <div style={{ background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:"var(--radius-xl)", overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:"1px solid var(--color-border)", background:"var(--color-surface-2)" }}>
        <div style={{ fontWeight:800, fontSize:"1rem" }}>Venn Diagram: Brand × Influencer DNA Match</div>
        <div className="caption" style={{ marginTop:4 }}>Pilih tags untuk brand dan influencer, lihat overlap berubah</div>
      </div>
      <div style={{ padding:24 }}>
        <div style={{ display:"flex", gap:20, marginBottom:20, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ fontSize:"0.75rem", fontWeight:700, color:C, marginBottom:8 }}>🏢 Brand Tags</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {BRAND_TAGS.map(t => (<button key={t} onClick={() => toggle(brandSelected, setBrandSelected, t)} style={{ padding:"4px 10px", borderRadius:100, fontSize:"0.7rem", fontWeight:700, border:brandSelected.has(t)?`2px solid ${C}`:"1px solid var(--color-border)", background:brandSelected.has(t)?`${CL}0.15)`:"var(--color-surface-2)", color:brandSelected.has(t)?C:"var(--color-text-muted)", cursor:"pointer", fontFamily:"var(--font-sans)" }}>{t}</button>))}
            </div>
          </div>
          <div style={{ flex:"1 1 200px" }}>
            <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#22D3EE", marginBottom:8 }}>👤 Influencer Tags</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {INFLUENCER_TAGS.map(t => (<button key={t} onClick={() => toggle(influencerSelected, setInfluencerSelected, t)} style={{ padding:"4px 10px", borderRadius:100, fontSize:"0.7rem", fontWeight:700, border:influencerSelected.has(t)?"2px solid #22D3EE":"1px solid var(--color-border)", background:influencerSelected.has(t)?"rgba(34,211,238,0.15)":"var(--color-surface-2)", color:influencerSelected.has(t)?"#22D3EE":"var(--color-text-muted)", cursor:"pointer", fontFamily:"var(--font-sans)" }}>{t}</button>))}
            </div>
          </div>
        </div>
        {/* Venn Circles */}
        <div style={{ position:"relative", height:180, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <motion.div animate={{ x: -60 + separation * 0.3 }} transition={{ type:"spring", stiffness:200, damping:25 }}
            style={{ width:140, height:140, borderRadius:"50%", background:`${CL}0.15)`, border:`2px solid ${CL}0.5)`, position:"absolute", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:C, position:"absolute", left:10, textAlign:"center" }}>Brand<br/>{brandSelected.size} tags</span>
          </motion.div>
          <motion.div animate={{ x: 60 - separation * 0.3 }} transition={{ type:"spring", stiffness:200, damping:25 }}
            style={{ width:140, height:140, borderRadius:"50%", background:"rgba(34,211,238,0.15)", border:"2px solid rgba(34,211,238,0.5)", position:"absolute", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#22D3EE", position:"absolute", right:10, textAlign:"center" }}>Influencer<br/>{influencerSelected.size} tags</span>
          </motion.div>
          {overlap.length > 0 && (
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} style={{ position:"absolute", zIndex:2, background:"rgba(255,255,255,0.9)", borderRadius:100, padding:"4px 12px", display:"flex", flexDirection:"column", alignItems:"center" }}>
              <span style={{ fontSize:"1.5rem", fontWeight:900, color:"#16A34A" }}>{matchRate}%</span>
              <span style={{ fontSize:"0.55rem", fontWeight:700, color:"#16A34A" }}>MATCH</span>
            </motion.div>
          )}
        </div>
        <motion.div key={matchRate} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ marginTop:12, padding:"14px 16px", background:matchRate>70?"rgba(34,197,94,0.08)":matchRate>40?`${CL}0.06)`:"rgba(239,68,68,0.08)", border:`1px solid ${matchRate>70?"rgba(34,197,94,0.3)":matchRate>40?`${CL}0.2)`:"rgba(239,68,68,0.3)"}`, borderRadius:"var(--radius-sm)", textAlign:"center" }}>
          <div style={{ fontWeight:700, fontSize:"0.875rem", color:matchRate>70?"#16A34A":matchRate>40?C:"#DC2626", marginBottom:4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon icon={matchRate > 70 ? "solar:target-bold-duotone" : matchRate > 40 ? "solar:bolt-bold-duotone" : "solar:danger-bold-duotone"} width={18} />
            {matchRate > 70 ? "Excellent Match!" : matchRate > 40 ? "Moderate Match" : "Low Match"}
          </div>
          <div style={{ fontSize:"0.8125rem", color:"var(--color-text-secondary)" }}>
            {overlap.length > 0 ? `Overlap tags: ${overlap.join(", ")}` : "Tidak ada overlap — influencer ini tidak cocok dengan brand DNA"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AILab() {
  const [messages,setMessages]=useState<ChatMessage[]>([{role:"ai",content:"Halo! Aku AI Tutor untuk modul Influencer DNA Matching. Tanyakan tentang vector search, DNA scoring, atau ROI kolaborasi!",timestamp:new Date()}]);
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
  const bottomRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  async function handleSend(){if(!input.trim()||loading)return;const um=input.trim();setInput("");setError(null);setMessages(p=>[...p,{role:"user",content:um,timestamp:new Date()}]);setLoading(true);const r=await askModuleAI("influencer-dna",um);setLoading(false);if(r.error)setError(r.error);else if(r.answer)setMessages(p=>[...p,{role:"ai",content:r.answer!,timestamp:new Date()}]);}
  return(
    <div style={{border:"1px solid var(--color-border)",borderRadius:"var(--radius-xl)",overflow:"hidden",background:"var(--color-surface)",boxShadow:"var(--shadow-md)"}}>
      <div style={{padding:"16px 24px",borderBottom:"1px solid var(--color-border)",display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)"}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:`${CL}0.3)`,border:`1px solid ${CL}0.5)`,display:"flex",alignItems:"center",justifyContent:"center"}}><Bot size={18} color="#E879F9"/></div>
        <div><div style={{fontWeight:800,fontSize:"0.9375rem",color:"#F8F9FA"}}>AI Tutor Lab</div><div style={{fontSize:"0.75rem",color:"#9CA3AF"}}>Konteks: Influencer DNA Matching</div></div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"rgba(110,225,43,0.15)",border:"1px solid rgba(110,225,43,0.3)",borderRadius:100,padding:"3px 10px"}}><div style={{width:6,height:6,borderRadius:"50%",background:"#6EE12B",animation:"pulse 2s infinite"}}/><span style={{fontSize:"0.6875rem",fontWeight:700,color:"#6EE12B"}}>Online</span></div>
      </div>
      <div style={{height:360,overflowY:"auto",padding:"20px 24px",display:"flex",flexDirection:"column",gap:16,background:"var(--color-surface-2)"}}>
        {messages.map((msg,i)=>(<div key={i} style={{display:"flex",gap:10,flexDirection:msg.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:"50%",background:msg.role==="ai"?`linear-gradient(135deg,${C},#9333EA)`:"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid var(--color-border)"}}>{msg.role==="ai"?<Bot size={15} color="#FFF"/>:<User size={15} color="var(--color-text-secondary)"/>}</div><div style={{maxWidth:"78%",padding:"12px 16px",borderRadius:msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",background:msg.role==="ai"?"var(--color-surface)":`linear-gradient(135deg,${C},#9333EA)`,border:"1px solid var(--color-border)"}}><div style={{fontSize:"0.875rem",color:msg.role==="ai"?"var(--color-text-primary)":"#FFF",lineHeight:1.65,whiteSpace:"pre-wrap"}}>{msg.content.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div></div>))}
        {loading&&<div style={{display:"flex",gap:10}}><div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C},#9333EA)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Bot size={15} color="#FFF"/></div><div style={{padding:"14px 18px",background:"var(--color-surface)",border:"1px solid var(--color-border)",borderRadius:"4px 16px 16px 16px",display:"flex",gap:6}}>{[0,1,2].map(ii=><div key={ii} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`pulse 1.2s ${ii*0.2}s infinite`,opacity:0.6}}/>)}</div></div>}
        {error&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"color-mix(in srgb,var(--color-error) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--color-error) 30%,transparent)",borderRadius:"var(--radius-md)",fontSize:"0.8125rem",color:"var(--color-error)"}}><AlertCircle size={15}/>{error}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"16px 20px",borderTop:"1px solid var(--color-border)",display:"flex",gap:10,background:"var(--color-surface)"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();}}} placeholder="Tanyakan tentang influencer matching..." disabled={loading} rows={2} style={{flex:1,border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",padding:"10px 14px",fontSize:"0.875rem",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",background:"var(--color-surface-2)",resize:"none",outline:"none",lineHeight:1.5}}/>
        <button onClick={handleSend} disabled={loading||!input.trim()} style={{width:44,height:44,borderRadius:"var(--radius-md)",background:loading||!input.trim()?"var(--color-surface-3)":`linear-gradient(135deg,${C},#9333EA)`,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:loading||!input.trim()?"not-allowed":"pointer",flexShrink:0,alignSelf:"flex-end"}}><Send size={18} color={loading||!input.trim()?"var(--color-text-muted)":"#FFF"}/></button>
      </div>
    </div>
  );
}

export default function InfluencerDNAPage(){
  const [currentLesson,setCurrentLesson]=useState(0);const [completed,setCompleted]=useState<Set<number>>(new Set());const [quizAnswer,setQuizAnswer]=useState<QuizAnswer|null>(null);const [showAILab,setShowAILab]=useState(false);
  const lesson=LESSONS[currentLesson];const progress=(completed.size/LESSONS.length)*100;
  function goToLesson(idx:number){setCurrentLesson(idx);setQuizAnswer(null);setShowAILab(false);window.scrollTo({top:0,behavior:"smooth"});}
  function handleQuizAnswer(i:number){if(quizAnswer)return;const correct=i===lesson.quiz.correct;setQuizAnswer({questionIndex:currentLesson,selected:i,correct});if(correct)setCompleted(p=>new Set([...p,currentLesson]));}
  return(
    <div className="animate-fade-in-up" style={{display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:32,flexWrap:"wrap",gap:12}}><Link href="/dashboard/learn" style={{display:"flex",alignItems:"center",gap:8,color:"var(--color-text-secondary)",textDecoration:"none",fontSize:"0.875rem",fontWeight:600}}><ArrowLeft size={16}/> Kembali ke Kurikulum</Link><div style={{display:"flex",alignItems:"center",gap:16}}><div style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",color:"var(--color-text-muted)"}}><BookOpen size={15}/>{completed.size}/{LESSONS.length} selesai</div><div style={{width:120,height:6,background:"var(--color-surface-3)",borderRadius:999,overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C},#9333EA)`,borderRadius:999,transition:"width 0.5s ease"}}/></div></div></div>
      <div style={{background:"linear-gradient(135deg,#1A1D23 0%,#2D2F3A 100%)",borderRadius:"var(--radius-xl)",padding:"32px 36px",marginBottom:32,position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-50,right:-50,width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${CL}0.3) 0%,transparent 70%)`}}/><div style={{position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${CL}0.2)`,border:`1px solid ${CL}0.4)`,borderRadius:100,padding:"4px 14px",marginBottom:12}}><Users size={13} color="#E879F9"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"#E879F9",letterSpacing:"0.06em"}}>MODUL 11 · INFLUENCER DNA</span></div><h1 style={{fontSize:"clamp(1.375rem,3vw,1.875rem)",color:"#F8F9FA",letterSpacing:"-0.04em",marginBottom:8}}>Influencer DNA Matching</h1><p style={{color:"#9CA3AF",maxWidth:480}}>Pencocokan vibe brand dengan influencer menggunakan vector search dan AI.</p><div style={{display:"flex",gap:20,marginTop:20}}><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><BookOpen size={14}/> 4 Materi</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#9CA3AF"}}><Clock size={14}/> 2.5 jam</span><span style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8125rem",color:"#E879F9",fontWeight:700}}><Zap size={14}/> AI Tutor Lab</span></div></div></div>
      <div style={{display:"flex",gap:28,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{flex:"0 0 260px",display:"flex",flexDirection:"column",gap:6,position:"sticky",top:24}}><div style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-text-muted)",letterSpacing:"0.08em",marginBottom:8}}>DAFTAR MATERI</div>{LESSONS.map((l,i)=>{const isDone=completed.has(i);const isActive=i===currentLesson;return(<button key={l.id} onClick={()=>goToLesson(i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:"var(--radius-md)",border:isActive?`1px solid ${CL}0.5)`:"1px solid transparent",background:isActive?`${CL}0.1)`:"transparent",cursor:"pointer",textAlign:"left",transition:"all 0.2s",width:"100%",fontFamily:"var(--font-sans)"}}>{isDone?<CheckCircle size={16} color="#6EE12B" style={{flexShrink:0}}/>:<Circle size={16} color={isActive?C:"var(--color-border-2)"} style={{flexShrink:0}}/>}<span style={{fontSize:"0.8125rem",fontWeight:isActive?700:500,color:isActive?C:"var(--color-text-secondary)",lineHeight:1.4}}>{i+1}. {l.title}</span></button>);})}</div>
        <div style={{flex:"1 1 400px",display:"flex",flexDirection:"column",gap:24,minWidth:0}}>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"24px 28px",borderBottom:"1px solid var(--color-border)",background:`${CL}0.05)`,display:"flex",alignItems:"flex-start",gap:14}}><div style={{width:48,height:48,borderRadius:"var(--radius-md)",background:`${CL}0.15)`,border:`1px solid ${CL}0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Users size={22} color={C} strokeWidth={2}/></div><div><div style={{fontSize:"0.6875rem",fontWeight:700,color:C,letterSpacing:"0.08em",marginBottom:4}}>MATERI {currentLesson+1} DARI {LESSONS.length}</div><h2 style={{fontSize:"1.25rem",letterSpacing:"-0.02em",color:"var(--color-text-primary)",marginBottom:2}}>{lesson.title}</h2><div style={{fontSize:"0.8125rem",color:"var(--color-text-muted)"}}>{lesson.concept}</div></div></div>
            <div style={{padding:28}}>
              <div style={{fontSize:"0.9375rem",lineHeight:1.75,color:"var(--color-text-secondary)",marginBottom:24,whiteSpace:"pre-wrap"}}>{lesson.body.replace(/\*\*(.*?)\*\*/g,"$1")}</div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px 18px",background:`${CL}0.06)`,border:`1px solid ${CL}0.2)`,borderRadius:"var(--radius-md)",marginBottom:28}}><Lightbulb size={18} color={C} style={{flexShrink:0,marginTop:1}}/><p style={{fontSize:"0.875rem",color:"var(--color-text-primary)",fontStyle:"italic",fontWeight:600,lineHeight:1.6}}>{lesson.insight}</p></div>
              <div style={{marginBottom:28}}><VennDiagramViz/></div>
              <div style={{padding:"20px 22px",background:"var(--color-surface-2)",border:"1px solid var(--color-border)",borderRadius:"var(--radius-md)",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Target size={15} color="var(--color-accent-text)"/><span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-accent-text)",letterSpacing:"0.08em"}}>TANTANGAN PRAKTIK</span></div><div style={{fontSize:"0.875rem",lineHeight:1.7,color:"var(--color-text-secondary)",whiteSpace:"pre-wrap"}}>{lesson.challenge.replace(/\*\*(.*?)\*\*/g,"$1")}</div></div>
              <button onClick={()=>setShowAILab(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderRadius:"var(--radius-md)",background:showAILab?`linear-gradient(135deg,${C},#9333EA)`:"var(--color-surface-3)",border:"1px solid",borderColor:showAILab?"transparent":"var(--color-border)",color:showAILab?"#FFF":"var(--color-text-secondary)",fontSize:"0.875rem",fontWeight:700,cursor:"pointer",width:"100%",justifyContent:"center",marginBottom:showAILab?20:0,fontFamily:"var(--font-sans)"}}><Zap size={15}/> {showAILab?"Tutup AI Tutor Lab":"Buka AI Tutor Lab — Tanya Langsung ke AI"}</button>
              {showAILab&&<AILab/>}
            </div>
          </div>
          <div className="premium-card" style={{padding:0}}><div style={{padding:"20px 24px",borderBottom:"1px solid var(--color-border)",background:"var(--color-surface-2)",display:"flex",alignItems:"center",gap:10}}><Users size={18} color="var(--color-accent-text)"/><span style={{fontWeight:800,fontSize:"1rem"}}>Cek Pemahaman</span>{quizAnswer&&<span style={{marginLeft:"auto",fontSize:"0.75rem",fontWeight:700,padding:"2px 10px",borderRadius:100,background:quizAnswer.correct?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:quizAnswer.correct?"#16A34A":"#DC2626"}}>{quizAnswer.correct?"✓ Benar!":"✗ Coba lagi"}</span>}</div><div style={{padding:"24px 28px"}}><p style={{fontWeight:700,fontSize:"1rem",color:"var(--color-text-primary)",marginBottom:20,lineHeight:1.5}}>{lesson.quiz.question}</p><div style={{display:"flex",flexDirection:"column",gap:10}}>{lesson.quiz.options.map((opt,i)=>{const isS=quizAnswer?.selected===i;const isC=i===lesson.quiz.correct;const sr=!!quizAnswer;let bg="var(--color-surface-2)";let border="1px solid var(--color-border)";let color="var(--color-text-secondary)";if(sr&&isC){bg="rgba(34,197,94,0.08)";border="1px solid rgba(34,197,94,0.4)";color="#15803D";}else if(sr&&isS&&!isC){bg="rgba(239,68,68,0.08)";border="1px solid rgba(239,68,68,0.4)";color="#B91C1C";}return(<button key={i} onClick={()=>handleQuizAnswer(i)} disabled={!!quizAnswer} style={{padding:"14px 18px",borderRadius:"var(--radius-md)",background:bg,border,color,fontSize:"0.875rem",fontWeight:500,cursor:quizAnswer?"not-allowed":"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,lineHeight:1.5,fontFamily:"var(--font-sans)"}}><span style={{width:24,height:24,borderRadius:"50%",background:sr&&isC?"#16A34A":sr&&isS?"#DC2626":"var(--color-surface-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6875rem",fontWeight:800,color:(sr&&isC)||(sr&&isS)?"#FFF":"var(--color-text-muted)",flexShrink:0}}>{String.fromCharCode(65+i)}</span>{opt}</button>);})}</div>{quizAnswer&&<div style={{marginTop:20,padding:"16px 18px",background:quizAnswer.correct?"rgba(34,197,94,0.06)":"rgba(239,68,68,0.06)",border:`1px solid ${quizAnswer.correct?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:"var(--radius-md)"}}><div style={{fontSize:"0.75rem",fontWeight:700,color:quizAnswer.correct?"#16A34A":"#DC2626",marginBottom:6}}>{quizAnswer.correct?"✓ PENJELASAN":"✗ PENJELASAN"}</div><p style={{fontSize:"0.875rem",lineHeight:1.65,color:"var(--color-text-secondary)"}}>{lesson.quiz.explanation}</p></div>}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:12}}><button onClick={()=>goToLesson(currentLesson-1)} disabled={currentLesson===0} className="btn btn-secondary" style={{gap:8,opacity:currentLesson===0?0.4:1}}><ChevronLeft size={16}/> Sebelumnya</button>{currentLesson<LESSONS.length-1?<button onClick={()=>goToLesson(currentLesson+1)} disabled={!quizAnswer} className="btn btn-primary" style={{gap:8,opacity:quizAnswer?1:0.5}}>Materi Berikutnya <ChevronRight size={16}/></button>:<Link href="/dashboard/learn" className="btn btn-primary" style={{gap:8}}>Selesai! Kembali ke Kurikulum <CheckCircle size={16}/></Link>}</div>
        </div>
      </div>
    </div>
  );
}
