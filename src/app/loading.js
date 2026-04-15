export default function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: "20px" }}>
      <div style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#10b981", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <div className="font-display" style={{ fontSize: "18px", fontWeight: 800, color: "#1e293b", opacity: 0.6 }}>HeavenlyPlants Registry...</div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .font-display { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
