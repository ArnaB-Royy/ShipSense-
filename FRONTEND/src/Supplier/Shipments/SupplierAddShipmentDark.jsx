// Supplier/SupplierAddShipmentDark.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupplierNavbarDark from "./Components/SupplierNavbarDark";
import SupplierSidebarDark from "./Components/SupplierSidebarDark";

const API          = "http://localhost:5000/api/shipments";
const DELAYCODES_API = "http://localhost:5000/api/delaycodes";
const ME_API       = "http://localhost:5000/api/auth/me";

export default function SupplierAddShipmentDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [loading, setLoading]           = useState(false);
  const [notification, setNotification] = useState(null);
  const [delayCodes, setDelayCodes]     = useState([]);
  const [profile, setProfile]           = useState(null);
  const [formData, setFormData]         = useState({
    Origin: "", Destination: "",
    ETA: "", Status: "In Transit",
    DelayReason: "", DelayDuration: 0,
  });

  useEffect(() => {
    // fetch supplier's own profile to auto-fill Supplier field
    fetch(ME_API, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setProfile(d.user); })
      .catch(() => {});

    fetch(DELAYCODES_API, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setDelayCodes(d.data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.Origin.trim() || !formData.Destination.trim() || !formData.ETA) {
      showNotification("error", "Please fill all required fields!");
      return;
    }
    if (formData.Origin.trim().toLowerCase() === formData.Destination.trim().toLowerCase()) {
      showNotification("error", "Origin and Destination cannot be the same!");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(formData.ETA) < today) {
      showNotification("error", "ETA cannot be in the past!");
      return;
    }
    if (Number(formData.DelayDuration) < 0) {
      showNotification("error", "Delay duration cannot be negative!");
      return;
    }
    if (Number(formData.DelayDuration) > 720) {
      showNotification("error", "Delay duration max is 720hrs (30 days)!");
      return;
    }
    if (formData.Status === "Delayed" && !formData.DelayReason) {
      showNotification("error", "Please select a delay code for delayed shipments!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        Supplier:      profile?.Name || "Unknown Supplier",
        Origin:        formData.Origin.trim(),
        Destination:   formData.Destination.trim(),
        ETA:           formData.ETA,
        Status:        formData.Status,
        DelayReason:   formData.DelayReason || null,
        DelayDuration: Number(formData.DelayDuration) || 0,
        CreatedBy:     "supplier",
      };
      const res  = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", `${data.data.ShipmentId} created successfully!`);
        setFormData({ Origin: "", Destination: "", ETA: "", Status: "In Transit", DelayReason: "", DelayDuration: 0 });
      } else {
        showNotification("error", data.message || "Failed to create shipment");
      }
    } catch {
      showNotification("error", "Cannot connect to server — is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), type === "error" ? 4000 : 3000);
  };

  const filled = formData.Origin.trim() && formData.Destination.trim() && formData.ETA;

  const statusColor = (s) => {
    if (s === "On Time")   return "#4ade80";
    if (s === "Delayed")   return "#f87171";
    if (s === "Delivered") return "#60a5fa";
    return "#fbbf24";
  };

  const selectedDelayLabel = delayCodes.find(d => d._id === formData.DelayReason)?.Code || "";

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#07060a", color:"#e0d8d0", fontFamily:"'Inter',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow  { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 4px 24px rgba(230,50,50,0.25)} 50%{box-shadow:0 4px 40px rgba(230,50,50,0.45)} }

        .fade-up-sa   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-sa-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity:0; }
        .slide-right-sa { animation: slideRight 0.35s ease forwards; }

        .form-input-sa {
          width:100%; padding:12px 16px;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:8px; color:#e0d8d0;
          font-size:0.88rem; font-family:'Inter',sans-serif;
          box-sizing:border-box; transition:all 0.2s;
        }
        .form-input-sa:focus {
          outline:none; border-color:rgba(230,50,50,0.5);
          background:rgba(255,255,255,0.06);
          box-shadow:0 0 0 3px rgba(230,50,50,0.07);
        }
        .form-input-sa::placeholder { color:#3a2a25; }
        .form-input-sa:not(:placeholder-shown) { border-color:rgba(230,50,50,0.2); }
        select.form-input-sa option { background:#0f0d13; color:#e0d8d0; }

        .autofill-sa {
          width:100%; padding:12px 16px;
          background:rgba(230,50,50,0.04);
          border:1px solid rgba(230,50,50,0.15);
          border-radius:8px; color:#f0a030;
          font-size:0.88rem; font-family:'Inter',sans-serif;
          box-sizing:border-box; cursor:not-allowed;
          display:flex; align-items:center; gap:8px;
        }

        .back-btn-sa {
          background:transparent; border:1px solid rgba(255,255,255,0.08);
          color:#7a6a60; padding:10px 20px; border-radius:8px;
          cursor:pointer; font-size:0.78rem; font-family:'Inter',sans-serif;
          transition:all 0.2s;
        }
        .back-btn-sa:hover { color:#e0d8d0; border-color:rgba(255,255,255,0.15); background:rgba(255,255,255,0.03); }

        .submit-ready-sa {
          width:100%; padding:15px;
          background:linear-gradient(135deg,#e63232,#f0a030);
          border:none; border-radius:10px; color:#fff;
          font-size:0.88rem; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; cursor:pointer;
          font-family:'Inter',sans-serif;
          animation:glowPulse 3s ease infinite;
          transition:all 0.3s; position:relative; overflow:hidden;
        }
        .submit-ready-sa:hover { transform:translateY(-2px); }
        .submit-ready-sa::after {
          content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          transition:left 0.5s;
        }
        .submit-ready-sa:hover::after { left:150%; }

        .submit-disabled-sa {
          width:100%; padding:15px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          border-radius:10px; color:#3a2a25;
          font-size:0.88rem; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; cursor:not-allowed;
          font-family:'Inter',sans-serif;
        }

        .spinner-sa { width:18px; height:18px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; display:inline-block; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(230,50,50,0.25); border-radius:4px; }
      `}</style>

      <SupplierNavbarDark toggleTheme={toggleTheme} pageTitle="ADD SHIPMENT" pageSubtitle="CREATE NEW" />

      <div style={{ display:"flex", flex:1, overflow:"visible" }}>
        <SupplierSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft:`${68 + hoveredWidth}px`, flex:1, padding:"2rem 2.5rem", transition:"margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position:"relative" }}>

          {/* ORBS */}
          <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(230,50,50,0.1),transparent 70%)", animation:"pulseOrb 6s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"fixed", bottom:"-150px", left:"5%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,rgba(240,160,48,0.06),transparent 70%)", animation:"pulseOrb 8s ease-in-out infinite reverse", pointerEvents:"none", zIndex:0 }} />

          {/* TOAST */}
          {notification && (
            <div className="slide-right-sa" style={{ position:"fixed", top:"80px", right:"2rem", zIndex:1000, padding:"1rem 1.4rem", borderRadius:"10px", background: notification.type === "success" ? "linear-gradient(135deg,rgba(74,222,128,0.12),rgba(74,222,128,0.06))" : "linear-gradient(135deg,rgba(248,113,113,0.12),rgba(248,113,113,0.06))", border:`1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: notification.type === "success" ? "#4ade80" : "#f87171", backdropFilter:"blur(16px)", boxShadow:`0 8px 32px ${notification.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)"}`, display:"flex", alignItems:"center", gap:"0.8rem", minWidth:"280px", maxWidth:"380px" }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"50%", background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.82rem", marginBottom:"2px" }}>{notification.type === "success" ? "Shipment Created!" : "Error"}</div>
                <div style={{ opacity:0.8, fontSize:"0.76rem", lineHeight:1.4 }}>{notification.message}</div>
              </div>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="fade-up-sa" style={{ marginBottom:"2rem", display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative", zIndex:1 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                <div style={{ width:"24px", height:"2px", background:"linear-gradient(90deg,#e63232,#f0a030)", borderRadius:"2px" }} />
                <span style={{ fontSize:"0.6rem", letterSpacing:"4px", textTransform:"uppercase", background:"linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:700 }}>Create</span>
              </div>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", background:"linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"3px", lineHeight:1, margin:0 }}>NEW SHIPMENT</h1>
              <div style={{ fontSize:"0.76rem", color:"#a89888", marginTop:"6px" }}>
                Shipping as <span style={{ color:"#f0a030", fontWeight:600 }}>{profile?.Name || "..."}</span> · Required fields marked with *
              </div>
            </div>
            <button className="back-btn-sa" onClick={() => navigate("/supplier/shipments")}>← Back to Shipments</button>
          </div>

          <div className="fade-up-sa-1" style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:"24px", position:"relative", zIndex:1 }}>

            {/* FORM CARD */}
            <div style={{ background:"linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.015))", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"16px", overflow:"hidden" }}>
              <div style={{ height:"2px", background:"linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize:"200%", animation:"gradFlow 3s linear infinite" }} />
              <div style={{ padding:"2rem" }}>

                {/* SUPPLIER — auto-filled, read only */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"1.2rem" }}>
                  <div style={{ width:"3px", height:"16px", background:"linear-gradient(to bottom,#e63232,#f0a030)", borderRadius:"2px" }} />
                  <span style={{ fontSize:"0.62rem", letterSpacing:"3px", textTransform:"uppercase", color:"#a89888", fontWeight:700 }}>Shipment Info</span>
                </div>

                <div style={{ marginBottom:"1rem" }}>
                  <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>
                    Supplier
                    <span style={{ marginLeft:"8px", fontSize:"0.55rem", color:"#4a3a35", textTransform:"none", letterSpacing:"1px" }}>— Auto-filled from your account</span>
                  </label>
                  <div className="autofill-sa">
                    <span style={{ fontSize:"0.9rem" }}>🏭</span>
                    <span>{profile?.Name || "Loading..."}</span>
                    <span style={{ marginLeft:"auto", fontSize:"0.62rem", color:"#4a3a35", letterSpacing:"1px" }}>LOCKED</span>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"1rem" }}>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>Origin <span style={{ color:"#e63232" }}>*</span></label>
                    <input className="form-input-sa" type="text" name="Origin" placeholder="e.g. Mumbai" value={formData.Origin} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>Destination <span style={{ color:"#e63232" }}>*</span></label>
                    <input className="form-input-sa" type="text" name="Destination" placeholder="e.g. Dubai" value={formData.Destination} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", margin:"1.5rem 0" }} />

                {/* SCHEDULE */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"1.2rem" }}>
                  <div style={{ width:"3px", height:"16px", background:"linear-gradient(to bottom,#e63232,#f0a030)", borderRadius:"2px" }} />
                  <span style={{ fontSize:"0.62rem", letterSpacing:"3px", textTransform:"uppercase", color:"#a89888", fontWeight:700 }}>Schedule & Status</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>ETA <span style={{ color:"#e63232" }}>*</span></label>
                    <input className="form-input-sa" type="date" name="ETA" value={formData.ETA} onChange={handleChange} style={{ colorScheme:"dark" }} />
                  </div>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>Status</label>
                    <select className="form-input-sa" name="Status" value={formData.Status} onChange={handleChange}>
                      <option value="In Transit">In Transit</option>
                      <option value="On Time">On Time</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", margin:"1.5rem 0" }} />

                {/* DELAY */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"1.2rem" }}>
                  <div style={{ width:"3px", height:"16px", background:"linear-gradient(to bottom,#f87171,#fbbf24)", borderRadius:"2px" }} />
                  <span style={{ fontSize:"0.62rem", letterSpacing:"3px", textTransform:"uppercase", color:"#a89888", fontWeight:700 }}>Delay Info</span>
                  <span style={{ fontSize:"0.6rem", color:"#4a3a35", letterSpacing:"1px" }}>— Optional</span>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>Delay Code</label>
                    <select className="form-input-sa" name="DelayReason" value={formData.DelayReason} onChange={handleChange}>
                      <option value="">None</option>
                      {delayCodes.map(dc => (
                        <option key={dc._id} value={dc._id}>{dc.Code} — {dc.Reason}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:"0.62rem", letterSpacing:"2px", textTransform:"uppercase", color:"#8a7a70", marginBottom:"6px", display:"block", fontWeight:600 }}>Delay Duration (hrs)</label>
                    <input className="form-input-sa" type="number" name="DelayDuration" placeholder="0" min="0" value={formData.DelayDuration} onChange={handleChange} />
                  </div>
                </div>

                {/* delay code expanded info */}
                {formData.DelayReason && (() => {
                  const dc = delayCodes.find(d => d._id === formData.DelayReason);
                  if (!dc) return null;
                  return (
                    <div style={{ marginTop:"1rem", padding:"12px 14px", background:"rgba(248,113,113,0.05)", border:"1px solid rgba(248,113,113,0.15)", borderRadius:"8px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                      {[
                        { label:"Category", val: dc.Category },
                        { label:"Severity",  val: dc.Severity  },
                        { label:"Avg Delay", val: dc.AverageDelayHours ? `${dc.AverageDelayHours} hrs` : "—" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div style={{ fontSize:"0.56rem", letterSpacing:"2px", textTransform:"uppercase", color:"#6a4a40", fontWeight:700, marginBottom:"3px" }}>{item.label}</div>
                          <div style={{ fontSize:"0.82rem", color: item.label === "Severity" && dc.Severity === "High" ? "#f87171" : item.label === "Severity" && dc.Severity === "Medium" ? "#fbbf24" : "#d4c4b8", fontWeight:600 }}>{item.val || "—"}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* RIGHT PANEL */}
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

              {/* LIVE PREVIEW */}
              <div style={{ background:"linear-gradient(145deg,rgba(230,50,50,0.05),rgba(240,160,48,0.02))", border:"1px solid rgba(230,50,50,0.15)", borderRadius:"14px", overflow:"hidden" }}>
                <div style={{ height:"2px", background:"linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize:"200%", animation:"gradFlow 3s linear infinite" }} />
                <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", gap:"8px" }}>
                  <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#e63232", animation:"pulseOrb 2s ease-in-out infinite" }} />
                  <span style={{ fontSize:"0.62rem", letterSpacing:"3px", textTransform:"uppercase", color:"#a89888", fontWeight:700 }}>Live Preview</span>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  {[
                    { label:"Supplier",   val: profile?.Name },
                    { label:"Route",      val: formData.Origin && formData.Destination ? `${formData.Origin} → ${formData.Destination}` : "" },
                    { label:"ETA",        val: formData.ETA ? new Date(formData.ETA).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "" },
                    { label:"Status",     val: formData.Status, color: statusColor(formData.Status) },
                    { label:"Delay Code", val: selectedDelayLabel },
                  ].map((item, i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ fontSize:"0.65rem", letterSpacing:"1.5px", textTransform:"uppercase", color:"#5a4a45" }}>{item.label}</span>
                      <span style={{ fontSize:"0.82rem", color: item.val ? (item.color || "#d4c4b8") : "#3a2a25", fontWeight: item.val ? 500 : 400 }}>{item.val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                className={filled && !loading ? "submit-ready-sa" : "submit-disabled-sa"}
                onClick={handleSubmit}
                disabled={loading || !filled}
              >
                {loading ? (
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"10px" }}>
                    <span className="spinner-sa" /> Creating...
                  </span>
                ) : filled ? "Create Shipment →" : "Fill required fields first"}
              </button>

              {/* TIPS */}
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"14px", padding:"16px 18px" }}>
                <div style={{ fontSize:"0.6rem", letterSpacing:"2px", textTransform:"uppercase", color:"#5a4a45", marginBottom:"12px", fontWeight:700 }}>Quick Tips</div>
                {[
                  "Shipment ID is auto-generated",
                  "Your name is auto-filled as the supplier",
                  "Origin and Destination must be different",
                  "ETA must be a future date",
                  "If status is Delayed, select a delay code",
                  "Admin will assign a customer to your shipment",
                ].map((tip, i, arr) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"8px", marginBottom: i < arr.length - 1 ? "10px" : "0" }}>
                    <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"linear-gradient(135deg,#e63232,#f0a030)", marginTop:"6px", flexShrink:0 }} />
                    <div style={{ fontSize:"0.76rem", color:"#7a6a60", lineHeight:1.5 }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}