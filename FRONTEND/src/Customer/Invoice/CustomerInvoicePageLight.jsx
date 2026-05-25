import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";

const SHIPMENTS_API = "http://localhost:5000/api/shipments/my";
const AUTH_API      = "http://localhost:5000/api/auth";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.95)",
  rose: "#c9848a", gold: "#c4a35a", roseDark: "#a86870", goldDark: "#a0834a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.10)", goldLight: "rgba(196,163,90,0.10)",
  green: "#5a8a6a",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

const STATUS_COLOR = {
  "Delivered":  { color: "#3a7a4a", bg: "rgba(58,122,74,0.1)",  border: "rgba(58,122,74,0.25)"  },
  "In Transit": { color: "#4a6aaa", bg: "rgba(74,106,170,0.1)", border: "rgba(74,106,170,0.25)" },
  "On Time":    { color: "#4a6aaa", bg: "rgba(74,106,170,0.1)", border: "rgba(74,106,170,0.25)" },
  "Delayed":    { color: "#b05858", bg: "rgba(176,88,88,0.1)",  border: "rgba(176,88,88,0.25)"  },
};

const SIGNATORIES = [
  { name: "Arnab Roy",   title: "Director, ShipSense"        },
  { name: "Juhi Thakur", title: "Operations Lead, ShipSense" },
];

function invoiceNumber(ship) {
  return `INV-${ship.ShipmentId || ship._id?.slice(-6).toUpperCase()}`;
}

function statusBadge(status) {
  const s = STATUS_COLOR[status] || { color: C.inkMid, bg: C.goldLight, border: C.border };
  return (
    <span style={{ fontSize: "0.66rem", padding: "3px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {status || "—"}
    </span>
  );
}

export default function CustomerInvoicePageLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [shipments, setShipments]       = useState([]);
  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [expanded, setExpanded]         = useState(null);
  const [generating, setGenerating]     = useState(null);
  const [animated, setAnimated]         = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(AUTH_API + "/me", { credentials: "include" }).then(r => r.json()),
      fetch(SHIPMENTS_API,    { credentials: "include" }).then(r => r.json()),
    ]).then(([authData, shipData]) => {
      if (authData.success) setProfile(authData.user);
      if (shipData.success) setShipments(shipData.data || []);
      setTimeout(() => setAnimated(true), 150);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // PDF is identical to dark version — light theme PDF always
    const handleDownload = async (ship) => {
    setGenerating(ship._id);
    await new Promise(r => setTimeout(r, 300));

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PW  = 210, PH = 297, ML = 15, MR = 15;
    const CW  = PW - ML - MR;
    const RX  = PW - MR;
    let y     = 0;

    const shipIndex = shipments.findIndex(s => s._id === ship._id);
    const signatory = SIGNATORIES[shipIndex % 2];
    const hasDelay  = !!ship.DelayReason?.Code;
    const subtotal  = hasDelay ? 5970 : 5370;
    const tax       = Math.round(subtotal * 0.18);
    const total     = subtotal + tax;
    const fmtAmt    = (n) => `Rs. ${n.toLocaleString("en-IN")}.00`;

    // ── HEADER BAND (light cream) ──
    doc.setFillColor(250, 246, 240);
    doc.rect(0, 0, PW, 42, "F");

    // thin top border line
    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.5);
    doc.line(0, 0.5, PW, 0.5);
    doc.setLineWidth(0.2);

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 100, 106); // rose
    doc.text("SHIPSENSE", ML, 20);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(168, 145, 122); // inkLight
    doc.text("SUPPLY CHAIN INTELLIGENCE", ML, 27);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 34, 24); // ink dark
    doc.text("INVOICE", RX, 17, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 87, 68); // inkMid
    doc.text(`No: ${invoiceNumber(ship)}`, RX, 24, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, RX, 30, { align: "right" });
    doc.text("Due: Upon Receipt", RX, 36, { align: "right" });

    // rose -> gold divider
    doc.setFillColor(201, 132, 138);
    doc.rect(0, 42, PW * 0.5, 2.5, "F");
    doc.setFillColor(196, 163, 90);
    doc.rect(PW * 0.5, 42, PW * 0.5, 2.5, "F");

    y = 54;

    // ── BILLED TO + SHIPMENT INFO ──
    const boxW = (CW - 8) / 2;

    doc.setFillColor(243, 237, 228); // bgDeep
    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.3);
    doc.roundedRect(ML, y, boxW, 36, 2, 2, "FD");
    doc.roundedRect(ML + boxW + 8, y, boxW, 36, 2, 2, "FD");
    doc.setLineWidth(0.2);

    // left box
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(168, 145, 122);
    doc.text("BILLED TO", ML + 5, y + 7);

    doc.setDrawColor(201, 132, 138);
    doc.setLineWidth(0.4);
    doc.line(ML + 5, y + 9, ML + 28, y + 9);
    doc.setLineWidth(0.2);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(46, 34, 24);
    doc.text(profile?.Name || "Customer", ML + 5, y + 16);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 87, 68);
    doc.text(profile?.Email || "—", ML + 5, y + 22);
    doc.text(profile?.Company || "—", ML + 5, y + 28);

    // right box
    const rx2 = ML + boxW + 8;
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(168, 145, 122);
    doc.text("SHIPMENT DETAILS", rx2 + 5, y + 7);

    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.4);
    doc.line(rx2 + 5, y + 9, rx2 + 38, y + 9);
    doc.setLineWidth(0.2);

    [
        ["Tracking ID", ship.ShipmentId || "—"],
        ["Route",       `${ship.Origin} to ${ship.Destination}`],
        ["Supplier",    ship.Supplier   || "—"],
        ["Status",      ship.Status     || "—"],
    ].forEach(([lbl, val], i) => {
        const dy = y + 16 + i * 5.8;
        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(168, 145, 122);
        doc.text(`${lbl}:`, rx2 + 5, dy);
        doc.setTextColor(46, 34, 24);
        doc.setFont("helvetica", "bold");
        doc.text(val, rx2 + 30, dy);
    });

    y += 44;

    // ── TABLE HEADER (rose-dark band) ──
    const COL = { desc: ML + 4, qty: ML + 102, rate: ML + 128, amt: RX - 4 };

    doc.setFillColor(160, 80, 86); // roseDark
    doc.rect(ML, y, CW, 8, "F");

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 245, 235);
    doc.text("DESCRIPTION", COL.desc, y + 5.2);
    doc.text("QTY",    COL.qty,  y + 5.2, { align: "center" });
    doc.text("RATE",   COL.rate, y + 5.2, { align: "center" });
    doc.text("AMOUNT", COL.amt,  y + 5.2, { align: "right"  });

    y += 8;

    // ── TABLE ROWS ──
    const rows = [
        ["Standard Freight Handling",  1, 4200],
        ["Port Clearance Fee",         1,  850],
        ["Documentation & Processing", 1,  320],
    ];
    if (hasDelay) rows.push([`Delay Surcharge (${ship.DelayReason.Code})`, 1, 600]);

    rows.forEach((row, i) => {
        const rh    = 8;
        const isDel = row[0].startsWith("Delay");

        doc.setFillColor(i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 246 : 250, i % 2 === 0 ? 240 : 245);
        doc.rect(ML, y, CW, rh, "F");

        if (isDel) {
        doc.setFillColor(201, 132, 138);
        doc.rect(ML, y, 2.5, rh, "F");
        }

        doc.setFontSize(8);
        doc.setFont("helvetica", isDel ? "bold" : "normal");
        doc.setTextColor(isDel ? 160 : 46, isDel ? 80 : 34, isDel ? 86 : 24);
        doc.text(row[0], COL.desc + (isDel ? 3 : 0), y + 5.3);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 87, 68);
        doc.text(String(row[1]), COL.qty,  y + 5.3, { align: "center" });
        doc.text(fmtAmt(row[2]), COL.rate, y + 5.3, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setTextColor(46, 34, 24);
        doc.text(fmtAmt(row[2] * row[1]), COL.amt, y + 5.3, { align: "right" });

        doc.setDrawColor(214, 201, 188);
        doc.setLineWidth(0.2);
        doc.line(ML, y + rh, ML + CW, y + rh);

        y += rh;
    });

    y += 6;

    // ── TOTALS BOX ──
    const TBW = 80, TBX = RX - TBW;

    doc.setFillColor(243, 237, 228);
    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.3);
    doc.roundedRect(TBX, y, TBW, 30, 2, 2, "FD");

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 87, 68);
    doc.text("Subtotal",      TBX + 5, y + 8);
    doc.text("Tax (18% GST)", TBX + 5, y + 16);

    doc.setTextColor(46, 34, 24);
    doc.text(fmtAmt(subtotal), RX - 5, y + 8,  { align: "right" });
    doc.text(fmtAmt(tax),      RX - 5, y + 16, { align: "right" });

    doc.setDrawColor(196, 163, 90);
    doc.line(TBX + 4, y + 19, RX - 4, y + 19);

    // total due band — rose
    doc.setFillColor(201, 132, 138);
    doc.roundedRect(TBX, y + 20, TBW, 10, 0, 2, "F");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 245, 235);
    doc.text("TOTAL DUE", TBX + 5, y + 27);
    doc.setTextColor(255, 255, 255);
    doc.text(fmtAmt(total), RX - 5, y + 27, { align: "right" });

    y += 38;

    // ── DELAY NOTE ──
    if (hasDelay) {
        doc.setFillColor(255, 248, 240);
        doc.setDrawColor(196, 163, 90);
        doc.setLineWidth(0.3);
        doc.roundedRect(ML, y, CW, 20, 2, 2, "FD");
        doc.setFillColor(201, 132, 138);
        doc.rect(ML, y, 3, 20, "F");

        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(160, 80, 86);
        doc.text("DELAY NOTICE", ML + 7, y + 6);

        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 87, 68);
        const dText = `Code: ${ship.DelayReason.Code}   Category: ${ship.DelayReason.Category || "—"}   Reason: ${ship.DelayReason.Reason || "—"}   Severity: ${ship.DelayReason.Severity || "—"}`;
        doc.text(doc.splitTextToSize(dText, CW - 14), ML + 7, y + 13);
        y += 26;
    }

    // ── SIGNATURE ──
    y += 8;
    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.4);
    doc.line(RX - 62, y, RX, y);

    y += 5;
    doc.setFontSize(14);
    doc.setFont("times", "bolditalic");
    doc.setTextColor(160, 80, 86);
    doc.text(signatory.name, RX, y, { align: "right" });

    y += 5;
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(168, 145, 122);
    doc.text(signatory.title,        RX, y, { align: "right" });
    y += 4;
    doc.text("Authorised Signatory", RX, y, { align: "right" });

    // ── FOOTER (light) ──
    doc.setFillColor(243, 237, 228);
    doc.rect(0, PH - 14, PW, 14, "F");

    doc.setDrawColor(196, 163, 90);
    doc.setLineWidth(0.3);
    doc.line(0, PH - 14, PW, PH - 14);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 87, 68);
    doc.text("ShipSense · Supply Chain Intelligence · shipsense.app", ML, PH - 6);
    doc.setTextColor(168, 145, 122);
    doc.text("This is a computer-generated invoice and does not require a physical signature.", RX, PH - 6, { align: "right" });

    doc.save(`${invoiceNumber(ship)}.pdf`);
    setGenerating(null);
    };

  const totalShipments = shipments.length;
  const delayed   = shipments.filter(s => s.Status === "Delayed").length;
  const delivered = shipments.filter(s => s.Status === "Delivered").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradFlowL{ 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin     { to{transform:rotate(360deg)} }

        .inv-card-l {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(196,163,90,0.07);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .card-top-l {
          height: 2px;
          background: linear-gradient(90deg,${C.rose},${C.gold},${C.rose});
          background-size: 200%; animation: gradFlowL 3s linear infinite;
        }

        .inv-row-l {
          display: grid;
          grid-template-columns: 140px 1fr 140px 100px 110px 130px 28px;
          align-items: center;
          padding: 14px 20px; gap: 12px;
          cursor: pointer; transition: background 0.2s;
          border-bottom: 1px solid ${C.border};
          position: relative;
        }
        .inv-row-l::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:0; background:linear-gradient(to bottom,${C.rose},${C.gold});
          transition:width 0.22s; border-radius:0 2px 2px 0;
        }
        .inv-row-l:hover::before { width:3px; }
        .inv-row-l:hover { background: ${C.roseLight} !important; }
        .inv-row-l:last-child { border-bottom: none; }

        .dl-btn-l {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 0; width: 100%;
          background: linear-gradient(135deg,${C.rose},${C.gold});
          border: none; border-radius: 8px;
          color: #fff; font-weight: 700;
          font-family: ${font.body}; font-size: 0.72rem;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 2px 10px rgba(201,132,138,0.2);
        }
        .dl-btn-l:hover { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,132,138,0.3); }
        .dl-btn-l:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .detail-panel-l {
          padding: 1.4rem 1.6rem;
          background: ${C.bgDeep};
          border-top: 1px dashed ${C.border};
          animation: fadeUp 0.22s ease;
        }

        .stat-chip-l {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 12px; padding: 1.1rem 1.4rem;
          box-shadow: 0 4px 16px rgba(196,163,90,0.06);
          position: relative; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .stat-chip-l:hover { border-color: ${C.borderRose}; box-shadow: 0 8px 24px rgba(201,132,138,0.1); }

        .spinner-l { width:26px; height:26px; border:2px solid rgba(201,132,138,0.2); border-top-color:${C.rose}; border-radius:50%; animation:spin 0.8s linear infinite; }

        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,132,138,0.3); border-radius:4px; }
      `}</style>

      <CustomerNavbarLight toggleTheme={toggleTheme} pageTitle="Invoices" pageSubtitle="Billing Records" />

      <div style={{ display: "flex", flex: 1 }}>
        <CustomerSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", minHeight: "calc(100vh - 64px)", position: "relative" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle,rgba(201,132,138,0.09),transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1 }}>

            {/* PAGE HEADER */}
            <div style={{ marginBottom: "1.8rem", animation: "fadeUp 0.4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Billing Records</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px", lineHeight: 1, margin: 0 }}>My Invoices</h1>
              <div style={{ fontSize: "0.74rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
                {loading ? "Fetching your invoices..." : `${totalShipments} invoice${totalShipments !== 1 ? "s" : ""} · Updated just now`}
              </div>
            </div>

            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "40vh", gap: "1rem" }}>
                <div className="spinner-l" />
                <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Loading invoices...</div>
              </div>
            ) : (
              <>
                {/* STAT CHIPS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "1.8rem", animation: "fadeUp 0.4s 0.06s ease both" }}>
                  {[
                    { label: "Total Invoices", val: totalShipments, color: C.rose     },
                    { label: "Delayed",         val: delayed,        color: C.roseDark },
                    { label: "Delivered",        val: delivered,      color: C.green    },
                  ].map((s, i) => (
                    <div key={i} className="stat-chip-l">
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlowL 3s linear infinite" }} />
                      <div style={{ fontSize: "0.58rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "8px", fontFamily: font.body }}>{s.label}</div>
                      <div style={{ fontFamily: font.heading, fontSize: "3rem", fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* TABLE CARD */}
                <div className="inv-card-l" style={{ animation: "fadeUp 0.4s 0.12s ease both" }}>
                  <div className="card-top-l" />

                  {/* TABLE HEAD */}
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 140px 100px 110px 130px 28px", padding: "10px 20px", gap: "12px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
                    {["Invoice", "Route", "Supplier", "Status", "Total", "Download", ""].map(h => (
                      <div key={h} style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, fontFamily: font.body }}>{h}</div>
                    ))}
                  </div>

                  {shipments.length === 0 ? (
                    <div style={{ padding: "5rem", textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>📭</div>
                      <div style={{ fontFamily: font.heading, fontSize: "1.4rem", fontStyle: "italic", color: C.inkMid }}>No invoices yet</div>
                      <div style={{ fontSize: "0.78rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>Invoices appear once shipments are assigned to your account.</div>
                    </div>
                  ) : shipments.map((ship, idx) => {
                    const isOpen   = expanded === ship._id;
                    const hasDelay = !!ship.DelayReason?.Code;
                    const sub      = hasDelay ? 5970 : 5370;
                    const tot      = Math.round(sub * 1.18);

                    return (
                      <div key={ship._id}>
                        <div className="inv-row-l" style={{ background: isOpen ? C.roseLight : "transparent", animationDelay: `${idx * 0.04}s` }}
                          onClick={() => setExpanded(isOpen ? null : ship._id)}>

                          <div>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>Invoice</div>
                            <div style={{ fontFamily: font.heading, fontSize: "1rem", fontStyle: "italic", fontWeight: 600, background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{invoiceNumber(ship)}</div>
                          </div>

                          <div>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>Route</div>
                            <div style={{ fontSize: "0.82rem", color: C.inkMid, fontFamily: font.body }}>{ship.Origin} <span style={{ color: C.rose }}>→</span> {ship.Destination}</div>
                          </div>

                          <div>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>Supplier</div>
                            <div style={{ fontSize: "0.82rem", color: C.inkMid, fontFamily: font.body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ship.Supplier || "—"}</div>
                          </div>

                          <div>{statusBadge(ship.Status)}</div>

                          <div>
                            <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>Total</div>
                            <div style={{ fontFamily: font.heading, fontSize: "1.1rem", fontWeight: 600, color: C.ink }}>₹{tot.toLocaleString("en-IN")}</div>
                          </div>

                          <div onClick={e => e.stopPropagation()}>
                            <button className="dl-btn-l" disabled={generating === ship._id}
                              onClick={() => handleDownload(ship)}>
                              {generating === ship._id ? "…" : "↓ PDF"}
                            </button>
                          </div>

                          <div style={{ fontSize: "0.62rem", color: C.inkFaint, transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", textAlign: "center" }}>▼</div>
                        </div>

                        {isOpen && (
                          <div className="detail-panel-l">
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.2rem", marginBottom: "1.2rem" }}>
                              {[
                                    { label: "Tracking ID", val: ship.ShipmentId || "—" },
                                    { label: "Origin",      val: ship.Origin     || "—" },
                                    { label: "Destination", val: ship.Destination|| "—" },
                                    { label: "ETA",         val: ship.ETA ? new Date(ship.ETA).toLocaleDateString("en-IN") : "—" },
                                    ].map((c, i) => (
                                <div key={i}>
                                  <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "4px", fontFamily: font.body }}>{c.label}</div>
                                  <div style={{ fontSize: "0.84rem", color: C.inkMid, fontFamily: font.body }}>{c.val}</div>
                                </div>
                              ))}
                            </div>

                            {hasDelay && (
                              <div style={{ padding: "0.9rem 1.2rem", background: "rgba(176,88,88,0.06)", borderRadius: "8px", borderLeft: `3px solid ${C.rose}`, marginBottom: "1.2rem" }}>
                                <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.rose, fontWeight: 700, marginBottom: "8px", fontFamily: font.body }}>Delay Details</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                                  {[
                                    { label: "Code",     val: ship.DelayReason.Code     },
                                    { label: "Category", val: ship.DelayReason.Category },
                                    { label: "Reason",   val: ship.DelayReason.Reason   },
                                    { label: "Severity", val: ship.DelayReason.Severity },
                                  ].map((d, i) => (
                                    <div key={i}>
                                      <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>{d.label}</div>
                                      <div style={{ fontSize: "0.84rem", color: C.rose, fontFamily: font.body }}>{d.val || "—"}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "2.5rem", padding: "0.9rem 1.2rem", background: C.bgCard, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                              {[
                                { label: "Subtotal",     val: `₹${sub.toLocaleString("en-IN")}` },
                                { label: "Tax (18% GST)",val: `₹${Math.round(sub * 0.18).toLocaleString("en-IN")}` },
                                { label: "Total",        val: `₹${tot.toLocaleString("en-IN")}`, accent: true },
                              ].map((t, i) => (
                                <div key={i} style={{ textAlign: "right" }}>
                                  <div style={{ fontSize: "0.56rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, fontWeight: 700, marginBottom: "3px", fontFamily: font.body }}>{t.label}</div>
                                  <div style={{ fontFamily: font.heading, fontSize: t.accent ? "1.2rem" : "0.95rem", fontWeight: 600, color: t.accent ? C.rose : C.ink }}>{t.val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {shipments.length > 0 && (
                  <div style={{ textAlign: "center", marginTop: "1.8rem", fontSize: "0.68rem", color: C.inkFaint, fontFamily: font.body }}>
                    All invoices are system-generated · For billing disputes contact your assigned admin
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}