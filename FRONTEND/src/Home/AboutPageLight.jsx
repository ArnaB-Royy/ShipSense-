import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg: "#faf6f0",
  bgDeep: "#f3ede4",
  bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a",
  roseDark: "#a85f65",
  roseLight: "rgba(201,132,138,0.15)",
  gold: "#c4a35a",
  goldLight: "rgba(196,163,90,0.15)",
  sage: "#8a9e7a",
  sageLight: "rgba(138,158,122,0.15)",
  ink: "#2e2218",
  inkMid: "#6b5744",
  inkLight: "#a8917a",
  inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)",
  borderRose: "rgba(201,132,138,0.25)",
};

const font = {
  heading: "'Cormorant Garamond', serif",
  cursive: "'Dancing Script', cursive",
  body: "'DM Sans', sans-serif",
};

export default function AboutPage({ toggleTheme }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Partners", path: "#" },
    { label: "Features", path: "features" },
    { label: "Team", path: "#" },
    { label: "Contact", path: "#" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: font.body, overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseR { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes floatBg { 0%, 100% { transform: translate(-50%, -50%) translateY(0px); } 50% { transform: translate(-50%, -50%) translateY(-20px); } }
        @keyframes pulseOrb { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.15); } }
        @keyframes scrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .about-nav-link { color: ${C.inkLight}; text-decoration: none; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.2s; font-family: ${font.body}; font-weight: 500; }
        .about-nav-link:hover { color: ${C.rose}; }
        .about-nav-link.active { color: ${C.rose}; border-bottom: 1px solid ${C.rose}; padding-bottom: 2px; }
        .about-footer-link { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: ${C.inkFaint}; text-decoration: none; transition: color 0.2s; font-family: ${font.body}; }
        .about-footer-link:hover { color: ${C.rose}; }
        .toggle-track { width: 44px; height: 24px; border-radius: 999px; background: rgba(201,132,138,0.15); border: 1px solid rgba(196,163,90,0.3); position: relative; transition: background 0.3s; cursor: pointer; }
        .toggle-thumb { position: absolute; top: 3px; left: 22px; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #c9848a, #c4a35a); transition: transform 0.3s; }
        .hover-card { transition: all 0.3s; }
        .hover-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(201,132,138,0.12) !important; border-color: ${C.rose} !important; }
        .step-card { transition: all 0.3s; }
        .step-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(201,132,138,0.12) !important; }
        .team-card { transition: all 0.3s; }
        .team-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(196,163,90,0.12) !important; }
        .tech-card { transition: all 0.3s; }
        .tech-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.06) !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(250,246,240,0.88)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div onClick={() => navigate("/")} style={{ fontFamily: font.cursive, fontSize: "2.2rem", fontWeight: 600, background: `linear-gradient(90deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px", cursor: "pointer" }}>
          ShipSense
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {navLinks.map(l => (
            <li key={l.label}>
              <a href="#" onClick={(e) => { e.preventDefault(); if (l.path !== "#") navigate(l.path); }} className={`about-nav-link${l.label === "About" ? " active" : ""}`}>{l.label}</a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* THEME TOGGLE */}
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <span style={{ fontSize: "0.85rem" }}>🌙</span>
            <div className="toggle-track"><div className="toggle-thumb" /></div>
            <span style={{ fontSize: "0.85rem" }}>☀️</span>
          </div>
          <button style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, color: "#fff", border: "none", padding: "0.65rem 1.8rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: font.body, transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(201,132,138,0.35)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10rem 4rem 6rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.14) 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", fontSize: "16vw", fontFamily: font.cursive, fontWeight: 600, color: "transparent", WebkitTextStroke: `1px rgba(201,132,138,0.07)`, userSelect: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0, animation: "floatBg 8s ease-in-out infinite" }}>About Us</div>
        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: `1px solid ${C.borderRose}`, borderRadius: "999px", background: C.roseLight }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.rose, display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: C.rose, fontFamily: font.body, fontWeight: 500 }}>Our Story</span>
          </div>
          <h1 style={{ fontFamily: font.heading, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1, marginBottom: "1.5rem", fontWeight: 600, color: C.ink }}>
            Built for Supply Chains<br />
            <span style={{ fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>That Cannot Afford to Wait.</span>
          </h1>
          <p style={{ fontSize: "1rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "600px", margin: "0 auto", fontWeight: 300 }}>
            ShipSense was built to bring clarity, intelligence, and accountability to modern supply chain management — because every delayed shipment has a story, and every story deserves an answer.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: "6rem 4rem", background: C.bgDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Our Mission</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink, lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Transparency at Every<br />
              <span style={{ fontStyle: "italic", color: C.rose }}>Mile of the Journey.</span>
            </h2>
            <p style={{ fontSize: "0.92rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300, marginBottom: "1.2rem" }}>
              We believe supply chains should be transparent, predictable, and intelligent. Our mission is to eliminate the uncertainty that plagues logistics networks worldwide — giving every stakeholder, from warehouse to customer, the clarity they deserve.
            </p>
            <p style={{ fontSize: "0.92rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300 }}>
              By combining real-time tracking with AI-driven ETA prediction and structured delay analysis, ShipSense transforms reactive logistics into proactive intelligence.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: "🎯", title: "Precision", desc: "Every ETA prediction is backed by machine learning trained on real carrier and route data." },
              { icon: "🔍", title: "Transparency", desc: "Standardized delay reason codes ensure every stakeholder knows exactly why a shipment is late." },
              { icon: "⚡", title: "Speed", desc: "Real-time updates and live operations feed keep your team ahead of disruptions before they escalate." },
            ].map((v, i) => (
              <div key={i} className="hover-card" style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", padding: "1.2rem", background: C.bgCard, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: "1.4rem", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", background: C.roseLight, borderRadius: "8px", border: `1px solid ${C.borderRose}`, flexShrink: 0 }}>{v.icon}</div>
                <div>
                  <div style={{ fontFamily: font.heading, fontSize: "1.2rem", fontWeight: 600, color: C.ink, marginBottom: "0.3rem" }}>{v.title}</div>
                  <div style={{ fontSize: "0.82rem", color: C.inkMid, lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</div>
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
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>The Problem</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink, marginBottom: "1rem" }}>
              Why Traditional Supply Chains <span style={{ fontStyle: "italic", color: C.rose }}>Fail.</span>
            </h2>
            <p style={{ fontSize: "0.92rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "600px", margin: "0 auto", fontWeight: 300 }}>
              The global supply chain industry loses billions annually to avoidable delays. The root cause is almost always the same — a lack of real-time visibility and no structured way to understand why things go wrong.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { icon: "🌫️", problem: "No Visibility", desc: "Shipments disappear into a black box the moment they leave the warehouse. Stakeholders are left guessing ETA based on outdated spreadsheets and phone calls." },
              { icon: "❓", problem: "Unexplained Delays", desc: "When shipments are late, there is rarely a clear reason provided. Customers are told 'it's delayed' with no context — damaging trust and revenue." },
              { icon: "🎲", problem: "ETA is Guesswork", desc: "Traditional ETA estimates are static, calculated once at dispatch and never updated. They don't account for weather, port congestion, customs, or carrier issues." },
            ].map((p, i) => (
              <div key={i} className="hover-card" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "2rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{p.icon}</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "1.4rem", fontWeight: 600, color: C.ink, marginBottom: "0.8rem" }}>{p.problem}</h3>
                <p style={{ fontSize: "0.82rem", color: C.inkMid, lineHeight: 1.8, fontWeight: 300 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
     
      {/* STATS */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
        {[{ val: "10K", unit: "+", label: "Shipments Tracked" }, { val: "95", unit: "%", label: "ETA Accuracy" }, { val: "50", unit: "+", label: "Countries" }].map((s, i) => (
          <div key={i} style={{ padding: "3rem", textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontFamily: font.heading, fontSize: "4rem", fontWeight: 600, letterSpacing: "1px", lineHeight: 1 }}>
              <span style={{ color: C.ink }}>{s.val}</span>
              <span style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.unit}</span>
            </div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginTop: "0.5rem", fontFamily: font.body }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section style={{ padding: "7rem 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.1) 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Get Started</div>
          <h2 style={{ fontFamily: font.heading, fontSize: "3.5rem", fontWeight: 600, color: C.ink, marginBottom: "1.2rem" }}>
            Ready to Track <span style={{ fontStyle: "italic", color: C.rose }}>Smarter?</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "480px", margin: "0 auto 2.5rem", fontWeight: 300 }}>
            Join the platform that gives your supply chain the intelligence it deserves. Real-time tracking, AI predictions, and full transparency — all in one place.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, color: "#fff", border: "none", padding: "1rem 2.5rem", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: font.body, transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px rgba(201,132,138,0.35)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >Get Started</button>
            <button style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.border}`, padding: "1rem 2rem", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: font.body, transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.color = C.rose; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; }}
            >Learn More</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ fontFamily: font.cursive, fontSize: "2rem", fontWeight: 600, letterSpacing: "1px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ShipSense</div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Privacy", "Terms", "Help"].map(l => (
            <a key={l} href="#" className="about-footer-link">{l}</a>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: C.inkFaint, letterSpacing: "1px", fontFamily: font.body }}>© 2026 ShipSense. All Rights Reserved.</div>
      </footer>

    </div>
  );
}