import Link from "next/link";
import { getPlantById, getPlants } from "../../data/plants";
import { notFound } from "next/navigation";
import PlantActions from "./PlantActions";
import PlantGateway from "./PlantGateway";
import TopActions from "./TopActions";
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

  const BRAND_DEEP = "#1e293b"; 
  const BRAND_ACCENT = "#10b981"; 
  const BRAND_MUTED = "#64748b";

  return (
    <PlantGateway plant={plant}>
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
               <a href="#" style={{ color: BRAND_DEEP, transition: "0.2s", display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
               </a>
            </div>
          </div>
        </nav>
  
        <section className="hero-padding" style={{ padding: "100px 0 40px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
          <div className="container">
            <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
              <div className="anim-fadeUp">
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                   <span style={verifiedBadge}>
                      <ShieldCheck size={14} /> Verified Companion
                   </span>
                </div>
                <h1 className="font-display plant-hero-title" style={{ fontSize: "40px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.1 }}>
                  Meet <span style={{ color: BRAND_ACCENT }}>{plant.nickname || plant.name}</span>
                </h1>
                <p style={{ fontSize: "18px", color: BRAND_MUTED, marginBottom: "24px", fontWeight: 600 }}>{plant.species}</p>
                <div style={aiBubbleContainer}>
                  <div style={bubbleArrow} />
                  <span style={{ fontWeight: 800, color: BRAND_ACCENT }}>{plant.nickname || plant.name}:</span> "I'm loving this cool UAE indoor breeze!"
                </div>
                <TopActions plantId={plant.id} />
              </div>
              <div className="anim-leafGrow" style={{ position: "relative" }}>
                 <div style={imagePreviewFrame}>
                    {plant.image ? (
                      <img src={plant.image} style={{ width: "100%", maxHeight: "350px", objectFit: "cover", borderRadius: "12px" }} />
                    ) : (
                      <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", borderRadius: "12px", fontSize: "80px" }}>🪴</div>
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

        <section style={{ padding: "40px 0", background: "#f8fafc" }}>
           <div className="container">
              <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px" }}>Health Status</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                 <div style={statusCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                       <div style={{ ...iconSquare, background: "#eff6ff", color: "#3b82f6" }}><Droplets size={20} /></div>
                       <span style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>WATER LEVEL</span>
                    </div>
                    <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                        <div style={{ width: "60%", height: "100%", background: "#3b82f6" }}></div>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>Adequate (2 days ago)</p>
                 </div>
                 <div style={statusCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                       <div style={{ ...iconSquare, background: "#fef3c7", color: "#d97706" }}><Sun size={20} /></div>
                       <span style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>SUNLIGHT</span>
                    </div>
                    <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                        <div style={{ width: "40%", height: "100%", background: "#d97706" }}></div>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>{sunString}</p>
                 </div>
                 <div style={statusCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                       <div style={{ ...iconSquare, background: "#fce7f3", color: "#db2777" }}><Thermometer size={20} /></div>
                       <span style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>UAE CLIMATE</span>
                    </div>
                    <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden", marginBottom: "12px" }}>
                        <div style={{ width: "80%", height: "100%", background: "linear-gradient(90deg, #3b82f6, #db2777)" }}></div>
                    </div>
                    <p style={{ fontSize: "13px", fontWeight: 700, margin: 0 }}>{tempString}</p>
                 </div>
              </div>
           </div>
        </section>

        <div className="container" style={{ padding: "40px 16px 80px" }}>
           <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "40px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
                 <section>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
                       <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 800 }}>Growth Journey</h3>
                       <button className="btn-outline" style={{ padding: "6px 14px", fontSize: "11px" }}>Gallery</button>
                    </div>
                    <div style={{ borderLeft: "2px solid #e2e8f0", paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "32px" }}>
                       {plant.timeline.map((item, i) => (
                          <div key={i} style={{ position: "relative" }}>
                             <div style={timelineNode} />
                             <div style={narrativeStep}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                   <div style={{ fontWeight: 800, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                                      {item.event}
                                      {item.type === 'memory' && <Camera size={14} color={BRAND_ACCENT} />}
                                   </div>
                                   <div style={narrativeDate}>{item.date}</div>
                                </div>
                                <p style={{ color: BRAND_MUTED, fontSize: "13px" }}>{item.detail}</p>
                                {item.image && (
                                   <div style={{ marginTop: "8px", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                      <img src={item.image} style={{ width: "100%", maxHeight: "250px", objectFit: "cover", display: "block" }} />
                                   </div>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                 </section>
                 <section>
                    <h3 className="font-display" style={{ fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>Companions</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="mobile-grid-1">
                       <div style={recCard}>
                          <div style={{ width: "40px", height: "40px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" }}>🌱</div>
                          <h4 style={{ fontSize: "14px", fontWeight: 800, marginBottom: "4px" }}>Snake Plant</h4>
                          <a href="#" style={{ fontSize: "12px", fontWeight: 800, color: BRAND_ACCENT, textDecoration: "none" }}>Shop →</a>
                       </div>
                       <div style={recCard}>
                          <div style={{ width: "40px", height: "40px", background: "#fefce8", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" }}>🌿</div>
                          <h4 style={{ fontSize: "14px", fontWeight: 800, marginBottom: "4px" }}>Premium Feed</h4>
                          <a href="#" style={{ fontSize: "12px", fontWeight: 800, color: BRAND_ACCENT, textDecoration: "none" }}>Shop →</a>
                       </div>
                    </div>
                 </section>
              </div>
   
              <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 <div style={caretakerCard}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={caretakerAvatarFrame}>
                           {plant.owner_image ? <img src={plant.owner_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <User size={20} color={BRAND_ACCENT} />}
                        </div>
                        <div>
                           <span style={{ fontSize: "9px", fontWeight: 800, color: BRAND_ACCENT, letterSpacing: "1px", textTransform: "uppercase" }}>Primary Caretaker</span>
                           <h4 style={{ fontSize: "16px", fontWeight: 900, margin: 0 }}>{plant.owner_name || "Nexus Registry"}</h4>
                        </div>
                    </div>
                 </div>
                 <PlantActions plantId={plant.id} currentOwner={plant.owner_name} correctKey={plant.access_key} />
                 <div style={asideInfoCard}>
                    <h4 style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px", color: BRAND_MUTED }}>Asset Metadata</h4>
                    <div style={metaRow}><span>Registry ID</span><strong>PL-{plant.id.substring(0,8)}</strong></div>
                    <div style={metaRow}><span>Status</span><strong style={{ color: BRAND_ACCENT }}>Verified</strong></div>
                 </div>
              </aside>
           </div>
        </div>

        <footer style={footerStyle}>
           <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: BRAND_MUTED }}>© 2024 HeavenlyPlants Registry</span>
              <Link href="/" style={{ fontSize: "12px", color: BRAND_DEEP, textDecoration: "none", fontWeight: 700 }}>Home</Link>
           </div>
        </footer>
      </div>
    </PlantGateway>
  );
}

const navStyle = { position: "fixed", top: 0, left: 0, right: 0, height: "70px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e2e8f0", zIndex: 1000 };
const verifiedBadge = { display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", color: "#059669", padding: "6px 14px", borderRadius: "100px", fontSize: "11px", fontWeight: 800 };
const imagePreviewFrame = { background: "#fff", padding: "10px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" };
const floatingMeta = { position: "absolute", bottom: "20px", left: "20px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", padding: "10px 16px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" };
const statusCard = { padding: "20px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" };
const iconSquare = { width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" };
const recCard = { padding: "20px", background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0" };
const aiBubbleContainer = { background: "#f8fafc", border: "1px solid #e2e8f0", padding: "14px 18px", borderRadius: "14px", fontSize: "14px", color: "#475569", position: "relative", marginBottom: "24px", maxWidth: "320px" };
const bubbleArrow = { position: "absolute", top: "-8px", left: "20px", width: "14px", height: "14px", background: "#f8fafc", borderLeft: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0", transform: "rotate(45deg)" };
const timelineNode = { position: "absolute", left: "-31px", top: "6px", width: "12px", height: "12px", background: "#fff", border: "3px solid #10b981", borderRadius: "50%" };
const narrativeStep = { background: "#fff", padding: "20px", borderRadius: "14px", border: "1px solid #f1f5f9" };
const narrativeDate = { fontSize: "11px", color: "#94a3b8", fontWeight: 700 };
const asideInfoCard = { padding: "24px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" };
const metaRow = { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px" };
const footerStyle = { borderTop: "1px solid #e2e8f0", padding: "40px 0", background: "#fff" };
const caretakerCard = { padding: "20px", background: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" };
const caretakerAvatarFrame = { position: "relative", width: "48px", height: "48px", borderRadius: "50%", background: "#f8fafc", border: "2px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" };
