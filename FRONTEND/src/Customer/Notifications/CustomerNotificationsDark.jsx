import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebarDark from "../Components/CustomerSidebarDark";
import CustomerNavbarDark from "../Components/CustomerNavbarDark";

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
        <circle cx="7" cy="7" r="6" stroke="#f0a030" strokeWidth="1.2" />
        <path d="M7 4v3.5l2 1.5" stroke="#f0a030" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    color: "#f0a030",
    bg: "rgba(240,160,48,0.08)",
    border: "rgba(240,160,48,0.2)",
  },
  "Delivery": {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="4" width="12" height="8" rx="1" stroke="#4caf80" strokeWidth="1.2" />
        <path d="M4 4V3a3 3 0 016 0v1" stroke="#4caf80" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M5 7.5l1.5 1.5L9 6" stroke="#4caf80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#4caf80",
    bg: "rgba(76,175,128,0.08)",
    border: "rgba(76,175,128,0.2)",
  },
  "Delay Alert": {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13 12H1L7 1z" stroke="#e63232" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M7 5.5v2.5" stroke="#e63232" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.6" fill="#e63232" />
      </svg>
    ),
    color: "#e63232",
    bg: "rgba(230,50,50,0.08)",
    border: "rgba(230,50,50,0.2)",
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

export default function CustomerNotificationsDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  useEffect(() => {
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

  const hover = { transition: "transform 0.2s, box-shadow 0.2s" };

  return (
    <div
      style={{
        background: "#07060a",
        color: "#e0d8d0",
        fontFamily: "'Inter', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes pulseR { 0%,100%{opacity:1}50%{opacity:0.2} }
        @keyframes pulseOrb { 0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.12)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarDark
        toggleTheme={toggleTheme}
        pageTitle="NOTIFICATIONS"
        pageSubtitle="ALERTS & UPDATES"
      />

      {/* LAYOUT: Sidebar + Main content */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {/* SIDEBAR */}
        <CustomerSidebarDark
          hoveredWidth={hoveredWidth}
          setHoveredWidth={setHoveredWidth}
        />

        {/* AMBIENT ORB */}
        <div
          style={{
            position: "fixed",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(196,30,30,0.12) 0%,rgba(196,30,30,0.04) 50%,transparent 70%)",
            top: "40%",
            left: "35%",
            transform: "translate(-50%,-50%)",
            zIndex: 0,
            pointerEvents: "none",
            animation: "pulseOrb 5s ease-in-out infinite",
          }}
        />

        {/* PAGE BODY */}
        <main
          style={{
            marginLeft: "68px",
            flex: 1,
            paddingTop: "2.5rem",
            paddingBottom: "5rem",
            paddingLeft: "3rem",
            paddingRight: "3rem",
            maxWidth: "860px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              animation: visible ? "fadeUp 0.8s ease both" : "none",
            }}
          >
            {/* PAGE HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg,#e63232,#f0a030)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "0.5rem",
                  }}
                >
                  Customer Portal
                </div>
                <h1
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "3rem",
                    background: "linear-gradient(135deg,#ffffff,#c8b0a8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "2px",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  NOTIFICATIONS
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "1px",
                        padding: "0.25rem 0.8rem",
                        borderRadius: "999px",
                        background: "rgba(230,50,50,0.12)",
                        border: "1px solid rgba(230,50,50,0.25)",
                        color: "#e63232",
                        WebkitTextFillColor: "#e63232",
                      }}
                    >
                      {unreadCount} unread
                    </span>
                  )}
                </h1>
              </div>

              {/* HEADER ACTIONS */}
              {notifications.length > 0 && (
                <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: "transparent",
                        color: "#6a5e5e",
                        border: "1px solid rgba(255,255,255,0.08)",
                        padding: "0.55rem 1.2rem",
                        fontSize: "0.7rem",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: "3px",
                        ...hover,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(240,160,48,0.3)"; e.currentTarget.style.color = "#f0a030"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6a5e5e"; }}
                    >
                      Mark All Read
                    </button>
                  )}
                  {!clearConfirm ? (
                    <button
                      onClick={() => setClearConfirm(true)}
                      style={{
                        background: "transparent",
                        color: "#6a5e5e",
                        border: "1px solid rgba(230,50,50,0.2)",
                        padding: "0.55rem 1.2rem",
                        fontSize: "0.7rem",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: "3px",
                        ...hover,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(230,50,50,0.5)"; e.currentTarget.style.color = "#e63232"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(230,50,50,0.2)"; e.currentTarget.style.color = "#6a5e5e"; }}
                    >
                      Clear All
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.68rem", color: "#6a5e5e", letterSpacing: "0.5px" }}>Sure?</span>
                      <button
                        onClick={clearAll}
                        style={{ background: "rgba(230,50,50,0.15)", color: "#e63232", border: "1px solid rgba(230,50,50,0.3)", padding: "0.45rem 0.9rem", fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px" }}
                      >
                        Yes, Clear
                      </button>
                      <button
                        onClick={() => setClearConfirm(false)}
                        style={{ background: "transparent", color: "#6a5e5e", border: "1px solid rgba(255,255,255,0.07)", padding: "0.45rem 0.9rem", fontSize: "0.68rem", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CATEGORY FILTER TABS */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.45rem 1.1rem",
                      borderRadius: "999px",
                      border: isActive
                        ? `1px solid ${meta ? meta.color + "55" : "rgba(240,160,48,0.4)"}`
                        : "1px solid rgba(255,255,255,0.07)",
                      background: isActive
                        ? meta
                          ? meta.bg
                          : "rgba(240,160,48,0.08)"
                        : "rgba(255,255,255,0.02)",
                      color: isActive
                        ? meta
                          ? meta.color
                          : "#f0a030"
                        : "#4a4040",
                      fontSize: "0.68rem",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#c8b8b0"; }}}
                    onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#4a4040"; }}}
                  >
                    {meta && <span style={{ display: "flex" }}>{meta.icon}</span>}
                    {cat}
                    {catUnread > 0 && (
                      <span
                        style={{
                          minWidth: "16px",
                          height: "16px",
                          borderRadius: "999px",
                          background: isActive
                            ? meta
                              ? meta.color
                              : "#f0a030"
                            : "rgba(255,255,255,0.1)",
                          color: isActive ? "#07060a" : "#4a4040",
                          fontSize: "0.52rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 4px",
                        }}
                      >
                        {catUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* NOTIFICATION LIST */}
            {filtered.length === 0 ? (
              /* EMPTY STATE */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6rem 2rem",
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.5 2 6 4.5 6 8v1.5C6 12 4 13.5 4 15v1h16v-1c0-1.5-2-3-2-5.5V8c0-3.5-2.5-6-6-6z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M10 18a2 2 0 004 0" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
                  </svg>
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    background: "linear-gradient(135deg,#ffffff,#c8b0a8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "2px",
                    marginBottom: "0.5rem",
                  }}
                >
                  ALL CLEAR
                </div>
                <p style={{ fontSize: "0.82rem", color: "#4a4040", lineHeight: 1.7, maxWidth: "280px", margin: 0 }}>
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
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1rem",
                        padding: "1.2rem 1.4rem",
                        background: n.read
                          ? "rgba(255,255,255,0.015)"
                          : "rgba(255,255,255,0.03)",
                        border: n.read
                          ? "1px solid rgba(255,255,255,0.05)"
                          : `1px solid ${meta.border}`,
                        borderRadius: "8px",
                        transition: "all 0.25s",
                        animation: `slideIn 0.4s ease ${i * 0.04}s both`,
                        position: "relative",
                        cursor: n.read ? "default" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.borderColor = meta.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = n.read ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)";
                        e.currentTarget.style.borderColor = n.read ? "rgba(255,255,255,0.05)" : meta.border;
                      }}
                    >
                      {/* UNREAD DOT */}
                      {!n.read && (
                        <div
                          style={{
                            position: "absolute",
                            top: "14px",
                            right: "14px",
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: meta.color,
                            animation: "pulseR 2s infinite",
                            flexShrink: 0,
                          }}
                        />
                      )}

                      {/* CATEGORY ICON */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        {meta.icon}
                      </div>

                      {/* CONTENT */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            marginBottom: "0.3rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.55rem",
                              letterSpacing: "2px",
                              textTransform: "uppercase",
                              color: meta.color,
                              padding: "0.15rem 0.55rem",
                              background: meta.bg,
                              border: `1px solid ${meta.border}`,
                              borderRadius: "2px",
                              fontWeight: 500,
                            }}
                          >
                            {n.category}
                          </span>
                          <span
                            style={{
                              fontSize: "0.62rem",
                              color: "#3a3030",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {formatTimestamp(n.timestamp)}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.88rem",
                            fontWeight: n.read ? 400 : 500,
                            color: n.read ? "#6a5e5e" : "#c8b8b0",
                            marginBottom: "0.35rem",
                            letterSpacing: "0.2px",
                          }}
                        >
                          {n.title}
                        </div>
                        <p
                          style={{
                            fontSize: "0.78rem",
                            color: "#4a4040",
                            lineHeight: 1.65,
                            margin: 0,
                            fontWeight: 300,
                          }}
                        >
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
                            border: "1px solid rgba(255,255,255,0.07)",
                            color: "#4a4040",
                            fontSize: "0.6rem",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            padding: "0.3rem 0.75rem",
                            borderRadius: "2px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap",
                            marginTop: "2px",
                            alignSelf: "flex-start",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.color + "66"; e.currentTarget.style.color = meta.color; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#4a4040"; }}
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
        </main>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          padding: "1.6rem 4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          marginLeft: "68px",
        }}
      >
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "4px", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SHIPSENSE</div>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
          {["Privacy", "Terms", "Help"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: "#333", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = "#f0a030")}
              onMouseLeave={(e) => (e.target.style.color = "#333")}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ fontSize: "0.62rem", color: "#222", letterSpacing: "1px", textAlign: "right" }}>© 2026 SHIPSENSE. ALL RIGHTS RESERVED.</div>
      </footer>
    </div>
  );
}