import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const WORDS = ["EVERY MILE.", "EVERY DELAY.", "EVERY ROUTE.", "THE FUTURE."];

export default function AboutPageDark({ toggleTheme }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const hover = { transition: "transform 0.2s, box-shadow 0.2s" };

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Partners", path: "#" },
    { label: "Features", path: "/features" },
    { label: "Team", path: "#" },
    { label: "Contact", path: "#" },
  ];

  return (
    <div style={{ background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(7,6,10,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div onClick={() => navigate("/")} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "4px", background: "linear-gradient(90deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" }}>
          SHIPSENSE
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {navLinks.map(l => (
            <li key={l.label}>
              <a href="#"
                onClick={(e) => { e.preventDefault(); if (l.path !== "#") navigate(l.path); }}
                style={{ color: l.label === "About" ? "#f0a030" : "#666", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase", transition: "color 0.2s", borderBottom: l.label === "About" ? "1px solid #f0a030" : "none", paddingBottom: l.label === "About" ? "2px" : "0" }}
                onMouseEnter={e => e.target.style.color = "#f0a030"}
                onMouseLeave={e => e.target.style.color = l.label === "About" ? "#f0a030" : "#666"}
              >{l.label}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* THEME TOGGLE */}
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "#666", textTransform: "uppercase" }}>🌙</span>
            <div style={{ width: "44px", height: "24px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", position: "relative", transition: "background 0.3s" }}>
              <div style={{ position: "absolute", top: "3px", left: "3px", width: "18px", height: "18px", borderRadius: "50%", background: "linear-gradient(135deg, #e63232, #f0a030)", transition: "transform 0.3s" }} />
            </div>
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "#444", textTransform: "uppercase" }}>☀️</span>
          </div>
          <button style={{ background: "linear-gradient(135deg, #e63232, #f0a030)", color: "#fff", border: "none", padding: "0.6rem 1.6rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(230,50,50,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >LOGIN</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10rem 4rem 6rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,30,30,0.2) 0%, rgba(196,30,30,0.06) 40%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", fontSize: "16vw", fontFamily: "'Bebas Neue', sans-serif", color: "transparent", WebkitTextStroke: "1px rgba(196,30,30,0.06)", userSelect: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0, animation: "floatBg 8s ease-in-out infinite" }}>ABOUT US</div>

        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: "1px solid rgba(196,30,30,0.3)", borderRadius: "999px", background: "rgba(196,30,30,0.05)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e63232", display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#e08080" }}>Our Story</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 0.92, marginBottom: "1.5rem", letterSpacing: "1px" }}>
            <span style={{ display: "block", background: "linear-gradient(135deg, #ffffff, #c8b8b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BUILT FOR SUPPLY CHAINS</span>
            <span style={{ display: "block", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>THAT CANNOT AFFORD TO WAIT.</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "600px", margin: "0 auto", fontWeight: 300 }}>
            ShipSense was built to bring clarity, intelligence, and accountability to modern supply chain management — because every delayed shipment has a story, and every story deserves an answer.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: "6rem 4rem", background: "#0a0608" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Our Mission</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              TRANSPARENCY AT EVERY<br />MILE OF THE JOURNEY.
            </h2>
            <p style={{ fontSize: "0.92rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300, marginBottom: "1.2rem" }}>
              We believe supply chains should be transparent, predictable, and intelligent. Our mission is to eliminate the uncertainty that plagues logistics networks worldwide — giving every stakeholder, from warehouse to customer, the clarity they deserve.
            </p>
            <p style={{ fontSize: "0.92rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300 }}>
              By combining real-time tracking with AI-driven ETA prediction and structured delay analysis, ShipSense transforms reactive logistics into proactive intelligence.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "🎯", title: "PRECISION", desc: "Every ETA prediction is backed by machine learning trained on real carrier and route data." },
              { icon: "🔍", title: "TRANSPARENCY", desc: "Standardized delay reason codes ensure every stakeholder knows exactly why a shipment is late." },
              { icon: "⚡", title: "SPEED", desc: "Real-time updates and live operations feed keep your team ahead of disruptions before they escalate." },
            ].map((v, i) => (
              <div key={i} style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", padding: "1.2rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", ...hover }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(196,30,30,0.3)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(196,30,30,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: "1.4rem", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(196,30,30,0.08)", borderRadius: "8px", border: "1px solid rgba(196,30,30,0.15)", flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "2px", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem" }}>{v.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "#6a5e5e", lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{ padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>The Problem</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1rem" }}>
              WHY TRADITIONAL SUPPLY CHAINS FAIL.
            </h2>
            <p style={{ fontSize: "0.92rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "600px", margin: "0 auto", fontWeight: 300 }}>
              The global supply chain industry loses billions annually to avoidable delays. The root cause is almost always the same — a lack of real-time visibility and no structured way to understand why things go wrong.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { icon: "🌫️", problem: "NO VISIBILITY", desc: "Shipments disappear into a black box the moment they leave the warehouse. Stakeholders are left guessing ETA based on outdated spreadsheets and phone calls." },
              { icon: "❓", problem: "UNEXPLAINED DELAYS", desc: "When shipments are late, there is rarely a clear reason provided. Customers are told 'it's delayed' with no context — damaging trust and revenue." },
              { icon: "🎲", problem: "ETA IS GUESSWORK", desc: "Traditional ETA estimates are static, calculated once at dispatch and never updated. They don't account for weather, port congestion, customs, or carrier issues." },
            ].map((p, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "2rem", ...hover }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(196,30,30,0.3)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,30,30,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "2px", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.8rem" }}>{p.problem}</h3>
                <p style={{ fontSize: "0.82rem", color: "#6a5e5e", lineHeight: 1.8, fontWeight: 300 }}>{p.desc}</p>
              </div>
            ))}
          </div>
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

      {/* CTA */}
      <section style={{ padding: "7rem 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,30,30,0.15) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 5s ease-in-out infinite" }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Get Started</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1.2rem" }}>
            READY TO TRACK SMARTER?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "480px", margin: "0 auto 2.5rem", fontWeight: 300 }}>
            Join the platform that gives your supply chain the intelligence it deserves. Real-time tracking, AI predictions, and full transparency — all in one place.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={{ background: "linear-gradient(135deg, #e63232, #f0a030)", color: "#fff", border: "none", padding: "1rem 2.5rem", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(230,50,50,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >GET STARTED</button>
            <button style={{ background: "transparent", color: "#6a5e5e", border: "1px solid rgba(255,255,255,0.08)", padding: "1rem 2rem", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,160,48,0.4)"; e.currentTarget.style.color = "#f0a030"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6a5e5e"; }}
            >LEARN MORE</button>
          </div>
        </div>
      </section>

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