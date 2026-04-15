"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ArrowLeft, Download, Leaf } from "lucide-react";
import { getPlants } from "../../../data/plants";

export default function PrintQRPage() {
  const { id } = useParams();
  const router = useRouter();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlant() {
      const res = await fetch("/api/plants");
      const plants = await res.json();
      const found = plants.find(p => p.id === id);
      setPlant(found);
      setLoading(false);
    }
    fetchPlant();
  }, [id]);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Tag...</div>;
  if (!plant) return <div style={{ padding: "40px", textAlign: "center" }}>Plant not found.</div>;

  const qrUrl = `${window.location.origin}/plant/${plant.id}`;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "40px 20px" }} className="no-print">

      {/* ── HEADER ── */}
      <div style={{ maxWidth: "600px", margin: "0 auto 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.back()} style={btnStyle}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 800 }}>Print Digital Tag</h1>
          <p style={{ fontSize: "12px", color: "#666" }}>Optimized for 3x3 inch printers</p>
        </div>
        <button onClick={() => window.print()} style={{ ...btnStyle, background: "var(--green-deep)", color: "#fff" }}>
          <Printer size={18} /> Print Now
        </button>
      </div>

      {/* ── PRINT-ONLY CSS ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .print-container { display: block !important; margin: 0 !important; width: 100% !important; }
        }
      `}</style>

      {/* ── TAG PREVIEW ── */}
      <div className="print-container" style={{
        maxWidth: "380px",
        margin: "0 auto",
        padding: "40px",
        background: "#fff",
        borderRadius: "32px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
        textAlign: "center",
        border: "1px solid #e1e1e1",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle decorative background */}
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", background: "#f0fdf4", borderRadius: "50%", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "28px", height: "28px", background: "#10b981", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px", color: "#111827" }}>HeavenlyPlants</span>
          </div>

          <div style={{
            margin: "0 auto 24px",
            padding: "20px",
            background: "#fff",
            border: "2px solid #10b981",
            borderRadius: "24px",
            display: "inline-block",
            boxShadow: "0 10px 20px rgba(16, 185, 129, 0.1)"
          }}>
            <QRCodeSVG value={qrUrl} size={220} level="H" includeMargin={false} />
          </div>

          <h2 style={{ fontSize: "28px", fontWeight: 900, margin: "0 0 4px", color: "#111827" }}>{plant.name}</h2>
          <p style={{ color: "#059669", fontWeight: 800, fontSize: "14px", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "1px" }}>{plant.species || "Digital Registry specimen"}</p>

          <div style={{
            background: "#111827",
            padding: "16px",
            borderRadius: "16px",
            marginBottom: "20px",
            color: "#fff"
          }}>
            <div style={{ fontSize: "10px", fontWeight: 800, opacity: 0.6, marginBottom: "4px", textTransform: "uppercase" }}>Specimen Access Key</div>
            <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "4px" }}>{plant.access_key || "1234"}</div>
          </div>

          <div style={{
            fontSize: "11px",
            color: "#64748b",
            lineHeight: 1.5,
            padding: "0 20px"
          }}>
            Scan the code and enter the <strong>Access Key</strong> above to view your plant's verified history.
          </div>

          <div style={{ marginTop: "32px", fontSize: "10px", fontWeight: 700, color: "#cbd5e1", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
            REGISTRY ID: {plant.id.substring(0, 14).toUpperCase()}
          </div>
        </div>
      </div>

    </div>
  );
}

const btnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 20px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  background: "#fff",
  color: "#1e293b",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "14px",
  transition: "all 0.2s"
};
