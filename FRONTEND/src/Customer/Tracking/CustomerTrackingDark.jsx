import { useState } from "react";
import CustomerSidebarDark from "../Components/CustomerSidebarDark";
import CustomerNavbarDark from "../Components/CustomerNavbarDark";

const API = "http://localhost:5000/api/shipments";

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
    case "On Time":   return { color: "#4ade80", border: "rgba(74,222,128,0.25)",  bg: "rgba(74,222,128,0.08)",  glow: "rgba(74,222,128,0.15)" };
    case "Delayed":   return { color: "#f87171", border: "rgba(248,113,113,0.25)", bg: "rgba(248,113,113,0.08)", glow: "rgba(248,113,113,0.15)" };
    case "Delivered": return { color: "#60a5fa", border: "rgba(96,165,250,0.25)",  bg: "rgba(96,165,250,0.08)",  glow: "rgba(96,165,250,0.15)" };
    default:          return { color: "#fbbf24", border: "rgba(251,191,36,0.25)",  bg: "rgba(251,191,36,0.08)",  glow: "rgba(251,191,36,0.15)" };
  }
};

export default function CustomerTrackingDark({ toggleTheme }) {
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseOrb  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(32px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes shimmer   { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }

        .fade-up-d   { animation: fadeUp 0.55s ease forwards; }
        .fade-up-d-1 { animation: fadeUp 0.55s 0.08s ease forwards; opacity: 0; }
        .fade-up-d-2 { animation: fadeUp 0.55s 0.16s ease forwards; opacity: 0; }
        .fade-up-d-3 { animation: fadeUp 0.55s 0.24s ease forwards; opacity: 0; }
        .slide-up-d  { animation: slideUp 0.45s cubic-bezier(0.34,1.1,0.64,1) forwards; }

        .search-btn-d {
          background: transparent;
          color: #e63232;
          border: 1px solid rgba(230,50,50,0.45);
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
          font-family: 'Inter', sans-serif;
        }
        .search-btn-d:hover:not(:disabled) {
          background: rgba(230,50,50,0.08);
          border-color: rgba(230,50,50,0.7);
          box-shadow: 0 0 24px rgba(230,50,50,0.15);
          transform: translateY(-1px);
        }
        .search-btn-d:disabled { opacity: 0.45; cursor: not-allowed; }

        .track-input-d {
          flex: 1;
          height: 52px;
          padding: 0 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #e0d8d0;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.25s;
          box-sizing: border-box;
        }
        .track-input-d::placeholder { color: #3a3030; }
        .track-input-d:focus {
          outline: none;
          border-color: rgba(230,50,50,0.45);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 4px rgba(230,50,50,0.06);
        }

        .spinner-d {
          width: 24px; height: 24px;
          border: 2px solid rgba(230,50,50,0.15);
          border-top-color: #e63232;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarDark
        toggleTheme={toggleTheme}
        pageTitle="Track Shipment"
        pageSubtitle="Live Tracking"
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>

          {/* AMBIENT ORBS */}
          <div style={{ position: "fixed", top: "-120px", right: "-120px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.09), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-160px", left: "-80px", width: "580px", height: "580px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.06), transparent 70%)", animation: "pulseOrb 9s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {/* HEADER */}
          <header className="fade-up-d" style={{ width: "100%", maxWidth: "720px", paddingTop: "1.5rem", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{ width: "28px", height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", borderRadius: "2px" }} />
              <span style={{ fontSize: "0.58rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Live Tracking</span>
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.4rem", background: "linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "4px", lineHeight: 1, margin: "0 0 10px" }}>
              TRACK SHIPMENT
            </h1>
            <p style={{ fontSize: "0.84rem", color: "#7a6a60", margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Enter your shipment ID to see real-time status, location, and estimated arrival.
            </p>
          </header>

          {/* SEARCH */}
          <div className="fade-up-d-1" style={{ width: "100%", maxWidth: "720px", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                className="track-input-d"
                type="text"
                placeholder="e.g. SHP-00123"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
              <button className="search-btn-d" onClick={handleSearch} disabled={loading || !trackingId.trim()}>
                {loading ? <div className="spinner-d" /> : "Track"}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && !loading && (
            <div className="slide-up-d" style={{ width: "100%", maxWidth: "720px", marginBottom: "2rem", padding: "1.1rem 1.4rem", borderRadius: "10px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", fontSize: "0.84rem", display: "flex", alignItems: "center", gap: "10px", position: "relative", zIndex: 1, fontFamily: "'Inter', sans-serif" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.85rem" }}>✕</div>
              {error}
            </div>
          )}

          {/* RESULT */}
          {shipment && !loading && (
            <div style={{ width: "100%", maxWidth: "720px", position: "relative", zIndex: 1 }}>

              {/* STATUS BADGE + ETA ROW */}
              <div className="fade-up-d" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.8rem", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", background: "linear-gradient(135deg,#f0a030,#e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>{shipment.ShipmentId}</span>
                  <span style={{ fontSize: "0.72rem", padding: "5px 13px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter', sans-serif", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: `0 0 14px ${sc.glow}` }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: sc.color, animation: shipment.Status === "In Transit" ? "pulse 2s infinite" : "none" }} />
                    {shipment.Status}
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#7a6a60", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ color: "#5a4a40" }}>ETA</span>
                  <span style={{ color: "#d4c4b8", fontWeight: 600, fontSize: "0.88rem" }}>
                    {new Date(shipment.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* TIMELINE STEPPER */}
              <div className="fade-up-d-1" style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.015))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite" }} />
                <div style={{ padding: "2rem 1.8rem" }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "#5a4a40", fontWeight: 700, marginBottom: "1.8rem", fontFamily: "'Inter', sans-serif" }}>Shipment Progress</div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                    {STEPS.map((step, i) => {
                      const done    = i <= activeStep;
                      const current = i === activeStep;
                      return (
                        <div key={step.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          {i > 0 && (
                            <div style={{ position: "absolute", top: "20px", right: "50%", width: "100%", height: "2px", background: i <= activeStep ? "linear-gradient(90deg,#e63232,#f0a030)" : "rgba(255,255,255,0.06)", zIndex: 0, transform: "translateY(-50%)" }} />
                          )}
                          <div style={{
                            width: "40px", height: "40px", borderRadius: "50%", zIndex: 1,
                            background: current ? "linear-gradient(135deg,#e63232,#f0a030)" : done ? "rgba(230,50,50,0.15)" : "rgba(255,255,255,0.04)",
                            border: current ? "none" : done ? "1px solid rgba(230,50,50,0.35)" : "1px solid rgba(255,255,255,0.07)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1rem",
                            boxShadow: current ? "0 0 24px rgba(230,50,50,0.35)" : "none",
                            transition: "all 0.3s", flexShrink: 0,
                          }}>
                            {done && !current
                              ? <span style={{ color: "#e63232", fontSize: "0.9rem", fontWeight: 700 }}>✓</span>
                              : <span style={{ fontSize: current ? "1.1rem" : "0.95rem", opacity: done ? 1 : 0.3 }}>{step.icon}</span>
                            }
                          </div>
                          <div style={{ marginTop: "10px", textAlign: "center", padding: "0 4px" }}>
                            <div style={{ fontSize: "0.68rem", fontWeight: current ? 700 : 500, color: current ? "#f0a030" : done ? "#a89888" : "#4a3a35", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif", lineHeight: 1.3, transition: "color 0.3s" }}>
                              {step.key}
                            </div>
                            <div style={{ fontSize: "0.6rem", color: done ? "#6a5a50" : "#2a1a15", marginTop: "3px", fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}>
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {shipment.Status === "Delayed" && (
                    <div style={{ marginTop: "1.8rem", padding: "0.9rem 1.1rem", borderRadius: "8px", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.18)", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#f87171", fontSize: "0.9rem" }}>⚠</span>
                      <div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f87171", marginBottom: "2px", fontFamily: "'Inter', sans-serif" }}>Shipment Delayed</div>
                        <div style={{ fontSize: "0.74rem", color: "#a87878", fontFamily: "'Inter', sans-serif" }}>
                          {shipment.DelayReason ? `Reason: ${shipment.DelayReason}` : "Reason not specified."}
                          {shipment.DelayDuration > 0 && ` · Estimated delay: +${shipment.DelayDuration}h`}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="fade-up-d-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.01))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", opacity: 0.6 }} />
                  <div style={{ padding: "1.4rem 1.5rem" }}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "#5a4a40", fontWeight: 700, marginBottom: "1rem", fontFamily: "'Inter', sans-serif" }}>Route</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.6rem", color: "#5a4a40", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Inter', sans-serif" }}>Origin</div>
                        <div style={{ fontSize: "0.92rem", color: "#d4c4b8", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{shipment.Origin}</div>
                      </div>
                      <div style={{ fontSize: "1.1rem", color: "#e63232", fontWeight: 700, flexShrink: 0 }}>→</div>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={{ fontSize: "0.6rem", color: "#5a4a40", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "1.5px", fontFamily: "'Inter', sans-serif" }}>Destination</div>
                        <div style={{ fontSize: "0.92rem", color: "#d4c4b8", fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{shipment.Destination}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(240,160,48,0.01))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden" }}>
                  <div style={{ height: "2px", background: "linear-gradient(90deg,#f0a030,#e63232)", opacity: 0.6 }} />
                  <div style={{ padding: "1.4rem 1.5rem" }}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "#5a4a40", fontWeight: 700, marginBottom: "0.8rem", fontFamily: "'Inter', sans-serif" }}>Estimated Arrival</div>
                    <div style={{ fontSize: "1.5rem", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2px", background: "linear-gradient(135deg,#fff,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {new Date(shipment.ETA).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "#7a6a60", marginTop: "2px", fontFamily: "'Inter', sans-serif" }}>
                      {new Date(shipment.ETA).toLocaleDateString("en-GB", { year: "numeric" })}
                      {" · "}
                      {new Date(shipment.ETA).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CARRIER CARD */}
              <div className="fade-up-d-3" style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.015))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", marginBottom: "2rem" }}>
                <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s ease infinite" }} />
                <div style={{ padding: "1.4rem 1.8rem" }}>
                  <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", color: "#5a4a40", fontWeight: 700, marginBottom: "1.2rem", fontFamily: "'Inter', sans-serif" }}>Carrier Details</div>
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
                        <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a40", fontWeight: 600, marginBottom: "5px", fontFamily: "'Inter', sans-serif" }}>{label}</div>
                        <div style={{ fontSize: "0.88rem", color: "#c8b8b0", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!shipment && !loading && !error && !searched && (
            <div className="fade-up-d-2" style={{ textAlign: "center", marginTop: "3rem", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "1rem", opacity: 0.25 }}>📦</div>
              <div style={{ fontSize: "0.9rem", color: "#5a4a40", fontFamily: "'Inter', sans-serif" }}>Enter a shipment ID above to begin tracking</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}