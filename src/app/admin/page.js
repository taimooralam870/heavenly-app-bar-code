"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Save, RefreshCw, LogIn, Upload, Trash2, Edit2, 
  Clock, Thermometer, Droplets, User, Calendar, 
  Leaf, Search, PlusCircle, CheckCircle2, AlertCircle,
  LayoutDashboard, Menu, X, ArrowLeft, Lock, 
  Activity, Users, Settings, ExternalLink, Copy, Printer,
  Eye, Mail, UserPlus, MoreVertical, ShieldAlert, Star,
  ChevronRight, CheckSquare
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("inventory"); 

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [originUrl, setOriginUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initialForm = {
    name: "", description: "", price: "", stock: "", photoBase64: "",
    acquired_date: "", gardener: "", species: "", temp_care: "",
    water_care: "", owner_name: "", owner_age: "", owner_details: "",
    previous_owners: "", owner_review: "", access_key: "1234"
  };
  const [formData, setFormData] = useState(initialForm);

  const [accessUsers, setAccessUsers] = useState([
    { id: 1, name: "Admin Officer", role: "Super Admin", email: "admin@plantlife.com", status: "Online", avatar: "AO" },
    { id: 2, name: "Hassan Ali", role: "Editor", email: "hassan@garden.com", status: "Active", avatar: "HA" }
  ]);

  const fetchPlants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/plants");
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
      fetchPlants();
    }
    setOriginUrl(window.location.origin);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      fetchPlants();
    } else {
      alert("Invalid Password");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7); 
          setFormData(prev => ({ ...prev, photoBase64: dataUrl }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (plant) => {
    setEditingId(plant.id);
    setFormData({
      name: plant.name || "",
      description: plant.description || "",
      price: plant.price || "",
      stock: plant.stock || "",
      photoBase64: plant.image || "",
      acquired_date: plant.acquired_date || "",
      gardener: plant.gardener || "",
      species: plant.species || "",
      temp_care: plant.temp_care || "",
      water_care: plant.water_care || "",
      owner_name: plant.owner_name || "",
      owner_age: plant.owner_age || "",
      owner_details: plant.owner_details || "",
      previous_owners: plant.previous_owners || "",
      owner_review: plant.owner_review || "",
      access_key: plant.access_key || ""
    });
    setActiveTab("inventory");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plant record permanently?")) return;
    try {
      const res = await fetch(`/api/plants/${id}`, { method: "DELETE" });
      if (res.ok) fetchPlants();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      price: parseInt(formData.price, 10) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      image: formData.photoBase64
    };
    try {
      const url = editingId ? `/api/plants/${editingId}` : "/api/plants";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchPlants();
        setFormData(initialForm);
        setEditingId(null);
        alert("Success!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPlants = plants.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
         <div className="anim-fadeUp" style={{ width: "100%", maxWidth: "400px", background: "#fff", padding: "48px 32px", borderRadius: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.05)", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "#059669", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
               <Lock color="#fff" size={32} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>Officer Login</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "32px" }}>Access the secure plant registry.</p>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
               <input type="password" placeholder="Key Phrase" value={password} onChange={e => setPassword(e.target.value)} style={cleanInput} />
               <button type="submit" className="btn-primary" style={{ height: "50px", background: "#111827", justifyContent: "center" }}>Authenticate</button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", color: "#1e293b", position: "relative" }}>
      
      {/* ── MOBILE NAVBAR ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "60px", background: "#fff", borderBottom: "1px solid #e2e8f0", zIndex: 50, display: "none", alignItems: "center", padding: "0 16px" }} className="show-mobile-flex">
         <button onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none" }}><Menu size={22} /></button>
         <div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: "15px" }}>Heavenly<span style={{color: '#10b981'}}>Plants</span> Admin</div>
      </div>

      {isSidebarOpen && <div className="mobile-drawer-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: "260px", background: "#fff", borderRight: "1px solid #e2e8f0", position: "fixed", height: "100vh", padding: "24px 16px", display: "flex", flexDirection: "column", zIndex: 100 }}>
         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <div style={{ width: "28px", height: "28px", background: "#10b981", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}><Leaf color="#fff" size={16} /></div>
               <span style={{ fontWeight: 800, fontSize: "16px" }}>HeavenlyPlants</span>
            </div>
            <button className="show-mobile-flex" onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none" }}><X size={20}/></button>
         </div>

         <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button onClick={() => {setActiveTab("inventory"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "inventory" ? sideNavActive : {}) }}><LayoutDashboard size={18} /> Inventory</button>
            <button onClick={() => {setActiveTab("logs"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "logs" ? sideNavActive : {}) }}><Activity size={18} /> Logs</button>
            <button onClick={() => {setActiveTab("users"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "users" ? sideNavActive : {}) }}><Users size={18} /> Users</button>
         </nav>

         <div style={{ marginTop: "auto", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, marginBottom: "8px" }}>Admin Officer</div>
            <button onClick={() => { sessionStorage.clear(); window.location.href = "/"; }} style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "11px", fontWeight: 700, background: "#fff" }}>Sign Out</button>
         </div>
      </aside>

      <main className="admin-main" style={{ flex: 1, marginLeft: "260px", padding: "32px", marginTop: "0px" }}>
        
        {activeTab === "inventory" && (
           <div className="anim-fadeIn">
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }} className="admin-header">
                 <div>
                    <h1 style={{ fontSize: "28px", fontWeight: 800 }}>{editingId ? "Edit" : "Inventory"}</h1>
                    <p style={{ color: "#64748b", fontSize: "14px" }}>{plants.length} specimens tracked.</p>
                 </div>
                 <div style={{ position: "relative" }} className="hide-mobile">
                    <Search size={18} style={{ position: "absolute", left: "12px", top: "12px", color: "#94a3b8" }} />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...searchBar, width: "240px" }} />
                 </div>
              </header>

              <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px" }}>
                 <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", border: "1px solid #f1f5f9" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                       <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div><label style={clabel}>Plant Name</label><input name="name" value={formData.name} onChange={handleChange} required style={cleanInput} /></div>
                          <div><label style={clabel}>Species</label><input name="species" value={formData.species} onChange={handleChange} style={cleanInput} /></div>
                       </div>
                       <div className="mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div><label style={clabel}>Owner</label><input name="owner_name" value={formData.owner_name} onChange={handleChange} style={cleanInput} /></div>
                          <div><label style={clabel}>Access Key</label><input name="access_key" value={formData.access_key} onChange={handleChange} style={{...cleanInput, fontWeight: 800, color: '#059669'}} /></div>
                       </div>
                       <div onClick={() => document.getElementById('fl-up').click()} style={cleanDropzone}>
                          <input id="fl-up" type="file" onChange={handlePhotoUpload} style={{ display: "none" }} />
                          {formData.photoBase64 ? <span style={{ fontWeight: 700, color: "#059669" }}>Photo Attached</span> : <span>Select Photo</span>}
                       </div>
                       <button type="submit" disabled={submitting} className="btn-primary" style={{ background: "#059669", height: "48px", borderRadius: "10px" }}>
                          {submitting ? "Saving..." : (editingId ? "Update" : "Save Record")}
                       </button>
                    </form>
                 </div>

                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {loading ? <p>Loading...</p> : filteredPlants.map(p => (
                       <div key={p.id} style={recordCard}>
                          <div style={{ width: "48px", height: "48px", background: "#f8fafc", borderRadius: "10px", overflow: "hidden" }}>
                             {p.image ? <img src={p.image} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Leaf color="#94a3b8" />}
                          </div>
                          <div style={{ flex: 1 }}>
                             <h4 style={{ fontSize: "14px", fontWeight: 800, margin: 0 }}>{p.name}</h4>
                             <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{p.owner_name}</p>
                             <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                                <Link href={`/plant/${p.id}`} target="_blank" style={miniLnk}>PREVIEW</Link>
                                <button onClick={() => handleEdit(p)} style={miniLnk}>EDIT</button>
                                <button onClick={() => handleDelete(p.id)} style={{...miniLnk, color: '#ef4444'}}>DELETE</button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* Other tabs minimal implementation to ensure page load */}
        {activeTab === "logs" && <div className="anim-fadeIn"><h1>Logs</h1></div>}
        {activeTab === "users" && <div className="anim-fadeIn"><h1>Users</h1></div>}

      </main>

      <style jsx global>{`
        .anim-fadeIn { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

const sideNavBtn = { width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "10px", border: "none", background: "none", cursor: "pointer" };
const sideNavActive = { background: "#f1f5f9", color: "#111827", fontWeight: 800 };
const clabel = { display: "block", fontSize: "11px", fontWeight: 700, color: "#64748b", marginBottom: "4px" };
const cleanInput = { width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", fontSize: "13px", outline: "none" };
const searchBar = { padding: "10px 14px 10px 36px", borderRadius: "100px", border: "1px solid #e2e8f0", fontSize: "13px" };
const recordCard = { background: "#fff", padding: "12px 16px", borderRadius: "14px", display: "flex", gap: "12px", alignItems: "center", border: "1px solid #f1f5f9" };
const miniLnk = { fontSize: "10px", fontWeight: 800, color: "#10b981", textDecoration: "none", background: "none", border: "none", cursor: "pointer" };
const cleanDropzone = { padding: "12px", border: "1px dashed #e2e8f0", borderRadius: "8px", textAlign: "center", fontSize: "12px", color: "#94a3b8", cursor: "pointer" };
