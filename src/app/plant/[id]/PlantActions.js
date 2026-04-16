"use client";

import { useState } from "react";
import {
  CheckCircle, Lock,
  Droplets, ArrowRight, UserCheck,
  PlusCircle, Unlock
} from "lucide-react";

export default function PlantActions({ plantId, currentOwner, correctKey }) {
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [secret, setSecret] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [activeView, setActiveView] = useState("care"); // care, gallery, rename, transfer

  const targetKey = correctKey || "1234";

  const handleAction = async (action, data = {}) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      if (res.ok) {
        if (action === "transfer") {
          alert("Ownership successfully recorded as transferred.");
          window.location.href = "/";
        } else {
          window.location.reload();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER: ACTIVE CARETAKER MODE (Always visible now) ──
  return (
    <div className="anim-fadeIn" style={interfaceGrid}>
      <div style={activeHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }}></div>
          <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", letterSpacing: "1px" }}>QUICK ACTIONS MENU</span>
        </div>
      </div>

      {/* View Selector */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', overflowX: "auto", paddingBottom: "2px" }}>
        <button onClick={() => setActiveView("care")} style={{ ...tabBtn, borderBottom: activeView === 'care' ? '2px solid #10b981' : '2px solid transparent', color: activeView === 'care' ? '#111827' : '#94a3b8', whiteSpace: "nowrap" }}>Care</button>
        <button onClick={() => setActiveView("gallery")} style={{ ...tabBtn, borderBottom: activeView === 'gallery' ? '2px solid #10b981' : '2px solid transparent', color: activeView === 'gallery' ? '#111827' : '#94a3b8', whiteSpace: "nowrap" }}>Gallery</button>
        <button onClick={() => setActiveView("profile")} style={{ ...tabBtn, borderBottom: activeView === 'profile' ? '2px solid #10b981' : '2px solid transparent', color: activeView === 'profile' ? '#111827' : '#94a3b8', whiteSpace: "nowrap" }}>Profile</button>
        <button onClick={() => setActiveView("transfer")} style={{ ...tabBtn, borderBottom: activeView === 'transfer' ? '2px solid #10b981' : '2px solid transparent', color: activeView === 'transfer' ? '#111827' : '#94a3b8', whiteSpace: "nowrap" }}>Transfer</button>
      </div>

      {activeView === "care" && (
        <div className="anim-fadeIn" style={{ paddingTop: "16px" }}>
          <button onClick={() => handleAction("water")} style={toolBtn}>
            <div style={{ width: "32px", height: "32px", background: "#f0fdf4", color: "#10b981", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Droplets size={16} />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>Log Watering</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Record today's hydration</div>
            </div>
            <ArrowRight size={16} color="#cbd5e1" />
          </button>
        </div>
      )}

      {activeView === "gallery" && (
        <div className="anim-fadeIn" style={{ paddingTop: "16px" }}>
          <div onClick={() => document.getElementById('gal-up').click()} style={uploadSlot}>
            <PlusCircle size={24} color="#10b981" style={{ marginBottom: "8px" }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: "#111827" }}>Upload New Photo</span>
            <span style={{ fontSize: '12px', color: "#64748b" }}>Capture a growth milestone</span>
          </div>
          <input id="gal-up" type="file" style={{ display: "none" }} onChange={(e) => {
            const f = e.target.files[0];
            if (f) {
              const r = new FileReader();
              r.onloadend = () => handleAction("addMemory", { photoBase64: r.result });
              r.readAsDataURL(f);
            }
          }} />
        </div>
      )}

      {activeView === "profile" && (
        <div className="anim-fadeIn" style={transferBox}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px', color: "#111827" }}>Personalize Profile</h4>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Manage nicknames and caretaker identity.</p>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "6px" }}>PLANT NICKNAME</label>
            <input type="text" placeholder="e.g. Sir Reginald" id="set-nick" style={{ ...keyInput, background: "#fff", letterSpacing: "normal", textAlign: "left", fontSize: "14px", padding: "12px", marginBottom: 0 }} />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "6px" }}>CARETAKER NAME</label>
            <input type="text" placeholder={currentOwner} id="set-owner" style={{ ...keyInput, background: "#fff", letterSpacing: "normal", textAlign: "left", fontSize: "14px", padding: "12px", marginBottom: 0 }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", display: "block", marginBottom: "6px" }}>PROFILE PHOTO</label>
            <button onClick={() => document.getElementById('own-up').click()} style={{ ...toolBtn, padding: "12px", borderRadius: "12px" }}>Change Avatar</button>
            <input id="own-up" type="file" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files[0];
              if (f) {
                const r = new FileReader();
                r.onloadend = () => handleAction("updateCaretaker", { owner_image: r.result });
                r.readAsDataURL(f);
              }
            }} />
          </div>

          <button
            onClick={() => {
              const nick = document.getElementById("set-nick").value;
              const own = document.getElementById("set-owner").value;
              if (nick || own) handleAction("updateCaretaker", { nickname: nick || undefined, owner_name: own || undefined });
            }}
            style={{ ...btnAuth, background: '#111827' }}
          >
            Save All Changes
          </button>
        </div>
      )}

      {activeView === "transfer" && (
        <div className="anim-fadeIn" style={transferBox}>
          <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px', color: "#991b1b" }}>Gift or Transfer</h4>
          <p style={{ fontSize: '12px', color: '#b91c1c', marginBottom: '16px', lineHeight: 1.5 }}>Permanently transfer this digital twin to a new owner.</p>
          <input type="text" placeholder="New Owner Name" id="new-own" style={{ ...keyInput, border: "1px solid #fecaca", background: "#fff", letterSpacing: "normal", textAlign: "left", fontSize: "14px", padding: "12px" }} />
          <button
            onClick={() => {
              const name = document.getElementById("new-own").value;
              if (name) handleAction("transfer", { newOwner: name });
            }}
            style={{ ...btnAuth, background: '#ef4444' }}
          >
            Confirm Transfer
          </button>
        </div>
      )}
    </div>
  );
}

// ── LUXURY STYLES ──
const authBox = { padding: "24px", background: "#fff", borderRadius: "16px", border: "1px solid #10b981", boxShadow: "0 10px 30px rgba(16,185,129,0.1)" };
const authHeader = { display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", color: "#111827" };
const authText = { fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: 1.6 };
const keyInput = { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "20px", fontWeight: 800, marginBottom: "16px", outline: "none", background: '#f8fafc', letterSpacing: "4px", textAlign: "center" };
const btnAuth = { width: "100%", padding: "14px", background: "#10b981", color: "#fff", border: "none", borderRadius: "100px", fontWeight: 800, fontSize: "14px", cursor: "pointer", marginBottom: "10px", transition: "all 0.2s" };
const btnCancel = { width: "100%", background: "none", border: "none", color: "#94a3b8", fontSize: "14px", fontWeight: 700, cursor: "pointer" };

const interfaceGrid = { display: "flex", flexDirection: "column", gap: "16px", background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" };
const activeHeader = { display: "flex", alignItems: "center", justifyContent: 'space-between', paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" };
const exitBtn = { background: "#f1f5f9", border: "none", color: "#64748b", fontSize: "11px", fontWeight: 800, padding: '6px 12px', borderRadius: '100px', cursor: 'pointer' };

const tabBar = { display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0' };
const tabBtn = { background: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer', padding: '10px 0', outline: "none" };

const toolBtn = { width: "100%", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#fff", display: "flex", alignItems: "center", gap: "16px", cursor: "pointer", transition: "all 0.2s" };
const uploadSlot = { padding: '32px', background: "#f8fafc", border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' };

const transferBox = { paddingTop: '16px', background: '#fff' };

const mainLinkBtn = {
  width: "100%", padding: "20px", background: "#fff", color: "#111827",
  borderRadius: "20px", border: "1px solid #e2e8f0", fontWeight: 800, fontSize: "15px",
  display: "flex", alignItems: "center", gap: "16px",
  cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", transition: "all 0.2s"
};
const bT = { fontSize: "14px", fontWeight: 800, color: "#111827" };

const uArea = { padding: "30px", border: "2px dashed #e2e8f0", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", background: "#fcfdfe" };
const cInput = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", background: "#f8fafc" };
const pActionBtn = { width: "100%", height: "48px", background: "#111827", color: "#fff", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
