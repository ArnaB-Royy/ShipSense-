import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WORDS = ["ON TIME.", "EVERY DELAY.", "EVERY ROUTE.", "THE FUTURE."];

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

export default function HomePageLight({ toggleTheme }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
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

  const hover = { transition: "transform 0.25s, box-shadow 0.25s" };

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Partners", path: "#" },
    { label: "Features", path: "/features" },
    { label: "Team", path: "#" },
    { label: "Contact", path: "#" },
  ];

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: font.body, overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseR { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes pulseOrb { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.15); } }
        @keyframes floatBg { 0%, 100% { transform: translate(-50%, -50%) translateY(0px); } 50% { transform: translate(-50%, -50%) translateY(-20px); } }
        @keyframes scrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes fadeY { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        .light-nav-link { color: ${C.inkLight}; text-decoration: none; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.2s; font-family: ${font.body}; font-weight: 500; }
        .light-nav-link:hover { color: ${C.rose}; }
        .light-footer-link { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: ${C.inkFaint}; text-decoration: none; transition: color 0.2s; font-family: ${font.body}; }
        .light-footer-link:hover { color: ${C.rose}; }
        .toggle-track { width: 44px; height: 24px; border-radius: 999px; background: rgba(201,132,138,0.15); border: 1px solid rgba(196,163,90,0.3); position: relative; cursor: pointer; }
        .toggle-thumb { position: absolute; top: 3px; left: 22px; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #c9848a, #c4a35a); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(250,246,240,0.88)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div
          onClick={(e) => { e.stopPropagation(); navigate("/"); }}
          style={{ fontFamily: font.cursive, fontSize: "2.2rem", fontWeight: 600, background: `linear-gradient(90deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px", cursor: "pointer" }}
        >
          ShipSense
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {navLinks.map(l => (
            <li key={l.label}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (l.path !== "#") navigate(l.path); }}
                className="light-nav-link"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <span style={{ fontSize: "0.85rem" }}>🌙</span>
            <div className="toggle-track"><div className="toggle-thumb" /></div>
            <span style={{ fontSize: "0.85rem" }}>☀️</span>
          </div>
          <button style={{
            background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
            color: "#fff", border: "none", padding: "0.65rem 1.8rem",
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", cursor: "pointer", borderRadius: "2px",
            fontFamily: font.body, ...hover
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(201,132,138,0.35)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
        alignItems: "center", padding: "8rem 4rem 4rem",
        position: "relative", overflow: "hidden", gap: "4rem"
      }}>
        <div style={{ position: "absolute", width: "700px", height: "700px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.18) 0%, rgba(201,132,138,0.06) 40%, transparent 70%)`, top: "40%", left: "30%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.14) 0%, rgba(196,163,90,0.05) 50%, transparent 70%)`, top: "60%", left: "70%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 6s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, rgba(138,158,122,0.1) 0%, transparent 70%)`, top: "20%", left: "10%", zIndex: 0 }} />
        <div style={{
          position: "absolute", fontSize: "18vw", fontFamily: font.cursive, fontWeight: 600,
          color: "transparent", WebkitTextStroke: `1px rgba(201,132,138,0.08)`,
          userSelect: "none", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0,
          animation: "floatBg 8s ease-in-out infinite"
        }}>ShipSense</div>

        {/* LEFT */}
        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: `1px solid ${C.borderRose}`, borderRadius: "999px", background: C.roseLight }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.rose, display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: C.rose, fontFamily: font.body, fontWeight: 500 }}>AI-Powered Supply Chain</span>
          </div>
          <h1 style={{ fontFamily: font.heading, fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.92, marginBottom: "1.8rem", letterSpacing: "1px", fontWeight: 600 }}>
            <span style={{ display: "block", color: C.ink }}>Deliver</span>
            <span style={{ display: "block", color: C.ink }}>Certainty.</span>
            <span style={{ display: "block", fontStyle: "italic", fontWeight: 500, background: `linear-gradient(135deg, ${C.rose} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minHeight: "1.1em", fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>
              {displayed}<span style={{ animation: "blink 0.8s infinite", color: C.gold }}>|</span>
            </span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "440px", marginBottom: "2.5rem", fontWeight: 300 }}>
            Intelligent ETA prediction and delay analysis for supply chains that demand precision. When a shipment moves, you know. When it doesn't, you know why.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, color: "#fff", border: "none", padding: "1rem 2.5rem", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: font.body, ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05) translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px rgba(201,132,138,0.35)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >Get Started</button>
            <button style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.border}`, padding: "1rem 2rem", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px", fontFamily: font.body, ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.color = C.rose; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; }}
            >Learn More</button>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(30px)", transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s" }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.borderRose}`, borderRadius: "12px", padding: "1.8rem", position: "relative", backdropFilter: "blur(10px)", boxShadow: "0 8px 40px rgba(201,132,138,0.1)" }}>
            <div style={{ position: "absolute", top: "-8px", right: "-8px", width: "16px", height: "16px", borderRadius: "50%", background: C.rose, animation: "pulseR 2s infinite", boxShadow: `0 0 10px rgba(201,132,138,0.5)` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", paddingBottom: "1rem", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: font.body, fontWeight: 600 }}>Live Operations</span>
              <span style={{ fontSize: "0.6rem", color: C.inkFaint, letterSpacing: "1px", display: "flex", alignItems: "center", gap: "5px", fontFamily: font.body }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.rose, display: "inline-block", animation: "pulseR 1.5s infinite" }} />
                4 Active
              </span>
            </div>
            {[
              { icon: "🚢", id: "SHP-4821", route: "Mumbai → Dubai", eta: "On Schedule", ok: true },
              { icon: "✈️", id: "SHP-3309", route: "Delhi → New York", eta: "+2h · Weather", ok: false },
              { icon: "🚛", id: "SHP-5102", route: "Chennai → London", eta: "On Schedule", ok: true },
              { icon: "🚢", id: "SHP-6074", route: "Kolkata → Singapore", eta: "+5h · Customs", ok: false },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7rem 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                  <div style={{ fontSize: "14px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", background: C.roseLight, borderRadius: "4px", border: `1px solid ${C.borderRose}` }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 500, color: C.ink, fontFamily: font.body }}>{s.id}</div>
                    <div style={{ fontSize: "0.7rem", color: C.inkLight, fontFamily: font.body }}>{s.route}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.62rem", padding: "0.2rem 0.7rem", borderRadius: "2px", fontWeight: 500, letterSpacing: "0.5px", fontFamily: font.body, background: s.ok ? C.goldLight : C.roseLight, color: s.ok ? C.gold : C.rose, border: `1px solid ${s.ok ? "rgba(196,163,90,0.3)" : "rgba(201,132,138,0.3)"}` }}>{s.ok ? "Nominal" : "Delayed"}</span>
                  <div style={{ fontSize: "0.65rem", color: C.inkFaint, marginTop: "2px", fontFamily: font.body }}>{s.eta}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem", marginTop: "1.2rem", paddingTop: "1.2rem", borderTop: `1px solid ${C.border}` }}>
              {[{ val: "94%", label: "Accuracy" }, { val: "2/4", label: "On Time" }, { val: "LOW", label: "Risk" }].map((m, i) => (
                <div key={i} style={{ textAlign: "center", padding: "0.6rem", background: C.bgDeep, borderRadius: "4px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.val}</div>
                  <div style={{ fontSize: "0.58rem", color: C.inkFaint, letterSpacing: "1px", textTransform: "uppercase", fontFamily: font.body }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FEED STRIP */}
      <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "0.8rem 4rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ fontSize: "0.58rem", letterSpacing: "3px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", paddingRight: "2rem", borderRight: `1px solid ${C.border}`, fontFamily: font.body, fontWeight: 600 }}>Live Intel</div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div style={{ display: "inline-flex", gap: "3rem", animation: "scrollX 25s linear infinite", whiteSpace: "nowrap" }}>
            {[...Array(2)].map((_, r) =>
              ["🚢 SHP-4821 Mumbai → Dubai · Nominal", "✈️ SHP-3309 Delhi → NYC · Delayed · Weather", "🚛 SHP-5102 Chennai → London · Nominal", "🚢 SHP-6074 Kolkata → Singapore · Delayed · Customs", "✈️ SHP-7741 Hyderabad → Frankfurt · Nominal"].map((item, i) => (
                <span key={`${r}-${i}`} style={{ fontSize: "0.72rem", color: C.inkFaint, letterSpacing: "1px", fontFamily: font.body }}>{item}</span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <section style={{ padding: "7rem 4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Platform</div>
          <h2 style={{ fontFamily: font.heading, fontSize: "3.5rem", fontWeight: 600, color: C.ink, letterSpacing: "1px" }}>What We Do</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "auto auto", gap: "1rem", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ gridColumn: "1/3", background: `linear-gradient(135deg, rgba(201,132,138,0.1), rgba(196,163,90,0.06))`, border: `1px solid ${C.borderRose}`, borderRadius: "8px", padding: "2.5rem", cursor: "pointer", ...hover, position: "relative", overflow: "hidden", boxShadow: "0 2px 20px rgba(201,132,138,0.07)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = `0 0 40px rgba(201,132,138,0.15)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 20px rgba(201,132,138,0.07)"; }}
          >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.12), transparent)` }} />
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Core Feature</div>
            <h3 style={{ fontFamily: font.heading, fontSize: "2.2rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", marginBottom: "1rem" }}>AI-Powered ETA Prediction</h3>
            <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.8, maxWidth: "500px", fontWeight: 300 }}>Machine learning models trained on historical route data, carrier performance, and real-time conditions. Estimates that get smarter with every delivery.</p>
          </div>

          <div style={{ gridColumn: "3/4", gridRow: "1/3", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 20px rgba(196,163,90,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.boxShadow = `0 0 30px rgba(201,132,138,0.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "0 2px 20px rgba(196,163,90,0.06)"; }}
          >
            <div>
              <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Live Now</div>
              <h3 style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", marginBottom: "1.2rem" }}>Operations Feed</h3>
              {[{ id: "SHP-4821", ok: true }, { id: "SHP-3309", ok: false }, { id: "SHP-5102", ok: true }, { id: "SHP-6074", ok: false }].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: "0.72rem", color: C.inkLight, fontFamily: font.body }}>{s.id}</span>
                  <span style={{ fontSize: "0.58rem", padding: "0.2rem 0.5rem", background: s.ok ? C.goldLight : C.roseLight, color: s.ok ? C.gold : C.rose, border: `1px solid ${s.ok ? "rgba(196,163,90,0.3)" : "rgba(201,132,138,0.3)"}`, fontFamily: font.body }}>{s.ok ? "Nominal" : "Delayed"}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "1.5rem" }}>
              {[{ val: "94%", label: "Accuracy" }, { val: "2/4", label: "On Time" }].map((m, i) => (
                <div key={i} style={{ padding: "0.7rem", background: C.bgDeep, borderRadius: "4px", textAlign: "center", border: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.val}</div>
                  <div style={{ fontSize: "0.58rem", color: C.inkFaint, letterSpacing: "1px", textTransform: "uppercase", fontFamily: font.body }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.boxShadow = `0 0 30px rgba(201,132,138,0.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>Categorisation</div>
            <h3 style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", marginBottom: "1rem" }}>Delay Reason Codes</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["Weather", "Customs", "Port Congestion", "Carrier Issue", "Documentation"].map((tag, i) => (
                <span key={i} style={{ fontSize: "0.65rem", padding: "0.25rem 0.7rem", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, borderRadius: "999px", fontFamily: font.body }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "2rem", cursor: "pointer", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = `0 0 30px rgba(196,163,90,0.1)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>Access</div>
            <h3 style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", marginBottom: "0.8rem" }}>Role-Based Control</h3>
            <p style={{ fontSize: "0.78rem", color: C.inkMid, lineHeight: 1.7, fontWeight: 300 }}>Three distinct access levels — Admin, Supplier, Customer. Everyone gets exactly what they need, nothing more.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section style={{ padding: "0 4rem 7rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Access Control</div>
          <h2 style={{ fontFamily: font.heading, fontSize: "3.5rem", fontWeight: 600, color: C.ink, letterSpacing: "1px" }}>Your Role</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: `1px solid ${C.border}`, borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 30px rgba(201,132,138,0.07)" }}>
          {[
            { num: "01", title: "Admin", tag: "Full Access", desc: "Complete system oversight. Manage all users, shipments, delay codes, and generate performance reports across the network.", tagColor: C.rose },
            { num: "02", title: "Supplier", tag: "Limited Access", desc: "Create and manage your own shipments. Update statuses, assign delay codes and monitor ETA accuracy for your routes.", tagColor: C.gold },
            { num: "03", title: "Customer", tag: "Read Only", desc: "Track your orders in real-time. View ETAs and delay reasons for your shipments. No editing access.", tagColor: C.sage },
          ].map((r, i) => (
            <div key={i}
              style={{ display: "flex", alignItems: "center", gap: "3rem", padding: "2rem 3rem", background: C.bgCard, cursor: "pointer", transition: "all 0.3s", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,132,138,0.04)"; e.currentTarget.style.paddingLeft = "3.5rem"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.bgCard; e.currentTarget.style.paddingLeft = "3rem"; }}
            >
              <div style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minWidth: "80px" }}>{r.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", marginBottom: "0.3rem" }}>{r.title}</div>
                <div style={{ fontSize: "0.8rem", color: C.inkMid, lineHeight: 1.6, fontWeight: 300 }}>{r.desc}</div>
              </div>
              <span style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: r.tagColor, padding: "0.4rem 1rem", border: `1px solid ${r.tagColor}60`, borderRadius: "999px", whiteSpace: "nowrap", fontFamily: font.body }}>{r.tag}</span>
              <span style={{ background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: "1.2rem" }}>→</span>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
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

      {/* FOOTER */}
      <footer style={{ padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ fontFamily: font.cursive, fontSize: "2rem", fontWeight: 600, letterSpacing: "1px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ShipSense</div>
        <div style={{ display: "flex", gap: "2.5rem" }}>
          {["Privacy", "Terms", "Help"].map(l => (
            <a key={l} href="#" className="light-footer-link">{l}</a>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: C.inkFaint, letterSpacing: "1px", fontFamily: font.body }}>© 2026 ShipSense. All Rights Reserved.</div>
      </footer>

    </div>
  );
}