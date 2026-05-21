import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerNavbarDark({ toggleTheme, pageTitle = "DASHBOARD", pageSubtitle = "OVERVIEW" }) {
  const navigate = useNavigate();
  const [spelling, setSpelling] = useState(false);
  const [displayText, setDisplayText] = useState("SHIPSENSE");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Pull customer from session/localStorage
  const customer = JSON.parse(
    sessionStorage.getItem("customerToken") || localStorage.getItem("customerToken") || "null"
  );

  const [editData, setEditData] = useState({
    name:    customer?.name    || "",
    email:   customer?.email   || "",
    phone:   customer?.phone   || "",
    address: customer?.address || "",
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: "status",   read: false, title: "Shipment In Transit",  message: "SHP-001 is now on its way to your destination.", time: "2 min ago"  },
    { id: 2, type: "delivery", read: false, title: "Delivery Confirmed",   message: "SHP-002 has been delivered successfully.",       time: "1 hr ago"  },
    { id: 3, type: "delay",    read: true,  title: "Delay Alert",          message: "SHP-003 has been delayed by 2 hours.",           time: "3 hrs ago" },
    { id: 4, type: "status",   read: true,  title: "Shipment Picked Up",   message: "SHP-004 has been picked up by carrier.",         time: "Yesterday" },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markOneRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearAll = () => setNotifications([]);

  const notifIcon = (type) => {
    switch (type) {
      case "status":   return "📦";
      case "delivery": return "✅";
      case "delay":    return "⚠️";
      default:         return "🔔";
    }
  };
  const notifColor = (type) => {
    switch (type) {
      case "status":   return { color: "#f0a030", border: "rgba(240,160,48,0.2)",  bg: "rgba(240,160,48,0.06)"  };
      case "delivery": return { color: "#4ade80", border: "rgba(74,222,128,0.2)",  bg: "rgba(74,222,128,0.06)"  };
      case "delay":    return { color: "#e63232", border: "rgba(230,50,50,0.2)",   bg: "rgba(230,50,50,0.06)"   };
      default:         return { color: "#a89888", border: "rgba(168,152,136,0.2)", bg: "rgba(168,152,136,0.06)" };
    }
  };

  useEffect(() => {
    const full = "SHIPSENSE";
    const interval = setInterval(() => {
      setSpelling(true);
      let i = 0;
      setDisplayText("");
      const spell = setInterval(() => {
        i++;
        setDisplayText(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(spell);
          setTimeout(() => setSpelling(false), 800);
        }
      }, 80);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${customer?._id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.customer) {
        const updated = { ...customer, ...data.customer };
        sessionStorage.setItem("customerToken", JSON.stringify(updated));
        localStorage.setItem("customerToken", JSON.stringify(updated));
        setIsEditing(false);
        showNotification("success", "Profile updated successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to update profile.");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const initials = customer?.name
    ? customer.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "C";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseR       { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(230,50,50,0.4)} 50%{opacity:0.4;box-shadow:none} }
        @keyframes pulseG       { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(74,186,74,0.4)} 50%{opacity:0.4;box-shadow:none} }
        @keyframes gradFlow     { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes textShift    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes cursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUp      { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideRight   { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDown    { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes avatarSpin   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes avatarPulse  { 0%,100%{box-shadow:0 0 10px rgba(240,160,48,0.5),0 0 20px rgba(230,50,50,0.2)} 50%{box-shadow:0 0 22px rgba(240,160,48,0.8),0 0 44px rgba(230,50,50,0.4)} }
        @keyframes nameShift    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes badgeShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes notifBounce  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes badgePop     { 0%{transform:scale(0)} 60%{transform:scale(1.25)} 100%{transform:scale(1)} }

        .logo-text-c {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 4px;
          background: linear-gradient(90deg,#e63232,#f0a030,#fff,#f0a030,#e63232);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: textShift 12s ease infinite;
        }
        .cursor-c {
          display: inline-block; width: 2px; height: 1.2rem;
          background: #f0a030; margin-left: 2px; vertical-align: middle;
          animation: cursorBlink 0.6s ease infinite;
        }
        .page-title-c {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem; letter-spacing: 4px;
          background: linear-gradient(90deg,#e63232,#f0a030,#e63232);
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: gradFlow 3s linear infinite;
        }
        .page-subtitle-c {
          font-size: 0.52rem; letter-spacing: 3px; text-transform: uppercase;
          color: #a89888; font-family: 'Inter',sans-serif; margin-top: 2px; font-weight: 600;
        }

        .avatar-wrapper {
          position: relative; width: 48px; height: 48px; flex-shrink: 0;
        }
        .avatar-wrapper::before {
          content:''; position:absolute; inset:-2px; border-radius:50%;
          background: conic-gradient(#f0a030,#e63232,#ffffff,#e63232,#f0a030);
          animation: avatarSpin 2s linear infinite; z-index:0;
        }
        .avatar-inner {
          position:absolute; inset:2px; border-radius:50%;
          background: linear-gradient(135deg,#2a1a08,#1a0808);
          display:flex; align-items:center; justify-content:center;
          font-size:1.1rem; font-weight:800; color:#f0a030;
          font-family:'Bebas Neue',sans-serif; z-index:1;
          animation: avatarPulse 2s ease-in-out infinite;
        }
        .name-lg {
          font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:2px;
          background: linear-gradient(90deg,#f0a030,#fff,#e63232,#f0a030,#fff,#e63232);
          background-size:300% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          animation: nameShift 3s ease infinite;
        }
        .cust-badge {
          font-size:0.55rem; padding:2px 7px; border-radius:4px;
          background: linear-gradient(90deg,rgba(240,160,48,0.35),rgba(230,50,50,0.25),rgba(240,160,48,0.35));
          background-size:200% auto;
          border:1px solid rgba(240,160,48,0.7);
          color:#f0a030; font-weight:800; letter-spacing:2px;
          font-family:'Inter',sans-serif; text-transform:uppercase;
          animation: badgeShimmer 2s linear infinite;
          box-shadow:0 0 8px rgba(240,160,48,0.3),0 0 16px rgba(230,50,50,0.1);
        }

        .notif-dropdown-c {
          position:absolute; top:calc(100% + 10px); right:0;
          width:340px; z-index:300;
          background:linear-gradient(145deg,#0f0d13,#0a0810);
          border:1px solid rgba(230,50,50,0.2);
          border-radius:14px; overflow:hidden;
          animation: slideDown 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards;
          box-shadow:0 20px 60px rgba(0,0,0,0.6);
        }
        .profile-dropdown-c {
          position:absolute; top:calc(100% + 10px); right:0;
          width:230px; z-index:300;
          background:linear-gradient(145deg,#0f0d13,#0a0810);
          border:1px solid rgba(240,160,48,0.2);
          border-radius:14px; overflow:hidden;
          animation: slideDown 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards;
          box-shadow:0 20px 60px rgba(0,0,0,0.6);
        }

        .icon-btn-c {
          position: relative;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.25s;
          flex-shrink: 0;
        }
        .icon-btn-c:hover {
          background: rgba(230,50,50,0.08);
          border-color: rgba(230,50,50,0.35);
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(230,50,50,0.2);
        }

        .slide-up-modal  { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .slide-right-ntf { animation: slideRight 0.35s ease forwards; }
        .action-btn-c    { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-c:hover { transform: translateY(-2px); }

        input:focus, select:focus { outline:none !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(230,50,50,0.25); border-radius:4px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 4rem", background:"rgba(7,6,10,0.98)", borderBottom:"1px solid rgba(230,50,50,0.12)", position:"sticky", top:0, zIndex:100, flexShrink:0 }}>

        {/* LEFT — Logo */}
        <div onClick={() => navigate("/")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
          <div className="logo-text-c">
            {displayText}
            {spelling && <span className="cursor-c" />}
          </div>
        </div>

        {/* CENTER — Page title */}
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
          <div className="page-title-c">{pageTitle}</div>
          <div className="page-subtitle-c">{pageSubtitle}</div>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>

          {/* LIVE pill */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", border:"1px solid rgba(230,50,50,0.2)", borderRadius:"999px", background:"rgba(230,50,50,0.05)" }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#e63232", display:"inline-block", animation:"pulseR 2s infinite" }} />
            <span style={{ fontSize:"0.65rem", color:"#e63232", fontFamily:"'Inter',sans-serif", fontWeight:700, letterSpacing:"2px" }}>LIVE</span>
          </div>

          {/* DATE */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", border:"1px solid rgba(240,160,48,0.15)", borderRadius:"6px", background:"rgba(240,160,48,0.04)", fontSize:"0.68rem", color:"#b89050", fontFamily:"'Inter',sans-serif", fontWeight:500 }}>
            📅 {new Date().toDateString()}
          </div>

          {/* THEME TOGGLE */}
          <div onClick={toggleTheme}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 10px", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"6px", background:"rgba(255,255,255,0.02)", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(230,50,50,0.3)"; e.currentTarget.style.background="rgba(230,50,50,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
          >
            <span style={{ fontSize:"0.9rem" }}>🌙</span>
            <div style={{ width:"30px", height:"17px", borderRadius:"999px", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", position:"relative" }}>
              <div style={{ position:"absolute", top:"2px", left:"2px", width:"13px", height:"13px", borderRadius:"50%", background:"linear-gradient(135deg,#e63232,#f0a030)", transition:"transform 0.3s" }} />
            </div>
            <span style={{ fontSize:"0.9rem" }}>☀️</span>
          </div>

          {/* ── NOTIFICATIONS BELL ── */}
          <div style={{ position:"relative" }}>
            <div className="icon-btn-c"
              onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }}
              title="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5A1 1 0 003.5 15h13a1 1 0 00.86-1.5L16 11V8a6 6 0 00-6-6z"
                  stroke={notifOpen ? "#e63232" : "#7a6a60"} strokeWidth="1.5"
                  fill={notifOpen ? "rgba(230,50,50,0.1)" : "none"} />
                <path d="M8 15a2 2 0 004 0" stroke={notifOpen ? "#e63232" : "#7a6a60"} strokeWidth="1.4" />
              </svg>
              {unreadCount > 0 && (
                <div style={{ position:"absolute", top:"-4px", right:"-4px", width:"18px", height:"18px", borderRadius:"50%", background:"linear-gradient(135deg,#e63232,#f0a030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.58rem", fontWeight:700, color:"#fff", fontFamily:"'Inter',sans-serif", animation:"notifBounce 2s ease infinite", border:"2px solid #07060a" }}>
                  {unreadCount}
                </div>
              )}
            </div>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="notif-dropdown-c">
                <div style={{ height:"2px", background:"linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize:"200%", animation:"gradFlow 3s linear infinite" }} />
                <div style={{ padding:"1rem 1.2rem", borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", letterSpacing:"2px", color:"#e0d8d0" }}>NOTIFICATIONS</div>
                    <div style={{ fontSize:"0.62rem", color:"#6a5a50", letterSpacing:"1px" }}>{unreadCount} unread</div>
                  </div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ background:"transparent", border:"1px solid rgba(240,160,48,0.25)", color:"#f0a030", padding:"4px 10px", borderRadius:"6px", fontSize:"0.62rem", fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif", letterSpacing:"0.5px" }}>Mark all read</button>
                    )}
                    <button onClick={clearAll} style={{ background:"transparent", border:"1px solid rgba(230,50,50,0.25)", color:"#e63232", padding:"4px 10px", borderRadius:"6px", fontSize:"0.62rem", fontWeight:600, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Clear all</button>
                  </div>
                </div>
                <div style={{ maxHeight:"280px", overflowY:"auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding:"2.5rem", textAlign:"center", color:"#5a4a45", fontSize:"0.8rem" }}>
                      <div style={{ fontSize:"2rem", marginBottom:"8px", opacity:0.4 }}>🔔</div>
                      No notifications
                    </div>
                  ) : notifications.map((n, i) => {
                    const nc = notifColor(n.type);
                    return (
                      <div key={n.id} onClick={() => markOneRead(n.id)}
                        style={{ padding:"0.9rem 1.2rem", borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", background: n.read ? "transparent" : "rgba(230,50,50,0.03)", cursor:"pointer", transition:"background 0.2s", display:"flex", gap:"10px", alignItems:"flex-start" }}
                        onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background= n.read ? "transparent" : "rgba(230,50,50,0.03)"}
                      >
                        <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:nc.bg, border:`1px solid ${nc.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>
                          {notifIcon(n.type)}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"3px" }}>
                            <div style={{ fontSize:"0.78rem", fontWeight:600, color: n.read ? "#a89888" : "#e0d8d0", fontFamily:"'Inter',sans-serif" }}>{n.title}</div>
                            {!n.read && <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#e63232", flexShrink:0 }} />}
                          </div>
                          <div style={{ fontSize:"0.71rem", color:"#6a5a50", lineHeight:1.4, marginBottom:"4px" }}>{n.message}</div>
                          <div style={{ fontSize:"0.62rem", color:"#4a3a35" }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding:"0.8rem 1.2rem", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                  <button onClick={() => { navigate("/customer/notifications"); setNotifOpen(false); }}
                    style={{ width:"100%", padding:"8px", background:"transparent", border:"1px solid rgba(230,50,50,0.2)", borderRadius:"8px", color:"#e63232", fontSize:"0.72rem", fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif", letterSpacing:"1px", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(230,50,50,0.06)"; e.currentTarget.style.borderColor="rgba(230,50,50,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="rgba(230,50,50,0.2)"; }}
                  >VIEW ALL NOTIFICATIONS →</button>
                </div>
              </div>
            )}
          </div>

          {/* ── PROFILE ICON ── */}
          <div style={{ position:"relative" }}>
            <div className="icon-btn-c"
              onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
              title="Profile"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="7" r="3.5" stroke={profileOpen ? "#f0a030" : "#7a6a60"} strokeWidth="1.5" fill={profileOpen ? "rgba(240,160,48,0.1)" : "none"} />
                <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke={profileOpen ? "#f0a030" : "#7a6a60"} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Profile mini dropdown */}
            {profileOpen && !isEditing && (
              <div className="profile-dropdown-c">
                <div style={{ height:"2px", background:"linear-gradient(90deg,#f0a030,#e63232,#f0a030)", backgroundSize:"200%", animation:"gradFlow 3s linear infinite" }} />
                <div style={{ padding:"1rem 1.2rem", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                    <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:"linear-gradient(135deg,#e63232,#f0a030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.78rem", fontWeight:700, color:"#fff", fontFamily:"'Inter',sans-serif", flexShrink:0 }}>{initials}</div>
                    <div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"1px", color:"#e0d8d0" }}>{customer?.name?.split(" ")[0] || "Customer"}</div>
                      <div style={{ fontSize:"0.62rem", color:"#6a5a50", letterSpacing:"1px", fontFamily:"'Inter',sans-serif" }}>Customer</div>
                    </div>
                  </div>
                </div>
                {[
                  { icon:"👤", label:"View Profile",     action: () => { setProfileOpen(false); setTimeout(() => setProfileOpen(true), 10); setIsEditing(false); } },
                  { icon:"⚙️", label:"Account Settings", action: () => { setProfileOpen(false); navigate("/customer/profile"); } },
                  { icon:"🔔", label:"Notifications",    action: () => { setProfileOpen(false); navigate("/customer/notifications"); } },
                ].map((item, i) => (
                  <div key={i} onClick={item.action}
                    style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 1.2rem", cursor:"pointer", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", transition:"background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(240,160,48,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}
                  >
                    <span style={{ fontSize:"0.85rem" }}>{item.icon}</span>
                    <span style={{ fontSize:"0.8rem", color:"#a89888", fontFamily:"'Inter',sans-serif", fontWeight:500 }}>{item.label}</span>
                  </div>
                ))}
                <div
                  onClick={() => { localStorage.removeItem("customerToken"); sessionStorage.removeItem("customerToken"); navigate("/customer/login"); }}
                  style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 1.2rem", cursor:"pointer", transition:"background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(230,50,50,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="#e63232" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10 11l3-3-3-3" stroke="#e63232" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="13" y1="8" x2="6" y2="8" stroke="#e63232" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize:"0.8rem", color:"#e63232", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>Logout</span>
                </div>
              </div>
            )}
          </div>

          {/* USER CHIP */}
          <div onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:"8px", padding:"4px 14px 4px 4px", background:"rgba(230,50,50,0.07)", border:"1px solid rgba(230,50,50,0.2)", borderRadius:"999px", cursor:"pointer", transition:"all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(230,50,50,0.14)"; e.currentTarget.style.borderColor="rgba(230,50,50,0.4)"; e.currentTarget.style.transform="scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(230,50,50,0.07)"; e.currentTarget.style.borderColor="rgba(230,50,50,0.2)"; e.currentTarget.style.transform="scale(1)"; }}
          >
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg,#e63232,#f0a030)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#fff", fontFamily:"'Inter',sans-serif", flexShrink:0, boxShadow:"0 2px 8px rgba(230,50,50,0.3)" }}>
              {initials}
            </div>
            <span style={{ fontSize:"0.82rem", fontWeight:600, color:"#e0d8d0", fontFamily:"'Inter',sans-serif" }}>
              {customer?.name?.split(" ")[0] || "Customer"}
            </span>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#4aba4a", animation:"pulseG 2s infinite" }} />
          </div>
        </div>
      </nav>

      {/* ── NOTIFICATION TOAST ── */}
      {notification && (
        <div className="slide-right-ntf" style={{ position:"fixed", top:"80px", right:"2rem", zIndex:1001, padding:"1rem 1.4rem", borderRadius:"10px", background: notification.type === "success" ? "linear-gradient(135deg,rgba(74,222,128,0.12),rgba(74,222,128,0.06))" : "linear-gradient(135deg,rgba(248,113,113,0.12),rgba(248,113,113,0.06))", border:`1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, color: notification.type === "success" ? "#4ade80" : "#f87171", backdropFilter:"blur(16px)", boxShadow:`0 8px 32px ${notification.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)"}`, display:"flex", alignItems:"center", gap:"0.8rem", minWidth:"260px" }}>
          <div style={{ width:"30px", height:"30px", borderRadius:"50%", background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>
            {notification.type === "success" ? "✓" : "✕"}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.82rem", marginBottom:"2px", fontFamily:"'Inter',sans-serif" }}>{notification.type === "success" ? "Success" : "Error"}</div>
            <div style={{ opacity:0.8, fontSize:"0.76rem", fontFamily:"'Inter',sans-serif" }}>{notification.message}</div>
          </div>
        </div>
      )}

      {/* ── PROFILE MODAL ── */}
      {profileOpen && customer && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) { setProfileOpen(false); setIsEditing(false); } }}
        >
          <div className="slide-up-modal" style={{ background:"linear-gradient(145deg,#0f0d13,#0a0810)", border:"1px solid rgba(240,160,48,0.35)", borderRadius:"16px", width:"520px", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 100px rgba(0,0,0,0.7),0 0 60px rgba(240,160,48,0.08)" }}>
            <div style={{ height:"2px", background:"linear-gradient(90deg,#f0a030,#e63232,#fff,#e63232,#f0a030)", backgroundSize:"200%", animation:"gradFlow 3s linear infinite", borderRadius:"16px 16px 0 0" }} />

            {/* Header */}
            <div style={{ padding:"1.6rem 2rem", borderBottom:"1px solid rgba(240,160,48,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <div className="avatar-wrapper">
                  <div className="avatar-inner">{initials}</div>
                </div>
                <div>
                  <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"4px", fontFamily:"'Inter',sans-serif", fontWeight:600, color:"#f0a030" }}>
                    📦 Customer Account
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span className="name-lg">{customer?.name || "Customer"}</span>
                    <span className="cust-badge">CUSTOMER</span>
                  </div>
                </div>
              </div>
              <button onClick={() => { setProfileOpen(false); setIsEditing(false); }}
                style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", color:"#7a6a60", width:"34px", height:"34px", borderRadius:"50%", cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(248,113,113,0.12)"; e.currentTarget.style.color="#f87171"; e.currentTarget.style.borderColor="rgba(248,113,113,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="#7a6a60"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
              >✕</button>
            </div>

            <div style={{ padding:"2rem" }}>
              {/* Status badge */}
              <div style={{ marginBottom:"1.4rem" }}>
                <span style={{ fontSize:"0.72rem", padding:"5px 12px", borderRadius:"999px", fontWeight:600, fontFamily:"'Inter',sans-serif", background: customer?.status === "active" ? "rgba(74,222,128,0.08)" : "rgba(230,50,50,0.08)", color: customer?.status === "active" ? "#4ade80" : "#e63232", border:`1px solid ${customer?.status === "active" ? "rgba(74,222,128,0.3)" : "rgba(230,50,50,0.3)"}` }}>
                  {customer?.status === "active" ? "● Active Account" : "● Inactive Account"}
                </span>
              </div>

              {/* Fields */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem", marginBottom:"1.5rem" }}>
                {[
                  { label:"Full Name", key:"name",    type:"text"  },
                  { label:"Phone",     key:"phone",   type:"tel"   },
                  { label:"Email",     key:"email",   type:"email" },
                  { label:"Address",   key:"address", type:"text"  },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"2px", textTransform:"uppercase", color:"#6a5a50", marginBottom:"6px", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{field.label}</div>
                    {isEditing ? (
                      <input type={field.type} value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                        style={{ width:"100%", padding:"10px 12px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", color:"#e0d8d0", fontSize:"0.84rem", fontFamily:"'Inter',sans-serif", boxSizing:"border-box" }} />
                    ) : (
                      <div style={{ fontSize:"0.9rem", color:"#d4c4b8", fontFamily:"'Inter',sans-serif", padding:"8px 12px", background:"rgba(255,255,255,0.025)", borderRadius:"6px", border:"1px solid rgba(255,255,255,0.05)" }}>
                        {customer?.[field.key] || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Timestamps */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", padding:"1rem 1.2rem", background:"rgba(255,255,255,0.02)", borderRadius:"8px", marginBottom:"1.5rem", border:"1px solid rgba(255,255,255,0.04)" }}>
                {[{ label:"Joined", val:customer?.createdAt }, { label:"Last Updated", val:customer?.updatedAt }].map((t, i) => (
                  <div key={i}>
                    <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:"#5a4a45", marginBottom:"4px", fontFamily:"'Inter',sans-serif", fontWeight:600 }}>{t.label}</div>
                    <div style={{ fontSize:"0.78rem", color:"#8a7a70", fontFamily:"'Inter',sans-serif" }}>{t.val ? new Date(t.val).toLocaleString() : "—"}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:"10px", justifyContent:"flex-end" }}>
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="action-btn-c"
                      style={{ padding:"10px 20px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#a89888", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontFamily:"'Inter',sans-serif" }}
                      onMouseEnter={e => { e.currentTarget.style.color="#e0d8d0"; e.currentTarget.style.background="rgba(255,255,255,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color="#a89888"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                    >Cancel</button>
                    <button onClick={handleUpdate} className="action-btn-c"
                      style={{ padding:"10px 24px", background:"linear-gradient(135deg,#e63232,#f0a030)", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 20px rgba(230,50,50,0.25)" }}>
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="action-btn-c"
                    style={{ padding:"10px 24px", background:"linear-gradient(135deg,#e63232,#f0a030)", border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:"'Inter',sans-serif", boxShadow:"0 4px 20px rgba(230,50,50,0.25)" }}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdowns */}
      {(notifOpen || profileOpen) && (
        <div style={{ position:"fixed", inset:0, zIndex:250 }}
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </>
  );
}