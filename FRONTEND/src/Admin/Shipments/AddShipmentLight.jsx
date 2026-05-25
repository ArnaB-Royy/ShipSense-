import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarLight from "../Components/AdminNavbarLight";
import AdminSidebarLight from "../Components/AdminSidebarLight";

const API = "http://localhost:5000/api/shipments";
const USERS_API = "http://localhost:5000/api/users";
const DELAYCODES_API = "http://localhost:5000/api/delaycodes";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

export default function AddShipmentLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    Supplier: "", Origin: "", Destination: "",
    ETA: "", Status: "In Transit", DelayReason: "", DelayDuration: 0,
    AssignedCustomer: "",
  });
  const [customers, setCustomers] = useState([]);
  const [delayCodes, setDelayCodes] = useState([]);

  useEffect(() => {
    fetch(`${USERS_API}?Role=customer`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setCustomers(d.data); })
      .catch(() => {});
    fetch(DELAYCODES_API, { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.success) setDelayCodes(d.data); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Whitespace-only check
    if (!formData.Supplier.trim() || !formData.Origin.trim() || !formData.Destination.trim() || !formData.ETA) {
      showNotification("error", "Please fill all required fields!");
      return;
    }
    if (formData.Supplier.trim().length < 2) {
      showNotification("error", "Supplier name must be at least 2 characters!");
      return;
    }
    // Case-insensitive same city check
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
      showNotification("error", "Delay duration seems too high — max 720hrs (30 days)!");
      return;
    }
    if (formData.Status === "Delayed" && !formData.DelayReason) {
      showNotification("error", "Please select a delay reason for delayed shipments!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        DelayReason: formData.DelayReason || null,
        DelayDuration: Number(formData.DelayDuration) || 0,
        Supplier: formData.Supplier.trim(),
        Origin: formData.Origin.trim(),
        Destination: formData.Destination.trim(),
      };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", `${data.data.ShipmentId} created successfully!`);
        setFormData({ Supplier: "", Origin: "", Destination: "", ETA: "", Status: "In Transit", DelayReason: "", DelayDuration: 0 });
      } else {
        if (data.message?.includes("duplicate")) {
          showNotification("error", "A shipment with these details already exists!");
        } else if (data.message?.includes("validation")) {
          showNotification("error", "Invalid data — please check all fields!");
        } else {
          showNotification("error", data.message || "Failed to create shipment");
        }
      }
    } catch (err) {
      if (err.message?.includes("fetch")) {
        showNotification("error", "Cannot connect to server — is the backend running?");
      } else {
        showNotification("error", "Something went wrong — please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), type === "error" ? 4000 : 3000);
  };

  const filled = formData.Supplier.trim() && formData.Origin.trim() && formData.Destination.trim() && formData.ETA;
  const selectedCustomerName = customers.find(c => c._id === formData.AssignedCustomer)?.Name || "";
  const selectedDelayLabel = delayCodes.find(d => d._id === formData.DelayReason)?.Code || "";

  const statusColor = (s) => {
    if (s === "On Time") return "#5a9e5a";
    if (s === "Delayed") return C.rose;
    if (s === "Delivered") return C.gold;
    return C.inkMid;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 4px 24px rgba(201,132,138,0.2)} 50%{box-shadow:0 4px 40px rgba(201,132,138,0.4)} }

        .fade-up-al { animation: fadeUp 0.5s ease forwards; }
        .fade-up-al-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .slide-right-al { animation: slideRight 0.35s ease forwards; }

        .form-input-l {
          width: 100%; padding: 12px 16px;
          background: ${C.bgDeep}; border: 1px solid ${C.border};
          border-radius: 8px; color: ${C.ink};
          font-size: 0.88rem; font-family: ${font.body};
          box-sizing: border-box; transition: all 0.2s;
        }
        .form-input-l:focus {
          outline: none; border-color: ${C.borderRose};
          background: ${C.bgCard};
          box-shadow: 0 0 0 3px rgba(201,132,138,0.08);
        }
        .form-input-l::placeholder { color: ${C.inkFaint}; }
        select.form-input-l option { background: ${C.bgCard}; color: ${C.ink}; }

        .back-btn-l {
          background: transparent; border: 1px solid ${C.border};
          color: ${C.inkLight}; padding: 10px 20px;
          border-radius: 8px; cursor: pointer;
          font-size: 0.78rem; font-family: ${font.body}; transition: all 0.2s;
        }
        .back-btn-l:hover { color: ${C.ink}; border-color: ${C.borderRose}; background: ${C.roseLight}; }

        .submit-ready-l {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, ${C.rose}, ${C.gold});
          border: none; border-radius: 10px; color: #fff;
          font-size: 0.88rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; cursor: pointer; font-family: ${font.body};
          animation: glowPulse 3s ease infinite; transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .submit-ready-l:hover { transform: translateY(-2px); }
        .submit-ready-l::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }
        .submit-ready-l:hover::after { left: 150%; }

        .submit-disabled-l {
          width: 100%; padding: 15px; background: ${C.bgDeep};
          border: 1px solid ${C.border}; border-radius: 10px; color: ${C.inkFaint};
          font-size: 0.88rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; cursor: not-allowed; font-family: ${font.body};
        }

        .spinner-l {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.8s linear infinite; display: inline-block;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }
      `}</style>

      <AdminNavbarLight toggleTheme={toggleTheme} pageTitle="Add Shipment" pageSubtitle="Create New" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.1), transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.07), transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {notification && (
            <div className="slide-right-al" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
              padding: "1rem 1.4rem", borderRadius: "10px",
              background: notification.type === "success"
                ? "linear-gradient(135deg, rgba(90,158,90,0.12), rgba(90,158,90,0.06))"
                : `linear-gradient(135deg, ${C.roseLight}, rgba(201,132,138,0.06))`,
              border: `1px solid ${notification.type === "success" ? "rgba(90,158,90,0.3)" : C.borderRose}`,
              color: notification.type === "success" ? "#5a9e5a" : C.rose,
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px rgba(201,132,138,0.1)`,
              display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "280px", maxWidth: "380px"
            }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(90,158,90,0.15)" : C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px", fontFamily: font.body }}>{notification.type === "success" ? "Shipment Created!" : "Error"}</div>
                <div style={{ opacity: 0.8, fontSize: "0.76rem", fontFamily: font.body, lineHeight: 1.4 }}>{notification.message}</div>
              </div>
            </div>
          )}

          <div className="fade-up-al" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: font.body }}>Create</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", lineHeight: 1, margin: 0 }}>New Shipment</h1>
              <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>Fill in the details — required fields marked with *</div>
            </div>
            <button className="back-btn-l" onClick={() => navigate("/admin/shipments")}>← Back to Shipments</button>
          </div>

          <div className="fade-up-al-1" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", position: "relative", zIndex: 1 }}>

            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(201,132,138,0.07)" }}>
              <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
              <div style={{ padding: "2rem" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkLight, fontWeight: 700, fontFamily: font.body }}>Shipment Info</span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Supplier <span style={{ color: C.rose }}>*</span></label>
                  <input className="form-input-l" type="text" name="Supplier" placeholder="e.g. Juii Exports" value={formData.Supplier} onChange={handleChange} />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>
                    Assigned Customer
                    <span style={{ marginLeft: "8px", fontSize: "0.55rem", color: C.inkFaint, letterSpacing: "1px", textTransform: "none" }}>— Optional</span>
                  </label>
                  <select className="form-input-l" name="AssignedCustomer" value={formData.AssignedCustomer} onChange={handleChange}>
                    <option value="">No customer assigned</option>
                    {customers.map(c => (
                      <option key={c._id} value={c._id}>{c.Name} ({c.Email})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Origin <span style={{ color: C.rose }}>*</span></label>
                    <input className="form-input-l" type="text" name="Origin" placeholder="e.g. Kolkata" value={formData.Origin} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Destination <span style={{ color: C.rose }}>*</span></label>
                    <input className="form-input-l" type="text" name="Destination" placeholder="e.g. London" value={formData.Destination} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${C.border},transparent)`, margin: "1.5rem 0" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkLight, fontWeight: 700, fontFamily: font.body }}>Schedule & Status</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>ETA <span style={{ color: C.rose }}>*</span></label>
                    <input className="form-input-l" type="date" name="ETA" value={formData.ETA} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Status</label>
                    <select className="form-input-l" name="Status" value={formData.Status} onChange={handleChange}>
                      <option value="In Transit">In Transit</option>
                      <option value="On Time">On Time</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${C.border},transparent)`, margin: "1.5rem 0" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkLight, fontWeight: 700, fontFamily: font.body }}>Delay Info</span>
                  <span style={{ fontSize: "0.6rem", color: C.inkFaint, letterSpacing: "1px", fontFamily: font.body }}>— Optional</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Delay Reason</label>
                    <select className="form-input-l" name="DelayReason" value={formData.DelayReason} onChange={handleChange}>
                      <option value="">None</option>
                      {delayCodes.map(dc => (
                        <option key={dc._id} value={dc._id}>{dc.Code} — {dc.Reason}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "6px", display: "block", fontWeight: 600, fontFamily: font.body }}>Delay Duration (hrs)</label>
                    <input className="form-input-l" type="number" name="DelayDuration" placeholder="0" min="0" value={formData.DelayDuration} onChange={handleChange} />
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: `linear-gradient(145deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 20px rgba(201,132,138,0.1)" }}>
                <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.rose, animation: "pulseOrb 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkLight, fontWeight: 700, fontFamily: font.body }}>Live Preview</span>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  {[
                    { label: "Supplier", val: formData.Supplier },
                    { label: "Customer", val: selectedCustomerName },
                    { label: "Route", val: formData.Origin && formData.Destination ? `${formData.Origin} → ${formData.Destination}` : "" },
                    { label: "ETA", val: formData.ETA ? new Date(formData.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "" },
                    { label: "Status", val: formData.Status, color: statusColor(formData.Status) },
                    { label: "Delay Code", val: selectedDelayLabel },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 5 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body }}>{item.label}</span>
                      <span style={{ fontSize: "0.82rem", color: item.val ? (item.color || C.inkMid) : C.inkFaint, fontWeight: item.val ? 500 : 400, fontFamily: font.body }}>{item.val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={filled && !loading ? "submit-ready-l" : "submit-disabled-l"} onClick={handleSubmit} disabled={loading || !filled}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span className="spinner-l" /> Creating...
                  </span>
                ) : filled ? "Create Shipment →" : "Fill required fields first"}
              </button>

              <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "16px 18px", boxShadow: "0 2px 12px rgba(201,132,138,0.06)" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "12px", fontWeight: 700, fontFamily: font.body }}>Quick Tips</div>
                {[
                  "Shipment ID is auto-generated",
                  "Origin and Destination must be different cities",
                  "ETA must be a future date",
                  "If status is Delayed, add a delay reason",
                  "Delay info is optional for other statuses",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: i < 4 ? "10px" : "0" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: `linear-gradient(135deg,${C.rose},${C.gold})`, marginTop: "6px", flexShrink: 0 }} />
                    <div style={{ fontSize: "0.76rem", color: C.inkLight, lineHeight: 1.5, fontFamily: font.body }}>{tip}</div>
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