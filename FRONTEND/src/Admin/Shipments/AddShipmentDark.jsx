import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarDark from "../Components/AdminNavbarDark";
import AdminSidebarDark from "../Components/AdminSidebarDark";

const API = "http://localhost:5000/api/shipments";
const USERS_API = "http://localhost:5000/api/users";
const DELAYCODES_API = "http://localhost:5000/api/delaycodes";

export default function AddShipmentDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [delayCodes, setDelayCodes] = useState([]);
  const [formData, setFormData] = useState({
    Supplier: "", Origin: "", Destination: "",
    ETA: "", Status: "In Transit", DelayReason: "", DelayDuration: 0,
    AssignedCustomer: "",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.Supplier.trim() || !formData.Origin.trim() || !formData.Destination.trim() || !formData.ETA) {
      showNotification("error", "Please fill all required fields!");
      return;
    }
    if (formData.Supplier.trim().length < 2) {
      showNotification("error", "Supplier name must be at least 2 characters!");
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
      showNotification("error", "Delay duration seems too high — max 720hrs (30 days)!");
      return;
    }
    if (formData.Status === "Delayed" && !formData.DelayReason) {
      showNotification("error", "Please select a delay code for delayed shipments!");
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
        AssignedCustomer: formData.AssignedCustomer || null,
      };
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showNotification("success", `${data.data.ShipmentId} created successfully!`);
        setFormData({ Supplier: "", Origin: "", Destination: "", ETA: "", Status: "In Transit", DelayReason: "", DelayDuration: 0, AssignedCustomer: "" });
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

  const statusColor = (s) => {
    if (s === "On Time") return "#4ade80";
    if (s === "Delayed") return "#f87171";
    if (s === "Delivered") return "#60a5fa";
    return "#fbbf24";
  };

  const selectedCustomerName = customers.find(c => c._id === formData.AssignedCustomer)?.Name || "";
  const selectedDelayLabel = delayCodes.find(d => d._id === formData.DelayReason)?.Code || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 4px 24px rgba(230,50,50,0.25)} 50%{box-shadow:0 4px 40px rgba(230,50,50,0.45)} }

        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .slide-right { animation: slideRight 0.35s ease forwards; }

        .form-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; color: #e0d8d0;
          font-size: 0.88rem; font-family: 'Inter', sans-serif;
          box-sizing: border-box; transition: all 0.2s;
        }
        .form-input:focus {
          outline: none; border-color: rgba(230,50,50,0.5);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(230,50,50,0.07);
        }
        .form-input::placeholder { color: #3a2a25; }
        .form-input:not(:placeholder-shown) { border-color: rgba(230,50,50,0.2); }
        select.form-input option { background: #0f0d13; color: #e0d8d0; }

        .back-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.08);
          color: #7a6a60; padding: 10px 20px; border-radius: 8px;
          cursor: pointer; font-size: 0.78rem; font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .back-btn:hover { color: #e0d8d0; border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.03); }

        .submit-ready {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #e63232, #f0a030);
          border: none; border-radius: 10px; color: #fff;
          font-size: 0.88rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; cursor: pointer;
          font-family: 'Inter', sans-serif;
          animation: glowPulse 3s ease infinite;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .submit-ready:hover { transform: translateY(-2px); }
        .submit-ready::after {
          content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s;
        }
        .submit-ready:hover::after { left: 150%; }

        .submit-disabled {
          width: 100%; padding: 15px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; color: #3a2a25;
          font-size: 0.88rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; cursor: not-allowed;
          font-family: 'Inter', sans-serif;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.8s linear infinite; display: inline-block;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
      `}</style>

      <AdminNavbarDark toggleTheme={toggleTheme} pageTitle="ADD SHIPMENT" pageSubtitle="CREATE NEW" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.1), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.06), transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {notification && (
            <div className="slide-right" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
              padding: "1rem 1.4rem", borderRadius: "10px",
              background: notification.type === "success"
                ? "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.06))"
                : "linear-gradient(135deg, rgba(248,113,113,0.12), rgba(248,113,113,0.06))",
              border: `1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
              color: notification.type === "success" ? "#4ade80" : "#f87171",
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px ${notification.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)"}`,
              display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "280px", maxWidth: "380px"
            }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px" }}>{notification.type === "success" ? "Shipment Created!" : "Error"}</div>
                <div style={{ opacity: 0.8, fontSize: "0.76rem", lineHeight: 1.4 }}>{notification.message}</div>
              </div>
            </div>
          )}

          <div className="fade-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Create</span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0 }}>NEW SHIPMENT</h1>
              <div style={{ fontSize: "0.76rem", color: "#a89888", marginTop: "6px" }}>Fill in the details — required fields marked with *</div>
            </div>
            <button className="back-btn" onClick={() => navigate("/admin/shipments")}>← Back to Shipments</button>
          </div>

          <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", position: "relative", zIndex: 1 }}>

            <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(230,50,50,0.015))", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
              <div style={{ padding: "2rem" }}>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#a89888", fontWeight: 700 }}>Shipment Info</span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Supplier <span style={{ color: "#e63232" }}>*</span></label>
                  <input className="form-input" type="text" name="Supplier" placeholder="e.g. Arnab Logistics" value={formData.Supplier} onChange={handleChange} />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>
                    Assigned Customer
                    <span style={{ marginLeft: "8px", fontSize: "0.55rem", color: "#4a3a35", letterSpacing: "1px", textTransform: "none" }}>— Optional</span>
                  </label>
                  <select className="form-input" name="AssignedCustomer" value={formData.AssignedCustomer} onChange={handleChange}>
                    <option value="">No customer assigned</option>
                    {customers.map(c => (
                      <option key={c._id} value={c._id}>{c.Name} ({c.Email})</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Origin <span style={{ color: "#e63232" }}>*</span></label>
                    <input className="form-input" type="text" name="Origin" placeholder="e.g. Mumbai" value={formData.Origin} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Destination <span style={{ color: "#e63232" }}>*</span></label>
                    <input className="form-input" type="text" name="Destination" placeholder="e.g. Dubai" value={formData.Destination} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", margin: "1.5rem 0" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#a89888", fontWeight: 700 }}>Schedule & Status</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>ETA <span style={{ color: "#e63232" }}>*</span></label>
                    <input className="form-input" type="date" name="ETA" value={formData.ETA} onChange={handleChange} style={{ colorScheme: "dark" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Status</label>
                    <select className="form-input" name="Status" value={formData.Status} onChange={handleChange}>
                      <option value="In Transit">In Transit</option>
                      <option value="On Time">On Time</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)", margin: "1.5rem 0" }} />

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                  <div style={{ width: "3px", height: "16px", background: "linear-gradient(to bottom,#f87171,#fbbf24)", borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#a89888", fontWeight: 700 }}>Delay Info</span>
                  <span style={{ fontSize: "0.6rem", color: "#4a3a35", letterSpacing: "1px" }}>— Optional</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Delay Code</label>
                    <select className="form-input" name="DelayReason" value={formData.DelayReason} onChange={handleChange}>
                      <option value="">None</option>
                      {delayCodes.map(dc => (
                        <option key={dc._id} value={dc._id}>{dc.Code} — {dc.Reason}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: "#8a7a70", marginBottom: "6px", display: "block", fontWeight: 600 }}>Delay Duration (hrs)</label>
                    <input className="form-input" type="number" name="DelayDuration" placeholder="0" min="0" value={formData.DelayDuration} onChange={handleChange} />
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ background: "linear-gradient(145deg, rgba(230,50,50,0.05), rgba(240,160,48,0.02))", border: "1px solid rgba(230,50,50,0.15)", borderRadius: "14px", overflow: "hidden" }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e63232", animation: "pulseOrb 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.62rem", letterSpacing: "3px", textTransform: "uppercase", color: "#a89888", fontWeight: 700 }}>Live Preview</span>
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
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a4a45" }}>{item.label}</span>
                      <span style={{ fontSize: "0.82rem", color: item.val ? (item.color || "#d4c4b8") : "#3a2a25", fontWeight: item.val ? 500 : 400 }}>{item.val || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={filled && !loading ? "submit-ready" : "submit-disabled"} onClick={handleSubmit} disabled={loading || !filled}>
                {loading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                    <span className="spinner" /> Creating...
                  </span>
                ) : filled ? "Create Shipment →" : "Fill required fields first"}
              </button>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "14px", padding: "16px 18px" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "12px", fontWeight: 700 }}>Quick Tips</div>
                {[
                  "Shipment ID is auto-generated",
                  "Origin and Destination must be different cities",
                  "ETA must be a future date",
                  "If status is Delayed, add a delay code",
                  "Assigning a customer lets them track this shipment",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: i < 4 ? "10px" : "0" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "linear-gradient(135deg,#e63232,#f0a030)", marginTop: "6px", flexShrink: 0 }} />
                    <div style={{ fontSize: "0.76rem", color: "#7a6a60", lineHeight: 1.5 }}>{tip}</div>
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