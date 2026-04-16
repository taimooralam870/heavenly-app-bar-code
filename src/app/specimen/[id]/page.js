import Link from "next/link";
import { getPlantById, getPlants } from "../../data/plants";
import { notFound } from "next/navigation";
import {
   ArrowLeft, Droplets, Sun, Thermometer, ShieldCheck,
   MapPin, ShoppingCart, Heart, Share2, Info, ArrowRight, Star
} from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
   const { id } = await params;
   const plant = await getPlantById(id);
   if (!plant) return { title: "Specimen Not Found" };
   return {
      title: `${plant.name} · Desert Survivor Specimen`,
      description: `Discover the resilient story of ${plant.name}. Adaptive greenery for the modern UAE home.`,
   };
}

export default async function SpecimenPage({ params }) {
   const { id } = await params;
   const plant = await getPlantById(id);
   const allPlants = await getPlants();

   if (!plant) notFound();

   // Suggestions: Other plants except the current one
   const suggestions = allPlants.filter(p => p.id !== plant.id).slice(0, 3);

   const BRAND_ACCENT = "#C8973E"; // Golden Sand
   const BRAND_DEEP = "#1A3C34";   // Forest Emerald
   const BRAND_BG = "#FBFAF5";     // Ivory Cream

   return (
      <div style={{ background: BRAND_BG, minHeight: "100vh", paddingBottom: "100px", color: "#0D1B1E" }}>

         {/* ── TOP NAVIGATION ── */}
         <nav style={{ padding: "24px 0", borderBottom: "1px solid rgba(26,60,52,0.05)", background: "#fff" }}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <Link href="/" style={{ textDecoration: "none", color: BRAND_DEEP, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ArrowLeft size={18} />
                  <span style={{ fontWeight: 800, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Return to Gallery</span>
               </Link>
               <div style={{ display: "flex", gap: "16px" }}>
                  <button style={circleBtn}><Heart size={18} /></button>
                  <button style={circleBtn}><Share2 size={18} /></button>
               </div>
            </div>
         </nav>

         {/* ── MAIN CONTENT ── */}
         <div className="container" style={{ paddingTop: "60px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "80px", alignItems: "start" }}>

               {/* Gallery View */}
               <div className="anim-fadeUp">
                  <div style={imageDisplay}>
                     {plant.image ? (
                        <img src={plant.image} style={{ width: "100%", borderRadius: "40px", boxShadow: "0 40px 80px rgba(26,60,52,0.12)" }} />
                     ) : (
                        <div style={{ height: "640px", background: "#f1f5f9", borderRadius: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "100px" }}>🪴</div>
                     )}
                     <div style={{ ...badgeFloating, background: BRAND_DEEP, color: BRAND_ACCENT, border: `1px solid ${BRAND_ACCENT}` }}>
                        <ShieldCheck size={14} />
                        PREMIUM REGISTRY SPECIMEN
                     </div>
                  </div>

                  <div style={{ marginTop: "40px", padding: "48px", background: "#fff", borderRadius: "32px", border: "1px solid rgba(26,60,52,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                     <h3 className="font-display" style={{ fontSize: "28px", fontWeight: 900, marginBottom: "24px", color: BRAND_DEEP }}>Species Heritage</h3>
                     <p style={{ fontSize: "18px", color: "#475569", lineHeight: 1.9, marginBottom: "40px", fontWeight: 500 }}>
                        {plant.description}
                     </p>
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                        <div style={{ ...originCard, background: "#f1f5f4" }}>
                           <div style={{ ...originIcon, background: BRAND_DEEP, color: "#fff" }}><MapPin size={18} /></div>
                           <div>
                              <div style={{ fontSize: "11px", fontWeight: 800, color: BRAND_ACCENT, letterSpacing: "1px" }}>NURSERY ORIGIN</div>
                              <div style={{ fontWeight: 800, color: BRAND_DEEP }}>{plant.location || "Dubai Oasis"}</div>
                           </div>
                        </div>
                        <div style={{ ...originCard, background: "#fcf8f0" }}>
                           <div style={{ ...originIcon, background: BRAND_ACCENT, color: "#fff" }}><Star size={18} /></div>
                           <div>
                              <div style={{ fontSize: "11px", fontWeight: 800, color: BRAND_DEEP, letterSpacing: "1px" }}>REGISTRY SCORE</div>
                              <div style={{ fontWeight: 800, color: BRAND_ACCENT }}>AUTHENTIC GRADE A</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Sales Sidebar */}
               <aside className="anim-fadeUp delay-1" style={{ position: "sticky", top: "120px" }}>
                  <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                     <span style={{ fontSize: "12px", fontWeight: 900, color: BRAND_ACCENT, letterSpacing: "2.5px" }}>{plant.species.toUpperCase()}</span>
                     <div style={{ width: "4px", height: "4px", background: BRAND_ACCENT, borderRadius: "50%" }}></div>
                     <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>ID: {plant.id.substring(0, 8)}</span>
                  </div>
                  <h1 className="font-display" style={{ fontSize: "52px", fontWeight: 900, marginBottom: "32px", color: BRAND_DEEP, lineHeight: 1 }}>{plant.name}</h1>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "48px" }}>
                     <div style={{ ...statTag, border: `1px solid rgba(26,60,52,0.1)`, background: "none" }}><Droplets size={16} color={BRAND_DEEP} /> Low Water</div>
                     <div style={{ ...statTag, border: `1px solid rgba(26,60,52,0.1)`, background: "none" }}><Sun size={16} color={BRAND_DEEP} /> Indirect Light</div>
                     <div style={{ ...statTag, border: `1px solid rgba(26,60,52,0.1)`, background: "none" }}><Thermometer size={16} color={BRAND_DEEP} /> AC Tolerant</div>
                  </div>

                  <div style={{ ...purchaseCard, background: BRAND_DEEP, color: "#fff", border: "none" }}>
                     <div style={{ marginBottom: "32px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: BRAND_ACCENT, marginBottom: "6px", letterSpacing: "1.5px" }}>ESTIMATED COLLECTION VALUE</div>
                        <div style={{ fontSize: "42px", fontWeight: 900, color: "#fff" }}>AED 1,250<span style={{ fontSize: "20px", opacity: 0.6 }}>.00</span></div>
                     </div>
                     <button style={{ ...btnBuy, background: BRAND_ACCENT, color: BRAND_DEEP }}>
                        Acquire this Specimen <ArrowRight size={20} />
                     </button>
                     <p style={{ textAlign: "center", fontSize: "11px", color: BRAND_ACCENT, opacity: 0.7, margin: "20px 0 0", fontWeight: 700 }}>Exclusive to HeavenlyPlants Registry</p>
                  </div>

                  <div style={{ marginTop: "48px" }}>
                     <h4 style={{ fontSize: "14px", fontWeight: 900, color: BRAND_DEEP, marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1px solid ${BRAND_ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>!</div>
                        The Collector Promise
                     </h4>
                     <ul style={infoList}>
                        <li style={{ color: BRAND_DEEP }}><strong>AC Resilience:</strong> Specially acclimated to UAE indoor AC cycles.</li>
                        <li style={{ color: BRAND_DEEP }}><strong>Digital Presence:</strong> Lifetime access to the private Caretaker Console.</li>
                        <li style={{ color: BRAND_DEEP }}><strong>Verified Origin:</strong> Provenance tracked from seed to ceramic.</li>
                     </ul>
                  </div>
               </aside>

            </div>

            {/* ── SUGGESTIONS SECTION ── */}
            <section style={{ marginTop: "140px" }}>
               <div style={{ borderTop: "1px solid rgba(26,60,52,0.1)", paddingTop: "80px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
                     <div>
                        <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 900, color: BRAND_DEEP }}>Bespoke Companions</h2>
                        <p style={{ color: "#64748b", marginTop: "8px" }}>Curated selections for your private indoor gallery.</p>
                     </div>
                     <Link href="/#explore" style={{ color: BRAND_ACCENT, fontWeight: 900, textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        View Collection <ArrowRight size={18} />
                     </Link>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
                     {suggestions.map((p) => (
                        <Link key={p.id} href={`/specimen/${p.id}`} style={{ textDecoration: "none" }}>
                           <div style={{ ...suggCard, background: "#fff", border: "1px solid rgba(26,60,52,0.05)" }}>
                              <div style={{ ...suggImageWrap, height: "260px" }}>
                                 {p.image ? <img src={p.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ fontSize: "50px" }}>🪴</div>}
                              </div>
                              <div style={{ padding: "28px" }}>
                                 <h4 style={{ fontSize: "20px", fontWeight: 900, color: BRAND_DEEP, marginBottom: "8px" }}>{p.name}</h4>
                                 <div style={{ fontSize: "12px", color: BRAND_ACCENT, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px" }}>{p.species}</div>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </section>
         </div>
      </div>
   );
}

// ── UI STYLES ──
const circleBtn = { width: "48px", height: "48px", borderRadius: "50%", background: "#fff", border: "1px solid rgba(26,60,52,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s", color: "#1A3C34" };
const imageDisplay = { position: "relative" };
const badgeFloating = { position: "absolute", top: "30px", left: "30px", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: 900, display: "flex", alignItems: "center", gap: "10px", letterSpacing: "1.5px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" };
const originCard = { padding: "24px", borderRadius: "24px", display: "flex", gap: "20px", alignItems: "center" };
const originIcon = { width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" };
const statTag = { padding: "10px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" };
const purchaseCard = { padding: "48px", borderRadius: "40px", boxShadow: "0 30px 60px rgba(26,60,52,0.2)" };
const btnBuy = { width: "100%", padding: "22px", border: "none", borderRadius: "100px", fontWeight: 900, fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", cursor: "pointer", transition: "0.3s", textTransform: "uppercase", letterSpacing: "1px" };
const infoList = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px", fontSize: "15px", lineHeight: 1.6 };

const suggCard = { borderRadius: "32px", overflow: "hidden", transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)" };
const suggImageWrap = { background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" };
