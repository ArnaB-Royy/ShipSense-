import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarLight from "../Components/AdminNavbarLight";
import AdminSidebarLight from "../Components/AdminSidebarLight";

const API = "http://localhost:5000/api/shipments";
const USERS_API = "http://localhost:5000/api/users";
const DELAYCODES_API = "http://localhost:5000/api/delaycodes";
const STATUSES = ["All", "In Transit", "On Time", "Delayed", "Delivered"];

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a", sage: "#8a9e7a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = { heading: "'Cormorant Garamond', serif", cursive: "'Dancing Script', cursive", body: "'DM Sans', sans-serif" };

export default function ShipmentsPageLight({ toggleTheme }) {
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
      const res = await fetch(`${API}/${selectedShipment.ShipmentId}`, { method: "DELETE", credentials: "include" });
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

  const delayLabel = (dr) => {
    if (!dr) return null;
    if (typeof dr === "object") return dr.Code;
    return dr;
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const statusConfig = (status) => {
    switch (status) {
      case "On Time":   return { color: "#5a9e5a", border: "rgba(90,158,90,0.3)", bg: "rgba(90,158,90,0.08)", glow: "rgba(90,158,90,0.15)" };
      case "Delayed":   return { color: C.rose, border: C.borderRose, bg: C.roseLight, glow: "rgba(201,132,138,0.2)" };
      case "Delivered": return { color: C.gold, border: "rgba(196,163,90,0.3)", bg: C.goldLight, glow: "rgba(196,163,90,0.15)" };
      default:          return { color: C.inkMid, border: "rgba(107,87,68,0.3)", bg: "rgba(107,87,68,0.08)", glow: "rgba(107,87,68,0.1)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');

        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fade-up-l { animation: fadeUp 0.5s ease forwards; }
        .fade-up-l-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .fade-up-l-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
        .slide-right-l { animation: slideRight 0.35s ease forwards; }
        .slide-up-modal-l { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .row-item-l {
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .row-item-l::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0;
          width: 0;
          background: linear-gradient(to bottom, ${C.rose}, ${C.gold});
          transition: width 0.25s; border-radius: 0 2px 2px 0;
        }
        .row-item-l:hover::before { width: 3px; }
        .row-item-l:hover { background: rgba(201,132,138,0.05) !important; padding-left: 24px !important; }
        .row-item-l:hover .cell-dim-l { color: ${C.inkMid} !important; }
        .row-item-l:hover .cell-main-l { color: ${C.ink} !important; }

        .action-btn-l { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-l:hover { transform: translateY(-2px); }

        .add-btn-l { transition: all 0.25s; }
        .add-btn-l:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,132,138,0.3) !important; }

        .filter-pill-l { transition: all 0.2s; cursor: pointer; }
        .filter-pill-l:hover { color: ${C.inkMid} !important; }

        input:focus, select:focus { outline: none !important; }
        input::placeholder { color: ${C.inkFaint}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }

        .spinner-l {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,132,138,0.2);
          border-top-color: ${C.rose};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <AdminNavbarLight toggleTheme={toggleTheme} pageTitle="Shipments" pageSubtitle="Manage & Track" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative" }}>

          {/* AMBIENT ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.12), transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.08), transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* NOTIFICATION */}
          {notification && (
            <div className="slide-right-l" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
              padding: "1rem 1.4rem", borderRadius: "10px",
              background: notification.type === "success"
                ? "linear-gradient(135deg, rgba(90,158,90,0.12), rgba(90,158,90,0.06))"
                : `linear-gradient(135deg, ${C.roseLight}, rgba(201,132,138,0.06))`,
              border: `1px solid ${notification.type === "success" ? "rgba(90,158,90,0.3)" : C.borderRose}`,
              color: notification.type === "success" ? "#5a9e5a" : C.rose,
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px ${notification.type === "success" ? "rgba(90,158,90,0.1)" : "rgba(201,132,138,0.1)"}`,
              display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "260px"
            }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(90,158,90,0.15)" : C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px", fontFamily: font.body }}>{notification.type === "success" ? "Success" : "Error"}</div>
                <div style={{ opacity: 0.8, fontSize: "0.76rem", fontFamily: font.body }}>{notification.message}</div>
              </div>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="fade-up-l" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: font.body }}>Manage</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", lineHeight: 1, margin: 0 }}>All Shipments</h1>
              <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
                {loading ? "Fetching data..." : `${shipments.length} shipment${shipments.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>
            <button className="add-btn-l" onClick={() => navigate("/admin/add-shipment")} style={{
              background: "transparent", color: C.rose,
              border: `1px solid rgba(201,132,138,0.4)`,
              padding: "12px 28px", borderRadius: "8px",
              fontSize: "0.82rem", fontWeight: 700,
              letterSpacing: "1.5px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: font.body,
              boxShadow: "0 0 16px rgba(201,132,138,0.08)",
              display: "flex", alignItems: "center", gap: "8px"
            }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>+</span>
              Add Shipment
            </button>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="fade-up-l-1" style={{ display: "flex", gap: "12px", marginBottom: "16px", position: "relative", zIndex: 1 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkMid} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search by ID, supplier, origin, destination..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", padding: "12px 16px 12px 42px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.ink, fontSize: "0.85rem", fontFamily: font.body, boxSizing: "border-box", transition: "all 0.25s" }}
                onFocus={e => { e.target.style.borderColor = C.borderRose; e.target.style.boxShadow = `0 0 0 4px rgba(201,132,138,0.08)`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "flex", gap: "4px", background: C.bgDeep, border: `1px solid ${C.border}`, padding: "4px", borderRadius: "10px" }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill-l" style={{
                  padding: "6px 14px", borderRadius: "7px", fontSize: "0.73rem", fontWeight: 500,
                  fontFamily: font.body,
                  background: statusFilter === s ? `linear-gradient(135deg, ${C.roseLight}, ${C.goldLight})` : "transparent",
                  border: statusFilter === s ? `1px solid ${C.borderRose}` : "1px solid transparent",
                  color: statusFilter === s ? C.rose : C.inkLight
                }}>{s}</button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="fade-up-l-2" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", position: "relative", zIndex: 1, boxShadow: "0 4px 24px rgba(201,132,138,0.07)" }}>
            <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />

            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1.2fr 130px 130px 140px 70px", padding: "12px 20px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
              {["Shipment ID", "Supplier", "Customer", "Route", "ETA", "Status", "Delay Code", "Delay"].map(h => (
                <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 700 }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div className="spinner-l" />
                <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Fetching shipments...</div>
              </div>
            ) : shipments.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                <div style={{ color: C.inkMid, fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px", fontFamily: font.body }}>No shipments found</div>
                <div style={{ color: C.inkLight, fontSize: "0.76rem", fontFamily: font.body }}>Try adjusting your search or add a new shipment</div>
              </div>
            ) : (
              shipments.map((s, i) => {
                const sc = statusConfig(s.Status);
                const isHov = hoveredRow === i;
                return (
                  <div key={i} className="row-item-l"
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => { setSelectedShipment(s); setEditData({ ...s }); setIsEditing(false); setShowDeleteConfirm(false); }}
                    style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1.2fr 130px 130px 140px 70px", padding: "14px 20px", alignItems: "center", borderBottom: i < shipments.length - 1 ? `1px solid ${C.border}` : "none", animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0 }}
                  >
                    <div style={{ fontFamily: font.heading, fontSize: "1rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.ShipmentId}</div>
                    <div className="cell-main-l" style={{ fontSize: "0.84rem", color: C.inkMid, fontFamily: font.body, transition: "color 0.15s", fontWeight: 500 }}>{s.Supplier}</div>
                    <div style={{ fontSize: "0.82rem", color: s.AssignedCustomer ? "#8b7cf8" : C.inkFaint, fontFamily: font.body, fontWeight: s.AssignedCustomer ? 500 : 400 }}>{s.AssignedCustomer?.Name || "—"}</div>
                    <div style={{ fontSize: "0.84rem", fontFamily: font.body, display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="cell-dim-l" style={{ color: C.inkLight, transition: "color 0.15s" }}>{s.Origin}</span>
                      <span style={{ color: C.rose, fontSize: "0.75rem", fontWeight: 700 }}>→</span>
                      <span className="cell-dim-l" style={{ color: C.inkLight, transition: "color 0.15s" }}>{s.Destination}</span>
                    </div>
                    <div className="cell-dim-l" style={{ fontSize: "0.84rem", color: C.inkLight, fontFamily: font.body, transition: "color 0.15s" }}>{new Date(s.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div>
                      <span style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", boxShadow: isHov ? `0 0 12px ${sc.glow}` : "none", transition: "box-shadow 0.2s" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: s.Status === "In Transit" ? "pulse 2s infinite" : "none" }} />
                        {s.Status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: delayLabel(s.DelayReason) ? C.rose : C.inkFaint, fontFamily: font.body, fontWeight: delayLabel(s.DelayReason) ? 600 : 400 }}>{delayLabel(s.DelayReason) || "—"}</div>
                    <div style={{ fontSize: "0.84rem", fontFamily: font.body, fontWeight: s.DelayDuration > 0 ? 700 : 400, color: s.DelayDuration > 0 ? C.rose : C.inkFaint }}>{s.DelayDuration > 0 ? `+${s.DelayDuration}h` : "—"}</div>
                  </div>
                );
              })
            )}
            {!loading && shipments.length > 0 && (
              <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(196,163,90,0.3),transparent)` }} />
            )}
          </div>

          {/* DETAIL CARD OVERLAY */}
          {selectedShipment && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(46,34,24,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
              onClick={e => { if (e.target === e.currentTarget) { setSelectedShipment(null); setIsEditing(false); setShowDeleteConfirm(false); } }}
            >
              <div className="slide-up-modal-l" style={{ background: C.bgCard, border: `1px solid ${C.borderRose}`, borderRadius: "16px", width: "560px", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 100px rgba(46,34,24,0.2)" }}>
                <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite", borderRadius: "16px 16px 0 0" }} />

                {/* Header */}
                <div style={{ padding: "1.6rem 2rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>Shipment Details</div>
                    <div style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px" }}>{selectedShipment.ShipmentId}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {(() => { const sc = statusConfig(selectedShipment.Status); return (
                      <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color }} />{selectedShipment.Status}
                      </span>
                    ); })()}
                    <button onClick={() => { setSelectedShipment(null); setIsEditing(false); setShowDeleteConfirm(false); }}
                      style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkLight, width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = C.borderRose; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.bgDeep; e.currentTarget.style.color = C.inkLight; e.currentTarget.style.borderColor = C.border; }}
                    >✕</button>
                  </div>
                </div>

                <div style={{ padding: "2rem" }}>
                  {showDeleteConfirm ? (
                    <div style={{ background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "12px", padding: "2.5rem", textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                      <div style={{ fontSize: "1rem", color: C.ink, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>Delete {selectedShipment.ShipmentId}?</div>
                      <div style={{ fontSize: "0.82rem", color: C.inkMid, marginBottom: "2rem", fontFamily: font.body }}>This action is permanent and cannot be undone.</div>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={() => setShowDeleteConfirm(false)} className="action-btn-l" style={{ padding: "10px 28px", background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkMid, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                          onMouseEnter={e => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderColor = C.borderRose; }}
                          onMouseLeave={e => { e.currentTarget.style.color = C.inkMid; e.currentTarget.style.borderColor = C.border; }}
                        >Cancel</button>
                        <button onClick={handleDelete} className="action-btn-l" style={{ padding: "10px 28px", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,132,138,0.25)"}
                          onMouseLeave={e => e.currentTarget.style.background = C.roseLight}
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
                            <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>{field.label}</div>
                            {isEditing ? (
                              field.type === "select" ? (
                                <select value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }}>
                                  {field.options.map(o => <option key={o} value={o} style={{ background: C.bgCard }}>{o || "None"}</option>)}
                                </select>
                              ) : (
                                <input type={field.type} value={field.type === "date" ? editData[field.key]?.slice(0, 10) : editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })} style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }} />
                              )
                            ) : (
                              <div style={{ fontSize: "0.9rem", color: C.inkMid, fontFamily: font.body, padding: "8px 12px", background: C.bgDeep, borderRadius: "6px", border: `1px solid ${C.border}` }}>
                                {field.key === "ETA" ? new Date(selectedShipment[field.key]).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : selectedShipment[field.key] || "—"}
                              </div>
                            )}
                          </div>
                        ))}
                      

                      {/* DELAY CODE */}
                        <div style={{ gridColumn: "1/3" }}>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>Delay Code</div>
                          {isEditing ? (
                            <select
                              value={editData.DelayReason?._id || editData.DelayReason || ""}
                              onChange={e => setEditData({ ...editData, DelayReason: e.target.value || null })}
                              style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }}
                            >
                              <option value="">None</option>
                              {delayCodes.map(dc => (
                                <option key={dc._id} value={dc._id}>{dc.Code} — {dc.Reason}</option>
                              ))}
                            </select>
                          ) : (
                            selectedShipment.DelayReason ? (
                              <div style={{ padding: "10px 12px", background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "3px", fontFamily: font.body }}>Code</div>
                                  <div style={{ fontSize: "0.88rem", color: C.rose, fontWeight: 700, fontFamily: font.body }}>{selectedShipment.DelayReason.Code}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "3px", fontFamily: font.body }}>Category</div>
                                  <div style={{ fontSize: "0.88rem", color: C.inkMid, fontFamily: font.body }}>{selectedShipment.DelayReason.Category}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "3px", fontFamily: font.body }}>Reason</div>
                                  <div style={{ fontSize: "0.88rem", color: C.inkMid, fontFamily: font.body }}>{selectedShipment.DelayReason.Reason}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "3px", fontFamily: font.body }}>Severity</div>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 600, fontFamily: font.body, color: selectedShipment.DelayReason.Severity === "High" ? C.rose : selectedShipment.DelayReason.Severity === "Medium" ? C.gold : "#5a9e5a" }}>{selectedShipment.DelayReason.Severity}</div>
                                </div>
                                <div style={{ gridColumn: "1/3" }}>
                                  <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "3px", fontFamily: font.body }}>Avg Delay</div>
                                  <div style={{ fontSize: "0.88rem", color: C.inkMid, fontFamily: font.body }}>{selectedShipment.DelayReason.AverageDelayHours} hrs</div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: "0.9rem", color: C.inkFaint, fontFamily: font.body, padding: "8px 12px", background: C.bgDeep, borderRadius: "6px", border: `1px solid ${C.border}` }}>—</div>
                            )
                          )}
                        </div>

                        {/* ASSIGNED CUSTOMER */}
                        <div style={{ gridColumn: "1/3" }}>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>Assigned Customer</div>
                          {isEditing ? (
                            <select
                              value={editData.AssignedCustomer?._id || editData.AssignedCustomer || ""}
                              onChange={e => setEditData({ ...editData, AssignedCustomer: e.target.value })}
                              style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }}
                            >
                              <option value="">No customer assigned</option>
                              {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.Name} ({c.Email})</option>
                              ))}
                            </select>
                          ) : (
                            <div style={{ fontSize: "0.9rem", fontFamily: font.body, padding: "8px 12px", background: C.bgDeep, borderRadius: "6px", border: `1px solid ${C.border}`, color: selectedShipment.AssignedCustomer ? "#8b7cf8" : C.inkFaint }}>
                              {selectedShipment.AssignedCustomer ? `${selectedShipment.AssignedCustomer.Name} (${selectedShipment.AssignedCustomer.Email})` : "—"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 1.2rem", background: C.bgDeep, borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${C.border}` }}>
                        {[{ label: "Created", val: selectedShipment.createdAt }, { label: "Last Updated", val: selectedShipment.updatedAt }].map((t, i) => (
                          <div key={i}>
                            <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>{t.label}</div>
                            <div style={{ fontSize: "0.78rem", color: C.inkLight, fontFamily: font.body }}>{new Date(t.val).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(false)} className="action-btn-l" style={{ padding: "10px 20px", background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkMid, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                              onMouseEnter={e => { e.currentTarget.style.color = C.ink; }}
                              onMouseLeave={e => { e.currentTarget.style.color = C.inkMid; }}
                            >Cancel</button>
                            <button onClick={handleUpdate} className="action-btn-l" style={{ padding: "10px 24px", background: `linear-gradient(135deg,${C.rose},${C.gold})`, border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body, boxShadow: `0 4px 20px rgba(201,132,138,0.25)` }}>Save Changes</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setShowDeleteConfirm(true)} className="action-btn-l" style={{ padding: "10px 20px", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,132,138,0.25)"}
                              onMouseLeave={e => e.currentTarget.style.background = C.roseLight}
                            >Delete</button>
                            <button onClick={() => setIsEditing(true)} className="action-btn-l" style={{ padding: "10px 24px", background: `linear-gradient(135deg,${C.rose},${C.gold})`, border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body, boxShadow: `0 4px 20px rgba(201,132,138,0.25)` }}>Edit Shipment</button>
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