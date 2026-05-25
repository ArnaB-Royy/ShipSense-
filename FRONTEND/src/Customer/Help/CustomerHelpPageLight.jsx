// CustomerHelpPageLight.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.95)",
  rose: "#c9848a", gold: "#c4a35a", roseDark: "#a86870", goldDark: "#a0834a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.10)", goldLight: "rgba(196,163,90,0.10)",
  green: "#5a8a6a",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

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
      { label: "In Transit",  color: "#a0834a", bg: "rgba(196,163,90,0.1)",  border: "rgba(196,163,90,0.3)",  desc: "Your shipment is currently on the move and heading to its destination." },
      { label: "Delivered",   color: "#5a8a6a", bg: "rgba(90,138,106,0.1)", border: "rgba(90,138,106,0.3)",  desc: "Your shipment has reached its destination and been confirmed as delivered." },
      { label: "Delayed",     color: "#a86870", bg: "rgba(201,132,138,0.1)", border: "rgba(201,132,138,0.3)", desc: "Your shipment has encountered a delay. Check the delay code for the reason." },
      { label: "Pending",     color: "#6b5744", bg: "rgba(107,87,68,0.08)",  border: "rgba(107,87,68,0.2)",   desc: "Your shipment has been registered but hasn't been picked up or dispatched yet." },
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

export default function CustomerHelpPageLight({ toggleTheme }) {
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [openFaq, setOpenFaq]           = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlowL{ 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }

        .section-card-l {
          background: rgba(255,250,245,0.95);
          border: 1px solid rgba(196,163,90,0.2);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(196,163,90,0.07);
          transition: border-color 0.25s, box-shadow 0.25s;
          animation: fadeUp 0.5s ease both;
        }
        .section-card-l:hover {
          border-color: rgba(201,132,138,0.25);
          box-shadow: 0 8px 28px rgba(201,132,138,0.1);
        }
        .card-top-l {
          height: 2px;
          background: linear-gradient(90deg,${C.rose},${C.gold},${C.rose});
          background-size: 200%; animation: gradFlowL 3s linear infinite;
        }

        .status-chip-l {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 999px;
          font-size: 0.72rem; font-weight: 600;
          font-family: ${font.body};
        }

        .code-row-l {
          display: grid; grid-template-columns: 80px 110px 1fr;
          gap: 1rem; align-items: start;
          padding: 12px 0;
          border-bottom: 1px solid rgba(196,163,90,0.15);
        }
        .code-row-l:last-child { border-bottom: none; }

        .faq-item-l {
          border-bottom: 1px solid rgba(196,163,90,0.15);
          overflow: hidden;
        }
        .faq-item-l:last-child { border-bottom: none; }

        .faq-q-l {
          width: 100%; background: transparent; border: none;
          padding: 1.1rem 1.4rem; cursor: pointer;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; text-align: left;
          transition: background 0.2s;
        }
        .faq-q-l:hover { background: rgba(201,132,138,0.05); }

        .faq-a-l {
          padding: 0 1.4rem 1.1rem;
          font-size: 0.82rem; color: ${C.inkMid};
          line-height: 1.7; font-family: ${font.body};
          animation: fadeUp 0.2s ease;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }
      `}</style>

      <CustomerNavbarLight toggleTheme={toggleTheme} pageTitle="Help & Guide" pageSubtitle="Support" />

      <div style={{ display: "flex", flex: 1 }}>
        <CustomerSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", minHeight: "calc(100vh - 64px)", position: "relative" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle,rgba(201,132,138,0.09),transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

          <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 1 }}>

            {/* PAGE HEADER */}
            <div style={{ marginBottom: "2rem", animation: "fadeUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Support</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px", lineHeight: 1, margin: 0 }}>Help & Guide</h1>
              <div style={{ fontSize: "0.74rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>Everything you need to know about using ShipSense</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {SECTIONS.map((sec, si) => (
                <div key={sec.id} className="section-card-l" style={{ animationDelay: `${si * 0.07}s` }}>
                  <div className="card-top-l" />
                  <div style={{ padding: "1.4rem 1.6rem" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.roseLight, border: `1px solid ${C.borderRose}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{sec.icon}</div>
                      <div>
                        <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "2px", fontFamily: font.body }}>Section {si + 1}</div>
                        <div style={{ fontFamily: font.heading, fontSize: "1.25rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(90deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{sec.title}</div>
                      </div>
                    </div>

                    {sec.content && (
                      <p style={{ fontSize: "0.84rem", color: C.inkMid, lineHeight: 1.8, margin: "0 0 1rem", fontFamily: font.body }}>{sec.content}</p>
                    )}

                    {sec.statuses && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {sec.statuses.map((st, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 14px", background: C.bgDeep, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                            <span className="status-chip-l" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}`, minWidth: "90px", justifyContent: "center" }}>
                              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                              {st.label}
                            </span>
                            <span style={{ fontSize: "0.82rem", color: C.inkMid, fontFamily: font.body, lineHeight: 1.5 }}>{st.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.codes && (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "80px 110px 1fr", gap: "1rem", padding: "8px 0", marginBottom: "4px" }}>
                          {["Code", "Category", "Description"].map(h => (
                            <div key={h} style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>{h}</div>
                          ))}
                        </div>
                        {sec.codes.map((c, i) => (
                          <div key={i} className="code-row-l">
                            <div style={{ fontFamily: font.heading, fontSize: "1rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{c.example}</div>
                            <div style={{ fontSize: "0.78rem", color: C.inkMid, fontFamily: font.body, fontWeight: 500 }}>{c.category}</div>
                            <div style={{ fontSize: "0.78rem", color: C.inkLight, fontFamily: font.body, lineHeight: 1.6 }}>{c.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* FAQ */}
              <div className="section-card-l" style={{ animationDelay: `${SECTIONS.length * 0.07}s` }}>
                <div className="card-top-l" />
                <div style={{ padding: "1.4rem 1.6rem 0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: C.roseLight, border: `1px solid ${C.borderRose}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>❓</div>
                    <div>
                      <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "2px", fontFamily: font.body }}>Section {SECTIONS.length + 1}</div>
                      <div style={{ fontFamily: font.heading, fontSize: "1.25rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(90deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Frequently Asked Questions</div>
                    </div>
                  </div>
                </div>

                {FAQS.map((faq, i) => (
                  <div key={i} className="faq-item-l">
                    <button className="faq-q-l" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span style={{ fontSize: "0.86rem", color: openFaq === i ? C.rose : C.inkMid, fontFamily: font.body, fontWeight: 500, lineHeight: 1.5 }}>{faq.q}</span>
                      <span style={{ fontSize: "0.7rem", color: C.inkFaint, transition: "transform 0.25s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}>▼</span>
                    </button>
                    {openFaq === i && (
                      <div className="faq-a-l">{faq.a}</div>
                    )}
                  </div>
                ))}
                <div style={{ height: "0.8rem" }} />
              </div>

              {/* CONTACT BANNER */}
              <div style={{ padding: "1.4rem 1.6rem", background: `linear-gradient(135deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", animation: `fadeUp 0.5s ${(SECTIONS.length + 1) * 0.07}s ease both` }}>
                <div>
                  <div style={{ fontSize: "0.56rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "4px", fontFamily: font.body }}>Still need help?</div>
                  <div style={{ fontFamily: font.heading, fontSize: "1.4rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(90deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Contact your Admin</div>
                  <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "4px", fontFamily: font.body }}>For shipment issues, billing disputes, or account changes — reach out to your assigned ShipSense admin.</div>
                </div>
                <div style={{ fontSize: "2.5rem", opacity: 0.5, flexShrink: 0 }}>💬</div>
              </div>

              <div style={{ height: "1rem" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}