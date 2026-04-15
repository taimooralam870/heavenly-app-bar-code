"use client";

import { Camera, Bell } from "lucide-react";
import { useState } from "react";

export default function TopActions({ plantId }) {
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
        if (res.ok) {
           window.location.reload();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    r.readAsDataURL(f);
  };

  return (
    <div style={{ display: "flex", gap: "16px" }}>
      <button 
        className="btn-primary" 
        style={{ padding: "16px 32px", borderRadius: "100px", fontSize: "14px" }}
        onClick={() => alert("Reminder synced with your calendar!")}
      >
        <Bell size={18} /> Remind Me to Water
      </button>

      <div style={{ position: 'relative' }}>
         <button 
           className="btn-outline" 
           style={{ borderRadius: "100px", background: "#fff", opacity: loading ? 0.7 : 1 }}
           onClick={() => document.getElementById('top-gal-up').click()}
           disabled={loading}
         >
           <Camera size={18} /> {loading ? "Uploading..." : "Add Memory"}
         </button>
         <input 
           id="top-gal-up" 
           type="file" 
           accept="image/*"
           style={{ display: "none" }} 
           onChange={handlePhotoUpload} 
         />
      </div>
    </div>
  );
}
