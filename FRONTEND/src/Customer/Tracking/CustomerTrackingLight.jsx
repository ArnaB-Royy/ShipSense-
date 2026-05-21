import { useState } from "react";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";

const API = "http://localhost:5000/api/shipments";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a", sage: "#8a9e7a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = {
  heading: "'Cormorant Garamond', serif",
  cursive: "'Dancing Script', cursive",
  body: "'DM Sans', sans-serif",
};

const STEPS = [
  { key: "Order Placed",      icon: "📋", desc: "Shipment registered in system" },
  { key: "Picked Up",         icon: "📦", desc: "Package collected from supplier" },
  { key: "In Transit",        icon: "🚚", desc: "En route to destination" },
  { key: "Out for Delivery",  icon: "🏠", desc: "Final mile delivery underway" },
  { key: "Delivered",         icon: "✅", desc: "Package successfully delivered" },
];

const STATUS_STEP_MAP = {
  "On Time":    2,
  "In Transit": 2,
  "Delayed":    2,
  "Delivered":  4,
};

const statusConfig = (status) => {
  switch (status) {
    case "On Time":   return { color: "#5a9e5a", border: "rgba(90,158,90,0.3)",    bg: "rgba(90,158,90,0.08)",    glow: "rgba(90,158,90,0.15)" };
    case "Delayed":   return { color: C.rose,    border: C.borderRose,              bg: C.roseLight,               glow: "rgba(201,132,138,0.2)" };
    case "Delivered": return { color: C.gold,    border: "rgba(196,163,90,0.3)",    bg: C.goldLight,               glow: "rgba(196,163,90,0.15)" };
    default:          return { color: C.inkMid,  border: "rgba(107,87,68,0.3)",     bg: "rgba(107,87,68,0.08)",    glow: "rgba(107,87,68,0.1)" };
  }
};

export default function CustomerTrackingLight({ toggleTheme }) {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [searched, setSearched]     = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  const handleSearch = async () => {
    const id = trackingId.trim();
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      setShipment(null);
      setSearched(true);
      const res  = await fetch(`${API}?search=${encodeURIComponent(id)}`);
      const data = await res.json();
      const found = (data.data || []).find(
        (s) => s.ShipmentId?.toLowerCase() === id.toLowerCase()
      );
      if (found) setShipment(found);
      else setError("No shipment found with that ID. Please check and try again.");
    } catch {
      setError("Unable to reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const activeStep = shipment ? (STATUS_STEP_MAP[shipment.Status] ?? 2) : -1;
  const sc = shipment ? statusConfig(shipment.Status) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlow  { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(32px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .fade-up-l   { animation: fadeUp 0.55s ease forwards; }
        .fade-up-l-1 { animation: fadeUp 0.55s 0.08s ease forwards; opacity: 0; }
        .fade-up-l-2 { animation: fadeUp 0.55s 0.16s ease forwards; opacity: 0; }
        .fade-up-l-3 { animation: fadeUp 0.55s 0.24s ease forwards; opacity: 0; }
        .slide-up-l  { animation: slideUp 0.45s cubic-bezier(0.34,1.1,0.64,1) forwards; }

        .search-btn-l {
          background: transparent;
          color: ${C.rose};
          border: 1px solid rgba(201,132,138,0.45);
          padding: 0 28px;
          height: 52px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          white-space: nowrap;
          font-family: ${font.body};
        }
        .search-btn-l:hover:not(:disabled) {
          background: ${C.roseLight};
          border-color: rgba(201,132,138,0.7);
          box-shadow: 0 8px 24px rgba(201,132,138,0.2);
          transform: translateY(-1px);
        }
        .search-btn-l:disabled { opacity: 0.45; cursor: not-allowed; }

        .track-input-l {
          flex: 1;
          height: 52px;
          padding: 0 18px;
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 10px;
          color: ${C.ink};
          font-size: 0.95rem;
          font-family: ${font.body};
          transition: all 0.25s;
          box-sizing: border-box;
        }
        .track-input-l::placeholder { color: ${C.inkFaint}; }
        .track-input-l:focus {
          outline: none;
          border-color: ${C.borderRose};
          box-shadow: 0 0 0 4px rgba(201,132,138,0.08);
        }

        .spinner-l {
          width: 24px; height: 24px;
          border: 2px solid rgba(201,132,138,0.2);
          border-top-color: ${C.rose};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarLight
        toggleTheme={toggleTheme}
        pageTitle="Track Shipment"
        pageSubtitle="Live Tracking"
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>

          {/* AMBIENT ORBS */}
          <div style={{ position: "fixed", top: "-120px", right: "-120px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,132,138,0.12), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-160px", left: "-80px", width: "580px", height: "580px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,163,90,0.08), transparent 70%)", animation: "pulseOrb 9s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* HEADER */}
          <header className="fade-up-l" style={{ width: "100%", maxWidth: "720px", paddingTop: "1.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "28px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
              <span style={{ fontSize: "0.58rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: font.body }}>Live Tracking</span>
            </div>
            <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent", letterSpacing: "1px", lineHeight: 1, margin: "0 0 10px" }}>
              Track Your Shipment
            </h1>
            <p style={{ fontSize: "0.84rem", color: C.inkLight, margin: 0, fontFamily: font.body }}>
              Enter your shipment ID to see real-time status, location, and estimated arrival.
            </p>
          </header>

          {/* SEARCH */}
          <div className="fade-up-l-1" style={{ width: "100%", maxWidth: "720px", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                className="track-input-l"
                type="text"
                placeholder="e.g. SHP-00123"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn-l" onClick={handleSearch} disabled={loading || !trackingId.trim()}>
                {loading ? <div className="spinner-l" /> : "Track"}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && !loading && (
            <div className="slide-up-l" style={{ width: "100%", maxWidth: "720px", marginBottom: "2rem", padding: "1.1rem 1.4rem", borderRadius: "10px", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1, fontFamily: font.body }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(201,132,138,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.85rem" }}>✕</div>
              {error}
            </div>
          )}

          {/* RESULT */}
          {shipment && !loading && (
            <div style={{ width: "100%", maxWidth: "720px", position: "relative", zIndex: 1 }}>

              {/* STATUS BADGE + ETA ROW */}
              <div className="fade-up-l" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px" }}>{shipment.ShipmentId}</span>
                  <span style={{ fontSize: "0.72rem", padding: "5px 13px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: `0 0 14px ${sc.glow}` }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: shipment.Status === "In Transit" ? "pulse 2s infinite" : "none" }} />
                    {shipment.Status}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: C.inkLight, display: "flex", alignItems: "center", gap: "6px", fontFamily: font.body }}>
                  <span style={{ color: C.inkFaint }}>ETA</span>
                  <span style={{ color: C.inkMid, fontWeight: 600, fontSize: "0.88rem" }}>
                    {new Date(shipment.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* TIMELINE STEPPER */}
              <div className="fade-up-l-1" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 4px 24px rgba(201,132,138,0.07)" }}>
                <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
                <div style={{ padding: "2rem 1.8rem" }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "1.8rem", fontFamily: font.body }}>Shipment Progress</div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                    {STEPS.map((step, i) => {
                      const done    = i <= activeStep;
                      const current = i === activeStep;
                      return (
                        <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          {i > 0 && (
                            <div style={{ position: "absolute", top: "20px", right: "50%", width: "100%", height: "2px", background: i <= activeStep ? `linear-gradient(90deg,${C.rose},${C.gold})` : C.border, zIndex: 0, transform: "translateY(-50%)" }} />
                          )}
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "50%", zIndex: 1,
                            background: current ? `linear-gradient(135deg,${C.rose},${C.gold})` : done ? C.roseLight : C.bgDeep,
                            border: current ? "none" : done ? `1px solid ${C.borderRose}` : `1px solid ${C.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1rem",
                            boxShadow: current ? `0 0 20px rgba(201,132,138,0.3)` : "none",
                            transition: "all 0.3s", flexShrink: 0,
                          }}>
                            {done && !current
                              ? <span style={{ color: C.rose, fontSize: "0.9rem", fontWeight: 700 }}>✓</span>
                              : <span style={{ fontSize: current ? "1.1rem" : "0.95rem", opacity: done ? 1 : 0.35 }}>{step.icon}</span>
                            }
                          </div>
                          <div style={{ marginTop: "10px", textAlign: "center", padding: "0 4px" }}>
                            <div style={{ fontSize: "0.68rem", fontWeight: current ? 700 : 500, color: current ? C.rose : done ? C.inkMid : C.inkFaint, letterSpacing: "0.5px", fontFamily: font.body, lineHeight: 1.3, transition: "color 0.3s" }}>
                              {step.key}
                            </div>
                            <div style={{ fontSize: "0.6rem", color: done ? C.inkLight : C.inkFaint, marginTop: "3px", fontFamily: font.body, lineHeight: 1.3 }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {shipment.Status === "Delayed" && (
                    <div style={{ marginTop: "1.8rem", padding: "0.9rem 1.1rem", borderRadius: "8px", background: C.roseLight, border: `1px solid ${C.borderRose}`, display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: C.rose, fontSize: "0.9rem" }}>⚠</span>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.rose, marginBottom: "2px", fontFamily: font.body }}>Shipment Delayed</div>
                        <div style={{ fontSize: "0.74rem", color: C.inkMid, fontFamily: font.body }}>
                          {shipment.DelayReason ? `Reason: ${shipment.DelayReason}` : "Reason not specified."}
                          {shipment.DelayDuration > 0 && ` · Estimated delay: +${shipment.DelayDuration}h`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="fade-up-l-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 16px rgba(201,132,138,0.06)" }}>
                  <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, opacity: 0.7 }} />
                  <div style={{ padding: "1.4rem 1.5rem" }}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "1rem", fontFamily: font.body }}>Route</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.6rem", color: C.inkFaint, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: font.body }}>Origin</div>
                        <div style={{ fontSize: "0.92rem", color: C.inkMid, fontWeight: 600, fontFamily: font.body }}>{shipment.Origin}</div>
                      </div>
                      <div style={{ fontSize: "1.1rem", color: C.rose, fontWeight: 700, flexShrink: 0 }}>→</div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={{ fontSize: "0.6rem", color: C.inkFaint, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: font.body }}>Destination</div>
                        <div style={{ fontSize: "0.92rem", color: C.inkMid, fontWeight: 600, fontFamily: font.body }}>{shipment.Destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 16px rgba(196,163,90,0.06)" }}>
                  <div style={{ height: "2px", background: `linear-gradient(90deg,${C.gold},${C.rose})`, opacity: 0.7 }} />
                  <div style={{ padding: "1.4rem 1.5rem" }}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "0.8rem", fontFamily: font.body }}>Estimated Arrival</div>
                    <div style={{ fontFamily: font.heading, fontSize: "2rem", fontWeight: 600, fontStyle: "italic", color: C.ink, lineHeight: 1 }}>
                      {new Date(shipment.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "4px", fontFamily: font.body }}>
                      {new Date(shipment.ETA).toLocaleDateString("en-GB", { year: "numeric" })}
                      {" · "}
                      {new Date(shipment.ETA).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARRIER CARD */}
              <div className="fade-up-l-3" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 24px rgba(201,132,138,0.07)", marginBottom: "2rem" }}>
                <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />
                <div style={{ padding: "1.4rem 1.8rem" }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "1.2rem", fontFamily: font.body }}>Carrier Details</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.4rem" }}>
                    {[
                      { label: "Supplier",     val: shipment.Supplier },
                      { label: "Shipment ID",  val: shipment.ShipmentId },
                      { label: "Delay",        val: shipment.DelayDuration > 0 ? `+${shipment.DelayDuration}h` : "None" },
                      { label: "Delay Reason", val: shipment.DelayReason || "—" },
                      { label: "Last Updated", val: new Date(shipment.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                      { label: "Created",      val: new Date(shipment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 600, marginBottom: "5px", fontFamily: font.body }}>{label}</div>
                        <div style={{ fontSize: "0.88rem", color: C.inkMid, fontFamily: font.body, fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!shipment && !loading && !error && !searched && (
            <div className="fade-up-l-2" style={{ textAlign: "center", marginTop: "3rem", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem", opacity: 0.2 }}>📦</div>
              <div style={{ fontSize: "0.9rem", color: C.inkFaint, fontFamily: font.body }}>Enter a shipment ID above to begin tracking</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}