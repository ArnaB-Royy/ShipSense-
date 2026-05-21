import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";

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
  sageBorder: "rgba(138,158,122,0.3)",
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

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    category: "Delay Alert",
    title: "Shipment SHP-3309 Delayed",
    message: "Your Delhi → New York shipment has been delayed by 2 hours due to adverse weather conditions at the origin airport.",
    timestamp: "2026-04-11T10:32:00",
    read: false,
  },
  {
    id: 2,
    category: "Status Update",
    title: "SHP-4821 Departed Mumbai Port",
    message: "Your shipment SHP-4821 has successfully departed Mumbai Port and is now en route to Dubai. ETA remains on schedule.",
    timestamp: "2026-04-11T09:15:00",
    read: false,
  },
  {
    id: 3,
    category: "Delivery",
    title: "SHP-2910 Delivered Successfully",
    message: "Your shipment SHP-2910 (Kolkata → Singapore) has been delivered and signed for at the destination warehouse.",
    timestamp: "2026-04-10T16:48:00",
    read: false,
  },
  {
    id: 4,
    category: "Delay Alert",
    title: "SHP-6074 Held at Customs",
    message: "Shipment SHP-6074 is currently held at Singapore Customs for documentation review. Expected delay: 5 hours.",
    timestamp: "2026-04-10T13:20:00",
    read: true,
  },
  {
    id: 5,
    category: "Status Update",
    title: "SHP-5102 In Transit",
    message: "Your Chennai → London shipment SHP-5102 is currently in transit and passing through the Suez Canal corridor.",
    timestamp: "2026-04-10T08:05:00",
    read: true,
  },
  {
    id: 6,
    category: "Delivery",
    title: "SHP-1847 Out for Delivery",
    message: "Shipment SHP-1847 has cleared customs in Frankfurt and is now out for final delivery. Expected by end of day.",
    timestamp: "2026-04-09T11:30:00",
    read: true,
  },
];

const CATEGORY_META = {
  "Status Update": {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="#c4a35a" strokeWidth="1.2" />
        <path d="M7 4v3.5l2 1.5" stroke="#c4a35a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    color: "#c4a35a",
    bg: "rgba(196,163,90,0.1)",
    border: "rgba(196,163,90,0.28)",
  },
  "Delivery": {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="4" width="12" height="8" rx="1" stroke="#8a9e7a" strokeWidth="1.2" />
        <path d="M4 4V3a3 3 0 016 0v1" stroke="#8a9e7a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M5 7.5l1.5 1.5L9 6" stroke="#8a9e7a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#8a9e7a",
    bg: "rgba(138,158,122,0.1)",
    border: "rgba(138,158,122,0.28)",
  },
  "Delay Alert": {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13 12H1L7 1z" stroke="#c9848a" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M7 5.5v2.5" stroke="#c9848a" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.6" fill="#c9848a" />
      </svg>
    ),
    color: "#c9848a",
    bg: "rgba(201,132,138,0.1)",
    border: "rgba(201,132,138,0.28)",
  },
};

function formatTimestamp(ts) {
  const date = new Date(ts);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const ALL_CATEGORIES = ["All", "Status Update", "Delivery", "Delay Alert"];

export default function CustomerNotificationsLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeCategory === "All"
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => {
    setNotifications([]);
    setClearConfirm(false);
  };

  const hover = { transition: "transform 0.25s, box-shadow 0.25s" };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseR { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarLight
        toggleTheme={toggleTheme}
        pageTitle="Notifications"
        pageSubtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
      />

      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <CustomerSidebarLight
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
        }}>

          {/* AMBIENT ORBS */}
          <div style={{
            position: "fixed", top: "-100px", right: "-100px",
            width: "500px", height: "500px", borderRadius: "50%",
            background: `radial-gradient(circle,rgba(201,132,138,0.1),transparent 70%)`,
            animation: "pulseOrb 6s ease-in-out infinite",
            pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "fixed", bottom: "-150px", left: "5%",
            width: "600px", height: "600px", borderRadius: "50%",
            background: `radial-gradient(circle,rgba(196,163,90,0.07),transparent 70%)`,
            animation: "pulseOrb 8s ease-in-out infinite reverse",
            pointerEvents: "none", zIndex: 0,
          }} />

          <div style={{
            opacity: visible ? 1 : 0,
            animation: visible ? "fadeUp 0.8s ease both" : "none",
            position: "relative", zIndex: 1,
            maxWidth: "860px",
          }}>

            {/* PAGE HEADER */}
            <div style={{ marginBottom: "1.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
                  Customer Portal
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <h1 style={{
                  fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600,
                  background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", color: "transparent",
                  letterSpacing: "1px", lineHeight: 1, margin: 0,
                  display: "flex", alignItems: "center", gap: "1rem",
                }}>
                  Notifications
                  {unreadCount > 0 && (
                    <span style={{
                      fontFamily: font.body, fontSize: "0.75rem", fontWeight: 600,
                      letterSpacing: "0.5px", padding: "0.25rem 0.8rem", borderRadius: "999px",
                      background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose,
                      WebkitTextFillColor: C.rose,
                    }}>
                      {unreadCount} unread
                    </span>
                  )}
                </h1>

                {/* HEADER ACTIONS */}
                {notifications.length > 0 && (
                  <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.border}`, padding: "0.55rem 1.2rem", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body, ...hover }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; }}
                      >
                        Mark All Read
                      </button>
                    )}
                    {!clearConfirm ? (
                      <button
                        onClick={() => setClearConfirm(true)}
                        style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.borderRose}`, padding: "0.55rem 1.2rem", fontSize: "0.7rem", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body, ...hover }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.color = C.rose; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderRose; e.currentTarget.style.color = C.inkLight; }}
                      >
                        Clear All
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.68rem", color: C.inkLight, letterSpacing: "0.5px", fontFamily: font.body }}>Sure?</span>
                        <button
                          onClick={clearAll}
                          style={{ background: C.roseLight, color: C.rose, border: `1px solid ${C.borderRose}`, padding: "0.45rem 0.9rem", fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body }}
                        >
                          Yes, Clear
                        </button>
                        <button
                          onClick={() => setClearConfirm(false)}
                          style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.border}`, padding: "0.45rem 0.9rem", fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ fontSize: "0.74rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All notifications have been read"}
              </div>
            </div>

            {/* CATEGORY FILTER TABS */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {ALL_CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                const meta = cat !== "All" ? CATEGORY_META[cat] : null;
                const catUnread = cat === "All"
                  ? unreadCount
                  : notifications.filter((n) => n.category === cat && !n.read).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.45rem",
                      padding: "0.45rem 1.1rem", borderRadius: "999px",
                      border: isActive
                        ? `1px solid ${meta ? meta.border : "rgba(196,163,90,0.4)"}`
                        : `1px solid ${C.border}`,
                      background: isActive
                        ? meta ? meta.bg : C.goldLight
                        : C.bgDeep,
                      color: isActive
                        ? meta ? meta.color : C.gold
                        : C.inkLight,
                      fontSize: "0.68rem", letterSpacing: "1.5px", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 0.2s", fontFamily: font.body, fontWeight: 500,
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = C.borderRose; e.currentTarget.style.color = C.rose; } }}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; } }}
                  >
                    {meta && <span style={{ display: "flex" }}>{meta.icon}</span>}
                    {cat}
                    {catUnread > 0 && (
                      <span style={{
                        minWidth: "16px", height: "16px", borderRadius: "999px",
                        background: isActive ? (meta ? meta.color : C.gold) : C.inkFaint,
                        color: isActive ? "#fff" : C.inkLight,
                        fontSize: "0.52rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px",
                      }}>
                        {catUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* NOTIFICATION LIST */}
            {filtered.length === 0 ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "6rem 2rem",
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: "10px", textAlign: "center",
                boxShadow: "0 4px 20px rgba(196,163,90,0.07)",
              }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%",
                  background: C.bgDeep, border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.5rem",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.5 2 6 4.5 6 8v1.5C6 12 4 13.5 4 15v1h16v-1c0-1.5-2-3-2-5.5V8c0-3.5-2.5-6-6-6z" stroke={C.inkFaint} strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M10 18a2 2 0 004 0" stroke={C.inkFaint} strokeWidth="1.2" />
                  </svg>
                </div>
                <div style={{ fontFamily: font.heading, fontSize: "1.8rem", fontWeight: 600, fontStyle: "italic", color: C.ink, letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                  All Clear
                </div>
                <p style={{ fontSize: "0.82rem", color: C.inkMid, lineHeight: 1.7, maxWidth: "280px", margin: 0, fontWeight: 300, fontFamily: font.body }}>
                  {activeCategory === "All"
                    ? "You have no notifications. We'll let you know when something needs your attention."
                    : `No ${activeCategory} notifications at the moment.`}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {filtered.map((n, i) => {
                  const meta = CATEGORY_META[n.category];
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "1rem",
                        padding: "1.2rem 1.4rem",
                        background: n.read ? C.bgCard : "#fff",
                        border: n.read ? `1px solid ${C.border}` : `1px solid ${meta.border}`,
                        borderRadius: "8px",
                        transition: "all 0.25s",
                        animation: `slideIn 0.4s ease ${i * 0.04}s both`,
                        position: "relative",
                        boxShadow: n.read ? "0 2px 12px rgba(196,163,90,0.05)" : `0 4px 20px ${meta.bg}`,
                        cursor: n.read ? "default" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 6px 24px ${meta.bg}`;
                        e.currentTarget.style.borderColor = meta.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = n.read ? "0 2px 12px rgba(196,163,90,0.05)" : `0 4px 20px ${meta.bg}`;
                        e.currentTarget.style.borderColor = n.read ? C.border : meta.border;
                      }}
                    >
                      {/* UNREAD DOT */}
                      {!n.read && (
                        <div style={{
                          position: "absolute", top: "14px", right: "14px",
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: meta.color, animation: "pulseR 2s infinite", flexShrink: 0,
                        }} />
                      )}

                      {/* CATEGORY ICON */}
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "6px",
                        background: meta.bg, border: `1px solid ${meta.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: "2px",
                      }}>
                        {meta.icon}
                      </div>

                      {/* CONTENT */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "0.55rem", letterSpacing: "2px", textTransform: "uppercase",
                            color: meta.color, padding: "0.15rem 0.55rem",
                            background: meta.bg, border: `1px solid ${meta.border}`,
                            borderRadius: "999px", fontWeight: 500, fontFamily: font.body,
                          }}>
                            {n.category}
                          </span>
                          <span style={{ fontSize: "0.62rem", color: C.inkFaint, letterSpacing: "0.5px", fontFamily: font.body }}>
                            {formatTimestamp(n.timestamp)}
                          </span>
                        </div>
                        <div style={{
                          fontFamily: font.heading, fontSize: "1.05rem",
                          fontWeight: n.read ? 400 : 600,
                          fontStyle: n.read ? "normal" : "italic",
                          color: n.read ? C.inkLight : C.ink,
                          marginBottom: "0.35rem", letterSpacing: "0.2px",
                        }}>
                          {n.title}
                        </div>
                        <p style={{ fontSize: "0.78rem", color: C.inkMid, lineHeight: 1.65, margin: 0, fontWeight: 300, fontFamily: font.body }}>
                          {n.message}
                        </p>
                      </div>

                      {/* MARK AS READ */}
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          style={{
                            flexShrink: 0,
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            color: C.inkLight,
                            fontSize: "0.6rem", letterSpacing: "1px",
                            textTransform: "uppercase",
                            padding: "0.3rem 0.75rem", borderRadius: "999px",
                            cursor: "pointer", transition: "all 0.2s",
                            whiteSpace: "nowrap", marginTop: "2px",
                            alignSelf: "flex-start", fontFamily: font.body,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.color = meta.color; e.currentTarget.style.background = meta.bg; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; e.currentTarget.style.background = "transparent"; }}
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}