import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturePageDark({ toggleTheme }) {
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

      <style>{`
        @keyframes pulseR { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes pulseOrb { 0%, 100% { transform: translate(-50%, -50%) scale(1); } 50% { transform: translate(-50%, -50%) scale(1.15); } }
        @keyframes floatBg { 0%, 100% { transform: translate(-50%, -50%) translateY(0px); } 50% { transform: translate(-50%, -50%) translateY(-20px); } }
        @keyframes scrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem", position: "fixed", top: 0, left: 0, right: 0,
        zIndex: 100, background: "rgba(7,6,10,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div
          onClick={(e) => { e.stopPropagation(); navigate("/"); }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "4px", background: "linear-gradient(90deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer" }}
        >
          SHIPSENSE
        </div>
        <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          {navLinks.map(l => (
            <li key={l.label}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (l.path !== "#") navigate(l.path); }}
                style={{ color: l.label === "Features" ? "#f0a030" : "#666", textDecoration: "none", fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase", transition: "color 0.2s", borderBottom: l.label === "Features" ? "1px solid #f0a030" : "none", paddingBottom: l.label === "Features" ? "2px" : "0" }}
                onMouseEnter={e => e.target.style.color = "#f0a030"}
                onMouseLeave={e => e.target.style.color = l.label === "Features" ? "#f0a030" : "#666"}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div onClick={toggleTheme} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <span style={{ fontSize: "0.7rem", letterSpacing: "1px", color: "#666", textTransform: "uppercase" }}>🌙</span>
            <div style={{ width: "44px", height: "24px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", position: "relative" }}>
              <div style={{ position: "absolute", top: "3px", left: "3px", width: "18px", height: "18px", borderRadius: "50%", background: "linear-gradient(135deg, #e63232, #f0a030)" }} />
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
        <div style={{ position: "absolute", fontSize: "16vw", fontFamily: "'Bebas Neue', sans-serif", color: "transparent", WebkitTextStroke: "1px rgba(196,30,30,0.06)", userSelect: "none", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", zIndex: 0, animation: "floatBg 8s ease-in-out infinite" }}>FEATURES</div>

        <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.9s ease, transform 0.9s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.8rem", marginBottom: "2rem", padding: "0.4rem 1.2rem", border: "1px solid rgba(196,30,30,0.3)", borderRadius: "999px", background: "rgba(196,30,30,0.05)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e63232", display: "inline-block", animation: "pulseR 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#e08080" }}>Platform Features</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 7vw, 6rem)", lineHeight: 0.92, marginBottom: "1.5rem", letterSpacing: "1px" }}>
            <span style={{ display: "block", background: "linear-gradient(135deg, #ffffff, #c8b8b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>EVERYTHING YOUR SUPPLY CHAIN NEEDS.</span>
            <span style={{ display: "block", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>IN ONE PLATFORM.</span>
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "650px", margin: "0 auto", fontWeight: 300 }}>
            ShipSense is a full-stack MERN application that brings together real-time shipment tracking, AI-powered ETA prediction, structured delay analysis, and role-based access control — delivering end-to-end supply chain intelligence for admins, suppliers, and customers.
          </p>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section style={{ padding: "6rem 4rem", background: "#0a0608" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Core Features</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>
              THE FOUNDATION OF INTELLIGENT TRACKING.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "2.5rem", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(196,30,30,0.3)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,30,30,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "0.5rem" }}>01</div>
                <div style={{ fontSize: "2rem" }}>📡</div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#f0a030", marginBottom: "0.8rem" }}>Tracking</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1rem" }}>REAL-TIME SHIPMENT TRACKING</h3>
                <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300 }}>Every shipment logged into ShipSense is monitored continuously from dispatch to delivery. Live status updates and instant delay alerts ensure that no movement goes unnoticed. Stakeholders are never left guessing — they always know exactly where their shipment is and what is happening to it.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem", alignItems: "center", background: "linear-gradient(135deg, rgba(196,30,30,0.1), rgba(240,160,48,0.06))", border: "1px solid rgba(196,30,30,0.2)", borderRadius: "12px", padding: "2.5rem", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,30,30,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#e63232", marginBottom: "0.8rem" }}>AI Prediction</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1rem" }}>AI-POWERED ETA PREDICTION</h3>
                <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300 }}>A machine learning engine trained on carrier history, route data, weather patterns, and port conditions delivers ETAs that update dynamically throughout the shipment lifecycle. Unlike traditional systems that calculate ETA once at dispatch, ShipSense continuously recalculates — getting smarter with every delivery.</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: "0.5rem" }}>02</div>
                <div style={{ fontSize: "2rem" }}>🧠</div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "2.5rem", ...hover }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(240,160,48,0.3)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(240,160,48,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#f0a030", marginBottom: "0.8rem" }}>Classification</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>DELAY REASON CODES</h3>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>03</div>
                  <div style={{ fontSize: "2rem" }}>🏷️</div>
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300, marginBottom: "1.5rem" }}>ShipSense introduces a standardized delay classification system that gives structure and meaning to every disruption in the supply chain. When a shipment is late, everyone knows exactly why.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem" }}>
                {[
                  { code: "D01", label: "Weather Conditions" },
                  { code: "D02", label: "Port Congestion" },
                  { code: "D03", label: "Customs Hold" },
                  { code: "D04", label: "Mechanical Failure" },
                  { code: "D05", label: "Documentation Error" },
                  { code: "D06", label: "Carrier Delay" },
                ].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", background: "linear-gradient(135deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", whiteSpace: "nowrap", letterSpacing: "1px" }}>{d.code}</span>
                    <span style={{ fontSize: "0.78rem", color: "#6a5e5e", fontWeight: 300 }}>{d.label}</span>
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
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Platform</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>
              BUILT FOR EVERY ROLE.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {[
              { num: "04", icon: "🔐", tag: "Security", title: "ROLE-BASED ACCESS CONTROL", desc: "Three distinct roles — Admin, Supplier, and Customer — each with precisely defined permissions enforced through JWT authentication and bcrypt encryption. Protected routes enforce access boundaries across the entire application." },
              { num: "05", icon: "🚚", tag: "Tracking", title: "VISUAL SHIPMENT TIMELINE", desc: "A step-by-step progress tracker maps every shipment's full journey in real time — Ordered → Dispatched → In Transit → Out for Delivery → Delivered — giving customers clear and transparent visibility at every stage." },
              { num: "06", icon: "📊", tag: "Analytics", title: "ROLE-SPECIFIC DASHBOARDS", desc: "Tailored dashboards built with Recharts give each role the data most relevant to their function — network stats for admins, shipment performance for suppliers, and order tracking for customers." },
            ].map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "2rem", ...hover }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(196,30,30,0.3)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,30,30,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.2rem" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{f.num}</div>
                  <div style={{ fontSize: "1.8rem" }}>{f.icon}</div>
                </div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#f0a030", marginBottom: "0.5rem" }}>{f.tag}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "0.8rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "#6a5e5e", lineHeight: 1.8, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section style={{ padding: "6rem 4rem", background: "#0a0608" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Intelligence Layer</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>
              PREDICTION. BEFORE IT HAPPENS.
            </h2>
          </div>
          <div style={{ background: "linear-gradient(135deg, rgba(196,30,30,0.1), rgba(240,160,48,0.06))", border: "1px solid rgba(196,30,30,0.2)", borderRadius: "12px", padding: "3rem", ...hover }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(196,30,30,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "6rem", background: "linear-gradient(135deg, #e63232, #f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>07</div>
                <div style={{ fontSize: "3rem", marginTop: "0.5rem" }}>🤖</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                  {["Predictive Detection", "Smart Code Suggestion", "Pattern Recognition"].map((t, i) => (
                    <div key={i} style={{ fontSize: "0.7rem", padding: "0.4rem 0.8rem", background: "rgba(196,30,30,0.08)", border: "1px solid rgba(196,30,30,0.2)", borderRadius: "2px", color: "#e08080", textAlign: "center", letterSpacing: "1px" }}>{t}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: "#e63232", marginBottom: "0.8rem" }}>AI Layer</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px", marginBottom: "1.2rem" }}>PREDICTIVE DELAY DETECTION & SMART CODE SUGGESTION</h3>
                <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300, marginBottom: "1rem" }}>The AI engine continuously monitors active shipments and flags those at risk of delay before disruption occurs. By recognising patterns from historical shipment data — including carrier behaviour, route risk, and seasonal trends — ShipSense enables proactive intervention rather than reactive response.</p>
                <p style={{ fontSize: "0.88rem", color: "#6a5e5e", lineHeight: 1.9, fontWeight: 300 }}>When a shipment deviates from schedule, the AI automatically recommends the most probable delay reason code, reducing manual classification effort and ensuring consistency across all delay reporting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding: "6rem 4rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1rem" }}>Built With</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>
              A MODERN STACK.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
            {[
              { layer: "Frontend", tech: "React + Vite", desc: "Component-driven UI with blazing-fast builds and Tailwind CSS for styling.", color: "#e63232", icon: "⚛️" },
              { layer: "Backend", tech: "Node.js + Express", desc: "Lightweight, scalable REST API handling auth, business logic and data routing.", color: "#f0a030", icon: "🟢" },
              { layer: "Database", tech: "MongoDB + Mongoose", desc: "Flexible NoSQL storage for shipment records, user data and delay logs.", color: "#8a9e7a", icon: "🍃" },
              { layer: "Auth", tech: "JWT + bcrypt", desc: "Secure token-based authentication with encrypted password storage.", color: "#e63232", icon: "🔐" },
              { layer: "Charts", tech: "Recharts", desc: "Role-specific dashboards with interactive data visualisation and analytics.", color: "#f0a030", icon: "📊" },
              { layer: "AI", tech: "Machine Learning", desc: "ETA prediction and delay code suggestion powered by pattern recognition.", color: "#8a9e7a", icon: "🤖" },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "1.8rem", ...hover }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = t.color + "60"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: t.color }}>{t.layer}</div>
                  <div style={{ fontSize: "1.2rem" }}>{t.icon}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "2px", background: "linear-gradient(135deg, #ffffff, #c8b0a8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.6rem" }}>{t.tech}</div>
                <p style={{ fontSize: "0.78rem", color: "#6a5e5e", lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: "#050408", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {[
          { val: "10K", unit: "+", label: "Shipments Tracked" },
          { val: "95", unit: "%", label: "ETA Accuracy" },
          { val: "50", unit: "+", label: "Countries" },
          { val: "7", unit: "", label: "Key Features" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "3rem", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
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
            READY TO EXPERIENCE THE FULL PLATFORM?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#6a5e5e", lineHeight: 1.9, maxWidth: "520px", margin: "0 auto 2.5rem", fontWeight: 300 }}>
            Every feature in ShipSense is designed with one goal — to give your supply chain the intelligence, transparency, and precision it deserves. Join the platform built for supply chains that cannot afford to wait.
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
            <a key={l} href="#"
              style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#333", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#f0a030"}
              onMouseLeave={e => e.target.style.color = "#333"}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ fontSize: "0.65rem", color: "#222", letterSpacing: "1px" }}>© 2026 SHIPSENSE. ALL RIGHTS RESERVED.</div>
      </footer>

    </div>
  );
}