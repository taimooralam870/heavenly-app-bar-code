import Link from "next/link";
import { getPlantById, getPlants } from "../../data/plants";
import { notFound } from "next/navigation";
import PlantActions from "./PlantActions";
import PlantGateway from "./PlantGateway";
import TopActions from "./TopActions";
import MobilePlantLayout from "./MobilePlantLayout";
import PlantChatWidget from "./PlantChatWidget";
import {
   ArrowLeft, Calendar, User, Thermometer, Droplets,
   MapPin, Leaf, Clock, Star, Maximize, Lock,
   ChevronRight, Info, Camera, MessageCircle, Quote, ShieldCheck, Sun, Bell, HeartHandshake
} from "lucide-react";

export const dynamic = 'force-dynamic';

async function getDubaiWeather() {
   try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current_weather=true", { next: { revalidate: 1800 } });
      const data = await res.json();
      return data.current_weather;
   } catch (e) {
      return null;
   }
}

function getSunlightAdvice(weather) {
   if (!weather) return "Partial shade recommended";
   if (weather.is_day === 0) return "Resting (Night mode)";

   const code = weather.weathercode;
   if (code === 0) return "Strong UAE sun today. Best in shade.";
   if (code >= 1 && code <= 3) return "Bright & Clear. Indirect light ok.";
   if (code >= 45) return "Overcast sky. Low natural light.";
   return "Partial shade recommended";
}

export async function generateMetadata({ params }) {
   const resolvedParams = await params;
   const plant = await getPlantById(resolvedParams.id);
   if (!plant) return { title: "Plant Not Found" };
   return {
      title: `${plant.name} · HeavenlyPlants Profile`,
      description: plant.description,
   };
}

export default async function PlantPage({ params }) {
   const resolvedParams = await params;
   const plant = await getPlantById(resolvedParams.id);
   if (!plant) notFound();

   const weather = await getDubaiWeather();
   const currentTemp = weather ? Math.round(weather.temperature) : null;
   const tempString = currentTemp ? `Outdoors: ${currentTemp}°C | Indoors: 22°C-25°C` : `UAE AC Optimal: 22°C - 25°C`;
   const sunString = getSunlightAdvice(weather);

   const BRAND_DEEP = "#1e293b"; // Slate-900 for high professionalism
   const BRAND_ACCENT = "#10b981"; // Emerald
   const BRAND_MUTED = "#64748b";
    return (
      <>
      <PlantGateway plant={plant}>
         <style dangerouslySetInnerHTML={{__html: `
            #mobile-plant-view { display: none !important; }
            #desktop-plant-view { display: block !important; }
            @media (max-width: 768px) {
               #mobile-plant-view { display: block !important; }
               #desktop-plant-view { display: none !important; }
            }
         `}} />
         {/* ── MOBILE LAYOUT (only on ≤768px) ── */}
         <div id="mobile-plant-view" className="mobile-plant-view">
            <MobilePlantLayout plant={plant} currentTemp={currentTemp} sunString={sunString} />
         </div>
         {/* ── DESKTOP LAYOUT (hidden on mobile) ── */}
         <div id="desktop-plant-view" className="desktop-plant-view">
         <div style={{ minHeight: "100vh", background: "#f8fafc", color: BRAND_DEEP }}>
            <nav style={navStyle}>
               <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
                     <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: BRAND_DEEP, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <Leaf size={18} />
                     </div>
                     <span className="font-display" style={{ fontWeight: 800, fontSize: "20px" }}>
                        Heavenly<span style={{ color: BRAND_ACCENT }}>Plants</span>
                     </span>
                  </Link>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                     {/* Instagram SVG */}
                     <a href="#" style={{ color: BRAND_DEEP, transition: "0.2s", display: "flex" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                           <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                     </a>
                     {/* Facebook SVG */}
                     <a href="#" style={{ color: BRAND_DEEP, transition: "0.2s", display: "flex" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                     </a>
                     {/* TikTok SVG (already SVG) */}
                     <a href="#" style={{ color: BRAND_DEEP, transition: "0.2s", display: "flex", alignItems: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                           <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.92a8.27 8.27 0 0 0 3.73 1z" />
                        </svg>
                     </a>
                  </div>
               </div>
            </nav>

            {/* ── DASHBOARD HEADER ── */}
            <section className="hero-padding plant-hero-section" style={{ padding: "120px 0 40px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
               <div className="container">
                  <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" }}>
                     <div className="anim-fadeUp">
                        <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                           <span style={verifiedBadge}>
                              <ShieldCheck size={14} /> Verified Digital Companion
                           </span>
                        </div>
                        <h1 className="font-display plant-hero-title" style={{ fontSize: "56px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.1 }}>
                           Meet your <br /> <span style={{ color: BRAND_ACCENT }}>{plant.nickname || plant.name}</span>
                        </h1>

                        <p style={{ fontSize: "20px", color: BRAND_MUTED, marginBottom: "32px", fontWeight: 600 }}>
                           A healthy {plant.species || "Green Friend"} specimen
                        </p>

                        {/* Voice Tone Bubble */}
                        <div style={aiBubbleContainer}>
                           <div style={bubbleArrow} />
                           <span style={{ fontWeight: 800, color: BRAND_ACCENT }}>{plant.nickname || plant.name}:</span> "I'm loving this cool UAE indoor breeze, but don't forget my water!"
                        </div>

                        <TopActions plantId={plant.id} />
                     </div>

                     <div className="anim-leafGrow" style={{ position: "relative" }}>
                        <div style={imagePreviewFrame}>
                           {plant.image ? (
                              <img src={plant.image} style={{ width: "100%", maxHeight: "450px", objectFit: "cover", borderRadius: "12px" }} />
                           ) : (
                              <div style={{ height: "450px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: "12px", fontSize: "120px" }}>🪴</div>
                           )}
                        </div>
                        <div style={floatingMeta} className="hide-mobile">
                           <MapPin size={18} color={BRAND_ACCENT} />
                           <span>Thriving in <strong>{plant.location}</strong></span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* ── HEALTH INDICATORS ── */}
            <section className="health-section" style={{ padding: "40px 0", background: "#f8fafc" }}>
               <div className="container">
                  <h3 className="font-display" style={{ fontSize: "28px", fontWeight: 800, marginBottom: "32px" }}>Health Status</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                     <div style={statusCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                           <div style={{ ...iconSquare, background: "#eff6ff", color: "#3b82f6" }}><Droplets size={20} /></div>
                           <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8" }}>WATER LEVEL</span>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                           <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: "60%", height: "100%", background: "#3b82f6", borderRadius: "4px" }}></div>
                           </div>
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>Adequate (Last watered 2 days ago)</p>
                     </div>

                     <div style={statusCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                           <div style={{ ...iconSquare, background: "#fef3c7", color: "#d97706" }}><Sun size={20} /></div>
                           <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8" }}>SUNLIGHT NEEDS</span>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                           <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: "40%", height: "100%", background: "#d97706", borderRadius: "4px" }}></div>
                           </div>
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{sunString}</p>
                     </div>

                     <div style={statusCard}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                           <div style={{ ...iconSquare, background: "#fce7f3", color: "#db2777" }}><Thermometer size={20} /></div>
                           <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8" }}>TEMPERATURE</span>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                           <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                              <div style={{ width: "80%", height: "100%", background: "linear-gradient(90deg, #3b82f6, #db2777)", borderRadius: "4px" }}></div>
                           </div>
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{tempString}</p>
                     </div>
                  </div>
               </div>
            </section>

            {/* ── COLLECTOR SERVICES & CONSOLE ── */}
            <div className="container" style={{ padding: "60px 24px 100px" }}>
               <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px" }}>

                  <div className="plant-left-col" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

                     {/* Life Narrative Gamification */}
                     <section>
                        <div className="journey-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                           <h3 className="font-display" style={{ fontSize: "22px", fontWeight: 800, margin: 0 }}>Growth Journey</h3>
                           <button className="btn-outline" style={{ padding: "7px 14px", fontSize: "12px", flexShrink: 0 }}>View Gallery</button>
                        </div>
                        <div className="timeline-list" style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
                           {plant.timeline.map((item, i) => (
                              <div key={i} style={{ position: "relative" }}>
                                 <div style={timelineNode} />
                                 <div style={narrativeStep}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                       <div style={{ fontWeight: 800, fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                          {item.event}
                                          {item.type === 'memory' && <Camera size={14} color={BRAND_ACCENT} />}
                                       </div>
                                       <div style={narrativeDate}>{item.date}</div>
                                    </div>
                                    <p style={{ color: BRAND_MUTED, fontSize: "14px", marginBottom: item.image ? "12px" : "0" }}>{item.detail}</p>
                                    {item.image && (
                                       <div style={{ marginTop: "12px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                          <img src={item.image} style={{ width: "100%", maxHeight: "300px", objectFit: "cover", display: "block" }} />
                                       </div>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* SMART RECOMMENDATIONS */}
                     <section>
                        <h3 className="font-display" style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Best Friends for {plant.name}</h3>
                        <p style={{ color: BRAND_MUTED, marginBottom: "32px" }}>Expand your oasis with these UAE indoor favorites.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                           <div style={recCard}>
                              <div style={{ width: "60px", height: "60px", background: "#f0fdf4", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", marginBottom: "16px" }}>🌱</div>
                              <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>Snake Plant</h4>
                              <p style={{ fontSize: "13px", color: BRAND_MUTED, marginBottom: "16px" }}>Perfect low-light companion.</p>
                              <a href="#" style={{ fontSize: "13px", fontWeight: 800, color: BRAND_ACCENT, textDecoration: "none" }}>Shop Now →</a>
                           </div>
                           <div style={recCard}>
                              <div style={{ width: "60px", height: "60px", background: "#fefce8", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", marginBottom: "16px" }}>🌿</div>
                              <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>Premium Fertilizer</h4>
                              <p style={{ fontSize: "13px", color: BRAND_MUTED, marginBottom: "16px" }}>Nutrients adapted for UAE water.</p>
                              <a href="#" style={{ fontSize: "13px", fontWeight: 800, color: BRAND_ACCENT, textDecoration: "none" }}>Shop Now →</a>
                           </div>
                        </div>
                     </section>
                  </div>

                  <aside style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                     {/* CARETAKER PROFILE CARD */}
                     <div style={caretakerCard}>
                        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                           <div style={caretakerAvatarFrame}>
                              {plant.owner_image ? (
                                 <img src={plant.owner_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                 <User size={22} color={BRAND_ACCENT} />
                              )}
                              <div style={onlineStatusIndicator} className="anim-pulseGlow" />
                           </div>
                           <div style={{ flex: 1 }}>
                              <span style={{ fontSize: "10px", fontWeight: 800, color: BRAND_ACCENT, letterSpacing: "1px", textTransform: "uppercase" }}>Primary Caretaker</span>
                              <h4 style={{ fontSize: "18px", fontWeight: 900, margin: 0, color: BRAND_DEEP }}>{plant.owner_name || "Nexus Registry"}</h4>
                              <p style={{ fontSize: "12px", color: BRAND_MUTED, margin: 0 }}>Dubai, UAE · Active</p>
                           </div>
                        </div>
                     </div>

                     {/* CARETAKER ACTIONS */}
                     <div style={{ paddingBottom: "16px" }}>
                        <PlantActions plantId={plant.id} currentOwner={plant.owner_name} correctKey={plant.access_key} />
                     </div>

                     {/* Quick Info */}
                     <div style={asideInfoCard}>
                        <h4 style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: BRAND_MUTED }}>Asset Metadata</h4>
                        <div style={metaRow}><span>Registry ID</span><strong>PL-{plant.id.substring(0, 8)}</strong></div>
                        <div style={metaRow}><span>Specimen</span><strong>{plant.species}</strong></div>
                        <div style={metaRow}><span>Trust Score</span><strong style={{ color: BRAND_ACCENT }}>High Verified</strong></div>
                     </div>

                  </aside>

               </div>
            </div>

            <footer style={footerStyle}>
               <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: BRAND_MUTED }}>© 2024 HeavenlyPlants Registry</span>
                  <Link href="/" style={{ fontSize: "14px", color: BRAND_DEEP, textDecoration: "none", fontWeight: 700 }}>Home</Link>
               </div>
            </footer>

         </div>
         </div>{/* end desktop-plant-view */}
          <PlantChatWidget plant={plant} />
       </PlantGateway>
    </>
   );
}

// ── UI COMPONENTS ──
const navStyle = { position: "fixed", top: 0, left: 0, right: 0, height: "80px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e2e8f0", zIndex: 1000 };
const verifiedBadge = { display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", color: "#059669", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 800 };
const reviewCard = { padding: "32px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" };
const miniAvatar = { width: "24px", height: "24px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 900 };
const imagePreviewFrame = { background: "#fff", padding: "12px", borderRadius: "24px", boxShadow: "0 30px 60px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" };
const floatingMeta = { position: "absolute", bottom: "30px", left: "30px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", padding: "12px 20px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" };
const statusCard = { padding: "24px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" };
const iconSquare = { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" };
const recCard = { padding: "24px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", transition: "all 0.2s" };
const aiBubbleContainer = { background: "#f8fafc", border: "1px solid #e2e8f0", padding: "16px 20px", borderRadius: "16px", fontSize: "15px", color: "#475569", position: "relative", marginBottom: "32px", maxWidth: "400px" };
const bubbleArrow = { position: "absolute", top: "-8px", left: "24px", width: "16px", height: "16px", background: "#f8fafc", borderLeft: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0", transform: "rotate(45deg)" };
const timelineNode = { position: "absolute", left: "-39px", top: "4px", width: "12px", height: "12px", background: "#fff", border: "3px solid #10b981", borderRadius: "50%" };
const narrativeStep = { background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #f1f5f9" };
const narrativeDate = { fontSize: "12px", color: "#94a3b8", fontWeight: 700 };
const consoleLoginCard = { padding: "40px", background: "#fff", borderRadius: "32px", border: "1px solid #111827", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" };
const asideInfoCard = { padding: "32px", background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" };
const metaRow = { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9", fontSize: "14px" };
const footerStyle = { borderTop: "1px solid #e2e8f0", padding: "60px 0", background: "#fff" };

const caretakerCard = { padding: "24px", background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" };
const caretakerAvatarFrame = { position: "relative", width: "56px", height: "56px", borderRadius: "50%", background: "#f8fafc", border: "2px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" };
const onlineStatusIndicator = { position: "absolute", bottom: "2px", right: "2px", width: "12px", height: "12px", background: "#10b981", border: "2px solid #fff", borderRadius: "50%" };
