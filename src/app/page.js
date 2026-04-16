import Link from "next/link";
import { getPlants } from "./data/plants";
import { Leaf, Lock, Star, Activity, Globe, Users, Clock, ArrowRight, Camera, Mail, ExternalLink, Maximize, MessageCircle, Quote } from "lucide-react";

export const metadata = {
   title: "HeavenlyPlants – Digital Twin QR Registry for Premium Flora",
   description: "Experience the life story of every plant. Scan, Discover, and Care for your heavenly plants.",
};

export default async function Home() {
   const plants = await getPlants();

   // Mock stories for variety
   const stories = [
      { name: "Majesty Palm", owner: "Sarah J.", story: "Moved with me from a small apartment to my first house. Still thriving!" },
      { name: "Golden Pothos", owner: "Kevin M.", story: "Passed down from my grandmother. It's now over 20 years old." },
      { name: "Ficus Lyrata", owner: "Ayesha R.", story: "Survived a 3-day road trip. Truly a resilient beauty." }
   ];

   return (
      <div style={{ background: "#f8fafb", color: "#1e293b", minHeight: "100vh" }}>

         {/* ── STICKY NAV ── */}
         <nav style={navStyle}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", background: "#10b981", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                     <Leaf color="#fff" size={18} />
                  </div>
                  <span className="font-display" style={{ fontWeight: 800, fontSize: "20px", color: "#111827", letterSpacing: "-0.5px" }}>HeavenlyPlants</span>
               </div>
               <div style={{ display: "flex", gap: "24px" }}>
                  <Link href="/admin" className="btn-outline" style={{ border: "none", fontSize: "14px", fontWeight: 700 }}>Collector Portal</Link>
               </div>
            </div>
         </nav>

         {/* ── HERO SECTION ── */}
         <section className="hero-padding" style={{ padding: "180px 0 120px", background: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80') center/cover no-repeat", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.7) 100%)" }} />
            <div className="container" style={{ position: "relative", zIndex: 1, color: "#fff" }}>
               <div className="anim-fadeUp" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(16,185,129,0.15)", color: "#10b981", borderRadius: "100px", fontSize: "13px", fontWeight: 800, marginBottom: "24px", backdropFilter: "blur(10px)" }}>
                  <Star size={14} /> LUXURY INDOOR LIVING IN THE UAE
               </div>
               <h1 className="font-display anim-fadeUp delay-1 hero-title" style={{ fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 900, lineHeight: 0.9, color: "#fff", marginBottom: "32px", maxWidth: "800px" }}>
                  Smart Greenery for Your <span style={{ color: "#10b981" }}>Desert Oasis</span>
               </h1>
               <p className="anim-fadeUp delay-2" style={{ fontSize: "18px", color: "#cbd5e1", maxWidth: "600px", marginBottom: "40px", lineHeight: 1.6 }}>
                  Elevate your Dubai apartment or villa with premium indoor plants. Scan your luxurious QR tag to ensure your flora thrives in UAE's AC environments.
               </p>
               <div className="anim-fadeUp delay-3 mobile-stack" style={{ display: "flex", gap: "16px" }}>
                  <a href="#explore" className="btn-primary" style={{ padding: "18px 40px", fontSize: "16px", background: "#10b981", color: "#fff" }}>Explore Collection <ArrowRight size={18} /></a>
               </div>
            </div>
         </section>

         {/* ── HOW IT WORKS ── */}
         <section style={{ padding: "100px 0", background: "#fff" }}>
            <div className="container">
               <div style={{ textAlign: "center", marginBottom: "60px" }}>
                  <h2 className="font-display" style={{ fontSize: "42px", fontWeight: 800 }}>Seamless Digital Experience</h2>
                  <p style={{ color: "#64748b" }}>Your plant's life story in three simple steps.</p>
               </div>
               <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "40px" }}>
                  <div style={{ textAlign: "center" }}>
                     <div style={{ width: "80px", height: "80px", background: "#f0fdf4", color: "#10b981", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Maximize size={32} /></div>
                     <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>1. Scan the Pot</h3>
                     <p style={{ color: "#64748b" }}>Hold your phone to the premium QR tag on your ceramic pot.</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                     <div style={{ width: "80px", height: "80px", background: "#f0fdf4", color: "#10b981", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Activity size={32} /></div>
                     <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>2. Get Care Insights</h3>
                     <p style={{ color: "#64748b" }}>Instantly access UAE-optimized water, light, and AC temperature guidelines.</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                     <div style={{ width: "80px", height: "80px", background: "#f0fdf4", color: "#10b981", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}><Clock size={32} /></div>
                     <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>3. Track Journey</h3>
                     <p style={{ color: "#64748b" }}>Log growth milestones and maintain your plant's luxury digital twin.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* ── SOCIAL PROOF ── */}
         <section style={{ padding: "60px 0", background: "#0f172a", color: "#fff", textAlign: "center" }}>
            <div className="container">
               <h4 style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#94a3b8", marginBottom: "32px" }}>Trusted by UAE Plant Lovers & Elite Nurseries</h4>
               <div className="mobile-stack" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "60px", opacity: 0.6 }}>
                  {/* Mock logos text */}
                  <div style={{ fontSize: "24px", fontWeight: 900, fontFamily: "serif" }}>Dubai Marina Flora</div>
                  <div style={{ fontSize: "24px", fontWeight: 900, fontFamily: "serif" }}>Palm Jumeirah Greens</div>
                  <div style={{ fontSize: "24px", fontWeight: 900, fontFamily: "serif" }}>Abu Dhabi Botanics</div>
               </div>
            </div>
         </section>

         {/* ── PUBLIC EXPLORE GRID ── */}
         <section id="explore" style={{ padding: "100px 0", background: "#f8fafc" }}>
            <div className="container">
               <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" }}>
                  <div>
                     <h2 className="font-display" style={{ fontSize: "36px", fontWeight: 800 }}>Desert Survivors</h2>
                     <p style={{ color: "#64748b" }}>Premium indoor varieties perfectly suited for UAE AC environments.</p>
                  </div>
                  <Link href="/admin" className="btn-outline">Register Your Premium Plant</Link>
               </div>

               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(Min(100%, 300px), 1fr))", gap: "32px" }}>
                  {plants.slice(0, 6).map((plant) => (
                     <Link key={plant.id} href={`/specimen/${plant.id}`} style={{ textDecoration: "none" }}>
                        <div style={premiumPlantCard}>
                           <div style={imageWrap}>
                              {plant.image ? <img src={plant.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>🪴</div>}
                              <div style={tagOverlay}>{plant.species || "Rare Specimen"}</div>
                           </div>
                           <div style={{ padding: "24px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                 <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#111827", margin: 0 }}>{plant.name}</h3>
                                 <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                              </div>
                              <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                 Owned by <strong>{plant.owner_name || "Confidential"}</strong>. {plant.description?.substring(0, 60)}...
                              </p>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </section>

         {/* ── CTA SECTION ── */}
         <section style={ctaSection} className="mobile-cta">
            <div className="container" style={{ position: "relative", zIndex: 1 }}>
               <h2 className="font-display hero-title" style={{ fontSize: "48px", fontWeight: 900, marginBottom: "24px" }}>Ready to Digitalize your Flora?</h2>
               <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "40px" }}>Join the elite botanists tracking their premium collection across the Emirates.</p>
               <Link href="/admin" className="btn-primary" style={{ background: "#C8973E", color: "#1A3C34" }}>Start My Registry Now</Link>
            </div>
            <div style={ctaDecoration} />
         </section>

         {/* ── FOOTER ── */}
         <footer style={footerStyle}>
            <div className="container">
               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "60px", marginBottom: "60px" }}>
                  <div>
                     <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Leaf color="#10b981" size={24} />
                        <span className="font-display" style={{ fontWeight: 800, fontSize: "20px", color: "#fff" }}>HeavenlyPlants</span>
                     </div>
                     <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.6 }}>
                        The world's first digital twin registry for indoor plants. Tracking life stories across the globe.
                     </p>
                  </div>
                  <div>
                     <h4 style={footerHeading}>Digital Services</h4>
                     <ul style={footerList}>
                        <li>QR Labeling</li>
                        <li>Provenance Tracking</li>
                        <li>Care Automation</li>
                     </ul>
                  </div>
                  <div>
                     <h4 style={footerHeading}>Community</h4>
                     <ul style={footerList}>
                        <li>Instagram Feed</li>
                        <li>Global Ranking</li>
                        <li>Heavenly Rewards</li>
                     </ul>
                  </div>
                  <div style={{ textAlign: "right" }}>
                     <h4 style={footerHeading}>Connect</h4>
                     <div style={{ display: "flex", gap: "15px", justifyContent: "flex-end" }}>
                        <Camera size={20} color="rgba(255,255,255,0.6)" />
                        <Mail size={20} color="rgba(255,255,255,0.6)" />
                        <ExternalLink size={20} color="rgba(255,255,255,0.6)" />
                     </div>
                  </div>
               </div>
               <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
                  &copy; 2024 HeavenlyPlants. All records are cryptographically verified.
               </div>
            </div>
         </footer>
      </div>
   );
}

const navStyle = {
   position: "fixed", top: 0, left: 0, right: 0, height: "80px", background: "rgba(255,255,255,0.9)",
   backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9", zIndex: 1000
};

const heroSection = { padding: "180px 0 120px", background: "radial-gradient(circle at top right, #f0fdf4, transparent 40%)" };
const statItem = { textAlign: "center", flex: 1, minWidth: "150px" };
const premiumPlantCard = { background: "#fff", borderRadius: "24px", overflow: "hidden", transition: "all 0.3s", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" };
const imageWrap = { height: "240px", background: "#f8fafc", position: "relative", overflow: "hidden" };
const tagOverlay = { position: "absolute", top: "16px", left: "16px", padding: "6px 14px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", fontSize: "11px", fontWeight: 800, borderRadius: "100px", color: "#059669" };
const ctaSection = { padding: "100px 0", background: "#111827", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden", borderRadius: "50px", margin: "0 24px 80px" };
const ctaDecoration = { position: "absolute", width: "400px", height: "400px", background: "#059669", filter: "blur(150px)", opacity: 0.2, top: "-100px", right: "-100px" };
const footerStyle = { padding: "100px 0 60px", background: "#0f172a", color: "#fff" };
const footerHeading = { fontSize: "13px", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "24px" };
const footerList = { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.6)" };

const storyCard = {
   background: "#fff", padding: "40px", borderRadius: "24px", position: "relative",
   boxShadow: "0 20px 40px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9"
};
