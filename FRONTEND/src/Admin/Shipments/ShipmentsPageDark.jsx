import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarDark from "../Components/AdminNavbarDark";
import AdminSidebarDark from "../Components/AdminSidebarDark";

const API = "http://localhost:5000/api/shipments";
const USERS_API = "http://localhost:5000/api/users";
const DELAYCODES_API = "http://localhost:5000/api/delaycodes";
const STATUSES = ["All", "In Transit", "On Time", "Delayed", "Delivered"];

export default function ShipmentsPageDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
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

  useEffect(() => { fetchShipments(); }, [search, statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      let url = `${API}?`;
      if (search) url += `search=${search}&`;
      if (statusFilter !== "All") url += `Status=${statusFilter}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setShipments(data.data);
    } catch (err) {
      showNotification("error", "Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...editData,
        AssignedCustomer: editData.AssignedCustomer?._id || editData.AssignedCustomer || null,
        DelayReason: editData.DelayReason?._id || editData.DelayReason || null,
      };
      const res = await fetch(`${API}/${selectedShipment.ShipmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        await fetchShipments();
        // re-fetch the updated shipment so modal shows fresh populated data
        const fresh = await fetch(`${API}/${selectedShipment.ShipmentId}`, { credentials: "include" });
        const freshData = await fresh.json();
        if (freshData.success) setSelectedShipment(freshData.data);
        setIsEditing(false);
        showNotification("success", "Shipment updated successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to update shipment");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/${selectedShipment.ShipmentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSelectedShipment(null);
        setShowDeleteConfirm(false);
        fetchShipments();
        showNotification("success", "Shipment deleted successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to delete shipment");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const statusConfig = (status) => {
    switch (status) {
      case "On Time":   return { color: "#4ade80", border: "rgba(74,222,128,0.25)",  bg: "rgba(74,222,128,0.08)",  glow: "rgba(74,222,128,0.15)" };
      case "Delayed":   return { color: "#f87171", border: "rgba(248,113,113,0.25)", bg: "rgba(248,113,113,0.08)", glow: "rgba(248,113,113,0.15)" };
      case "Delivered": return { color: "#60a5fa", border: "rgba(96,165,250,0.25)",  bg: "rgba(96,165,250,0.08)",  glow: "rgba(96,165,250,0.15)" };
      default:          return { color: "#fbbf24", border: "rgba(251,191,36,0.25)",  bg: "rgba(251,191,36,0.08)",  glow: "rgba(251,191,36,0.15)" };
    }
  };

  // helper to get display label for a delay reason (works whether it's populated object or null)
  const delayLabel = (dr) => {
    if (!dr) return null;
    if (typeof dr === "object") return dr.Code;
    return dr;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
        .slide-right { animation: slideRight 0.35s ease forwards; }
        .slide-up-modal { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .row-item { transition: background 0.2s, padding-left 0.2s; cursor: pointer; position: relative; overflow: hidden; }
        .row-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: linear-gradient(to bottom, #e63232, #f0a030); transition: width 0.25s; border-radius: 0 2px 2px 0; }
        .row-item:hover::before { width: 3px; }
        .row-item:hover { background: rgba(230,50,50,0.04) !important; padding-left: 24px !important; }
        .row-item:hover .cell-dim { color: #c8b8b0 !important; }
        .row-item:hover .cell-main { color: #ffffff !important; }

        .action-btn { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn:hover { transform: translateY(-2px); }
        .add-btn { transition: all 0.25s; }
        .add-btn:hover { transform: translateY(-2px); background: rgba(230,50,50,0.08) !important; border-color: rgba(230,50,50,0.7) !important; box-shadow: 0 0 24px rgba(230,50,50,0.15) !important; }
        .filter-pill { transition: all 0.2s; cursor: pointer; }
        .filter-pill:hover { color: #c8b8b0 !important; }

        input:focus, select:focus { outline: none !important; }
        input::placeholder { color: #3a3030; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
        .spinner { width: 28px; height: 28px; border: 2px solid rgba(230,50,50,0.15); border-top-color: #e63232; border-radius: 50%; animation: spin 0.8s linear infinite; }
      `}</style>

      <AdminNavbarDark toggleTheme={toggleTheme} pageTitle="SHIPMENTS" pageSubtitle="MANAGE & TRACK" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.1), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.06), transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", top: "40%", left: "35%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.03), transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

          {notification && (
            <div className="slide-right" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
              padding: "1rem 1.4rem", borderRadius: "10px",
              background: notification.type === "success" ? "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.06))" : "linear-gradient(135deg, rgba(248,113,113,0.12), rgba(248,113,113,0.06))",
              border: `1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
              color: notification.type === "success" ? "#4ade80" : "#f87171",
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px ${notification.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)"}`,
              display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "260px"
            }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px" }}>{notification.type === "success" ? "Success" : "Error"}</div>
                <div style={{ opacity: 0.8, fontSize: "0.76rem" }}>{notification.message}</div>
              </div>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="fade-up" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030)", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Manage</span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg, #ffffff 0%, #e0c8c0 50%, #f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0 }}>ALL SHIPMENTS</h1>
              <div style={{ fontSize: "0.76rem", color: "#a89888", marginTop: "6px" }}>
                {loading ? "Fetching data..." : `${shipments.length} shipment${shipments.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>
            <button className="add-btn" onClick={() => navigate("/admin/add-shipment")} style={{ background: "transparent", color: "#e63232", border: "1px solid rgba(230,50,50,0.4)", padding: "12px 28px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 0 16px rgba(230,50,50,0.08)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>+</span> Add Shipment
            </button>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="fade-up-1" style={{ display: "flex", gap: "12px", marginBottom: "16px", position: "relative", zIndex: 1 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0d8d0" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search by ID, supplier, origin, destination..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#e0d8d0", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", boxSizing: "border-box", transition: "all 0.25s" }}
                onFocus={e => { e.target.style.borderColor = "rgba(230,50,50,0.4)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "0 0 0 4px rgba(230,50,50,0.06)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px", borderRadius: "10px" }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill" style={{ padding: "6px 14px", borderRadius: "7px", fontSize: "0.73rem", fontWeight: 500, fontFamily: "'Inter', sans-serif", background: statusFilter === s ? "linear-gradient(135deg, rgba(230,50,50,0.18), rgba(240,160,48,0.1))" : "transparent", border: statusFilter === s ? "1px solid rgba(230,50,50,0.35)" : "1px solid transparent", color: statusFilter === s ? "#f0a030" : "#7a6a60" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="fade-up-2" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(230,50,50,0.015))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", position: "relative", zIndex: 1 }}>
            <div style={{ height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030, #e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite" }} />

            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1.2fr 130px 130px 140px 70px", padding: "12px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["Shipment ID", "Supplier", "Customer", "Route", "ETA", "Status", "Delay Code", "Delay"].map(h => (
                <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700 }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div className="spinner" />
                <div style={{ color: "#7a6a60", fontSize: "0.82rem" }}>Fetching shipments...</div>
              </div>
            ) : shipments.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                <div style={{ color: "#a89888", fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px" }}>No shipments found</div>
                <div style={{ color: "#6a5a50", fontSize: "0.76rem" }}>Try adjusting your search or add a new shipment</div>
              </div>
            ) : (
              shipments.map((s, i) => {
                const sc = statusConfig(s.Status);
                const isHov = hoveredRow === i;
                const customerName = s.AssignedCustomer?.Name || "—";
                const drLabel = delayLabel(s.DelayReason);
                return (
                  <div key={i} className="row-item"
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => { setSelectedShipment(s); setEditData({ ...s }); setIsEditing(false); setShowDeleteConfirm(false); }}
                    style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1.2fr 130px 130px 140px 70px", padding: "14px 20px", alignItems: "center", borderBottom: i < shipments.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0 }}
                  >
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "1.5px", background: "linear-gradient(135deg, #f0a030, #e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.ShipmentId}</div>
                    <div className="cell-main" style={{ fontSize: "0.84rem", color: "#d4c4b8", fontWeight: 500, transition: "color 0.15s" }}>{s.Supplier}</div>
                    <div style={{ fontSize: "0.82rem", color: s.AssignedCustomer ? "#a78bfa" : "#4a3a35", fontWeight: s.AssignedCustomer ? 500 : 400 }}>{customerName}</div>
                    <div style={{ fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="cell-dim" style={{ color: "#b0a098", transition: "color 0.15s" }}>{s.Origin}</span>
                      <span style={{ color: "#e63232", fontSize: "0.75rem", fontWeight: 700 }}>→</span>
                      <span className="cell-dim" style={{ color: "#b0a098", transition: "color 0.15s" }}>{s.Destination}</span>
                    </div>
                    <div className="cell-dim" style={{ fontSize: "0.84rem", color: "#b0a098", transition: "color 0.15s" }}>{new Date(s.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div>
                      <span style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", boxShadow: isHov ? `0 0 12px ${sc.glow}` : "none", transition: "box-shadow 0.2s" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: s.Status === "In Transit" ? "pulse 2s infinite" : "none" }} />
                        {s.Status}
                      </span>
                    </div>
                    {/* DELAY CODE CELL — shows Code like "PRT-002" */}
                    <div style={{ fontSize: "0.78rem", color: drLabel ? "#f87171" : "#4a3a35", fontWeight: drLabel ? 600 : 400, letterSpacing: drLabel ? "0.5px" : 0 }}>
                      {drLabel || "—"}
                    </div>
                    <div style={{ fontSize: "0.84rem", fontWeight: s.DelayDuration > 0 ? 700 : 400, color: s.DelayDuration > 0 ? "#f87171" : "#4a3a35" }}>{s.DelayDuration > 0 ? `+${s.DelayDuration}h` : "—"}</div>
                  </div>
                );
              })
            )}

            {!loading && shipments.length > 0 && (
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(240,160,48,0.3), transparent)" }} />
            )}
          </div>

          {/* DETAIL MODAL */}
          {selectedShipment && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
              onClick={e => { if (e.target === e.currentTarget) { setSelectedShipment(null); setIsEditing(false); setShowDeleteConfirm(false); } }}>
              <div className="slide-up-modal" style={{ background: "linear-gradient(145deg, #0f0d13, #0a0810)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", width: "620px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,50,50,0.08)" }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030, #e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite", borderRadius: "16px 16px 0 0" }} />

                {/* Modal Header */}
                <div style={{ padding: "1.6rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "4px", fontWeight: 600 }}>Shipment Details</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #fff, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px" }}>{selectedShipment.ShipmentId}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {(() => { const sc = statusConfig(selectedShipment.Status); return (
                      <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", boxShadow: `0 0 16px ${sc.glow}` }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color }} />{selectedShipment.Status}
                      </span>
                    ); })()}
                    <button onClick={() => { setSelectedShipment(null); setIsEditing(false); setShowDeleteConfirm(false); }}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#7a6a60", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7a6a60"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >✕</button>
                  </div>
                </div>

                <div style={{ padding: "2rem" }}>
                  {showDeleteConfirm ? (
                    <div style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.07), rgba(248,113,113,0.03))", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", padding: "2.5rem", textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                      <div style={{ fontSize: "1rem", color: "#e0d8d0", marginBottom: "6px", fontWeight: 600 }}>Delete {selectedShipment.ShipmentId}?</div>
                      <div style={{ fontSize: "0.82rem", color: "#7a6a60", marginBottom: "2rem" }}>This action is permanent and cannot be undone.</div>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={() => setShowDeleteConfirm(false)} className="action-btn"
                          style={{ padding: "10px 28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a89888", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#e0d8d0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#a89888"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        >Cancel</button>
                        <button onClick={handleDelete} className="action-btn"
                          style={{ padding: "10px 28px", background: "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.1))", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}
                          onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(248,113,113,0.3), rgba(248,113,113,0.15))"}
                          onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(248,113,113,0.1))"}
                        >Yes, Delete</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                        {[
                          { label: "Supplier", key: "Supplier", type: "text", full: true },
                          { label: "Origin", key: "Origin", type: "text" },
                          { label: "Destination", key: "Destination", type: "text" },
                          { label: "ETA", key: "ETA", type: "date" },
                          { label: "Status", key: "Status", type: "select", options: ["In Transit", "On Time", "Delayed", "Delivered"] },
                          { label: "Delay Duration (hrs)", key: "DelayDuration", type: "number" },
                        ].map(field => (
                          <div key={field.key} style={{ gridColumn: field.full ? "1/3" : "auto" }}>
                            <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "6px", fontWeight: 600 }}>{field.label}</div>
                            {isEditing ? (
                              field.type === "select" ? (
                                <select value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", boxSizing: "border-box" }}>
                                  {field.options.map(o => <option key={o} value={o} style={{ background: "#0f0d13" }}>{o || "None"}</option>)}
                                </select>
                              ) : (
                                <input type={field.type} value={field.type === "date" ? editData[field.key]?.slice(0, 10) : editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", boxSizing: "border-box", colorScheme: "dark" }} />
                              )
                            ) : (
                              <div style={{ fontSize: "0.9rem", color: "#d4c4b8", padding: "8px 12px", background: "rgba(255,255,255,0.025)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                {field.key === "ETA"
                                  ? new Date(selectedShipment[field.key]).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                                  : selectedShipment[field.key] ?? "—"}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* DELAY REASON — dropdown fetching from delaycodes */}
                        <div style={{ gridColumn: "1/3" }}>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "6px", fontWeight: 600 }}>Delay Code</div>
                          {isEditing ? (
                            <select
                              value={editData.DelayReason?._id || editData.DelayReason || ""}
                              onChange={e => setEditData({ ...editData, DelayReason: e.target.value || null })}
                              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", boxSizing: "border-box" }}
                            >
                              <option value="" style={{ background: "#0f0d13" }}>None</option>
                              {delayCodes.map(dc => (
                                <option key={dc._id} value={dc._id} style={{ background: "#0f0d13" }}>{dc.Code} — {dc.Reason}</option>
                              ))}
                            </select>
                          ) : (
                            selectedShipment.DelayReason ? (
                              <div style={{ padding: "10px 12px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px" }}>Code</div>
                                  <div style={{ fontSize: "0.88rem", color: "#f87171", fontWeight: 700 }}>{selectedShipment.DelayReason.Code}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px" }}>Category</div>
                                  <div style={{ fontSize: "0.88rem", color: "#d4c4b8" }}>{selectedShipment.DelayReason.Category}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px" }}>Reason</div>
                                  <div style={{ fontSize: "0.88rem", color: "#d4c4b8" }}>{selectedShipment.DelayReason.Reason}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px" }}>Severity</div>
                                  <div style={{ fontSize: "0.88rem", color: selectedShipment.DelayReason.Severity === "High" ? "#f87171" : selectedShipment.DelayReason.Severity === "Medium" ? "#fbbf24" : "#4ade80", fontWeight: 600 }}>{selectedShipment.DelayReason.Severity}</div>
                                </div>
                                <div style={{ gridColumn: "1/3" }}>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px" }}>Avg Delay</div>
                                  <div style={{ fontSize: "0.88rem", color: "#d4c4b8" }}>{selectedShipment.DelayReason.AverageDelayHours} hrs</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: "0.9rem", color: "#4a3a35", padding: "8px 12px", background: "rgba(255,255,255,0.025)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>—</div>
                            )
                          )}
                        </div>

                        {/* ASSIGNED CUSTOMER */}
                        <div style={{ gridColumn: "1/3" }}>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "6px", fontWeight: 600 }}>Assigned Customer</div>
                          {isEditing ? (
                            <select
                              value={editData.AssignedCustomer?._id || editData.AssignedCustomer || ""}
                              onChange={e => setEditData({ ...editData, AssignedCustomer: e.target.value })}
                              style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", boxSizing: "border-box" }}
                            >
                              <option value="" style={{ background: "#0f0d13" }}>No customer assigned</option>
                              {customers.map(c => (
                                <option key={c._id} value={c._id} style={{ background: "#0f0d13" }}>{c.Name} ({c.Email})</option>
                              ))}
                            </select>
                          ) : (
                            <div style={{ fontSize: "0.9rem", padding: "8px 12px", background: "rgba(255,255,255,0.025)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)", color: selectedShipment.AssignedCustomer ? "#a78bfa" : "#4a3a35" }}>
                              {selectedShipment.AssignedCustomer
                                ? `${selectedShipment.AssignedCustomer.Name} (${selectedShipment.AssignedCustomer.Email})`
                                : "—"}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(255,255,255,0.04)" }}>
                        {[{ label: "Created", val: selectedShipment.createdAt }, { label: "Last Updated", val: selectedShipment.updatedAt }].map((t, i) => (
                          <div key={i}>
                            <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "4px", fontWeight: 600 }}>{t.label}</div>
                            <div style={{ fontSize: "0.78rem", color: "#8a7a70" }}>{new Date(t.val).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(false)} className="action-btn"
                              style={{ padding: "10px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a89888", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#e0d8d0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#a89888"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                            >Cancel</button>
                            <button onClick={handleUpdate} className="action-btn"
                              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #e63232, #f0a030)", border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, boxShadow: "0 4px 20px rgba(230,50,50,0.25)" }}>Save Changes</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setShowDeleteConfirm(true)} className="action-btn"
                              style={{ padding: "10px 20px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.15)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.07)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"; }}
                            >Delete</button>
                            <button onClick={() => setIsEditing(true)} className="action-btn"
                              style={{ padding: "10px 24px", background: "linear-gradient(135deg, #e63232, #f0a030)", border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, boxShadow: "0 4px 20px rgba(230,50,50,0.25)" }}>Edit Shipment</button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}