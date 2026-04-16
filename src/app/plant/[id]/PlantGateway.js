"use client";

import { useState, useEffect } from "react";
import { Lock, ShieldCheck, Leaf, Loader2, Search, ArrowRight, Zap, Sparkles } from "lucide-react";

export default function PlantGateway({ plant, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Check if already unlocked in this session
  useEffect(() => {
    const saved = sessionStorage.getItem(`plant_unlocked_${plant.id}`);
    if (saved === "true") {
      setUnlocked(true);
    }
  }, [plant.id]);

  const handleUnlock = () => {
    setIsVerifying(true);
    setError(false);

    // Simulate a secure decryption process for "Premium feel"
    setTimeout(() => {
      if (inputKey.trim() === (plant.access_key || "1234")) {
        setAnimatingOut(true);
        sessionStorage.setItem(`plant_unlocked_${plant.id}`, "true");
        setTimeout(() => {
          setUnlocked(true);
          setIsVerifying(false);
        }, 800);
      } else {
        setError(true);
        setIsVerifying(false);
      }
    }, 1200);
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div style={{
      ...gatewayOverlay,
      opacity: animatingOut ? 0 : 1,
      transform: animatingOut ? 'scale(1.1)' : 'scale(1)',
      pointerEvents: animatingOut ? 'none' : 'auto'
    }} className="anim-gatewayIn">

      {/* Background with abstract shapes */}
      <div style={bgLayer} />
      <div style={abstractShape1} />
      <div style={abstractShape2} />

      <div style={cardWrapper}>
        {/* Branding */}
        <div style={brandHeader}>
          <div style={logoIcon}>
            <Leaf size={24} color="#fff" />
          </div>
          <div style={brandText}>
            Heavenly<span style={{ color: "#10b981" }}>Plants</span>
          </div>
        </div>

        {/* Identification Card */}
        <div style={idCard}>
          <div style={statusBadge}>
            <div style={statusDot} className="anim-pulseGlow" />
            ENCRYPTED SPECIMEN RECORD
          </div>

          <h1 style={title}>Identify Specimen</h1>
          <p style={subtitle}>
            Enter the unique Access Key provided with your plant's QR tag to decrypt the life story and maintenance records.
          </p>

          <div style={inputContainer}>
            <div style={inputIcon}>
              {isVerifying ? <Loader2 className="spin" size={20} color="#10b981" /> : <Lock size={20} color={error ? "#ef4444" : "#94a3b8"} />}
            </div>
            <input
              type="text"
              placeholder="Enter Access Key (e.g. 1234)"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              style={{
                ...keyInput,
                borderColor: error ? "#ef4444" : (inputKey ? "#10b981" : "#e2e8f0"),
                boxShadow: error ? "0 0 0 4px rgba(239, 68, 68, 0.1)" : (inputKey ? "0 0 0 4px rgba(16, 185, 129, 0.1)" : "none")
              }}
              disabled={isVerifying}
            />
          </div>

          {error && (
            <div style={errorMessage}>
              <ShieldCheck size={14} />
              Invalid Key. Access Denied.
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={isVerifying || !inputKey}
            style={{
              ...primaryButton,
              opacity: (isVerifying || !inputKey) ? 0.7 : 1,
              background: error ? "#ef4444" : "#111827",
              cursor: (isVerifying || !inputKey) ? "not-allowed" : "pointer"
            }}
          >
            {isVerifying ? "DECRYPTING LEDGER..." : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ACCESS RECORDS <ArrowRight size={18} />
              </span>
            )}
          </button>

          <div style={footerMeta}>
            <div style={metaItem}><ShieldCheck size={12} /> SECURE CRYPTOGRAPHY</div>
            <div style={metaItem}><Zap size={12} /> INSTANT VERIFICATION</div>
          </div>
        </div>

        {/* Specimen Preview Mini Info */}
        <div style={previewBox}>
          <div style={previewImage}>
            {plant.image ? <img src={plant.image} style={imgStyle} /> : <span>🪴</span>}
          </div>
          <div style={previewInfo}>
            <div style={previewLabel}>SPECIMEN DETECTED</div>
            <div style={previewName}>{plant.name}</div>
            <div style={previewSpecies}>{plant.species}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STYLES ──
const gatewayOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 9999, background: "#0f172a", display: "flex",
  alignItems: "center", justifyContent: "center",
  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden", fontFamily: "inherit"
};

const bgLayer = {
  position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  backgroundImage: "radial-gradient(circle at 20% 30%, #1e293b 0%, #0f172a 100%)",
  zIndex: -1
};

const abstractShape1 = {
  position: "absolute", width: "600px", height: "600px",
  background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
  top: "-100px", right: "-100px", borderRadius: "50%",
  animation: "float 10s ease-in-out infinite", zIndex: -1
};

const abstractShape2 = {
  position: "absolute", width: "400px", height: "400px",
  background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
  bottom: "-50px", left: "-50px", borderRadius: "50%",
  animation: "float 15s ease-in-out infinite reverse", zIndex: -1
};

const cardWrapper = {
  width: "100%", maxWidth: "480px", padding: "24px",
  display: "flex", flexDirection: "column", gap: "24px",
  zIndex: 10
};

const brandHeader = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
  marginBottom: "12px"
};

const logoIcon = {
  width: "44px", height: "44px", background: "#10b981",
  borderRadius: "12px", display: "flex", alignItems: "center",
  justifyContent: "center", boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
};

const brandText = {
  fontSize: "24px", fontWeight: 900, color: "#fff",
  letterSpacing: "-1px"
};

const idCard = {
  background: "rgba(30, 41, 59, 0.7)", backdropFilter: "blur(30px)",
  borderRadius: "32px", padding: "40px", border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
};

const statusBadge = {
  display: "inline-flex", alignItems: "center", gap: "8px",
  padding: "6px 14px", borderRadius: "100px", background: "rgba(255,255,255,0.05)",
  fontSize: "11px", fontWeight: 800, color: "#94a3b8", marginBottom: "24px",
  letterSpacing: "0.5px"
};

const statusDot = {
  width: "6px", height: "6px", borderRadius: "50%",
  background: "#10b981", animation: "pulse-glow 2s infinite"
};

const title = {
  fontSize: "32px", fontWeight: 900, color: "#fff",
  marginBottom: "16px", letterSpacing: "-1px"
};

const subtitle = {
  fontSize: "15px", lineHeight: 1.6, color: "#94a3b8",
  marginBottom: "32px"
};

const inputContainer = {
  position: "relative", marginBottom: "16px"
};

const inputIcon = {
  position: "absolute", left: "16px", top: "50%",
  transform: "translateY(-50%)", zIndex: 1
};

const keyInput = {
  width: "100%", padding: "18px 18px 18px 52px", borderRadius: "16px",
  background: "rgba(255,255,255,0.03)", border: "2px solid #e2e8f020",
  fontSize: "18px", fontWeight: 800, color: "#fff", outline: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

const primaryButton = {
  width: "100%", padding: "20px", borderRadius: "16px",
  border: "none", color: "#fff", fontSize: "16px",
  fontWeight: 800, display: "flex", alignItems: "center",
  justifyContent: "center", transition: "all 0.3s",
  marginTop: "24px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
};

const errorMessage = {
  color: "#ef4444", fontSize: "13px", fontWeight: 700,
  display: "flex", alignItems: "center", gap: "6px",
  marginTop: "8px", justifyContent: "center"
};

const footerMeta = {
  display: "flex", justifyContent: "center", gap: "20px",
  marginTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)",
  paddingTop: "24px"
};

const metaItem = {
  fontSize: "10px", fontWeight: 800, color: "#475569",
  display: "flex", alignItems: "center", gap: "4px",
  textTransform: "uppercase", letterSpacing: "1px"
};

const previewBox = {
  background: "rgba(16, 185, 129, 0.05)", borderRadius: "20px",
  padding: "16px", display: "flex", alignItems: "center",
  gap: "16px", border: "1px solid rgba(16, 185, 129, 0.1)"
};

const previewImage = {
  width: "50px", height: "50px", borderRadius: "12px",
  background: "#1e293b", overflow: "hidden", display: "flex",
  alignItems: "center", justifyContent: "center", fontSize: "24px"
};

const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };

const previewInfo = { flex: 1 };
const previewLabel = { fontSize: "9px", fontWeight: 800, color: "#10b981", letterSpacing: "1px" };
const previewName = { fontSize: "16px", fontWeight: 800, color: "#fff" };
const previewSpecies = { fontSize: "12px", color: "#64748b" };
