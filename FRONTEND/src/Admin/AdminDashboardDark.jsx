import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebarDark from "./Components/AdminSidebarDark";
import AdminNavbarDark from "./Components/AdminNavbarDark";

const REPORTS_API   = "http://localhost:5000/api/reports";
const SHIPMENTS_API = "http://localhost:5000/api/shipments";

export default function AdminDashboardDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [reports, setReports]     = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [animated, setAnimated]   = useState(false);
  const [userName, setUserName]   = useState(localStorage.getItem("userName") || "");

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
      case "On Time":   return { color: "#f0a030", border: "rgba(240,160,48,0.3)",  bg: "rgba(240,160,48,0.08)"  };
      case "Delayed":   return { color: "#e63232", border: "rgba(230,50,50,0.3)",   bg: "rgba(230,50,50,0.08)"   };
      case "Delivered": return { color: "#e8c090", border: "rgba(232,192,144,0.3)", bg: "rgba(232,192,144,0.08)" };
      default:          return { color: "#c8803a", border: "rgba(200,128,58,0.3)",  bg: "rgba(200,128,58,0.08)"  };
    }
  };

  const s = reports?.summary;
  const delayReasons = reports?.delayReasons || [];
  const maxDelay = Math.max(...delayReasons.map(d => d.count), 1);

  const quickActions = [
    { label: "Add Shipment",   icon: "📦", path: "/admin/add-shipment",   color: "#e63232" },
    { label: "Add Delay Code", icon: "🏷️", path: "/admin/add-delay-code", color: "#f0a030" },
    { label: "Add User",       icon: "👤", path: "/admin/add-user",        color: "#c8803a" },
    { label: "View Reports",   icon: "📊", path: "/admin/reports",         color: "#e8c090" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter',sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlow  { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes rowIn     { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }

        .fade-up-d   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-d h1 { -webkit-text-fill-color: transparent !important; }
        .fade-up-d-1 { animation: fadeUp 0.5s 0.06s ease forwards; opacity:0; }
        .fade-up-d-2 { animation: fadeUp 0.5s 0.12s ease forwards; opacity:0; }
        .fade-up-d-3 { animation: fadeUp 0.5s 0.18s ease forwards; opacity:0; }

        .card-d {
          background: linear-gradient(145deg, rgba(255,255,255,0.025), rgba(230,50,50,0.012));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; overflow: hidden; position: relative;
          transition: border-color 0.25s;
        }
        .card-top-d {
          height: 2px;
          background: linear-gradient(90deg,#e63232,#f0a030,#e63232);
          background-size: 200%; animation: gradFlow 3s linear infinite;
        }

        .stat-block-d {
          padding: 16px 18px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .stat-block-d:hover {
          background: rgba(230,50,50,0.04);
          border-color: rgba(230,50,50,0.15);
          transform: translateY(-2px);
        }

        .qa-d {
          background: transparent;
          border-radius: 8px; padding: 9px 16px;
          font-size: 0.73rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex; align-items: center; gap: 7px;
          transition: all 0.25s; border: 1px solid;
        }
        .qa-d:hover { transform: translateY(-2px); }

        .ship-row-d {
          display: grid;
          grid-template-columns: 110px 1fr 1.1fr 90px 120px 120px;
          padding: 11px 18px; align-items: center;
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .ship-row-d::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:0; background: linear-gradient(to bottom,#e63232,#f0a030);
          transition: width 0.22s; border-radius: 0 2px 2px 0;
        }
        .ship-row-d:hover::before { width: 3px; }
        .ship-row-d:hover { background: rgba(230,50,50,0.04) !important; padding-left: 22px !important; }

        .bar-fill-d {
          height: 100%; border-radius: 999px;
          transition: width 1.2s cubic-bezier(0.34,1.2,0.64,1);
          position: relative; overflow: hidden;
        }
        .bar-fill-d::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
          animation: shimmer 2.5s ease infinite;
        }

        .summary-tile {
          padding: 12px 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px; transition: all 0.2s; cursor: default;
        }
        .summary-tile:hover {
          background: rgba(230,50,50,0.04);
          border-color: rgba(230,50,50,0.12);
          transform: translateY(-2px);
        }

        .spinner-d {
          width: 28px; height: 28px;
          border: 2px solid rgba(230,50,50,0.15);
          border-top-color: #e63232; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
      `}</style>

      <AdminNavbarDark toggleTheme={toggleTheme} pageTitle="DASHBOARD" pageSubtitle="OVERVIEW" />

      <div style={{ display: "flex", flex: 1 }}>
        <AdminSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          {/* ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(230,50,50,0.1),transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,160,48,0.06),transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* PAGE HEADER */}
          <div className="fade-up-d" style={{ marginBottom: "1.6rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", borderRadius: "2px" }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Welcome back, {userName || "Admin"}</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0, display: "inline-block" }}>ADMIN DASHBOARD</h1>
            <div style={{ fontSize: "0.74rem", color: "#a89888", marginTop: "6px" }}>
              {loading ? "Fetching live data..." : "Live data · Updated just now"}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="fade-up-d-1" style={{ display: "flex", gap: "10px", marginBottom: "20px", position: "relative", zIndex: 1, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#4a3a35", fontWeight: 700, marginRight: "4px" }}>Quick Actions</div>
            {quickActions.map((a, i) => (
              <button key={i} className="qa-d"
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
              <div className="spinner-d" />
              <div style={{ color: "#7a6a60", fontSize: "0.82rem" }}>Loading dashboard...</div>
            </div>
          ) : (
            <div className="fade-up-d-2" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", position: "relative", zIndex: 1 }}>

              {/* ── LEFT PANEL ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* Hero stat */}
                <div className="card-d">
                  <div className="card-top-d" />
                  <div style={{ padding: "1.4rem 1.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <div style={{ width: "3px", height: "14px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700 }}>Total Shipments</div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "4.5rem", background: "linear-gradient(135deg,#fff,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "4px", lineHeight: 1 }}>
                      {s?.totalShipments ?? "—"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#7a6a60", marginTop: "6px" }}>all time</div>
                    <div style={{ marginTop: "14px", height: "1px", background: "linear-gradient(90deg,rgba(230,50,50,0.3),transparent)" }} />
                    <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      {[
                        { label: "On Time",    value: s?.totalOnTime    ?? 0, color: "#f0a030" },
                        { label: "Delayed",    value: s?.totalDelayed   ?? 0, color: "#e63232" },
                        { label: "In Transit", value: reports?.statusBreakdown?.find(x => x._id === "In Transit")?.count ?? 0, color: "#c8803a" },
                      ].map((item, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", color: item.color, letterSpacing: "1px", lineHeight: 1 }}>{item.value}</div>
                          <div style={{ fontSize: "0.56rem", color: "#5a4a45", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stat blocks */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "On Time Rate", value: `${s?.onTimeRate ?? 0}%`, color: "#f0a030", pct: s?.onTimeRate ?? 0 },
                    { label: "Active Users",  value: s?.activeUsers ?? 0,      color: "#c8803a", pct: s?.totalUsers ? (s.activeUsers / s.totalUsers) * 100 : 0 },
                  ].map((item, i) => (
                    <div key={i} className="stat-block-d">
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
                      <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", fontWeight: 700, marginBottom: "8px" }}>{item.label}</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: item.color, letterSpacing: "2px", lineHeight: 1, textShadow: `0 0 16px ${item.color}44` }}>{item.value}</div>
                      <div style={{ marginTop: "8px", height: "3px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", overflow: "hidden" }}>
                        <div className="bar-fill-d" style={{ width: animated ? `${item.pct}%` : "0%", background: `linear-gradient(90deg,#e63232,${item.color})` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delay Breakdown */}
                <div className="card-d" style={{ flex: 1 }}>
                  <div className="card-top-d" />
                  <div style={{ padding: "1.2rem 1.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <div style={{ width: "3px", height: "12px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700 }}>Delay Breakdown</div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#6a5a50", marginBottom: "1.2rem" }}>Root causes of delays</div>
                    {delayReasons.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "1.5rem 0", color: "#5a4a45", fontSize: "0.78rem" }}>🎉 No delays recorded!</div>
                    ) : delayReasons.map((d, i) => {
                      const pct = (d.count / maxDelay) * 100;
                      return (
                        <div key={i} style={{ marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e63232", boxShadow: "0 0 5px rgba(230,50,50,0.5)", flexShrink: 0 }} />
                              <span style={{ fontSize: "0.76rem", color: "#c8b8b0", fontWeight: 500 }}>{d._id}</span>
                            </div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{ fontSize: "0.7rem", color: "#e63232", fontWeight: 700 }}>{d.count}</span>
                              <span style={{ fontSize: "0.62rem", color: "#5a4a45" }}>{Math.round(d.avgHours)}h avg</span>
                            </div>
                          </div>
                          <div style={{ height: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", overflow: "hidden" }}>
                            <div className="bar-fill-d" style={{ width: animated ? `${pct}%` : "0%", background: "linear-gradient(90deg,#e63232,#f0a030)", transition: `width 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.1}s` }} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Mini extra stats */}
                    <div style={{ marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { label: "Delay Codes", value: s?.activeDelayCodes ?? 0, sub: "active",          color: "#f0a030" },
                        { label: "Total Users",  value: s?.totalUsers ?? 0,       sub: `${s?.activeUsers ?? 0} active`, color: "#c8803a" },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "5px", fontWeight: 700 }}>{item.label}</div>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", color: item.color, letterSpacing: "1px", lineHeight: 1 }}>{item.value}</div>
                          <div style={{ fontSize: "0.6rem", color: "#6a5a50", marginTop: "2px" }}>{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL — Shipments Table ── */}
              <div className="card-d" style={{ display: "flex", flexDirection: "column" }}>
                <div className="card-top-d" />

                {/* Header */}
                <div style={{ padding: "1.2rem 1.6rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <div style={{ width: "3px", height: "12px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700 }}>Live Feed</div>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e63232", animation: "pulse 2s infinite", boxShadow: "0 0 5px rgba(230,50,50,0.5)" }} />
                    </div>
                    <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", color: "#e0d8d0", letterSpacing: "2px", margin: 0 }}>RECENT SHIPMENTS</h2>
                  </div>
                  <button onClick={() => navigate("/admin/shipments")}
                    style={{ background: "transparent", color: "#e63232", border: "1px solid rgba(230,50,50,0.35)", padding: "8px 18px", borderRadius: "8px", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.25s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(230,50,50,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >All Shipments →</button>
                </div>

                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1.1fr 90px 120px 120px", padding: "10px 18px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Shipment ID","Supplier","Route","ETA","Status","Delay"].map(h => (
                    <div key={h} style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                <div style={{ flex: 1 }}>
                  {shipments.length === 0 ? (
                    <div style={{ padding: "4rem", textAlign: "center" }}>
                      <div style={{ fontSize: "2.5rem", marginBottom: "1rem", opacity: 0.4 }}>📦</div>
                      <div style={{ color: "#6a5a50", fontSize: "0.82rem" }}>No shipments yet — add one to get started</div>
                    </div>
                  ) : shipments.map((ship, i) => {
                    const sc = statusConfig(ship.Status);
                    return (
                      <div key={i} className="ship-row-d"
                        onClick={() => navigate("/admin/shipments")}
                        style={{ borderBottom: i < shipments.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animation: `rowIn 0.3s ${i * 0.05}s ease forwards`, opacity: 0 }}
                      >
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "0.88rem", letterSpacing: "1px", background: "linear-gradient(135deg,#f0a030,#e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{ship.ShipmentId}</div>
                        <div style={{ fontSize: "0.8rem", color: "#d4c4b8", fontFamily: "'Inter',sans-serif", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}>{ship.Supplier}</div>
                        <div style={{ fontSize: "0.78rem", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ color: "#9a8a82" }}>{ship.Origin}</span>
                          <span style={{ color: "#e63232", fontSize: "0.65rem" }}>→</span>
                          <span style={{ color: "#9a8a82" }}>{ship.Destination}</span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#9a8a82", fontFamily: "'Inter',sans-serif" }}>
                          {new Date(ship.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </div>
                        <div>
                          <span style={{ fontSize: "0.66rem", padding: "3px 9px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter',sans-serif", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: sc.color, animation: ship.Status === "In Transit" ? "pulse 2s infinite" : "none", flexShrink: 0 }} />
                            {ship.Status}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: ship.DelayReason ? "#e63232" : "#3a2a25", fontFamily: "'Inter',sans-serif" }}>{ship.DelayReason?.Code || "—"}</div>
                      </div>
                    );
                  })}
                </div>

                {/* ── SYSTEM SUMMARY (shows when few shipments) ── */}
                {shipments.length < 6 && (
                  <div style={{ padding: "1.4rem 1.6rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                      <div style={{ width: "3px", height: "12px", background: "linear-gradient(to bottom,#e63232,#f0a030)", borderRadius: "2px" }} />
                      <div style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700 }}>System Summary</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "14px" }}>
                      {[
                        { label: "Suppliers",   value: reports?.topSuppliers?.length ?? 0,                                      icon: "🚢", color: "#f0a030" },
                        { label: "Delivered",   value: reports?.statusBreakdown?.find(x => x._id === "Delivered")?.count ?? 0,  icon: "✅", color: "#e8c090" },
                        { label: "Delay Codes", value: s?.totalDelayCodes ?? 0,                                                  icon: "🏷️", color: "#c8803a" },
                        { label: "Total Users", value: s?.totalUsers ?? 0,                                                       icon: "👥", color: "#f0a030" },
                      ].map((item, i) => (
                        <div key={i} className="summary-tile">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", fontWeight: 700 }}>{item.label}</div>
                            <div style={{ fontSize: "0.85rem" }}>{item.icon}</div>
                          </div>
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: item.color, letterSpacing: "2px", lineHeight: 1, textShadow: `0 0 12px ${item.color}33` }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div onClick={() => navigate("/admin/add-shipment")}
                      style={{ padding: "14px 18px", background: "linear-gradient(135deg,rgba(230,50,50,0.06),rgba(240,160,48,0.03))", border: "1px solid rgba(230,50,50,0.15)", borderRadius: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.25s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(230,50,50,0.12),rgba(240,160,48,0.06))"; e.currentTarget.style.borderColor = "rgba(230,50,50,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(230,50,50,0.06),rgba(240,160,48,0.03))"; e.currentTarget.style.borderColor = "rgba(230,50,50,0.15)"; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div>
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#7a5a50", marginBottom: "3px", fontWeight: 700 }}>Ready to grow?</div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.1rem", background: "linear-gradient(90deg,#fff,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>ADD YOUR FIRST SHIPMENTS →</div>
                      </div>
                      <div style={{ fontSize: "1.8rem", opacity: 0.5 }}>📦</div>
                    </div>
                  </div>
                )}

                <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(240,160,48,0.3),transparent)" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}