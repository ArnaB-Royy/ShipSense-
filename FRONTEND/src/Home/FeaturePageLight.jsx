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

export default function FeaturePageLight({ toggleTheme }) {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 100);
  }, []);

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
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .hover-card { transition: all 0.3s; }
        .hover-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(201,132,138,0.12) !important; border-color: ${C.rose} !important; }
        .feature-card { transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-4px) !important; box-shadow: 0 12px 40px rgba(196,163,90,0.1) !important; }
        .light-nav-link { color: ${C.inkLight}; text-decoration: none; font-size: 0.78rem; letter-spacing: 1.5px; text-transform: uppercase; transition: color 0.2s; font-family: ${font.body}; font-weight: 500; }
        .light-nav-link:hover { color: ${C.rose}; }
        .light-nav-link.active { color: ${C.rose}; border-bottom: 1px solid ${C.rose}; padding-bottom: 2px; }
        .light-footer-link { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: ${C.inkFaint}; text-decoration: none; transition: color 0.2s; font-family: ${font.body}; }
        .light-footer-link:hover { color: ${C.rose}; }
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
                className={`light-nav-link${l.label === "Features" ? " active" : ""}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <span style={{ fontSize: "0.85rem" }}>🌙</span>
            <div style={{ width: "44px", height: "24px", borderRadius: "999px", background: "rgba(201,132,138,0.15)", border: `1px solid rgba(196,163,90,0.3)`, position: "relative", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: "3px", left: "22px", width: "18px", height: "18px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})` }} />
            </div>
            <span style={{ fontSize: "0.85rem" }}>☀️</span>
          </div>
          <button style={{
            background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`,
            color: "#fff", border: "none", padding: "0.65rem 1.8rem",
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px",
            textTransform: "uppercase", cursor: "pointer", borderRadius: "2px",
            fontFamily: font.body, transition: "all 0.25s"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = `0 0 20px rgba(201,132,138,0.35)`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >Login</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10rem 4rem 6rem", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.14) 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, animation: "pulseOrb 5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", fontSize: "16vw", fontFamily: font.cursive, fontWeight: 600, color: "transparent", WebkitTextStroke: `1px rgba(201,132,138,0.07)`, userSelect: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0, animation: "floatBg 8s ease-in-out infinite" }}>Features</div>

        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: `1px solid ${C.borderRose}`, borderRadius: "999px", background: C.roseLight }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.rose, display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: C.rose, fontFamily: font.body, fontWeight: 500 }}>Platform Features</span>
          </div>
          <h1 style={{ fontFamily: font.heading, fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 1, marginBottom: "1.5rem", fontWeight: 600, color: C.ink }}>
            Everything Your Supply Chain Needs.<br />
            <span style={{ fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>In One Platform.</span>
          </h1>
          <p style={{ fontSize: "1rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "650px", margin: "0 auto", fontWeight: 300 }}>
            ShipSense is a full-stack MERN application that brings together real-time shipment tracking, AI-powered ETA prediction, structured delay analysis, and role-based access control — delivering end-to-end supply chain intelligence for admins, suppliers, and customers.
          </p>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section style={{ padding: "6rem 4rem", background: C.bgDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Core Features</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink }}>
              The Foundation of <span style={{ fontStyle: "italic", color: C.rose }}>Intelligent Tracking.</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Feature 1 */}
            <div className="hover-card" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2.5rem", boxShadow: "0 2px 20px rgba(201,132,138,0.05)" }}>
              <div>
                <div style={{ fontFamily: font.heading, fontSize: "5rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "0.5rem" }}>01</div>
                <div style={{ fontSize: "2rem" }}>📡</div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>Tracking</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, color: C.ink, marginBottom: "1rem" }}>Real-Time Shipment Tracking</h3>
                <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300 }}>Every shipment logged into ShipSense is monitored continuously from dispatch to delivery. Live status updates and instant delay alerts ensure that no movement goes unnoticed. Stakeholders are never left guessing — they always know exactly where their shipment is and what is happening to it.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="hover-card" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "center", background: `linear-gradient(135deg, rgba(201,132,138,0.08), rgba(196,163,90,0.05))`, border: `1px solid ${C.borderRose}`, borderRadius: "12px", padding: "2.5rem", boxShadow: "0 2px 20px rgba(201,132,138,0.07)" }}>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.rose, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>AI Prediction</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, color: C.ink, marginBottom: "1rem" }}>AI-Powered ETA Prediction</h3>
                <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300 }}>A machine learning engine trained on carrier history, route data, weather patterns, and port conditions delivers ETAs that update dynamically throughout the shipment lifecycle. Unlike traditional systems that calculate ETA once at dispatch, ShipSense continuously recalculates — getting smarter with every delivery.</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: font.heading, fontSize: "5rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "0.5rem" }}>02</div>
                <div style={{ fontSize: "2rem" }}>🧠</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="hover-card" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2.5rem", boxShadow: "0 2px 20px rgba(201,132,138,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>Classification</div>
                  <h3 style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, color: C.ink }}>Delay Reason Codes</h3>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ fontFamily: font.heading, fontSize: "5rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>03</div>
                  <div style={{ fontSize: "2rem" }}>🏷️</div>
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300, marginBottom: "1.5rem" }}>ShipSense introduces a standardized delay classification system that gives structure and meaning to every disruption in the supply chain. When a shipment is late, everyone knows exactly why.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem" }}>
                {[
                  { code: "D01", label: "Weather Conditions" },
                  { code: "D02", label: "Port Congestion" },
                  { code: "D03", label: "Customs Hold" },
                  { code: "D04", label: "Mechanical Failure" },
                  { code: "D05", label: "Documentation Error" },
                  { code: "D06", label: "Carrier Delay" },
                ].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem 1rem", background: C.bgDeep, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: font.heading, fontSize: "1rem", fontWeight: 600, background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap" }}>{d.code}</span>
                    <span style={{ fontSize: "0.78rem", color: C.inkMid, fontFamily: font.body, fontWeight: 300 }}>{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section style={{ padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Platform</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink }}>
              Built for <span style={{ fontStyle: "italic", color: C.rose }}>Every Role.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {[
              { num: "04", icon: "🔐", tag: "Security", title: "Role-Based Access Control", desc: "Three distinct roles — Admin, Supplier, and Customer — each with precisely defined permissions enforced through JWT authentication and bcrypt encryption. Protected routes enforce access boundaries across the entire application." },
              { num: "05", icon: "🚚", tag: "Tracking", title: "Visual Shipment Timeline", desc: "A step-by-step progress tracker maps every shipment's full journey in real time, giving customers a clear and transparent view at every stage — Ordered → Dispatched → In Transit → Out for Delivery → Delivered." },
              { num: "06", icon: "📊", tag: "Analytics", title: "Role-Specific Dashboards", desc: "Tailored dashboards built with Recharts give each role the data most relevant to their function — network stats for admins, shipment performance for suppliers, and order tracking for customers." },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 20px rgba(196,163,90,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                  <div style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{f.num}</div>
                  <div style={{ fontSize: "1.8rem" }}>{f.icon}</div>
                </div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.gold, marginBottom: "0.5rem", fontFamily: font.body, fontWeight: 600 }}>{f.tag}</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "1.4rem", fontWeight: 600, color: C.ink, marginBottom: "0.8rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.82rem", color: C.inkMid, lineHeight: 1.8, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section style={{ padding: "6rem 4rem", background: C.bgDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Intelligence Layer</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink }}>
              Prediction. <span style={{ fontStyle: "italic", color: C.rose }}>Before It Happens.</span>
            </h2>
          </div>
          <div className="hover-card" style={{ background: `linear-gradient(135deg, rgba(201,132,138,0.08), rgba(196,163,90,0.05))`, border: `1px solid ${C.borderRose}`, borderRadius: "12px", padding: "3rem", boxShadow: "0 2px 20px rgba(201,132,138,0.07)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: font.heading, fontSize: "6rem", fontWeight: 300, fontStyle: "italic", background: `linear-gradient(135deg, ${C.rose}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>07</div>
                <div style={{ fontSize: "3rem", marginTop: "0.5rem" }}>🤖</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                  {["Predictive Detection", "Smart Code Suggestion", "Pattern Recognition"].map((t, i) => (
                    <div key={i} style={{ fontSize: "0.7rem", padding: "0.4rem 0.8rem", background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "999px", color: C.rose, fontFamily: font.body, textAlign: "center" }}>{t}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: C.rose, marginBottom: "0.8rem", fontFamily: font.body, fontWeight: 600 }}>AI Layer</div>
                <h3 style={{ fontFamily: font.heading, fontSize: "2rem", fontWeight: 600, color: C.ink, marginBottom: "1.2rem" }}>Predictive Delay Detection & Smart Code Suggestion</h3>
                <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300, marginBottom: "1rem" }}>The AI engine continuously monitors active shipments and flags those at risk of delay before disruption occurs. By recognising patterns from historical shipment data — including carrier behaviour, route risk, and seasonal trends — ShipSense enables proactive intervention rather than reactive response.</p>
                <p style={{ fontSize: "0.88rem", color: C.inkMid, lineHeight: 1.9, fontWeight: 300 }}>When a shipment deviates from schedule, the AI automatically recommends the most probable delay reason code, reducing manual classification effort and ensuring consistency across all delay reporting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem", fontFamily: font.body, fontWeight: 600 }}>Built With</div>
            <h2 style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: C.ink }}>
              A <span style={{ fontStyle: "italic", color: C.rose }}>Modern Stack.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { layer: "Frontend", tech: "React + Vite", desc: "Component-driven UI with blazing-fast builds and Tailwind CSS for styling.", color: C.rose, icon: "⚛️" },
              { layer: "Backend", tech: "Node.js + Express", desc: "Lightweight, scalable REST API handling auth, business logic and data routing.", color: C.gold, icon: "🟢" },
              { layer: "Database", tech: "MongoDB + Mongoose", desc: "Flexible NoSQL storage for shipment records, user data and delay logs.", color: C.sage, icon: "🍃" },
              { layer: "Auth", tech: "JWT + bcrypt", desc: "Secure token-based authentication with encrypted password storage.", color: C.rose, icon: "🔐" },
              { layer: "Charts", tech: "Recharts", desc: "Role-specific dashboards with interactive data visualisation and analytics.", color: C.gold, icon: "📊" },
              { layer: "AI", tech: "Machine Learning", desc: "ETA prediction and delay code suggestion powered by pattern recognition.", color: C.sage, icon: "🤖" },
            ].map((t, i) => (
              <div key={i} className="feature-card" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "8px", padding: "1.8rem", boxShadow: "0 2px 10px rgba(196,163,90,0.05)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: t.color, fontFamily: font.body, fontWeight: 600 }}>{t.layer}</div>
                  <div style={{ fontSize: "1.2rem" }}>{t.icon}</div>
                </div>
                <div style={{ fontFamily: font.heading, fontSize: "1.4rem", fontWeight: 600, color: C.ink, marginBottom: "0.6rem" }}>{t.tech}</div>
                <p style={{ fontSize: "0.78rem", color: C.inkMid, lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: C.bgDeep, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { val: "10K", unit: "+", label: "Shipments Tracked" },
          { val: "95", unit: "%", label: "ETA Accuracy" },
          { val: "50", unit: "+", label: "Countries" },
          { val: "7", unit: "", label: "Key Features" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "3rem", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
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
            Ready to Experience the <span style={{ fontStyle: "italic", color: C.rose }}>Full Platform?</span>
          </h2>
          <p style={{ fontSize: "0.95rem", color: C.inkMid, lineHeight: 1.9, maxWidth: "520px", margin: "0 auto 2.5rem", fontWeight: 300 }}>
            Every feature in ShipSense is designed with one goal — to give your supply chain the intelligence, transparency, and precision it deserves. Join the platform built for supply chains that cannot afford to wait.
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
            <a key={l} href="#" className="light-footer-link">{l}</a>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: C.inkFaint, letterSpacing: "1px", fontFamily: font.body }}>© 2026 ShipSense. All Rights Reserved.</div>
      </footer>

    </div>
  );
}