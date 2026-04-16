"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Droplets, Sun, Thermometer, Camera, Leaf, PlusCircle, ArrowRight } from "lucide-react";

export default function MobilePlantLayout({ plant, currentTemp, sunString }) {
  const galleryItems = plant.timeline?.filter(t => t.image) || [];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── HERO HEADER ── */}
      <div style={heroWrap}>
        <div style={navBar}>
          <Link href="/" style={navBack}>‹</Link>
          <span style={navTitle}>HeavenlyPlants</span>
          <div style={{ fontSize: "20px" }}>⚙️</div>
        </div>
        <div style={circleImageWrap}>
          <div style={circleImageFrame}>
            {plant.image ? (
              <img src={plant.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={plant.name} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px", background: "#e8f5e9" }}>🪴</div>
            )}
          </div>
          <div style={locationPill}>
            <MapPin size={11} color="#c4714a" />
            <span>{plant.location || "Dubai"}</span>
          </div>
        </div>
      </div>

      {/* ── PLANT IDENTITY ── */}
      <div style={{ textAlign: "center", padding: "20px 20px 4px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", margin: 0, lineHeight: 1.2 }}>{plant.name}</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "6px" }}>
          <span style={{ color: "#c4714a", fontSize: "18px" }}>♥</span>
          <span style={{ fontSize: "14px", color: "#7a8270", fontWeight: 500 }}>{plant.nickname || plant.species}</span>
        </div>
      </div>

      {/* ── PLANT DETAILS CARD ── */}
      <div style={sectionCard}>
        <h3 style={cardHeading}>Plant Details</h3>
        <div style={detailRow}>
          <span style={detailLabel}>Date of Arrival:</span>
          <span style={detailValue}>{plant.acquired || "—"}</span>
        </div>
        <div style={detailRow}>
          <span style={detailLabel}>Species:</span>
          <span style={detailValue}>{plant.species || "—"}</span>
        </div>
        {plant.caretaker?.note && plant.caretaker.note !== "No extra notes." && (
          <div style={detailRow}>
            <span style={detailLabel}>Care Note:</span>
            <span style={detailValue}>{plant.caretaker.note}</span>
          </div>
        )}

        {/* Growth Timeline horizontal scroll */}
        <h3 style={{ ...cardHeading, marginTop: "18px" }}>Growth Timeline</h3>
        {galleryItems.length > 0 ? (
          <div style={{ display: "flex", gap: "0", alignItems: "flex-start", overflowX: "auto", paddingBottom: "8px", WebkitOverflowScrolling: "touch" }}>
            {galleryItems.map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flexShrink: 0 }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "14px", overflow: "hidden", border: "2px solid #e8f5e9", background: "#f5f0e8" }}>
                  <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={item.event} />
                </div>
                {i < galleryItems.length - 1 && (
                  <div style={{ width: "28px", height: "2px", borderTop: "2px dashed #c8a97e", position: "absolute", top: "35px", left: "72px", zIndex: 1 }} />
                )}
                <span style={{ fontSize: "10px", color: "#a89b8c", marginTop: "6px", fontWeight: 600, textAlign: "center", maxWidth: "72px" }}>{item.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", background: "#f9f6f0", borderRadius: "12px", marginTop: "8px" }}>
            <Camera size={24} color="#a89b8c" />
            <span style={{ fontSize: "12px", color: "#a89b8c", marginTop: "8px" }}>No photos yet — add your first!</span>
          </div>
        )}

        {/* Action Buttons */}
        <MobileTopActions plantId={plant.id} />
      </div>

      {/* ── HEALTH STATUS ── */}
      <div style={sectionCard}>
        <h3 style={cardHeading}>Health Status</h3>

        {/* Water Level */}
        <div style={healthRow}>
          <div style={{ ...healthIcon, background: "#e3f2fd" }}>
            <Droplets size={22} color="#2196f3" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={healthLabel}>Water Level</span>
              <span style={healthValue}>60%</span>
            </div>
            <div style={progressTrack}>
              <div style={{ ...progressFill, width: "60%", background: "linear-gradient(90deg, #2196f3, #64b5f6)" }} />
            </div>
          </div>
        </div>

        {/* Sunlight */}
        <div style={healthRow}>
          <div style={{ ...healthIcon, background: "#fffde7" }}>
            <Sun size={22} color="#f9a825" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={healthLabel}>Sunlight Exposure</span>
              <span style={healthValue}>6/10</span>
            </div>
            <div style={progressTrack}>
              <div style={{ ...progressFill, width: "60%", background: "linear-gradient(90deg, #f9a825, #ffcc02)" }} />
            </div>
            <span style={{ fontSize: "11px", color: "#a89b8c", marginTop: "3px", display: "block" }}>Partial Sun</span>
          </div>
        </div>

        {/* Temperature */}
        <div style={{ display: "flex", gap: "14px", alignItems: "center", paddingTop: "14px" }}>
          <div style={{ ...healthIcon, background: "#fce4ec" }}>
            <Thermometer size={22} color="#e91e63" />
          </div>
          <div>
            <span style={healthLabel}>Ambient Temperature</span>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a1a", marginTop: "2px" }}>{currentTemp || 24}°C</div>
          </div>
        </div>
      </div>

      {/* ── GROWTH JOURNEY ── */}
      <div style={sectionCard}>
        <h3 style={cardHeading}>Growth Journey</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {plant.timeline?.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "0", alignItems: "flex-start" }}>
              {/* Thumbnail */}
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #e8f5e9", marginRight: "10px", marginTop: "2px" }}>
                {item.image ? (
                  <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={item.event} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", background: "#e8f5e9" }}>🌿</div>
                )}
              </div>
              {/* Dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "6px", marginRight: "10px", flexShrink: 0 }}>
                <div style={{ width: "10px", height: "10px", background: "#4a7c59", borderRadius: "50%", boxShadow: "0 0 0 3px rgba(74,124,89,0.2)", flexShrink: 0 }} />
                {i < plant.timeline.length - 1 && (
                  <div style={{ flex: 1, width: "2px", background: "#d5e8da", minHeight: "36px", marginTop: "4px" }} />
                )}
              </div>
              {/* Text */}
              <div style={{ flex: 1, paddingBottom: "16px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a1a" }}>
                  {item.event} <span style={{ color: "#a89b8c", fontWeight: 500 }}>({item.date})</span>
                </div>
                <p style={{ fontSize: "12px", color: "#7a8270", margin: "3px 0 0", lineHeight: 1.4 }}>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEST FRIENDS & RECOMMENDATIONS ── */}
      <div style={sectionCard}>
        <h3 style={cardHeading}>Best Friends &amp; Recommendations</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { emoji: "🌱", name: "Snake Plant", species: "Sansevieria", desc: "Perfect Partners. Low-light companion ideal for UAE homes." },
            { emoji: "🪴", name: "ZZ Plant", species: "Zamioculcas", desc: "Low Light Duo. Thrives with minimal water and care." }
          ].map((f, i) => (
            <div key={i} style={{ background: "#f9f6f0", borderRadius: "16px", padding: "14px" }}>
              <div style={{ width: "52px", height: "52px", background: "#e8f5e9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "10px" }}>{f.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: "13px", marginBottom: "2px", color: "#1a1a1a" }}>{f.name}</div>
              <div style={{ fontSize: "11px", color: "#a89b8c", marginBottom: "6px" }}>{f.species}</div>
              <p style={{ fontSize: "11px", color: "#7a8270", marginBottom: "10px", lineHeight: 1.4 }}>{f.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button style={{ width: "100%", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, background: "#c4714a", color: "#fff", border: "none", borderRadius: "100px", cursor: "pointer", letterSpacing: "0.2px" }}>Add to Cart</button>
                <button style={{ width: "100%", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 800, background: "transparent", color: "#c4714a", border: "1.5px solid #c4714a", borderRadius: "100px", cursor: "pointer", letterSpacing: "0.2px" }}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CURRENT OWNER + QUICK ACTIONS ── */}
      <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

        {/* Owner Card */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ ...cardHeading, marginBottom: "14px" }}>Current Owner</h3>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", overflow: "hidden", margin: "0 auto", border: "3px solid #e8f5e9" }}>
            {plant.owner_image ? (
              <img src={plant.owner_image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Owner" />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", background: "#e8f5e9" }}>👤</div>
            )}
          </div>
          <div style={{ fontWeight: 800, fontSize: "13px", textAlign: "center", marginTop: "10px", color: "#1a1a1a" }}>{plant.owner_name || "Nexus Registry"}</div>
          <div style={{ fontSize: "11px", color: "#a89b8c", textAlign: "center", marginBottom: "10px" }}>Dubai</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "8px" }}>
            {["📞", "💬", "✉️"].map((ic, i) => (
              <div key={i} style={{ width: "28px", height: "28px", background: "#f5f0e8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>{ic}</div>
            ))}
          </div>
          <div style={{ fontSize: "9px", color: "#a89b8c", textAlign: "center" }}>Member Since: {plant.acquired?.split(" ").slice(-1)[0] || "2024"}</div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ ...cardHeading, marginBottom: "12px" }}>Quick Actions</h3>
          <MobileQuickActions plantId={plant.id} currentOwner={plant.owner_name} />
        </div>
      </div>

      {/* ── PLANT METADATA ── */}
      <div style={sectionCard}>
        <h3 style={cardHeading}>Plant Metadata</h3>
        {[
          { label: "Species Native Region", value: "South America" },
          { label: "Optimal Temp Range", value: plant.careInstructions?.[1]?.detail || "18–27°C" },
          { label: "Watering Care", value: plant.careInstructions?.[0]?.detail || "Normal" },
          { label: "Registry ID", value: `PL-${plant.id?.substring(0, 8)}` },
          { label: "Trust Score", value: "✅ High Verified", accent: true },
        ].map((m, i, arr) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #f0ebe3" : "none" }}>
            <div style={{ fontSize: "11px", color: "#a89b8c", marginBottom: "2px" }}>{m.label}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: m.accent ? "#4a7c59" : "#1a1a1a" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ padding: "24px 20px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "6px" }}>
          <div style={{ width: "26px", height: "26px", background: "#4a7c59", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "16px", color: "#1a1a1a" }}>Heavenly<span style={{ color: "#4a7c59" }}>Plants</span></span>
        </div>
        <p style={{ fontSize: "12px", color: "#a89b8c" }}>© 2024 HeavenlyPlants Registry · Dubai, UAE</p>
      </div>

    </div>
  );
}

// ── Mobile-only TopActions ──
function MobileTopActions({ plantId }) {
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setLoading(true);
    const r = new FileReader();
    r.onloadend = async () => {
      try {
        const res = await fetch(`/api/plants/${plantId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addMemory", photoBase64: r.result }),
        });
        if (res.ok) window.location.reload();
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    r.readAsDataURL(f);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
      <button
        onClick={() => document.getElementById('m-gal-up').click()}
        disabled={loading}
        style={{ width: "100%", padding: "13px", background: "#4a7c59", color: "#fff", border: "none", borderRadius: "100px", fontSize: "13px", fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
      >
        {loading ? "Uploading..." : "+ Add New Growth Image"}
      </button>
      <input id="m-gal-up" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
      <button
        onClick={() => alert("Use 'Edit Profile' in Quick Actions to update nickname.")}
        style={{ width: "100%", padding: "12px", background: "transparent", color: "#c4714a", border: "1.5px solid #c4714a", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
      >
        Edit Nickname
      </button>
    </div>
  );
}

// ── Mobile-only Quick Actions ──
function MobileQuickActions({ plantId, currentOwner }) {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(null);
  const [nick, setNick] = useState("");
  const [own, setOwn] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleAction = async (action, data = {}) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      if (res.ok) {
        if (action === "transfer") { alert("Ownership transferred!"); window.location.href = "/"; }
        else window.location.reload();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (view === "gallery") return (
    <div>
      <button onClick={() => setView(null)} style={backBtn}>← Back</button>
      <div onClick={() => document.getElementById('mqa-gal').click()} style={uploadSlot}>
        <span style={{ fontSize: "22px" }}>📷</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#4a7c59", marginTop: "4px" }}>Upload Photo</span>
      </div>
      <input id="mqa-gal" type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
        const f = e.target.files[0];
        if (f) { const r = new FileReader(); r.onloadend = () => handleAction("addMemory", { photoBase64: r.result }); r.readAsDataURL(f); }
      }} />
    </div>
  );

  if (view === "profile") return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button onClick={() => setView(null)} style={backBtn}>← Back</button>
      <div>
        <label style={{ fontSize: "10px", fontWeight: 800, color: "#a89b8c", marginBottom: "4px", display: "block", letterSpacing: "0.5px" }}>PLANT NICKNAME</label>
        <input type="text" placeholder="e.g. Sir Reginald" value={nick} onChange={e => setNick(e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: "10px", fontWeight: 800, color: "#a89b8c", marginBottom: "4px", display: "block", letterSpacing: "0.5px" }}>CARETAKER NAME</label>
        <input type="text" placeholder={currentOwner || "e.g. John Doe"} value={own} onChange={e => setOwn(e.target.value)} style={inputStyle} />
      </div>
      <button onClick={() => { if (nick || own) handleAction("updateCaretaker", { nickname: nick || undefined, owner_name: own || undefined }); }} style={{ ...saveBtn, marginTop: "4px" }} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );

  if (view === "transfer") return (
    <div>
      <button onClick={() => setView(null)} style={backBtn}>← Back</button>
      <input type="text" placeholder="New Owner Name" value={newOwner} onChange={e => setNewOwner(e.target.value)} style={{ ...inputStyle, borderColor: "#fecaca" }} />
      <button onClick={() => { if (newOwner) handleAction("transfer", { newOwner }); }} style={{ ...saveBtn, background: "#ef4444", marginTop: "8px" }} disabled={loading}>
        {loading ? "..." : "Confirm Gift"}
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {[
        { icon: "🪣", label: "Care Logs", action: () => handleAction("water") },
        { icon: "📷", label: "Plant Gallery", action: () => setView("gallery") },
        { icon: "✏️", label: "Edit Profile", action: () => setView("profile") },
      ].map((item, i) => (
        <button key={i} onClick={item.action} style={qaBtn} disabled={loading}>
          <span style={{ fontSize: "15px" }}>{item.icon}</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a" }}>{item.label}</span>
        </button>
      ))}
      <button onClick={() => setView("transfer")} style={transferBtn}>
        Transfer
      </button>
    </div>
  );
}

// ── Shared Styles ──
const heroWrap = {
  background: "linear-gradient(160deg, #4a7c59 0%, #3d6b4f 100%)",
  paddingBottom: "56px",
  borderBottomLeftRadius: "36px",
  borderBottomRightRadius: "36px",
};
const navBar = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 8px" };
const navBack = { color: "#fff", fontSize: "28px", fontWeight: 300, textDecoration: "none", lineHeight: 1 };
const navTitle = { color: "#fff", fontWeight: 700, fontSize: "17px" };
const circleImageWrap = { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", paddingTop: "10px" };
const circleImageFrame = { width: "130px", height: "130px", borderRadius: "50%", border: "4px solid rgba(255,255,255,0.5)", overflow: "hidden", background: "#e8f5e9", boxShadow: "0 8px 30px rgba(0,0,0,0.2)" };
const locationPill = { display: "inline-flex", alignItems: "center", gap: "4px", background: "#fff", borderRadius: "100px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, color: "#4a7c59", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };

const sectionCard = { margin: "12px 16px", background: "#fff", borderRadius: "20px", padding: "18px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
const cardHeading = { fontSize: "15px", fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px 0" };
const detailRow = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0ebe3" };
const detailLabel = { fontSize: "12px", color: "#7a8270" };
const detailValue = { fontSize: "12px", fontWeight: 700, color: "#1a1a1a", textAlign: "right", maxWidth: "55%" };

const healthRow = { display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #f0ebe3" };
const healthIcon = { width: "42px", height: "42px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
const healthLabel = { fontSize: "12px", color: "#7a8270", fontWeight: 600 };
const healthValue = { fontSize: "12px", fontWeight: 800, color: "#1a1a1a" };
const progressTrack = { height: "8px", background: "#f0ebe3", borderRadius: "100px", overflow: "hidden" };
const progressFill = { height: "100%", borderRadius: "100px" };

const qaBtn = { display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "9px 12px", background: "#f5f0e8", border: "none", borderRadius: "12px", cursor: "pointer", textAlign: "left" };
const transferBtn = { width: "100%", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", background: "#c4714a", color: "#fff", border: "none", borderRadius: "100px", fontSize: "12px", fontWeight: 800, cursor: "pointer", marginTop: "10px", letterSpacing: "0.3px", boxShadow: "0 4px 10px rgba(196, 113, 74, 0.2)" };
const backBtn = { background: "none", border: "none", color: "#4a7c59", fontSize: "12px", fontWeight: 700, cursor: "pointer", textAlign: "left", padding: 0, marginBottom: "8px", display: "block" };
const uploadSlot = { display: "flex", flexDirection: "column", alignItems: "center", padding: "16px", background: "#f5f0e8", border: "2px dashed #c8a97e", borderRadius: "12px", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #c8a97e", fontSize: "13px", outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box", color: "#1a1a1a", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)" };
const saveBtn = { width: "100%", padding: "10px", background: "#4a7c59", color: "#fff", border: "none", borderRadius: "100px", fontSize: "12px", fontWeight: 800, cursor: "pointer", marginTop: "8px" };
