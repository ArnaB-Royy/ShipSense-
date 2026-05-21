import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebarLight from "./Components/CustomerSidebarLight";
import CustomerNavbarLight from "./Components/CustomerNavbarLight";

const CUSTOMER_SHIPMENTS_API = "http://localhost:5000/api/customer/shipments"; // adjust to your endpoint

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.9)",
  rose: "#c9848a", gold: "#c4a35a",
  roseDark: "#a86870", goldDark: "#a0834a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.1)", goldLight: "rgba(196,163,90,0.1)",
  green: "#6b8a6a", greenLight: "rgba(107,138,106,0.1)", greenBorder: "rgba(107,138,106,0.35)",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

export default function CustomerDashboardLight({ toggleTheme, customerName = "Alex" }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animated, setAnimated] = useState(false);
  const [trackInput, setTrackInput] = useState("");
  const [trackFocused, setTrackFocused] = useState(false);

  useEffect(() => { fetchShipments(); }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await fetch(CUSTOMER_SHIPMENTS_API);
      const json = await res.json();
      if (json.success) setShipments(json.data);
      setTimeout(() => setAnimated(true), 150);
    } catch (err) {
      console.error("Customer dashboard fetch error:", err);
      setShipments([]);
      setTimeout(() => setAnimated(true), 150);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    switch (status) {
      case "On Time":     return { color: C.goldDark,  border: "rgba(196,163,90,0.35)",  bg: C.goldLight  };
      case "Delayed":     return { color: C.roseDark,  border: "rgba(201,132,138,0.35)", bg: C.roseLight  };
      case "Delivered":   return { color: C.green,     border: C.greenBorder,            bg: C.greenLight };
      case "In Transit":  return { color: C.inkMid,    border: "rgba(107,87,68,0.3)",    bg: "rgba(107,87,68,0.06)" };
      default:            return { color: C.inkMid,    border: "rgba(107,87,68,0.3)",    bg: "rgba(107,87,68,0.06)" };
    }
  };

  // Derived stats
  const totalShipments = shipments.length;
  const inTransit  = shipments.filter(s => s.Status === "In Transit").length;
  const delivered  = shipments.filter(s => s.Status === "Delivered").length;
  const pending    = shipments.filter(s => s.Status === "Pending" || s.Status === "On Time").length;
  const recentShipments = shipments.slice(0, 5);

  const statCards = [
    { label: "Total Shipments", value: totalShipments, icon: "📦", color: C.rose,     colorLight: C.roseLight,  pct: 100 },
    { label: "In Transit",      value: inTransit,       icon: "🚚", color: C.goldDark, colorLight: C.goldLight,  pct: totalShipments ? (inTransit / totalShipments) * 100 : 0 },
    { label: "Delivered",       value: delivered,        icon: "✅", color: C.green,    colorLight: C.greenLight, pct: totalShipments ? (delivered / totalShipments) * 100 : 0 },
    { label: "Pending",         value: pending,          icon: "⏳", color: C.inkMid,  colorLight: "rgba(107,87,68,0.08)", pct: totalShipments ? (pending / totalShipments) * 100 : 0 },
  ];

  const handleTrack = () => {
    const id = trackInput.trim();
    if (id) navigate(`/customer/track/${id}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body, overflow: "visible" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlowL { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes rowInL    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulseL    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        @keyframes shimmerL  { 0%{background-position:200% center} 100%{background-position:-200% center} }

        .fade-up-dl   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-dl-1 { animation: fadeUp 0.5s 0.06s ease forwards; opacity:0; }
        .fade-up-dl-2 { animation: fadeUp 0.5s 0.12s ease forwards; opacity:0; }

        .card-l {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 14px; overflow: hidden; position: relative;
          box-shadow: 0 4px 20px rgba(196,163,90,0.07);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .card-l:hover { border-color: ${C.borderRose}; box-shadow: 0 8px 32px rgba(201,132,138,0.1); }
        .card-top-l {
          height: 2px;
          background: linear-gradient(90deg,${C.rose},${C.gold},${C.rose});
          background-size: 200%; animation: gradFlowL 3s linear infinite;
        }

        .stat-card-c {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 14px; overflow: hidden; position: relative;
          box-shadow: 0 4px 20px rgba(196,163,90,0.07);
          padding: 1.3rem 1.4rem;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.22s;
          cursor: default;
        }
        .stat-card-c:hover { border-color: ${C.borderRose}; box-shadow: 0 8px 28px rgba(201,132,138,0.12); transform: translateY(-3px); }

        .ship-row-l {
          display: grid;
          grid-template-columns: 120px 1fr 1.1fr 90px 130px;
          padding: 11px 18px; align-items: center;
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .ship-row-l::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:0; background: linear-gradient(to bottom,${C.rose},${C.gold});
          transition: width 0.22s; border-radius: 0 2px 2px 0;
        }
        .ship-row-l:hover::before { width: 3px; }
        .ship-row-l:hover { background: ${C.roseLight} !important; padding-left: 22px !important; }

        .bar-fill-l {
          height: 100%; border-radius: 999px;
          transition: width 1.2s cubic-bezier(0.34,1.2,0.64,1);
          position: relative; overflow: hidden;
        }
        .bar-fill-l::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
          animation: shimmerL 2.5s ease infinite;
        }

        .track-input-c {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: ${font.body}; font-size: 0.88rem; color: ${C.ink};
          letter-spacing: 0.5px;
        }
        .track-input-c::placeholder { color: ${C.inkFaint}; }

        .track-btn-c {
          background: linear-gradient(135deg,${C.rose},${C.gold});
          border: none; border-radius: 8px; padding: 8px 20px;
          font-family: ${font.body}; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #fff; cursor: pointer;
          transition: all 0.25s; white-space: nowrap;
          box-shadow: 0 2px 10px rgba(201,132,138,0.25);
        }
        .track-btn-c:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,132,138,0.35); }
        .track-btn-c:active { transform: translateY(0); }

        .spinner-l {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,132,138,0.2);
          border-top-color: ${C.rose}; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }
      `}</style>

      <CustomerNavbarLight toggleTheme={toggleTheme} pageTitle="Dashboard" pageSubtitle="Overview" />

      <div style={{ display: "flex", flex: 1 }}>
        <CustomerSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          {/* ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle,rgba(201,132,138,0.1),transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle,rgba(196,163,90,0.07),transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* PAGE HEADER */}
          <div className="fade-up-dl" style={{ marginBottom: "1.6rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Welcome back, {customerName}</span>
            </div>
            <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", letterSpacing: "1px", lineHeight: 1, margin: 0 }}>My Dashboard</h1>
            <div style={{ fontSize: "0.74rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
              {loading ? "Fetching your shipments..." : "Your shipment overview · Updated just now"}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "40vh", gap: "1rem", position: "relative", zIndex: 1 }}>
              <div className="spinner-l" />
              <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Loading your dashboard...</div>
            </div>
          ) : (
            <div className="fade-up-dl-1" style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 1 }}>

              {/* ── STAT CARDS ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                {statCards.map((card, i) => (
                  <div key={i} className="stat-card-c" style={{ animationDelay: `${i * 0.07}s` }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlowL 3s linear infinite" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                      <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>{card.label}</div>
                      <div style={{ fontSize: "1.1rem", opacity: 0.75 }}>{card.icon}</div>
                    </div>
                    <div style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: card.color, lineHeight: 1, marginBottom: "10px" }}>{card.value}</div>
                    <div style={{ height: "3px", background: C.roseLight, borderRadius: "999px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                      <div className="bar-fill-l" style={{ width: animated ? `${card.pct}%` : "0%", background: `linear-gradient(90deg,${C.rose},${C.gold})` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── TRACK + TABLE ROW ── */}
              <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "16px" }}>

                {/* LEFT: Quick Track + Status Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                  {/* Quick Track */}
                  <div className="card-l">
                    <div className="card-top-l" />
                    <div style={{ padding: "1.4rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <div style={{ width: "3px", height: "14px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>Quick Track</div>
                      </div>
                      <div style={{ fontFamily: font.heading, fontSize: "1.35rem", fontWeight: 600, color: C.ink, marginBottom: "4px", lineHeight: 1.2 }}>Track a Shipment</div>
                      <div style={{ fontSize: "0.72rem", color: C.inkLight, fontFamily: font.body, marginBottom: "1.1rem" }}>Enter your shipment ID to view live status</div>

                      {/* Input */}
                      <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: C.bgDeep,
                        border: `1px solid ${trackFocused ? C.rose : C.border}`,
                        borderRadius: "10px", padding: "10px 14px",
                        marginBottom: "10px",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow: trackFocused ? `0 0 0 3px ${C.roseLight}` : "none",
                      }}>
                        <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>🔍</span>
                        <input
                          className="track-input-c"
                          placeholder="e.g. SHP-00123"
                          value={trackInput}
                          onChange={e => setTrackInput(e.target.value)}
                          onFocus={() => setTrackFocused(true)}
                          onBlur={() => setTrackFocused(false)}
                          onKeyDown={e => e.key === "Enter" && handleTrack()}
                        />
                      </div>
                      <button className="track-btn-c" onClick={handleTrack} style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>🚀</span> Track Shipment
                      </button>
                    </div>
                  </div>

                  {/* Status Breakdown mini card */}
                  <div className="card-l" style={{ flex: 1 }}>
                    <div className="card-top-l" />
                    <div style={{ padding: "1.2rem 1.4rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                        <div style={{ width: "3px", height: "12px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>Status Breakdown</div>
                      </div>

                      {[
                        { label: "In Transit", value: inTransit,  color: C.goldDark, pct: totalShipments ? (inTransit / totalShipments) * 100 : 0 },
                        { label: "Delivered",  value: delivered,  color: C.green,    pct: totalShipments ? (delivered / totalShipments) * 100 : 0  },
                        { label: "Pending",    value: pending,    color: C.inkMid,   pct: totalShipments ? (pending / totalShipments) * 100 : 0    },
                        { label: "Delayed",    value: shipments.filter(s => s.Status === "Delayed").length, color: C.roseDark, pct: totalShipments ? (shipments.filter(s => s.Status === "Delayed").length / totalShipments) * 100 : 0 },
                      ].map((item, i) => (
                        <div key={i} style={{ marginBottom: "13px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                              <span style={{ fontSize: "0.76rem", color: C.inkMid, fontWeight: 500, fontFamily: font.body }}>{item.label}</span>
                            </div>
                            <span style={{ fontSize: "0.72rem", color: item.color, fontWeight: 700, fontFamily: font.body }}>{item.value}</span>
                          </div>
                          <div style={{ height: "4px", background: C.roseLight, borderRadius: "999px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                            <div className="bar-fill-l" style={{ width: animated ? `${item.pct}%` : "0%", background: `linear-gradient(90deg,${C.rose},${C.gold})`, transition: `width 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.12}s` }} />
                          </div>
                        </div>
                      ))}

                      {totalShipments === 0 && (
                        <div style={{ textAlign: "center", padding: "1rem 0", color: C.inkLight, fontSize: "0.78rem", fontFamily: font.body }}>No shipments yet</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Recent Shipments Table */}
                <div className="card-l" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="card-top-l" />

                  {/* Header */}
                  <div style={{ padding: "1.2rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <div style={{ width: "3px", height: "12px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>Live Feed</div>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.rose, animation: "pulseL 2s infinite" }} />
                      </div>
                      <h2 style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", margin: 0 }}>Recent Shipments</h2>
                    </div>
                    <button onClick={() => navigate("/customer/shipments")}
                      style={{ background: "transparent", color: C.rose, border: `1px solid ${C.borderRose}`, padding: "8px 18px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: font.body, transition: "all 0.25s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >All Shipments →</button>
                  </div>

                  {/* Table header */}
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1.1fr 90px 130px", padding: "10px 18px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                    {["Shipment ID", "Supplier", "Route", "ETA", "Status"].map(h => (
                      <div key={h} style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 700 }}>{h}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  <div style={{ flex: 1 }}>
                    {recentShipments.length === 0 ? (
                      <div style={{ padding: "4rem", textAlign: "center" }}>
                        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                        <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body, marginBottom: "1rem" }}>No shipments yet</div>
                        <div
                          onClick={() => navigate("/customer/support")}
                          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: C.rose, fontFamily: font.body, fontWeight: 700, cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase", borderBottom: `1px solid ${C.borderRose}`, paddingBottom: "2px" }}
                        >Contact Support →</div>
                      </div>
                    ) : recentShipments.map((ship, i) => {
                      const sc = statusConfig(ship.Status);
                      return (
                        <div key={i} className="ship-row-l"
                          onClick={() => navigate(`/customer/track/${ship.ShipmentId}`)}
                          style={{ borderBottom: i < recentShipments.length - 1 ? `1px solid ${C.border}` : "none", animation: `rowInL 0.3s ${i * 0.05}s ease forwards`, opacity: 0 }}
                        >
                          <div style={{ fontFamily: font.heading, fontSize: "0.95rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{ship.ShipmentId}</div>
                          <div style={{ fontSize: "0.8rem", color: C.inkMid, fontFamily: font.body, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}>{ship.Supplier}</div>
                          <div style={{ fontSize: "0.78rem", fontFamily: font.body, display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ color: C.inkLight }}>{ship.Origin}</span>
                            <span style={{ color: C.rose, fontSize: "0.65rem" }}>→</span>
                            <span style={{ color: C.inkLight }}>{ship.Destination}</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: C.inkLight, fontFamily: font.body }}>
                            {new Date(ship.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </div>
                          <div>
                            <span style={{ fontSize: "0.66rem", padding: "3px 9px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: sc.color, animation: ship.Status === "In Transit" ? "pulseL 2s infinite" : "none", flexShrink: 0 }} />
                              {ship.Status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA if few shipments */}
                  {recentShipments.length > 0 && recentShipments.length < 3 && (
                    <div style={{ padding: "1.2rem 1.6rem", borderTop: `1px solid ${C.border}` }}>
                      <div
                        onClick={() => navigate("/customer/shipments")}
                        style={{ padding: "14px 18px", background: `linear-gradient(135deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.25s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,rgba(201,132,138,0.2),rgba(196,163,90,0.15))`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,132,138,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg,${C.roseLight},${C.goldLight})`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        <div>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "3px", fontWeight: 700, fontFamily: font.body }}>Need help?</div>
                          <div style={{ fontFamily: font.heading, fontSize: "1.2rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(90deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>View all your shipments →</div>
                        </div>
                        <div style={{ fontSize: "1.8rem", opacity: 0.5 }}>📋</div>
                      </div>
                    </div>
                  )}

                  <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(196,163,90,0.3),transparent)` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}