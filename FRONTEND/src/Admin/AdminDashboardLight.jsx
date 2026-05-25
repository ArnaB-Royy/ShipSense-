import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebarLight from "./Components/AdminSidebarLight";
import AdminNavbarLight from "./Components/AdminNavbarLight";

const REPORTS_API   = "http://localhost:5000/api/reports";
const SHIPMENTS_API = "http://localhost:5000/api/shipments";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.9)",
  rose: "#c9848a", gold: "#c4a35a",
  roseDark: "#a86870", goldDark: "#a0834a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.1)", goldLight: "rgba(196,163,90,0.1)",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

export default function AdminDashboardLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [reports, setReports]   = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [animated, setAnimated] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [rRes, sRes] = await Promise.all([
        fetch(REPORTS_API),
        fetch(SHIPMENTS_API),
      ]);
      const rJson = await rRes.json();
      const sJson = await sRes.json();
      if (rJson.success) setReports(rJson.data);
      if (sJson.success) setShipments(sJson.data.slice(0, 8));
      setTimeout(() => setAnimated(true), 150);
      const meRes = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      const meJson = await meRes.json();
      if (meJson.success) {
        setUserName(meJson.user.Name);
        localStorage.setItem("userName", meJson.user.Name);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    switch (status) {
      case "On Time":   return { color: C.goldDark,  border: "rgba(196,163,90,0.35)",  bg: C.goldLight  };
      case "Delayed":   return { color: C.roseDark,  border: "rgba(201,132,138,0.35)", bg: C.roseLight  };
      case "Delivered": return { color: "#6b8a6a",   border: "rgba(107,138,106,0.35)", bg: "rgba(107,138,106,0.1)" };
      default:          return { color: C.inkMid,    border: "rgba(107,87,68,0.3)",    bg: "rgba(107,87,68,0.06)"  };
    }
  };

  const s = reports?.summary;
  const delayReasons = reports?.delayReasons || [];
  const maxDelay = Math.max(...delayReasons.map(d => d.count), 1);

  const quickActions = [
    { label: "Add Shipment",   icon: "📦", path: "/admin/add-shipment",   color: C.roseDark  },
    { label: "Add Delay Code", icon: "🏷️", path: "/admin/add-delay-code", color: C.goldDark  },
    { label: "Add User",       icon: "👤", path: "/admin/add-user",        color: C.inkMid    },
    { label: "View Reports",   icon: "📊", path: "/admin/reports",         color: C.roseDark  },
  ];

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
        .fade-up-dl-3 { animation: fadeUp 0.5s 0.18s ease forwards; opacity:0; }

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

        .stat-block-l {
          padding: 16px 18px;
          background: ${C.bgDeep};
          border: 1px solid ${C.border};
          border-radius: 10px; transition: all 0.2s; position: relative; overflow: hidden;
        }
        .stat-block-l:hover { border-color: ${C.borderRose}; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,132,138,0.1); }

        .qa-l {
          background: transparent; border-radius: 8px; padding: 9px 16px;
          font-size: 0.73rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; cursor: pointer;
          font-family: ${font.body};
          display: flex; align-items: center; gap: 7px;
          transition: all 0.25s; border: 1px solid;
        }
        .qa-l:hover { transform: translateY(-2px); }

        .ship-row-l {
          display: grid;
          grid-template-columns: 110px 1fr 1.1fr 90px 120px 120px;
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

        .summary-tile-l {
          padding: 12px 14px; background: ${C.bgDeep};
          border: 1px solid ${C.border}; border-radius: 10px;
          transition: all 0.2s; cursor: default;
        }
        .summary-tile-l:hover { border-color: ${C.borderRose}; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(201,132,138,0.1); }

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

      <AdminNavbarLight toggleTheme={toggleTheme} pageTitle="Dashboard" pageSubtitle="Overview" />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          {/* ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle,rgba(201,132,138,0.1),transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle,rgba(196,163,90,0.07),transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* PAGE HEADER */}
          <div className="fade-up-dl" style={{ marginBottom: "1.6rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Welcome back, {userName || "Admin"}</span>
            </div>
            <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", letterSpacing: "1px", lineHeight: 1, margin: 0 }}>Admin Dashboard</h1>
            <div style={{ fontSize: "0.74rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
              {loading ? "Fetching live data..." : "Live data · Updated just now"}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="fade-up-dl-1" style={{ display: "flex", gap: "10px", marginBottom: "20px", position: "relative", zIndex: 1, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginRight: "4px", fontFamily: font.body }}>Quick Actions</div>
            {quickActions.map((a, i) => (
              <button key={i} className="qa-l"
                onClick={() => navigate(a.path)}
                style={{ color: a.color, borderColor: `${a.color}55` }}
                onMouseEnter={e => { e.currentTarget.style.background = `${a.color}14`; e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 16px ${a.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${a.color}55`; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: "0.9rem" }}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "40vh", gap: "1rem", position: "relative", zIndex: 1 }}>
              <div className="spinner-l" />
              <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Loading dashboard...</div>
            </div>
          ) : (
            <div className="fade-up-dl-2" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", position: "relative", zIndex: 1 }}>

              {/* ── LEFT PANEL ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Hero stat */}
                <div className="card-l">
                  <div className="card-top-l" />
                  <div style={{ padding: "1.4rem 1.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ width: "3px", height: "14px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>Total Shipments</div>
                    </div>
                    <div style={{ fontFamily: font.heading, fontSize: "4.5rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", lineHeight: 1 }}>
                      {s?.totalShipments ?? "—"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>all time</div>
                    <div style={{ marginTop: "14px", height: "1px", background: `linear-gradient(90deg,${C.borderRose},transparent)` }} />
                    <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      {[
                        { label: "On Time",    value: s?.totalOnTime    ?? 0, color: C.goldDark  },
                        { label: "Delayed",    value: s?.totalDelayed   ?? 0, color: C.roseDark  },
                        { label: "In Transit", value: reports?.statusBreakdown?.find(x => x._id === "In Transit")?.count ?? 0, color: C.inkMid },
                      ].map((item, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</div>
                          <div style={{ fontSize: "0.56rem", color: C.inkFaint, letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px", fontFamily: font.body }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stat blocks */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "On Time Rate", value: `${s?.onTimeRate ?? 0}%`, color: C.goldDark, pct: s?.onTimeRate ?? 0 },
                    { label: "Active Users",  value: s?.activeUsers ?? 0,      color: C.inkMid,   pct: s?.totalUsers ? (s.activeUsers / s.totalUsers) * 100 : 0 },
                  ].map((item, i) => (
                    <div key={i} className="stat-block-l">
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlowL 3s linear infinite" }} />
                      <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "8px", fontFamily: font.body }}>{item.label}</div>
                      <div style={{ fontFamily: font.heading, fontSize: "2rem", fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</div>
                      <div style={{ marginTop: "8px", height: "3px", background: C.roseLight, borderRadius: "999px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                        <div className="bar-fill-l" style={{ width: animated ? `${item.pct}%` : "0%", background: `linear-gradient(90deg,${C.rose},${C.gold})` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delay Breakdown */}
                <div className="card-l" style={{ flex: 1 }}>
                  <div className="card-top-l" />
                  <div style={{ padding: "1.2rem 1.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "3px", height: "12px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>Delay Breakdown</div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: C.inkLight, marginBottom: "1.2rem", fontFamily: font.body }}>Root causes of delays</div>
                    {delayReasons.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "1.5rem 0", color: C.inkLight, fontSize: "0.78rem", fontFamily: font.body }}>🎉 No delays recorded!</div>
                    ) : delayReasons.map((d, i) => {
                      const pct = (d.count / maxDelay) * 100;
                      return (
                        <div key={i} style={{ marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.rose, flexShrink: 0 }} />
                              <span style={{ fontSize: "0.76rem", color: C.inkMid, fontWeight: 500, fontFamily: font.body }}>{d._id}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontSize: "0.7rem", color: C.roseDark, fontWeight: 700, fontFamily: font.body }}>{d.count}</span>
                              <span style={{ fontSize: "0.62rem", color: C.inkFaint, fontFamily: font.body }}>{Math.round(d.avgHours)}h avg</span>
                            </div>
                          </div>
                          <div style={{ height: "4px", background: C.roseLight, borderRadius: "999px", overflow: "hidden", border: `1px solid ${C.border}` }}>
                            <div className="bar-fill-l" style={{ width: animated ? `${pct}%` : "0%", background: `linear-gradient(90deg,${C.rose},${C.gold})`, transition: `width 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.1}s` }} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Mini extra stats */}
                    <div style={{ marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { label: "Delay Codes", value: s?.activeDelayCodes ?? 0, sub: "active",                          color: C.goldDark },
                        { label: "Total Users",  value: s?.totalUsers ?? 0,       sub: `${s?.activeUsers ?? 0} active`,   color: C.inkMid   },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "10px", background: C.bg, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "5px", fontWeight: 700, fontFamily: font.body }}>{item.label}</div>
                          <div style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</div>
                          <div style={{ fontSize: "0.6rem", color: C.inkLight, marginTop: "2px", fontFamily: font.body }}>{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL — Shipments Table ── */}
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
                  <button onClick={() => navigate("/admin/shipments")}
                    style={{ background: "transparent", color: C.rose, border: `1px solid ${C.borderRose}`, padding: "8px 18px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: font.body, transition: "all 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >All Shipments →</button>
                </div>

                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1.1fr 90px 120px 120px", padding: "10px 18px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                  {["Shipment ID","Supplier","Route","ETA","Status","Delay"].map(h => (
                    <div key={h} style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                <div style={{ flex: 1 }}>
                  {shipments.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                      <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>No shipments yet — add one to get started</div>
                    </div>
                  ) : shipments.map((ship, i) => {
                    const sc = statusConfig(ship.Status);
                    return (
                      <div key={i} className="ship-row-l"
                        onClick={() => navigate("/admin/shipments")}
                        style={{ borderBottom: i < shipments.length - 1 ? `1px solid ${C.border}` : "none", animation: `rowInL 0.3s ${i * 0.05}s ease forwards`, opacity: 0 }}
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
                        <div style={{ fontSize: "0.78rem", color: ship.DelayReason ? C.roseDark : C.inkFaint, fontFamily: font.body }}>{ship.DelayReason?.Code || "—"}</div>
                      </div>
                    );
                  })}
                </div>

                {/* System Summary filler */}
                {shipments.length < 6 && (
                  <div style={{ padding: "1.4rem 1.6rem", borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                      <div style={{ width: "3px", height: "12px", background: `linear-gradient(to bottom,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>System Summary</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "14px" }}>
                      {[
                        { label: "Suppliers",   value: reports?.topSuppliers?.length ?? 0,                                     icon: "🚢", color: C.goldDark },
                        { label: "Delivered",   value: reports?.statusBreakdown?.find(x => x._id === "Delivered")?.count ?? 0, icon: "✅", color: "#6b8a6a" },
                        { label: "Delay Codes", value: s?.totalDelayCodes ?? 0,                                                 icon: "🏷️", color: C.inkMid  },
                        { label: "Total Users", value: s?.totalUsers ?? 0,                                                      icon: "👥", color: C.roseDark },
                      ].map((item, i) => (
                        <div key={i} className="summary-tile-l">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>{item.label}</div>
                            <div style={{ fontSize: "0.85rem" }}>{item.icon}</div>
                          </div>
                          <div style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, color: item.color, lineHeight: 1 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div onClick={() => navigate("/admin/add-shipment")}
                      style={{ padding: "14px 18px", background: `linear-gradient(135deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.25s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,rgba(201,132,138,0.2),rgba(196,163,90,0.15))`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,132,138,0.15)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg,${C.roseLight},${C.goldLight})`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div>
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkLight, marginBottom: "3px", fontWeight: 700, fontFamily: font.body }}>Ready to grow?</div>
                        <div style={{ fontFamily: font.heading, fontSize: "1.2rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(90deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Add your first shipments →</div>
                      </div>
                      <div style={{ fontSize: "1.8rem", opacity: 0.5 }}>📦</div>
                    </div>
                  </div>
                )}

                <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(196,163,90,0.3),transparent)` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}