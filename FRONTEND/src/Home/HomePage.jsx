import { useEffect, useState } from "react";
import "../App.css";

const WORDS = ["ON TIME.", "EVERY DELAY.", "EVERY ROUTE.", "THE FUTURE."];

export default function App() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const word = WORDS[wordIndex];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), 55);
    } else {
      setDeleting(false);
      setWordIndex((wordIndex + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex]);

  const hover = { transition: "transform 0.2s, box-shadow 0.2s" };

  return (
    <div style={{ background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(7,6,10,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "4px", background: "linear-gradient(90deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          SHIPSENSE
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {["About", "Platform", "Features", "Contact"].map(l => (
            <li key={l}>
              <a href="#" style={{ color: "#666", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#f0a030"}
                onMouseLeave={e => e.target.style.color = "#666"}
              >{l}</a>
            </li>
          ))}
        </ul>
        <button style={{ background: "linear-gradient(135deg, #e63232, #f0a030)", color: "#fff", border: "none", padding: "0.6rem 1.6rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(230,50,50,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
        >LOGIN</button>
      </nav>

      {/* HERO — Split layout with tracker card */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "8rem 4rem 4rem", position: "relative", overflow: "hidden", gap: "4rem" }}>

        {/* Glow orbs */}
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,30,30,0.22) 0%, rgba(196,30,30,0.08) 40%, transparent 70%)", top: "40%", left: "30%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.15) 0%, rgba(240,100,30,0.06) 50%, transparent 70%)", top: "60%", left: "70%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 6s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,30,30,0.1) 0%, transparent 70%)", top: "20%", left: "10%", zIndex: 0 }} />

        {/* Ghost text */}
        <div style={{ position: "absolute", fontSize: "18vw", fontFamily: "'Bebas Neue', sans-serif", color: "transparent", WebkitTextStroke: "1px rgba(196,30,30,0.06)", userSelect: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0, animation: "floatBg 8s ease-in-out infinite" }}>SHIPSENSE</div>

        {/* LEFT — Text */}
        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: "1px solid rgba(196,30,30,0.3)", borderRadius: "999px", background: "rgba(196,30,30,0.05)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e63232", display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#e08080" }}>AI-Powered Supply Chain</span>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.92, marginBottom: "1.8rem", letterSpacing: "1px" }}>
            <span style={{ display: "block", background: "linear-gradient(135deg, #ffffff 0%, #c8b8b0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DELIVER</span>
            <span style={{ display: "block", background: "linear-gradient(135deg, #ffffff 0%, #c8b8b0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CERTAINTY.</span>
            <span style={{ display: "block", background: "linear-gradient(135deg, #e63232 0%, #f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minHeight: "1.1em", fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>
              {displayed}<span style={{ animation: "blink 0.8s infinite", color: "#f0a030" }}>|</span>
            </span>
          </h1>

          <p style={{ fontSize: "0.92rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "440px", marginBottom: "2.5rem", fontWeight: 300 }}>
            Intelligent ETA prediction and delay analysis for supply chains that demand precision. When a shipment moves, you know. When it doesn't, you know why.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ background: "linear-gradient(135deg, #e63232, #f0a030)", color: "#fff", border: "none", padding: "1rem 2.5rem", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(230,50,50,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >GET STARTED</button>
            <button style={{ background: "transparent", color: "#6a5e5e", border: "1px solid rgba(255,255,255,0.08)", padding: "1rem 2rem", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = "rgba(240,160,48,0.4)"; e.currentTarget.style.color = "#f0a030"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6a5e5e"; }}
            >LEARN MORE</button>
          </div>
        </div>

        {/* RIGHT — Tracker card from V1 style */}
        <div style={{
          position: "relative", zIndex: 2,
          opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)",
          transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s"
        }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(196,30,30,0.2)", borderRadius: "12px", padding: "1.8rem", position: "relative", backdropFilter: "blur(10px)" }}>
            {/* Pulse dot */}
            <div style={{ position: "absolute", top: "-8px", right: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: "#e63232", animation: "pulseR 2s infinite", boxShadow: "0 0 10px rgba(230,50,50,0.5)" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LIVE OPERATIONS</span>
              <span style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e63232", display: "inline-block", animation: "pulseR 1.5s infinite" }} />
                4 ACTIVE
              </span>
            </div>

            {[
              { icon: "🚢", id: "SHP-4821", route: "Mumbai → Dubai", eta: "On Schedule", ok: true },
              { icon: "✈️", id: "SHP-3309", route: "Delhi → New York", eta: "+2h · Weather", ok: false },
              { icon: "🚛", id: "SHP-5102", route: "Chennai → London", eta: "On Schedule", ok: true },
              { icon: "🚢", id: "SHP-6074", route: "Kolkata → Singapore", eta: "+5h · Customs", ok: false },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div style={{ fontSize: "14px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(196,30,30,0.08)", borderRadius: "4px", border: "1px solid rgba(196,30,30,0.15)" }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "#c8b8b0" }}>{s.id}</div>
                    <div style={{ fontSize: "0.7rem", color: "#4a4040" }}>{s.route}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.62rem", padding: "0.2rem 0.7rem", borderRadius: "2px", fontWeight: 500, letterSpacing: "0.5px", background: s.ok ? "rgba(240,160,48,0.1)" : "rgba(196,30,30,0.1)", color: s.ok ? "#f0a030" : "#e63232", border: `1px solid ${s.ok ? "rgba(240,160,48,0.2)" : "rgba(196,30,30,0.2)"}` }}>{s.ok ? "NOMINAL" : "DELAYED"}</span>
                  <div style={{ fontSize: "0.65rem", color: "#3a3030", marginTop: "2px" }}>{s.eta}</div>
                </div>
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem", marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {[{ val: "94%", label: "Accuracy" }, { val: "2/4", label: "On Time" }, { val: "LOW", label: "Risk" }].map((m, i) => (
                <div key={i} style={{ textAlign: "center", padding: "0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", background: "linear-gradient(135deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.val}</div>
                  <div style={{ fontSize: "0.58rem", color: "#3a3030", letterSpacing: "1px", textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FEED STRIP */}
      <div style={{ background: "#0a0608", borderTop: "1px solid rgba(196,30,30,0.12)", borderBottom: "1px solid rgba(196,30,30,0.12)", padding: "0.8rem 4rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", paddingRight: "2rem", borderRight: "1px solid rgba(196,30,30,0.15)" }}>LIVE INTEL</div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ display: "inline-flex", gap: "3rem", animation: "scrollX 25s linear infinite", whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, r) =>
              ["🚢 SHP-4821 Mumbai → Dubai · NOMINAL", "✈️ SHP-3309 Delhi → NYC · DELAYED · WEATHER", "🚛 SHP-5102 Chennai → London · NOMINAL", "🚢 SHP-6074 Kolkata → Singapore · DELAYED · CUSTOMS", "✈️ SHP-7741 Hyderabad → Frankfurt · NOMINAL"].map((item, i) => (
                <span key={`${r}-${i}`} style={{ fontSize: "0.72rem", color: "#3a3a3a", letterSpacing: "1px" }}>{item}</span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <section style={{ padding: "7rem 4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Platform</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>WHAT WE DO</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "auto auto", gap: "1rem", maxWidth: "1100px", margin: "0 auto" }}>

          {/* Big card */}
          <div style={{ gridColumn: "1/3", background: "linear-gradient(135deg, rgba(196,30,30,0.12), rgba(240,160,48,0.06))", border: "1px solid rgba(196,30,30,0.2)", borderRadius: "8px", padding: "2.5rem", cursor: "pointer", ...hover, position: "relative", overflow: "hidden" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(196,30,30,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.12), transparent)" }} />
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#f0a030", marginBottom: "1rem" }}>Core Feature</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", background: "linear-gradient(135deg, #ffffff, #e0c8b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1rem" }}>AI-POWERED ETA PREDICTION</h3>
            <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.8, maxWidth: "500px" }}>Machine learning models trained on historical route data, carrier performance, and real-time conditions. Estimates that get smarter with every delivery.</p>
          </div>

          {/* Tall card */}
          <div style={{ gridColumn: "3/4", gridRow: "1/3", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(240,160,48,0.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(240,160,48,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "1rem" }}>Live Now</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#e0d8d0", letterSpacing: "2px", marginBottom: "1.2rem" }}>OPERATIONS FEED</h3>
              {[
                { id: "SHP-4821", ok: true },
                { id: "SHP-3309", ok: false },
                { id: "SHP-5102", ok: true },
                { id: "SHP-6074", ok: false },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: "0.72rem", color: "#555" }}>{s.id}</span>
                  <span style={{ fontSize: "0.58rem", padding: "0.2rem 0.5rem", background: s.ok ? "rgba(240,160,48,0.1)" : "rgba(196,30,30,0.1)", color: s.ok ? "#f0a030" : "#e63232", border: `1px solid ${s.ok ? "rgba(240,160,48,0.2)" : "rgba(196,30,30,0.2)"}` }}>{s.ok ? "NOMINAL" : "DELAYED"}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "1.5rem" }}>
              {[{ val: "94%", label: "Accuracy" }, { val: "2/4", label: "On Time" }].map((m, i) => (
                <div key={i} style={{ padding: "0.7rem", background: "rgba(255,255,255,0.02)", borderRadius: "4px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", background: "linear-gradient(135deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.val}</div>
                  <div style={{ fontSize: "0.58rem", color: "#444", letterSpacing: "1px", textTransform: "uppercase" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom left */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(196,30,30,0.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(196,30,30,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "0.8rem" }}>Categorization</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#e0d8d0", letterSpacing: "2px", marginBottom: "1rem" }}>DELAY REASON CODES</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Weather", "Customs", "Port Congestion", "Carrier Issue", "Documentation"].map((tag, i) => (
                <span key={i} style={{ fontSize: "0.65rem", padding: "0.25rem 0.7rem", background: "rgba(196,30,30,0.08)", border: "1px solid rgba(196,30,30,0.15)", color: "#8a6060", borderRadius: "2px" }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Bottom middle */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(240,160,48,0.3)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(240,160,48,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "0.8rem" }}>Access</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#e0d8d0", letterSpacing: "2px", marginBottom: "0.8rem" }}>ROLE-BASED CONTROL</h3>
            <p style={{ fontSize: "0.78rem", color: "#4a4040", lineHeight: 1.7 }}>Three distinct access levels — Admin, Supplier, Customer. Everyone gets exactly what they need, nothing more.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section style={{ padding: "0 4rem 7rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Access Control</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>YOUR ROLE</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", overflow: "hidden" }}>
          {[
            { num: "01", title: "ADMIN", tag: "FULL ACCESS", desc: "Complete system oversight. Manage all users, shipments, delay codes, and generate performance reports across the network.", tagColor: "#e63232" },
            { num: "02", title: "SUPPLIER", tag: "LIMITED ACCESS", desc: "Create and manage your own shipments. Update statuses, assign delay codes and monitor ETA accuracy for your routes.", tagColor: "#f0a030" },
            { num: "03", title: "CUSTOMER", tag: "READ ONLY", desc: "Track your orders in real-time. View ETAs and delay reasons for your shipments. No editing access.", tagColor: "#888" },
          ].map((r, i) => (
            <div key={i}
              style={{ display: "flex", alignItems: "center", gap: "3rem", padding: "2rem 3rem", background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.3s", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(196,30,30,0.05)"; e.currentTarget.style.paddingLeft = "3.5rem"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.paddingLeft = "3rem"; }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minWidth: "80px" }}>{r.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "0.3rem" }}>{r.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#5a4e4e", lineHeight: 1.6 }}>{r.desc}</div>
              </div>
              <span style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: r.tagColor, padding: "0.4rem 1rem", border: `1px solid ${r.tagColor}40`, borderRadius: "2px", whiteSpace: "nowrap" }}>{r.tag}</span>
              <span style={{ background: "linear-gradient(135deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.2rem" }}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: "#050408", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
        {[{ val: "10K", unit: "+", label: "Shipments Tracked" }, { val: "95", unit: "%", label: "ETA Accuracy" }, { val: "50", unit: "+", label: "Countries" }].map((s, i) => (
          <div key={i} style={{ padding: "3rem", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", letterSpacing: "2px", lineHeight: 1 }}>
              <span style={{ background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</span>
              <span style={{ background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#444", marginTop: "0.5rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "4px", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SHIPSENSE</div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Privacy", "Terms", "Help"].map(l => (
            <a key={l} href="#" style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#333", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#f0a030"}
              onMouseLeave={e => e.target.style.color = "#333"}
            >{l}</a>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: "#222", letterSpacing: "1px" }}>© 2026 SHIPSENSE. ALL RIGHTS RESERVED.</div>
      </footer>

    </div>
  );
}