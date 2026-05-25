import { useState, useEffect } from "react";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";

const API = "http://localhost:5000/api/shipments/my";
const STATUSES = ["All", "Pending", "In Transit", "Delivered", "Delayed"];

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a", sage: "#8a9e7a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = { heading: "'Cormorant Garamond', serif", cursive: "'Dancing Script', cursive", body: "'DM Sans', sans-serif" };

export default function CustomerShipmentsLight({ toggleTheme }) {
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
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!data.success) { setShipments([]); return; }
      setShipments(data.data);
    } catch (err) {
      console.error("Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    switch (status) {
      case "Delivered":  return { color: "#5a9e5a", border: "rgba(90,158,90,0.3)",   bg: "rgba(90,158,90,0.08)",   glow: "rgba(90,158,90,0.15)",   dot: true  };
      case "Delayed":    return { color: C.rose,    border: C.borderRose,             bg: C.roseLight,              glow: "rgba(201,132,138,0.2)",  dot: false };
      case "In Transit": return { color: C.gold,    border: "rgba(196,163,90,0.3)",   bg: C.goldLight,              glow: "rgba(196,163,90,0.15)",  dot: true  };
      case "Pending":    return { color: C.inkMid,  border: "rgba(107,87,68,0.3)",    bg: "rgba(107,87,68,0.08)",   glow: "rgba(107,87,68,0.1)",    dot: false };
      default:           return { color: C.inkLight, border: "rgba(168,145,122,0.3)", bg: "rgba(168,145,122,0.08)", glow: "rgba(168,145,122,0.1)",  dot: false };
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow  { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fade-up-l   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-l-1 { animation: fadeUp 0.5s 0.07s ease forwards; opacity: 0; }
        .fade-up-l-2 { animation: fadeUp 0.5s 0.14s ease forwards; opacity: 0; }
        .slide-up-modal-l { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .cs-row-l {
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .cs-row-l::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: linear-gradient(to bottom, ${C.rose}, ${C.gold});
          transition: width 0.25s; border-radius: 0 2px 2px 0;
        }
        .cs-row-l:hover::before { width: 3px; }
        .cs-row-l:hover { background: rgba(201,132,138,0.05) !important; padding-left: 24px !important; }
        .cs-row-l:hover .cell-dim-l  { color: ${C.inkMid} !important; }
        .cs-row-l:hover .cell-main-l { color: ${C.ink} !important; }

        .filter-pill-l { transition: all 0.2s; cursor: pointer; }
        .filter-pill-l:hover { color: ${C.inkMid} !important; }

        .close-btn-l { transition: all 0.2s; }
        .close-btn-l:hover { background: ${C.roseLight} !important; color: ${C.rose} !important; border-color: ${C.borderRose} !important; }

        input:focus  { outline: none !important; }
        input::placeholder { color: ${C.inkFaint}; }
        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }

        .spinner-l {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,132,138,0.2);
          border-top-color: ${C.rose};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .detail-row-l { display: grid; grid-template-columns: 140px 1fr; gap: 6px; padding: 10px 0; border-bottom: 1px solid ${C.border}; align-items: start; }
        .detail-row-l:last-child { border-bottom: none; }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarLight
        toggleTheme={toggleTheme}
        pageTitle="My Shipments"
        pageSubtitle="Track"
      />

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <CustomerSidebarLight
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
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.12), transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.08), transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* PAGE HEADER */}
            <div className="fade-up-l" style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: font.body }}>Track</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", letterSpacing: "1px", lineHeight: 1, margin: 0 }}>My Shipments</h1>
              <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
                {loading ? "Fetching data..." : `${shipments.length} shipment${shipments.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="fade-up-l-1" style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: "1 1 280px", position: "relative" }}>
                <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkMid} strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by tracking ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 16px 12px 42px",
                    background: C.bgCard, border: `1px solid ${C.border}`,
                    borderRadius: "10px", color: C.ink,
                    fontSize: "0.85rem", fontFamily: font.body,
                    boxSizing: "border-box", transition: "all 0.25s"
                  }}
                  onFocus={e => { e.target.style.borderColor = C.borderRose; e.target.style.boxShadow = "0 0 0 4px rgba(201,132,138,0.08)"; }}
                  onBlur={e =>  { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div style={{ display: "flex", gap: "4px", background: C.bgDeep, border: `1px solid ${C.border}`, padding: "4px", borderRadius: "10px", flexWrap: "wrap" }}>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill-l" style={{
                    padding: "6px 14px", borderRadius: "7px",
                    fontSize: "0.73rem", fontWeight: 500, fontFamily: font.body,
                    background: statusFilter === s ? `linear-gradient(135deg, ${C.roseLight}, ${C.goldLight})` : "transparent",
                    border: statusFilter === s ? `1px solid ${C.borderRose}` : "1px solid transparent",
                    color: statusFilter === s ? C.rose : C.inkLight, cursor: "pointer"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="fade-up-l-2" style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: "14px", overflow: "hidden",
              boxShadow: "0 4px 24px rgba(201,132,138,0.07)"
            }}>
              <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1.4fr 140px 140px", padding: "12px 20px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                {["Tracking ID", "Origin → Destination", "Status", "ETA", "Date Created"].map(h => (
                  <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 700 }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {loading ? (
                <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                  <div className="spinner-l" />
                  <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Fetching your shipments...</div>
                </div>
              ) : shipments.length === 0 ? (
                <div style={{ padding: "5rem", textAlign: "center" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                  <div style={{ color: C.inkMid, fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px", fontFamily: font.body }}>No shipments found</div>
                  <div style={{ color: C.inkLight, fontSize: "0.76rem", fontFamily: font.body }}>Try adjusting your search or status filter</div>
                </div>
              ) : (
                shipments.map((s, i) => {
                  const sc = statusConfig(s.Status);
                  const isHov = hoveredRow === i;
                  return (
                    <div
                      key={i}
                      className="cs-row-l"
                      onMouseEnter={() => setHoveredRow(i)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => setSelectedShipment(s)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr 1.4fr 140px 140px",
                        padding: "14px 20px", alignItems: "center",
                        borderBottom: i < shipments.length - 1 ? `1px solid ${C.border}` : "none",
                        animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0
                      }}
                    >
                      <div style={{ fontFamily: font.heading, fontSize: "1rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {s.ShipmentId}
                      </div>
                      <div style={{ fontSize: "0.84rem", fontFamily: font.body, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="cell-dim-l" style={{ color: C.inkLight, transition: "color 0.15s" }}>{s.Origin}</span>
                        <span style={{ color: C.rose, fontSize: "0.75rem", fontWeight: 700 }}>→</span>
                        <span className="cell-dim-l" style={{ color: C.inkLight, transition: "color 0.15s" }}>{s.Destination}</span>
                      </div>
                      <div>
                        <span style={{
                          fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px",
                          fontWeight: 600, fontFamily: font.body,
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          display: "inline-flex", alignItems: "center", gap: "5px",
                          boxShadow: isHov ? `0 0 12px ${sc.glow}` : "none",
                          transition: "box-shadow 0.2s"
                        }}>
                          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: sc.dot ? "pulse 2s infinite" : "none", flexShrink: 0 }} />
                          {s.Status}
                        </span>
                      </div>
                      <div className="cell-dim-l" style={{ fontSize: "0.84rem", color: C.inkLight, fontFamily: font.body, transition: "color 0.15s" }}>
                        {formatDate(s.ETA)}
                      </div>
                      <div className="cell-dim-l" style={{ fontSize: "0.84rem", color: C.inkLight, fontFamily: font.body, transition: "color 0.15s" }}>
                        {formatDate(s.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}

              {!loading && shipments.length > 0 && (
                <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(196,163,90,0.3),transparent)` }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL — outside the sidebar/content flex so it covers full viewport */}
      {selectedShipment && (() => {
        const s = selectedShipment;
        const sc = statusConfig(s.Status);
        return (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(46,34,24,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) setSelectedShipment(null); }}
          >
            <div className="slide-up-modal-l" style={{
              background: C.bgCard, border: `1px solid ${C.borderRose}`,
              borderRadius: "16px", width: "520px",
              maxHeight: "88vh", overflowY: "auto",
              boxShadow: "0 30px 100px rgba(46,34,24,0.2)"
            }}>
              <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite", borderRadius: "16px 16px 0 0" }} />

              <div style={{ padding: "1.6rem 2rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>Shipment Details</div>
                  <div style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px" }}>{s.ShipmentId}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color }} />
                    {s.Status}
                  </span>
                  <button
                    className="close-btn-l"
                    onClick={() => setSelectedShipment(null)}
                    style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkLight, width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >✕</button>
                </div>
              </div>

              <div style={{ padding: "2rem" }}>
                <div style={{ background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "1.8rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>Origin</div>
                    <div style={{ fontSize: "1rem", color: C.ink, fontWeight: 500, fontFamily: font.body }}>{s.Origin}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "30px", height: "1px", background: `linear-gradient(90deg,${C.rose},${C.gold})` }} />
                    <span style={{ color: C.rose, fontSize: "1rem", fontWeight: 700 }}>→</span>
                    <div style={{ width: "30px", height: "1px", background: `linear-gradient(90deg,${C.gold},${C.rose})` }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>Destination</div>
                    <div style={{ fontSize: "1rem", color: C.ink, fontWeight: 500, fontFamily: font.body }}>{s.Destination}</div>
                  </div>
                </div>

                <div style={{ background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "4px 16px", marginBottom: "1.4rem" }}>
                  {[
                    { label: "Supplier",     value: s.Supplier },
                    { label: "ETA",          value: formatDate(s.ETA) },
                    { label: "Date Created", value: formatDate(s.createdAt) },
                    { label: "Last Updated", value: new Date(s.updatedAt).toLocaleString() },
                    ...(s.DelayReason?.Code ? [{ label: "Delay Reason", value: s.DelayReason.Code, danger: true }] : []),
                    ...(s.DelayDuration > 0 ? [{ label: "Delay Duration", value: `+${s.DelayDuration} hrs`, danger: true }] : []),
                  ].map((row, i) => (
                    <div key={i} className="detail-row-l">
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 600, paddingTop: "1px" }}>{row.label}</div>
                      <div style={{ fontSize: "0.88rem", color: row.danger ? C.rose : C.inkMid, fontFamily: font.body }}>{row.value}</div>
                    </div>
                  ))}
                </div>

                {s.Status === "Delayed" && (
                  <div style={{ background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ fontSize: "1.2rem", lineHeight: 1, marginTop: "1px" }}>⚠️</div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: C.rose, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>Shipment Delayed</div>
                      <div style={{ fontSize: "0.76rem", color: C.inkMid, lineHeight: 1.5, fontFamily: font.body }}>
                        {s.DelayReason?.Code ? `${s.DelayReason.Code} — ${s.DelayReason.Reason || ""}. Category: ${s.DelayReason.Category || ""}.` : "This shipment has been delayed."}{" "}
                        {s.DelayDuration > 0 ? `Expected additional delay: ${s.DelayDuration} hours.` : ""}
                      </div>
                    </div>
                  </div>
                )}

                {s.Status === "Delivered" && (
                  <div style={{ background: "rgba(90,158,90,0.08)", border: "1px solid rgba(90,158,90,0.25)", borderRadius: "10px", padding: "14px 16px", display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ fontSize: "1.2rem" }}>✅</div>
                    <div style={{ fontSize: "0.8rem", color: "#5a9e5a", fontWeight: 600, fontFamily: font.body }}>Your shipment has been delivered successfully.</div>
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