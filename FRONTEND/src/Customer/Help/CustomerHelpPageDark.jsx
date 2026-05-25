// CustomerHelpPageDark.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbarDark from "../Components/CustomerNavbarDark";
import CustomerSidebarDark from "../Components/CustomerSidebarDark";

const SECTIONS = [
  {
    id: "getting-started",
    icon: "🚀",
    title: "Getting Started",
    content: "ShipSense is a supply chain intelligence platform that lets you track your shipments in real time, view billing records, and stay on top of delays — all from one dashboard. Once your account is set up and an admin assigns shipments to you, everything appears automatically. You don't need to manually add anything.",
  },
  {
    id: "dashboard",
    icon: "📊",
    title: "Your Dashboard",
    content: "The dashboard gives you a live overview of all your shipments. The four stat cards at the top show your total shipments, how many are in transit, how many are delivered, and how many are pending or delayed. The Quick Stats panel on the left shows your on-time rate, your top supplier, and average delay. The Recent Shipments table shows your last five shipments — click any row to go to the full shipments page.",
  },
  {
    id: "shipments",
    icon: "📦",
    title: "Tracking Your Shipments",
    content: "Go to My Shipments from the sidebar. You'll see all shipments assigned to your account in a table with the tracking ID, route, status, ETA, and date created. Click any row to open a detail modal showing the full breakdown — origin, destination, supplier, delay information if any, and timestamps. You can filter by status using the pills at the top, or search by tracking ID.",
  },
  {
    id: "statuses",
    icon: "🔄",
    title: "Understanding Shipment Statuses",
    content: null,
    statuses: [
      { label: "In Transit",  color: "#f0a030", bg: "rgba(240,160,48,0.08)",  border: "rgba(240,160,48,0.25)",  desc: "Your shipment is currently on the move and heading to its destination." },
      { label: "Delivered",   color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.25)",  desc: "Your shipment has reached its destination and been confirmed as delivered." },
      { label: "Delayed",     color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)", desc: "Your shipment has encountered a delay. Check the delay code for the reason." },
      { label: "Pending",     color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.25)",  desc: "Your shipment has been registered but hasn't been picked up or dispatched yet." },
    ],
  },
  {
    id: "delay-codes",
    icon: "⚠️",
    title: "Understanding Delay Codes",
    content: "When a shipment is delayed, it gets a delay code assigned by the admin. The code tells you the category and reason for the delay.",
    codes: [
      { code: "WTH", category: "Weather",       example: "WTH-001", desc: "Delay caused by severe weather conditions like storms, fog, or floods." },
      { code: "CST", category: "Customs",       example: "CST-001", desc: "Shipment held at customs for inspection, documentation issues, or clearance." },
      { code: "PRT", category: "Port",          example: "PRT-001", desc: "Port congestion, berth unavailability, or loading/unloading delays." },
      { code: "CAR", category: "Carrier",       example: "CAR-001", desc: "Issues with the carrier such as driver shortage, vehicle breakdown, or routing." },
      { code: "DOC", category: "Documentation", example: "DOC-001", desc: "Missing, incorrect, or incomplete shipment documents." },
      { code: "OTH", category: "Other",         example: "OTH-001", desc: "Miscellaneous delays that don't fall under the above categories." },
    ],
  },
  {
    id: "invoices",
    icon: "🧾",
    title: "Invoices & Billing",
    content: "Go to Invoices from the sidebar. Each shipment has an auto-generated invoice showing the route, supplier, status, and total amount. The base charges are Standard Freight Handling (Rs. 4,200), Port Clearance Fee (Rs. 850), and Documentation & Processing (Rs. 320). If your shipment was delayed, a Delay Surcharge of Rs. 600 is added. All amounts include 18% GST. Click the Download PDF button on any invoice to save a copy to your device.",
  },
  {
    id: "profile",
    icon: "👤",
    title: "Managing Your Profile",
    content: "Click your name in the top-right navbar to open your profile. From there you can view your account details and edit your name and email. Your role and account status are set by the admin and cannot be changed from here. Click Edit Profile, make your changes, and hit Save Changes. You can also log out from the profile panel.",
  },
];

const FAQS = [
  {
    q: "Why don't I see any shipments on my dashboard?",
    a: "Shipments are assigned to your account by an admin. If your dashboard is empty, your admin hasn't assigned any shipments yet. Contact your admin to get shipments linked to your account.",
  },
  {
    q: "Why is my shipment showing as Delayed?",
    a: "A delay status means the shipment encountered an issue during transit. Open the shipment detail by clicking the row in My Shipments — you'll see the delay code and reason explaining exactly what happened.",
  },
  {
    q: "Can I change my shipment details or cancel an order?",
    a: "No — shipment details are managed entirely by the admin. If you need a change or cancellation, contact your assigned admin directly.",
  },
  {
    q: "Why does my invoice show a Delay Surcharge?",
    a: "A Rs. 600 delay surcharge is applied to any shipment that was assigned a delay code. This covers the additional handling and coordination costs caused by the delay.",
  },
  {
    q: "Is the invoice PDF official?",
    a: "The invoice PDF is system-generated by ShipSense and includes all billing details, GST breakdown, and an authorised signatory. It is valid for internal record-keeping. For disputes, contact your assigned admin.",
  },
];

export default function CustomerHelpPageDark({ toggleTheme }) {
  const [hoveredWidth, setHoveredWidth]   = useState(0);
  const [openFaq, setOpenFaq]             = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlow{ 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulseOrb{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }

        .section-card-d {
          background: linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.012));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
          animation: fadeUp 0.5s ease both;
        }
        .section-card-d:hover {
          border-color: rgba(230,50,50,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .card-top-d {
          height: 2px;
          background: linear-gradient(90deg,#e63232,#f0a030,#e63232);
          background-size: 200%; animation: gradFlow 3s linear infinite;
        }

        .status-chip-d {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600;
          font-family: 'Inter',sans-serif;
        }

        .code-row-d {
          display: grid; grid-template-columns: 80px 110px 1fr;
          gap: 1rem; align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .code-row-d:last-child { border-bottom: none; }

        .faq-item-d {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          overflow: hidden;
        }
        .faq-item-d:last-child { border-bottom: none; }

        .faq-q-d {
          width: 100%; background: transparent; border: none;
          padding: 1.1rem 1.4rem; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left;
          transition: background 0.2s;
        }
        .faq-q-d:hover { background: rgba(230,50,50,0.03); }

        .faq-a-d {
          padding: 0 1.4rem 1.1rem;
          font-size: 0.82rem; color: #9a8a82;
          line-height: 1.7; font-family: 'Inter',sans-serif;
          animation: fadeUp 0.2s ease;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }
      `}</style>

      <CustomerNavbarDark toggleTheme={toggleTheme} pageTitle="HELP & GUIDE" pageSubtitle="SUPPORT" />

      <div style={{ display: "flex", flex: 1 }}>
        <CustomerSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", minHeight: "calc(100vh - 64px)", position: "relative" }}>

          {/* ORBS */}
          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(230,50,50,0.07),transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,160,48,0.04),transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* PAGE HEADER */}
            <div style={{ marginBottom: "2rem", animation: "fadeUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Support</span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0 }}>HELP & GUIDE</h1>
              <div style={{ fontSize: "0.74rem", color: "#a89888", marginTop: "6px" }}>Everything you need to know about using ShipSense</div>
            </div>

            {/* SECTIONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {SECTIONS.map((sec, si) => (
                <div key={sec.id} className="section-card-d" style={{ animationDelay: `${si * 0.07}s` }}>
                  <div className="card-top-d" />
                  <div style={{ padding: "1.4rem 1.6rem" }}>

                    {/* Section header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(230,50,50,0.08)", border: "1px solid rgba(230,50,50,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{sec.icon}</div>
                      <div>
                        <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700, marginBottom: "2px" }}>Section {si + 1}</div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", letterSpacing: "2px", background: "linear-gradient(90deg,#e0d8d0,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{sec.title.toUpperCase()}</div>
                      </div>
                    </div>

                    {/* Content */}
                    {sec.content && (
                      <p style={{ fontSize: "0.84rem", color: "#9a8a82", lineHeight: 1.8, margin: "0 0 1rem", fontFamily: "'Inter',sans-serif" }}>{sec.content}</p>
                    )}

                    {/* Statuses */}
                    {sec.statuses && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {sec.statuses.map((st, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                            <span className="status-chip-d" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}`, minWidth: "90px", justifyContent: "center" }}>
                              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                              {st.label}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: "#9a8a82", fontFamily: "'Inter',sans-serif", lineHeight: 1.5 }}>{st.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Delay codes */}
                    {sec.codes && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 110px 1fr", gap: "1rem", padding: "8px 0", marginBottom: "4px" }}>
                          {["Code", "Category", "Description"].map(h => (
                            <div key={h} style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", fontWeight: 700 }}>{h}</div>
                          ))}
                        </div>
                        {sec.codes.map((c, i) => (
                          <div key={i} className="code-row-d">
                            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "0.95rem", letterSpacing: "1.5px", background: "linear-gradient(135deg,#f0a030,#e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{c.example}</div>
                            <div style={{ fontSize: "0.78rem", color: "#c0b0a8", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>{c.category}</div>
                            <div style={{ fontSize: "0.78rem", color: "#9a8a82", fontFamily: "'Inter',sans-serif", lineHeight: 1.6 }}>{c.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* FAQ SECTION */}
              <div className="section-card-d" style={{ animationDelay: `${SECTIONS.length * 0.07}s` }}>
                <div className="card-top-d" />
                <div style={{ padding: "1.4rem 1.6rem 0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(230,50,50,0.08)", border: "1px solid rgba(230,50,50,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>❓</div>
                    <div>
                      <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700, marginBottom: "2px" }}>Section {SECTIONS.length + 1}</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.2rem", letterSpacing: "2px", background: "linear-gradient(90deg,#e0d8d0,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FREQUENTLY ASKED QUESTIONS</div>
                    </div>
                  </div>
                </div>

                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item-d">
                    <button className="faq-q-d" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span style={{ fontSize: "0.86rem", color: openFaq === i ? "#f0a030" : "#d4c4b8", fontFamily: "'Inter',sans-serif", fontWeight: 500, lineHeight: 1.5 }}>{faq.q}</span>
                      <span style={{ fontSize: "0.7rem", color: "#6a5a50", transition: "transform 0.25s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▼</span>
                    </button>
                    {openFaq === i && (
                      <div className="faq-a-d">{faq.a}</div>
                    )}
                  </div>
                ))}
                <div style={{ height: "0.8rem" }} />
              </div>

              {/* CONTACT BANNER */}
              <div style={{ padding: "1.4rem 1.6rem", background: "linear-gradient(135deg,rgba(230,50,50,0.07),rgba(240,160,48,0.05))", border: "1px solid rgba(230,50,50,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", animation: `fadeUp 0.5s ${(SECTIONS.length + 1) * 0.07}s ease both` }}>
                <div>
                  <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontWeight: 700, marginBottom: "4px" }}>Still need help?</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.3rem", letterSpacing: "2px", background: "linear-gradient(90deg,#e0d8d0,#e63232)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CONTACT YOUR ADMIN</div>
                  <div style={{ fontSize: "0.76rem", color: "#7a6a60", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>For shipment issues, billing disputes, or account changes — reach out to your assigned ShipSense admin.</div>
                </div>
                <div style={{ fontSize: "2.5rem", opacity: 0.4, flexShrink: 0 }}>💬</div>
              </div>

              <div style={{ height: "1rem" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}