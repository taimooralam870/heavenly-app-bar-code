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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "64px", background: "#fff", borderBottom: "1px solid #e2e8f0", zIndex: 50, display: "flex", alignItems: "center", padding: "0 20px" }} className="show-mobile-flex">
         <button onClick={() => setIsSidebarOpen(true)} style={{ background: "none", border: "none", padding: "8px", cursor: "pointer" }}>
            <Menu size={24} />
         </button>
         <div style={{ flex: 1, textAlign: "center", fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px" }}>Heavenly<span style={{color: '#10b981'}}>Plants</span> Admin</div>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {isSidebarOpen && <div className="mobile-drawer-overlay" onClick={() => setIsSidebarOpen(false)} />}

      {/* ── CLEAN SIDEBAR ── */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ width: "260px", background: "#fff", borderRight: "1px solid #e2e8f0", position: "fixed", height: "100vh", padding: "32px 20px", display: "flex", flexDirection: "column", zIndex: 100 }}>
         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px", paddingLeft: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
               <div style={{ width: "32px", height: "32px", background: "#10b981", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Leaf color="#fff" size={18} />
               </div>
               <span style={{ fontWeight: 800, fontSize: "18px", color: "#111827", letterSpacing: "-0.5px" }}>HeavenlyPlants</span>
            </div>
            <button className="show-mobile-flex" onClick={() => setIsSidebarOpen(false)} style={{ background: "none", border: "none" }}><X size={20}/></button>
         </div>

         <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button onClick={() => {setActiveTab("inventory"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "inventory" ? sideNavActive : {}) }}>
               <LayoutDashboard size={18} /> Inventory
            </button>
            <button onClick={() => {setActiveTab("logs"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "logs" ? sideNavActive : {}) }}>
               <Activity size={18} /> System Logs
            </button>
            <button onClick={() => {setActiveTab("users"); setIsSidebarOpen(false);}} style={{ ...sideNavBtn, ...(activeTab === "users" ? sideNavActive : {}) }}>
               <Users size={18} /> User Access
            </button>
         </nav>

         <div style={{ marginTop: "auto", padding: "16px", background: "#f8fafc", borderRadius: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
               <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>AD</div>
               <div style={{ fontSize: "12px" }}>
                  <div style={{ fontWeight: 800 }}>Admin Officer</div>
                  <div style={{ color: "#10b981", fontWeight: 800, fontSize: "10px" }}>ONLINE</div>
               </div>
            </div>
            <button onClick={() => { sessionStorage.clear(); window.location.href = "/"; }} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "12px", fontWeight: 700, background: "#fff", cursor: "pointer" }}>Sign Out</button>
         </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main" style={{ flex: 1, marginLeft: "260px", padding: "48px 60px", marginTop: "64px" }}>
        
        {activeTab === "inventory" && (
           <div className="anim-fadeIn">
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }} className="admin-header">
                 <div>
                    <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>{editingId ? "Edit Record" : "Plant Inventory"}</h1>
                    <p style={{ color: "#64748b", fontSize: "15px" }}>Manage your collection of {plants.length} records.</p>
                 </div>
                 <div style={{ position: "relative" }} className="search-input">
                    <Search size={18} style={{ position: "absolute", left: "16px", top: "14px", color: "#94a3b8" }} />
                    <input type="text" placeholder="Search plants or owners..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={searchBar} className="search-input" />
                 </div>
              </header>

              <div className="admin-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }}>
                 
                 {/* FORM BODY */}
                 <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                       <div className="form-row mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div><label style={clabel}>Plant Name</label><input name="name" value={formData.name} onChange={handleChange} required style={cleanInput} placeholder="Aloe Vera" /></div>
                          <div><label style={clabel}>Species</label><input name="species" value={formData.species} onChange={handleChange} style={cleanInput} placeholder="Succulent" /></div>
                       </div>
                       <div className="form-row mobile-grid-1" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                          <div><label style={clabel}>Owner Name</label><input name="owner_name" value={formData.owner_name} onChange={handleChange} style={cleanInput} placeholder="Full Name" /></div>
                          <div><label style={clabel}>Plant Access Key (QR Secret)</label><input name="access_key" value={formData.access_key} onChange={handleChange} style={{...cleanInput, fontWeight: 800, color: '#059669', background: '#f0fdf4'}} placeholder="e.g. 5678" /></div>
                       </div>
                       <div><label style={clabel}>Owner Details</label><textarea name="owner_details" value={formData.owner_details} onChange={handleChange} style={{...cleanInput, minHeight: "80px"}} placeholder="Address or Contact..." /></div>
                       <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div><label style={clabel}>Temperature Care</label><input name="temp_care" value={formData.temp_care} onChange={handleChange} style={cleanInput} placeholder="20-30°C" /></div>
                          <div><label style={clabel}>Water Frequency</label><input name="water_care" value={formData.water_care} onChange={handleChange} style={cleanInput} placeholder="Weekly" /></div>
                       </div>
                       <div onClick={() => document.getElementById('fl-up').click()} style={cleanDropzone}>
                          <input id="fl-up" type="file" onChange={handlePhotoUpload} style={{ display: "none" }} />
                          {formData.photoBase64 ? (
                             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                                <img src={formData.photoBase64} style={{width: '40px', height: '40px', borderRadius: '8px'}} />
                                <span style={{ fontWeight: 700, color: "#059669" }}>Photo Attached</span>
                             </div>
                          ) : <div style={{ color: "#94a3b8", fontSize: "14px" }}><Upload size={18} style={{verticalAlign: 'middle', marginRight: '8px'}}/> Select Photo</div>}
                       </div>

                       <div>
                          <label style={clabel}>Owner's Testimonial / Review</label>
                          <textarea 
                             placeholder="What does the customer say about this plant?" 
                             value={formData.owner_review}
                             onChange={(e) => setFormData({...formData, owner_review: e.target.value})}
                             style={{ ...cleanInput, height: "100px", resize: "none" }}
                          />
                       </div>

                       <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                          <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, padding: "16px", background: "#059669", borderRadius: "12px" }}>
                             {submitting ? <RefreshCw className="spin" /> : <Save size={18} />} {editingId ? "Update Record" : "Save New Record"}
                          </button>
                          {editingId && <button onClick={() => {setEditingId(null); setFormData(initialForm);}} style={{ padding: "0 24px", border: "1px solid #ddd", borderRadius: "12px", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Cancel</button>}
                       </div>
                    </form>
                 </div>

                 {/* LIST VIEW */}
                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {loading ? (
                       [1,2,3].map(i => (
                          <div key={i} style={{ ...recordCard, opacity: 0.5, animation: 'pulse 1.5s infinite ease-in-out' }}>
                             <div style={{ width: "56px", height: "56px", background: "#f1f5f9", borderRadius: "14px" }} />
                             <div style={{ flex: 1 }}>
                                <div style={{width: '60%', height: '14px', background: '#f1f5f9', borderRadius: '4px', marginBottom: '8px'}} />
                                <div style={{width: '40%', height: '10px', background: '#f1f5f9', borderRadius: '4px'}} />
                             </div>
                          </div>
                       ))
                    ) : filteredPlants.map(p => (
                       <div key={p.id} style={recordCard}>
                          <div style={{ width: "56px", height: "56px", background: "#f8fafc", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                             {p.image ? <img src={p.image} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Leaf color="#94a3b8" />}
                          </div>
                          <div style={{ flex: 1 }}>
                             <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#111827", margin: 0 }}>{p.name}</h4>
                             <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Owner: {p.owner_name} · {p.species}</p>
                             <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                                <Link href={`/plant/${p.id}`} target="_blank" style={miniLnk}>PREVIEW</Link>
                                <button onClick={() => { navigator.clipboard.writeText(`${originUrl}/plant/${p.id}`); alert("Copied!"); }} style={miniLnk}>COPY LINK</button>
                                <Link href={`/admin/print/${p.id}`} style={{ ...miniLnk, color: '#6366f1' }}>PRINT TAG</Link>
                             </div>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                             <button onClick={() => handleEdit(p)} style={recAction}><Edit2 size={16}/></button>
                             <button onClick={() => handleDelete(p.id)} style={{...recAction, color: '#ef4444', background: '#fef2f2'}}><Trash2 size={16}/></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {activeTab === "logs" && (
           <div className="anim-fadeIn">
              <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "32px" }}>Operation Logs</h1>
              <div className="responsive-table">
                <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", minWidth: "600px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f8fafc", textAlign: "left" }}>
                       <tr>
                          <th style={clTh}>ID</th>
                          <th style={clTh}>PLANT</th>
                          <th style={clTh}>SECRET KEY</th>
                          <th style={clTh}>DATE</th>
                          <th style={clTh}>STATUS</th>
                       </tr>
                    </thead>
                    <tbody>
                       {plants.map((p, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                             <td style={clTd}>#{p.id.substring(0,6)}</td>
                             <td style={clTd}>{p.name}</td>
                             <td style={clTd}><span style={{fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>{p.access_key || "1234"}</span></td>
                             <td style={clTd}>{new Date(p.created_at).toLocaleDateString()}</td>
                             <td style={clTd}><span style={{ color: "#059669", fontWeight: 700 }}>VERIFIED</span></td>
                          </tr>
                       ))}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        )}

        {activeTab === "users" && (
           <div className="anim-fadeIn">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }} className="admin-header">
                 <h1 style={{ fontSize: "32px", fontWeight: 800 }}>User Management</h1>
                 <button className="btn-primary" style={{ background: "#111827", borderRadius: "10px" }}><UserPlus size={18}/> Invite Staff</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                 {accessUsers.map(user => (
                   <div key={user.id} style={usrCrd}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                         <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800 }}>{user.avatar}</div>
                         <div>
                            <div style={{ fontWeight: 800, fontSize: "16px" }}>{user.name} <CheckCircle2 size={14} color="#10b981" style={{display: 'inline', marginLeft: '4px'}}/></div>
                            <div style={{ color: "#64748b", fontSize: "12px" }}>{user.email}</div>
                         </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "10px 0", borderTop: "1px solid #f1f5f9" }}>
                         <span style={{ color: "#94a3b8" }}>Permission Role</span>
                         <span style={{ fontWeight: 700 }}>{user.role}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                         <button style={usrAct}>Edit Access</button>
                         <button style={{...usrAct, color: '#ef4444'}}>Deactivate</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}

      </main>

      <style jsx global>{`
        .anim-fadeIn { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const sideNavBtn = {
  width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: "10px", fontSize: "14px",
  fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: "12px",
  border: "none", background: "none", cursor: "pointer", transition: "0.2s"
};
const sideNavActive = { background: "#f1f5f9", color: "#111827", fontWeight: 800 };

const clabel = { display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px" };
const cleanInput = {
  width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #e2e8f0",
  background: "#fff", fontSize: "14px", outline: "none", transition: "border 0.2s", color: "#111827"
};

const searchBar = { width: "300px", padding: "12px 16px 12px 48px", borderRadius: "100px", border: "1px solid #e2e8f0", outline: "none", background: "#fff", fontSize: "14px" };

const recordCard = {
  background: "#fff", padding: "16px 20px", borderRadius: "18px", display: "flex", gap: "16px",
  alignItems: "center", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
};
const miniLnk = { fontSize: "11px", fontWeight: 800, color: "#10b981", textDecoration: "none", cursor: "pointer", background: "none", border: "none" };
const recAction = { padding: "8px", borderRadius: "10px", border: "1px solid #f1f5f9", background: "#fff", cursor: "pointer", display: "flex" };

const clTd = { padding: "16px 24px", fontSize: "14px" };
const clTh = { padding: "16px 24px", fontSize: "12px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" };

const cleanDropzone = { padding: "16px", border: "2px dashed #e2e8f0", borderRadius: "12px", textAlign: "center", cursor: "pointer" };

const usrCrd = { background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" };
const usrAct = { flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: "#fff" };
