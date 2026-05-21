import { useState, useEffect } from "react";
import CustomerSidebarDark from "../Components/CustomerSidebarDark";
import CustomerNavbarDark from "../Components/CustomerNavbarDark";

const API = "http://localhost:5000/api/shipments";
const STATUSES = ["All", "Pending", "In Transit", "Delivered", "Delayed"];

export default function CustomerShipmentsDark({ toggleTheme }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  useEffect(() => { fetchShipments(); }, [search, statusFilter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      let url = `${API}?`;
      if (search) url += `search=${search}&`;
      if (statusFilter !== "All") url += `Status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setShipments(data.data);
    } catch (err) {
      console.error("Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    switch (status) {
      case "Delivered":  return { color: "#4ade80", border: "rgba(74,222,128,0.25)",  bg: "rgba(74,222,128,0.08)",  glow: "rgba(74,222,128,0.15)",  dot: true  };
      case "Delayed":    return { color: "#f87171", border: "rgba(248,113,113,0.25)", bg: "rgba(248,113,113,0.08)", glow: "rgba(248,113,113,0.15)", dot: false };
      case "In Transit": return { color: "#fbbf24", border: "rgba(251,191,36,0.25)",  bg: "rgba(251,191,36,0.08)",  glow: "rgba(251,191,36,0.15)",  dot: true  };
      case "Pending":    return { color: "#60a5fa", border: "rgba(96,165,250,0.25)",  bg: "rgba(96,165,250,0.08)",  glow: "rgba(96,165,250,0.15)",  dot: false };
      default:           return { color: "#a89888", border: "rgba(168,152,136,0.25)", bg: "rgba(168,152,136,0.08)", glow: "rgba(168,152,136,0.15)", dot: false };
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes gradFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(36px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fade-up   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.07s ease forwards; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.5s 0.14s ease forwards; opacity: 0; }
        .slide-up-modal { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .cs-row {
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .cs-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: linear-gradient(to bottom, #e63232, #f0a030);
          transition: width 0.25s; border-radius: 0 2px 2px 0;
        }
        .cs-row:hover::before { width: 3px; }
        .cs-row:hover { background: rgba(230,50,50,0.04) !important; padding-left: 24px !important; }
        .cs-row:hover .cell-dim  { color: #c8b8b0 !important; }
        .cs-row:hover .cell-main { color: #ffffff !important; }

        .filter-pill { transition: all 0.2s; cursor: pointer; }
        .filter-pill:hover { color: #c8b8b0 !important; }

        input:focus  { outline: none !important; }
        input::placeholder { color: #3a3030; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }

        .spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(230,50,50,0.15);
          border-top-color: #e63232;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .close-btn { transition: all 0.2s; }
        .close-btn:hover { background: rgba(248,113,113,0.12) !important; color: #f87171 !important; border-color: rgba(248,113,113,0.3) !important; }

        .detail-row { display: grid; grid-template-columns: 140px 1fr; gap: 6px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: start; }
        .detail-row:last-child { border-bottom: none; }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarDark
        toggleTheme={toggleTheme}
        pageTitle="MY SHIPMENTS"
        pageSubtitle="TRACK"
      />

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <CustomerSidebarDark
          hoveredWidth={hoveredWidth}
          setHoveredWidth={setHoveredWidth}
        />

        {/* MAIN CONTENT */}
        <div style={{
          marginLeft: `${68 + hoveredWidth}px`,
          flex: 1,
          padding: "2rem 2.5rem",
          transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          minHeight: "calc(100vh - 64px)",
        }}>

          {/* AMBIENT ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.1), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.06), transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* PAGE HEADER */}
            <div className="fade-up" style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030)", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Track</span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg, #ffffff 0%, #e0c8c0 50%, #f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0 }}>MY SHIPMENTS</h1>
              <div style={{ fontSize: "0.76rem", color: "#a89888", marginTop: "6px" }}>
                {loading ? "Fetching data..." : `${shipments.length} shipment${shipments.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="fade-up-1" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: "1 1 280px", position: "relative" }}>
                <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0d8d0" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by tracking ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px 12px 42px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px", color: "#e0d8d0",
                    fontSize: "0.85rem", fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box", transition: "all 0.25s"
                  }}
                  onFocus={e => { e.target.style.borderColor = "rgba(230,50,50,0.4)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "0 0 0 4px rgba(230,50,50,0.06)"; }}
                  onBlur={e =>  { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px", borderRadius: "10px", flexWrap: "wrap" }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill" style={{
                    padding: "6px 14px", borderRadius: "7px",
                    fontSize: "0.73rem", fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    background: statusFilter === s ? "linear-gradient(135deg, rgba(230,50,50,0.18), rgba(240,160,48,0.1))" : "transparent",
                    border: statusFilter === s ? "1px solid rgba(230,50,50,0.35)" : "1px solid transparent",
                    color: statusFilter === s ? "#f0a030" : "#7a6a60", cursor: "pointer"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="fade-up-2" style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.025), rgba(230,50,50,0.015))",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px", overflow: "hidden"
            }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030, #e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite" }} />

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1.4fr 140px 140px", padding: "12px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                {["Tracking ID", "Origin → Destination", "Status", "ETA", "Date Created"].map(h => (
                  <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {loading ? (
                <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <div className="spinner" />
                  <div style={{ color: "#7a6a60", fontSize: "0.82rem" }}>Fetching your shipments...</div>
                </div>
              ) : shipments.length === 0 ? (
                <div style={{ padding: "5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                  <div style={{ color: "#a89888", fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px" }}>No shipments found</div>
                  <div style={{ color: "#6a5a50", fontSize: "0.76rem" }}>Try adjusting your search or status filter</div>
                </div>
              ) : (
                shipments.map((s, i) => {
                  const sc = statusConfig(s.Status);
                  const isHov = hoveredRow === i;
                  return (
                    <div
                      key={i}
                      className="cs-row"
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => setSelectedShipment(s)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr 1.4fr 140px 140px",
                        padding: "14px 20px", alignItems: "center",
                        borderBottom: i < shipments.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                        animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0
                      }}
                    >
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "1.5px", background: "linear-gradient(135deg, #f0a030, #e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {s.ShipmentId}
                      </div>
                      <div style={{ fontSize: "0.84rem", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="cell-dim" style={{ color: "#b0a098", transition: "color 0.15s" }}>{s.Origin}</span>
                        <span style={{ color: "#e63232", fontSize: "0.75rem", fontWeight: 700 }}>→</span>
                        <span className="cell-dim" style={{ color: "#b0a098", transition: "color 0.15s" }}>{s.Destination}</span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px",
                          fontWeight: 600, fontFamily: "'Inter', sans-serif",
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          display: "inline-flex", alignItems: "center", gap: "5px",
                          boxShadow: isHov ? `0 0 12px ${sc.glow}` : "none",
                          transition: "box-shadow 0.2s"
                        }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: sc.dot ? "pulse 2s infinite" : "none", flexShrink: 0 }} />
                          {s.Status}
                        </span>
                      </div>
                      <div className="cell-dim" style={{ fontSize: "0.84rem", color: "#b0a098", fontFamily: "'Inter', sans-serif", transition: "color 0.15s" }}>
                        {formatDate(s.ETA)}
                      </div>
                      <div className="cell-dim" style={{ fontSize: "0.84rem", color: "#b0a098", fontFamily: "'Inter', sans-serif", transition: "color 0.15s" }}>
                        {formatDate(s.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}

              {!loading && shipments.length > 0 && (
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(240,160,48,0.3), transparent)" }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL — outside flex row to cover full viewport */}
      {selectedShipment && (() => {
        const s = selectedShipment;
        const sc = statusConfig(s.Status);
        return (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) setSelectedShipment(null); }}
          >
            <div className="slide-up-modal" style={{
              background: "linear-gradient(145deg, #0f0d13, #0a0810)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", width: "520px",
              maxHeight: "88vh", overflowY: "auto",
              boxShadow: "0 30px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(230,50,50,0.08)"
            }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg, #e63232, #f0a030, #e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite", borderRadius: "16px 16px 0 0" }} />

              <div style={{ padding: "1.6rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "4px", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Shipment Details</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #fff, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px" }}>{s.ShipmentId}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter', sans-serif", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", boxShadow: `0 0 16px ${sc.glow}` }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color }} />
                    {s.Status}
                  </span>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedShipment(null)}
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#7a6a60", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >✕</button>
                </div>
              </div>

              <div style={{ padding: "2rem" }}>
                <div style={{ background: "rgba(230,50,50,0.05)", border: "1px solid rgba(230,50,50,0.12)", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "1.8rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "4px", fontWeight: 600 }}>Origin</div>
                    <div style={{ fontSize: "1rem", color: "#e0d8d0", fontWeight: 500 }}>{s.Origin}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#e63232" }}>
                    <div style={{ width: "30px", height: "1px", background: "linear-gradient(90deg, #e63232, #f0a030)" }} />
                    <span style={{ fontSize: "1rem", fontWeight: 700 }}>→</span>
                    <div style={{ width: "30px", height: "1px", background: "linear-gradient(90deg, #f0a030, #e63232)" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "4px", fontWeight: 600 }}>Destination</div>
                    <div style={{ fontSize: "1rem", color: "#e0d8d0", fontWeight: 500 }}>{s.Destination}</div>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "10px", padding: "4px 16px", marginBottom: "1.4rem" }}>
                  {[
                    { label: "Supplier",     value: s.Supplier },
                    { label: "ETA",          value: formatDate(s.ETA) },
                    { label: "Date Created", value: formatDate(s.createdAt) },
                    { label: "Last Updated", value: new Date(s.updatedAt).toLocaleString() },
                    ...(s.DelayReason       ? [{ label: "Delay Reason",   value: s.DelayReason,            danger: true }] : []),
                    ...(s.DelayDuration > 0 ? [{ label: "Delay Duration", value: `+${s.DelayDuration} hrs`, danger: true }] : []),
                  ].map((row, i) => (
                    <div key={i} className="detail-row">
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", fontFamily: "'Inter', sans-serif", fontWeight: 600, paddingTop: "1px" }}>{row.label}</div>
                      <div style={{ fontSize: "0.88rem", color: row.danger ? "#f87171" : "#d4c4b8", fontFamily: "'Inter', sans-serif" }}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {s.Status === "Delayed" && (
                  <div style={{ background: "linear-gradient(135deg, rgba(248,113,113,0.07), rgba(248,113,113,0.03))", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "1px" }}>⚠️</div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#f87171", fontWeight: 700, marginBottom: "3px" }}>Shipment Delayed</div>
                      <div style={{ fontSize: "0.76rem", color: "#7a6a60", lineHeight: 1.5 }}>
                        {s.DelayReason ? `Reason: ${s.DelayReason}.` : "This shipment has been delayed."}{" "}
                        {s.DelayDuration > 0 ? `Expected additional delay: ${s.DelayDuration} hours.` : ""}
                      </div>
                    </div>
                  </div>
                )}

                {s.Status === "Delivered" && (
                  <div style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.07), rgba(74,222,128,0.03))", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ fontSize: "1.2rem" }}>✅</div>
                    <div style={{ fontSize: "0.8rem", color: "#4ade80", fontWeight: 600 }}>Your shipment has been delivered successfully.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}