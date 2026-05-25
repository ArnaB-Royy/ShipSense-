// Supplier/SupplierDashboardDark.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SupplierSidebarDark from "./Components/SupplierSidebarDark";
import SupplierNavbarDark from "./Components/SupplierNavbarDark";

const ME_API        = "http://localhost:5000/api/auth/me";
const SHIPMENTS_API = "http://localhost:5000/api/shipments/my";

export default function SupplierDashboardDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [profile, setProfile]           = useState(null);
  const [shipments, setShipments]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [animated, setAnimated]         = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [pRes, sRes] = await Promise.all([
        fetch(ME_API,        { credentials: "include" }),
        fetch(SHIPMENTS_API, { credentials: "include" }),
      ]);
      const pJson = await pRes.json();
      const sJson = await sRes.json();
      if (pJson.success) setProfile(pJson.user);
      if (sJson.success) setShipments(sJson.data);
      setTimeout(() => setAnimated(true), 150);
    } catch (err) {
      console.error("Supplier dashboard fetch error:", err);
      setTimeout(() => setAnimated(true), 150);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    switch (status) {
      case "In Transit": return { color: "#f0a030", border: "rgba(240,160,48,0.35)",  bg: "rgba(240,160,48,0.08)",  dot: true  };
      case "Delivered":  return { color: "#e8c090", border: "rgba(232,192,144,0.3)",  bg: "rgba(232,192,144,0.07)", dot: false };
      case "Delayed":    return { color: "#e63232", border: "rgba(230,50,50,0.35)",   bg: "rgba(230,50,50,0.08)",   dot: false };
      case "Pending":    return { color: "#c8803a", border: "rgba(200,128,58,0.35)",  bg: "rgba(200,128,58,0.08)",  dot: false };
      case "At Risk":    return { color: "#f0a030", border: "rgba(240,160,48,0.35)",  bg: "rgba(240,160,48,0.08)",  dot: true  };
      default:           return { color: "#9a8a82", border: "rgba(154,138,130,0.3)",  bg: "rgba(154,138,130,0.06)", dot: false };
    }
  };

  const totalShipments  = shipments.length;
  const inTransit       = shipments.filter(s => s.Status === "In Transit").length;
  const delivered       = shipments.filter(s => s.Status === "Delivered").length;
  const delayed         = shipments.filter(s => s.Status === "Delayed").length;
  const atRisk          = shipments.filter(s => s.Status === "At Risk").length;
  const recentShipments = shipments.slice(0, 5);

  const statCards = [
    { label: "Total Shipments", value: totalShipments, icon: "📦", color: "#f0a030", sub: "all time",         pct: 100 },
    { label: "In Transit",      value: inTransit,      icon: "🚚", color: "#f0a030", sub: "currently moving", pct: totalShipments ? (inTransit  / totalShipments) * 100 : 0 },
    { label: "Delivered",       value: delivered,      icon: "✅", color: "#e8c090", sub: "completed",        pct: totalShipments ? (delivered  / totalShipments) * 100 : 0 },
    { label: "Delayed",         value: delayed,        icon: "⚠️", color: "#e63232", sub: "need attention",   pct: totalShipments ? (delayed    / totalShipments) * 100 : 0 },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:"#07060a", color:"#e0d8d0", fontFamily:"'Inter',sans-serif", overflow:"visible" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlow { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes rowIn    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.8)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }

        .fade-up-s   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-s-1 { animation: fadeUp 0.5s 0.06s ease forwards; opacity:0; }
        .fade-up-s-2 { animation: fadeUp 0.5s 0.12s ease forwards; opacity:0; }

        .card-s {
          background: linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.012));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; overflow: hidden; position: relative;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .card-s:hover { border-color: rgba(230,50,50,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .card-top-s {
          height: 2px;
          background: linear-gradient(90deg,#e63232,#f0a030,#e63232);
          background-size: 200%; animation: gradFlow 3s linear infinite;
        }

        .stat-card-s {
          background: linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.012));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; overflow: hidden; position: relative;
          transition: all 0.25s; cursor: default;
        }
        .stat-card-s:hover { border-color:rgba(230,50,50,0.2); transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.4); }

        .bar-fill-s {
          height: 100%; border-radius: 999px;
          transition: width 1.2s cubic-bezier(0.34,1.2,0.64,1);
          position: relative; overflow: hidden;
        }
        .bar-fill-s::after {
          content:''; position:absolute; top:0; left:-100%;
          width:60%; height:100%;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
          animation: shimmer 2.5s ease infinite;
        }

        .ship-row-s {
          display: grid;
          grid-template-columns: 110px 1fr 1.2fr 90px 110px 1fr;
          padding: 12px 20px; align-items: center;
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .ship-row-s::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:0; background: linear-gradient(to bottom,#e63232,#f0a030);
          transition: width 0.22s; border-radius: 0 2px 2px 0;
        }
        .ship-row-s:hover::before { width: 3px; }
        .ship-row-s:hover { background: rgba(230,50,50,0.04) !important; padding-left: 24px !important; }

        .spinner-s {
          width: 28px; height: 28px;
          border: 2px solid rgba(230,50,50,0.15);
          border-top-color: #e63232; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
      `}</style>

      <SupplierNavbarDark toggleTheme={toggleTheme} pageTitle="DASHBOARD" pageSubtitle="OVERVIEW" />

      <div style={{ display:"flex", flex:1 }}>
        <SupplierSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft:`${68 + hoveredWidth}px`, flex:1, padding:"2rem 2.5rem", transition:"margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position:"relative", minHeight:"calc(100vh - 64px)" }}>

          {/* ORBS */}
          <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:"radial-gradient(circle,rgba(230,50,50,0.08),transparent 70%)", animation:"pulseOrb 6s ease-in-out infinite", pointerEvents:"none", zIndex:0 }} />
          <div style={{ position:"fixed", bottom:"-150px", left:"5%", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle,rgba(240,160,48,0.05),transparent 70%)", animation:"pulseOrb 8s ease-in-out infinite reverse", pointerEvents:"none", zIndex:0 }} />

          {/* PAGE HEADER */}
          <div className="fade-up-s" style={{ marginBottom:"1.8rem", position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
              <div style={{ width:"24px", height:"2px", background:"linear-gradient(90deg,#e63232,#f0a030)", borderRadius:"2px" }} />
              <span style={{ fontSize:"0.6rem", letterSpacing:"4px", textTransform:"uppercase", background:"linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:700 }}>
                Welcome back{profile?.Name ? `, ${profile.Name.split(" ")[0]}` : ""}
              </span>
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.8rem", background:"linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"3px", lineHeight:1, margin:0 }}>
              SUPPLIER DASHBOARD
            </h1>
            <div style={{ fontSize:"0.74rem", color:"#a89888", marginTop:"6px" }}>
              {loading ? "Fetching your shipments..." : "Live data · Updated just now"}
            </div>
          </div>

          {loading ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"40vh", gap:"1rem", position:"relative", zIndex:1 }}>
              <div className="spinner-s" />
              <div style={{ color:"#7a6a60", fontSize:"0.82rem" }}>Loading your dashboard...</div>
            </div>
          ) : (
            <div style={{ position:"relative", zIndex:1 }}>

              {/* ── STAT CARDS ── */}
              <div className="fade-up-s-1" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"18px" }}>
                {statCards.map((card, i) => (
                  <div key={i} className="stat-card-s">
                    <div className="card-top-s" />
                    <div style={{ padding:"1.3rem 1.5rem" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                        <div style={{ fontSize:"0.58rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"#6a5a50", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{card.label}</div>
                        <div style={{ fontSize:"1.1rem", opacity:0.7 }}>{card.icon}</div>
                      </div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3.2rem", color:card.color, letterSpacing:"3px", lineHeight:1, textShadow:`0 0 20px ${card.color}33` }}>
                        {card.value}
                      </div>
                      <div style={{ fontSize:"0.68rem", color:"#7a6a60", marginTop:"4px", marginBottom:"10px", fontFamily:"'Inter',sans-serif" }}>{card.sub}</div>
                      <div style={{ height:"3px", background:"rgba(255,255,255,0.04)", borderRadius:"999px", overflow:"hidden" }}>
                        <div className="bar-fill-s" style={{ width: animated ? `${card.pct}%` : "0%", background:`linear-gradient(90deg,#e63232,${card.color})` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── BOTTOM GRID ── */}
              <div className="fade-up-s-2" style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:"16px", alignItems:"stretch" }}>

                {/* Quick Stats */}
                <div className="card-s" style={{ position:"sticky", top:"80px" }}>
                  <div className="card-top-s" />
                  <div style={{ padding:"1.4rem 1.5rem" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                      <div style={{ width:"3px", height:"14px", background:"linear-gradient(to bottom,#e63232,#f0a030)", borderRadius:"2px" }} />
                      <div style={{ fontSize:"0.6rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"#6a5a50", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Analytics</div>
                    </div>
                    <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", color:"#e0d8d0", letterSpacing:"2px", margin:"0 0 1.4rem" }}>QUICK STATS</h3>

                    {/* On-Time Rate */}
                    {(() => {
                      const onTimeCount = shipments.filter(s => s.Status !== "Delayed").length;
                      const onTimePct   = totalShipments ? Math.round((onTimeCount / totalShipments) * 100) : 0;
                      return (
                        <div style={{ marginBottom:"1.4rem" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                            <span style={{ fontSize:"0.72rem", color:"#7a6a60", fontFamily:"'Inter',sans-serif", fontWeight:500 }}>On-Time Rate</span>
                            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", color: onTimePct >= 70 ? "#e8c090" : "#e63232", letterSpacing:"2px" }}>{onTimePct}%</span>
                          </div>
                          <div style={{ height:"4px", background:"rgba(255,255,255,0.04)", borderRadius:"999px", overflow:"hidden" }}>
                            <div className="bar-fill-s" style={{ width: animated ? `${onTimePct}%` : "0%", background:"linear-gradient(90deg,#e63232,#f0a030)" }} />
                          </div>
                        </div>
                      );
                    })()}

                    {/* At Risk */}
                    <div style={{ marginBottom:"1.4rem", padding:"1rem", background:"rgba(255,255,255,0.02)", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#4a3a35", fontWeight:700, marginBottom:"6px", fontFamily:"'Inter',sans-serif" }}>At Risk</div>
                      <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color: atRisk > 0 ? "#f0a030" : "#e8c090", letterSpacing:"2px" }}>{atRisk}</span>
                        <span style={{ fontSize:"0.72rem", color:"#5a4a45", fontFamily:"'Inter',sans-serif" }}>shipment{atRisk !== 1 ? "s" : ""}</span>
                      </div>
                      <div style={{ fontSize:"0.68rem", color:"#5a4a45", fontFamily:"'Inter',sans-serif" }}>
                        {atRisk > 0 ? "May face delays soon" : "All shipments on track"}
                      </div>
                    </div>

                    {/* Avg Delay */}
                    {(() => {
                      const delayedList = shipments.filter(s => s.Status === "Delayed" && s.DelayDuration);
                      const avgDelay    = delayedList.length ? Math.round(delayedList.reduce((sum, s) => sum + (s.DelayDuration || 0), 0) / delayedList.length) : 0;
                      return (
                        <div style={{ marginBottom:"1.4rem", padding:"1rem", background:"rgba(255,255,255,0.02)", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#4a3a35", fontWeight:700, marginBottom:"6px", fontFamily:"'Inter',sans-serif" }}>Avg Delay</div>
                          <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color: avgDelay > 0 ? "#e63232" : "#e8c090", letterSpacing:"2px" }}>{avgDelay}</span>
                            <span style={{ fontSize:"0.72rem", color:"#5a4a45", fontFamily:"'Inter',sans-serif" }}>days avg</span>
                          </div>
                          <div style={{ fontSize:"0.68rem", color:"#5a4a45", fontFamily:"'Inter',sans-serif" }}>
                            {delayedList.length > 0 ? `across ${delayedList.length} delayed shipment${delayedList.length > 1 ? "s" : ""}` : "No delays recorded"}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Total Delivered */}
                    <div style={{ padding:"1rem", background:"rgba(255,255,255,0.02)", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#4a3a35", fontWeight:700, marginBottom:"6px", fontFamily:"'Inter',sans-serif" }}>Delivered</div>
                      <div style={{ display:"flex", alignItems:"baseline", gap:"4px" }}>
                        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color:"#e8c090", letterSpacing:"2px" }}>{delivered}</span>
                        <span style={{ fontSize:"0.72rem", color:"#5a4a45", fontFamily:"'Inter',sans-serif" }}>of {totalShipments} total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Shipments Table */}
                <div className="card-s" style={{ display:"flex", flexDirection:"column" }}>
                  <div className="card-top-s" />

                  {/* Header */}
                  <div style={{ padding:"1.2rem 1.6rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                        <div style={{ width:"3px", height:"12px", background:"linear-gradient(to bottom,#e63232,#f0a030)", borderRadius:"2px" }} />
                        <div style={{ fontSize:"0.6rem", letterSpacing:"2.5px", textTransform:"uppercase", color:"#6a5a50", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>Live Feed</div>
                        <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#e63232", animation:"pulse 2s infinite", boxShadow:"0 0 5px rgba(230,50,50,0.5)" }} />
                      </div>
                      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", color:"#e0d8d0", letterSpacing:"2px", margin:0 }}>RECENT SHIPMENTS</h2>
                    </div>
                    <button
                      onClick={() => navigate("/supplier/shipments")}
                      style={{ background:"transparent", color:"#e63232", border:"1px solid rgba(230,50,50,0.35)", padding:"8px 18px", borderRadius:"8px", fontSize:"0.72rem", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", fontFamily:"'Inter',sans-serif", transition:"all 0.25s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(230,50,50,0.08)"; e.currentTarget.style.transform="translateY(-1px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.transform="translateY(0)"; }}
                    >All Shipments →</button>
                  </div>

                  {/* Table Header */}
                  <div style={{ display:"grid", gridTemplateColumns:"110px 1fr 1.2fr 90px 110px 1fr", padding:"10px 20px", background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    {["Shipment ID","Customer","Route","ETA","Status","Delay Code"].map(h => (
                      <div key={h} style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#5a4a45", fontWeight:700, fontFamily:"'Inter',sans-serif" }}>{h}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  <div style={{ flex:1 }}>
                    {recentShipments.length === 0 ? (
                      <div style={{ padding:"4rem", textAlign:"center" }}>
                        <div style={{ fontSize:"2.5rem", marginBottom:"1rem", opacity:0.4 }}>📦</div>
                        <div style={{ color:"#6a5a50", fontSize:"0.82rem", fontFamily:"'Inter',sans-serif" }}>No shipments yet — add one to get started</div>
                        <button
                          onClick={() => navigate("/supplier/add-shipment")}
                          style={{ marginTop:"1.2rem", background:"linear-gradient(135deg,#e63232,#f0a030)", border:"none", borderRadius:"8px", padding:"10px 24px", color:"#fff", fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:"0.8rem", cursor:"pointer", letterSpacing:"1px" }}
                        >+ Add First Shipment</button>
                      </div>
                    ) : recentShipments.map((ship, i) => {
                      const sc = statusConfig(ship.Status);
                      return (
                        <div key={i} className="ship-row-s"
                          onClick={() => navigate("/supplier/shipments")}
                          style={{ borderBottom: i < recentShipments.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animation:`rowIn 0.3s ${i * 0.06}s ease forwards`, opacity:0 }}
                        >
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.88rem", letterSpacing:"1px", background:"linear-gradient(135deg,#f0a030,#e63232)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{ship.ShipmentId}</div>
                          <div style={{ fontSize:"0.8rem", color:"#d4c4b8", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", paddingRight:"8px", fontFamily:"'Inter',sans-serif" }}>{ship.Customer || ship.Destination}</div>
                          <div style={{ fontSize:"0.78rem", display:"flex", alignItems:"center", gap:"4px", fontFamily:"'Inter',sans-serif" }}>
                            <span style={{ color:"#9a8a82" }}>{ship.Origin}</span>
                            <span style={{ color:"#e63232", fontSize:"0.65rem" }}>→</span>
                            <span style={{ color:"#9a8a82" }}>{ship.Destination}</span>
                          </div>
                          <div style={{ fontSize:"0.78rem", color:"#9a8a82", fontFamily:"'Inter',sans-serif" }}>
                            {new Date(ship.ETA).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}
                          </div>
                          <div>
                            <span style={{ fontSize:"0.66rem", padding:"3px 9px", borderRadius:"999px", fontWeight:600, fontFamily:"'Inter',sans-serif", background:sc.bg, color:sc.color, border:`1px solid ${sc.border}`, display:"inline-flex", alignItems:"center", gap:"4px" }}>
                              {sc.dot && <span style={{ width:"4px", height:"4px", borderRadius:"50%", background:sc.color, animation:"pulse 2s infinite", flexShrink:0 }} />}
                              {ship.Status}
                            </span>
                          </div>
                          <div style={{ fontSize:"0.78rem", color: ship.DelayReason?.Code ? "#e63232" : "#3a2a25", fontFamily:"'Inter',sans-serif" }}>
                            {ship.DelayReason?.Code || "—"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {recentShipments.length > 0 && recentShipments.length < 3 && (
                    <div style={{ padding:"1.2rem 1.6rem", borderTop:"1px solid rgba(255,255,255,0.04)", marginTop:"auto" }}>
                      <div
                        onClick={() => navigate("/supplier/add-shipment")}
                        style={{ padding:"14px 18px", background:"linear-gradient(135deg,rgba(230,50,50,0.08),rgba(240,160,48,0.06))", border:"1px solid rgba(230,50,50,0.2)", borderRadius:"10px", cursor:"pointer", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", transition:"all 0.25s" }}
                        onMouseEnter={e => { e.currentTarget.style.background="linear-gradient(135deg,rgba(230,50,50,0.14),rgba(240,160,48,0.1))"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(230,50,50,0.15)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background="linear-gradient(135deg,rgba(230,50,50,0.08),rgba(240,160,48,0.06))"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
                      >
                        <div>
                          <div style={{ fontSize:"0.6rem", letterSpacing:"2px", textTransform:"uppercase", color:"#5a4a45", fontWeight:700, marginBottom:"3px", fontFamily:"'Inter',sans-serif" }}>Get started</div>
                          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:"2px", background:"linear-gradient(90deg,#e0d8d0,#e63232)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ADD YOUR FIRST SHIPMENT →</div>
                        </div>
                        <div style={{ fontSize:"1.8rem", opacity:0.4 }}>🚚</div>
                      </div>
                    </div>
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