import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_API  = "http://localhost:5000/api/auth";
const USERS_API = "http://localhost:5000/api/users";
const SHIPS_API = "http://localhost:5000/api/shipments/my";
const DEV_NAMES = ["Arnab Roy", "Juhi Thakur"];

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.98)",
  rose: "#c9848a", gold: "#c4a35a", roseDark: "#a86870",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.10)", goldLight: "rgba(196,163,90,0.10)",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif" };

function buildNotifications(shipments, profile) {
  const notifs = [];
  shipments.forEach(s => {
    if (s.Status === "Delayed") {
      notifs.push({
        id: `delay-${s._id}`,
        type: "delay",
        title: "Shipment Delayed",
        message: `${s.ShipmentId} (${s.Origin} → ${s.Destination}) has been delayed${s.DelayReason?.Code ? ` — ${s.DelayReason.Code}` : ""}.`,
        time: new Date(s.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        read: false,
      });
    }
    if (s.Status === "Delivered") {
      notifs.push({
        id: `delivered-${s._id}`,
        type: "delivery",
        title: "Shipment Delivered",
        message: `${s.ShipmentId} from ${s.Supplier} has been delivered successfully.`,
        time: new Date(s.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        read: true,
      });
    }
    if (s.Status === "In Transit") {
      notifs.push({
        id: `transit-${s._id}`,
        type: "status",
        title: "Shipment In Transit",
        message: `${s.ShipmentId} is currently on its way to ${s.Destination}.`,
        time: new Date(s.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        read: true,
      });
    }
  });
  return notifs;
}

export default function CustomerNavbarLight({ toggleTheme, pageTitle = "Dashboard", pageSubtitle = "Overview" }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [profileUser, setProfileUser]   = useState(null);
  const [isEditing, setIsEditing]       = useState(false);
  const [editData, setEditData]         = useState({});
  const [notification, setNotification] = useState(null);
  const [displayText, setDisplayText]   = useState("ShipSense");
  const [spelling, setSpelling]         = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch(`${AUTH_API}/me`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.success) { setProfileUser(d.user); setEditData({ ...d.user }); }
      }).catch(() => {});

    fetch(SHIPS_API, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.success) setNotifications(buildNotifications(d.data || []));
      }).catch(() => {});
  }, []);

  useEffect(() => {
    const full = "ShipSense";
    const interval = setInterval(() => {
      setSpelling(true);
      let i = 0; setDisplayText("");
      const spell = setInterval(() => {
        i++; setDisplayText(full.slice(0, i));
        if (i >= full.length) { clearInterval(spell); setTimeout(() => setSpelling(false), 800); }
      }, 100);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${USERS_API}/${profileUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        setProfileUser(data.data);
        setEditData({ ...data.data });
        setIsEditing(false);
        showNotif("success", "Profile updated successfully!");
      }
    } catch { showNotif("error", "Failed to update profile."); }
  };

  const handleLogout = async () => {
    try { await fetch(`${AUTH_API}/logout`, { method: "POST", credentials: "include" }); } catch (_) {}
    localStorage.clear();
    navigate("/");
  };

  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const isElite   = profileUser && DEV_NAMES.includes(profileUser.Name);
  const initials  = profileUser?.Name
    ? profileUser.Name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "C";
  const unread    = notifications.filter(n => !n.read).length;
  const markRead  = (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll   = () => setNotifications(p => p.map(n => ({ ...n, read: true })));
  const clearAll  = () => setNotifications([]);

  const notifIcon  = (type) => ({ status: "📦", delivery: "✅", delay: "⚠️" }[type] || "🔔");
  const notifColor = (type) => ({
    status:   { color: C.gold,    border: "rgba(196,163,90,0.25)",   bg: C.goldLight  },
    delivery: { color: "#5a9e5a", border: "rgba(90,158,90,0.25)",    bg: "rgba(90,158,90,0.08)" },
    delay:    { color: C.roseDark,border: C.borderRose,              bg: C.roseLight  },
  }[type] || { color: C.inkMid, border: C.border, bg: C.bgDeep });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes pulseRose  { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(201,132,138,0.4)} 50%{opacity:0.4;box-shadow:none} }
        @keyframes pulseG     { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes gradFlowL  { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes textShiftL { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes cursorBlinkL { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideUpL   { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideRightL{ from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDownL { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes notifBounceL { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes eliteAvatarSpinL  { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes eliteAvatarPulseL { 0%,100%{box-shadow:0 0 10px rgba(201,132,138,0.4),0 0 20px rgba(196,163,90,0.2)} 50%{box-shadow:0 0 22px rgba(201,132,138,0.7),0 0 40px rgba(196,163,90,0.35)} }
        @keyframes eliteTextShiftL   { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes eliteBadgeShimmerL{ 0%{background-position:200% center} 100%{background-position:-200% center} }

        .logo-text-l {
          font-family: ${font.heading}; font-size: 1.7rem; font-weight: 600; font-style: italic;
          letter-spacing: 1px;
          background: linear-gradient(90deg,${C.rose},${C.gold},#8a5a3a,${C.rose});
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: textShiftL 8s ease infinite;
        }
        .cursor-l { display:inline-block; width:1.5px; height:1.4rem; background:${C.rose}; margin-left:1px; vertical-align:middle; animation:cursorBlinkL 0.6s ease infinite; }
        .page-title-l { font-family:${font.heading}; font-size:1.1rem; font-weight:600; font-style:italic; letter-spacing:1px; background:linear-gradient(90deg,${C.rose},${C.gold},${C.rose}); background-size:200%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradFlowL 3s linear infinite; }
        .page-subtitle-l { font-size:0.52rem; letter-spacing:3px; text-transform:uppercase; color:${C.inkFaint}; font-family:${font.body}; margin-top:2px; font-weight:600; }

        .elite-avatar-wrapper-l { position:relative; width:48px; height:48px; flex-shrink:0; }
        .elite-avatar-wrapper-l::before { content:''; position:absolute; inset:-2px; border-radius:50%; background:conic-gradient(${C.rose},${C.gold},#fff,${C.gold},${C.rose}); animation:eliteAvatarSpinL 2s linear infinite; z-index:0; }
        .elite-avatar-inner-l { position:absolute; inset:2px; border-radius:50%; background:linear-gradient(135deg,#f8f0e8,#f0e4d4); display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:600; color:${C.rose}; font-family:${font.heading}; font-style:italic; z-index:1; animation:eliteAvatarPulseL 2s ease-in-out infinite; }
        .normal-avatar-wrapper-l { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,${C.rose},${C.gold}); display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:700; color:#fff; font-family:${font.body}; flex-shrink:0; }

        .elite-name-l { font-family:${font.heading}; font-size:1.5rem; font-weight:600; font-style:italic; background:linear-gradient(90deg,${C.rose},${C.gold},#8a5a3a,${C.rose},${C.gold}); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:eliteTextShiftL 3s ease infinite; }
        .normal-name-l { font-family:${font.heading}; font-size:1.5rem; font-weight:600; font-style:italic; color:${C.ink}; }
        .elite-badge-l { font-size:0.55rem; padding:2px 7px; border-radius:4px; background:linear-gradient(90deg,rgba(201,132,138,0.3),rgba(196,163,90,0.2),rgba(201,132,138,0.3)); background-size:200% auto; border:1px solid rgba(201,132,138,0.6); color:${C.rose}; font-weight:700; letter-spacing:2px; font-family:${font.body}; text-transform:uppercase; animation:eliteBadgeShimmerL 2s linear infinite; box-shadow:0 0 8px rgba(201,132,138,0.25); }

        .notif-dropdown-l { position:absolute; top:calc(100% + 10px); right:0; width:340px; z-index:300; background:${C.bgCard}; border:1px solid ${C.borderRose}; border-radius:14px; overflow:hidden; animation:slideDownL 0.22s cubic-bezier(0.34,1.2,0.64,1) forwards; box-shadow:0 20px 60px rgba(46,34,24,0.14); }
        .icon-btn-l { position:relative; width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:${C.bgDeep}; border:1px solid ${C.border}; cursor:pointer; transition:all 0.25s; flex-shrink:0; }
        .icon-btn-l:hover { background:${C.roseLight}; border-color:${C.borderRose}; transform:translateY(-1px); box-shadow:0 4px 14px rgba(201,132,138,0.15); }

        .slide-up-modal-l  { animation:slideUpL 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .slide-right-ntf-l { animation:slideRightL 0.35s ease forwards; }
        .action-btn-l { transition:all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-l:hover { transform:translateY(-2px); }

        input:focus, select:focus { outline:none !important; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(201,132,138,0.3); border-radius:4px; }
      `}</style>

      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 4rem", background:"rgba(250,246,240,0.98)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:100, flexShrink:0 }}>

        {/* LEFT */}
        <div onClick={() => navigate("/customer")} style={{ cursor:"pointer" }}>
          <div className="logo-text-l">{displayText}{spelling && <span className="cursor-l" />}</div>
        </div>

        {/* CENTER */}
        <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
          <div className="page-title-l">{pageTitle}</div>
          <div className="page-subtitle-l">{pageSubtitle}</div>
        </div>

        {/* RIGHT */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>

          {/* LIVE */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", border:`1px solid ${C.borderRose}`, borderRadius:"999px", background:C.roseLight }}>
            <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:C.rose, display:"inline-block", animation:"pulseRose 2s infinite" }} />
            <span style={{ fontSize:"0.65rem", color:C.rose, fontFamily:font.body, fontWeight:700, letterSpacing:"2px" }}>LIVE</span>
          </div>

          {/* DATE */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", border:`1px solid ${C.border}`, borderRadius:"6px", background:C.goldLight, fontSize:"0.68rem", color:C.inkMid, fontFamily:font.body, fontWeight:500 }}>
            📅 {new Date().toDateString()}
          </div>

          {/* THEME TOGGLE */}
          <div onClick={toggleTheme}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 10px", border:`1px solid ${C.border}`, borderRadius:"6px", background:C.bgDeep, cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=C.borderRose; e.currentTarget.style.background=C.roseLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bgDeep; }}
          >
            <span style={{ fontSize:"0.9rem" }}>🌙</span>
            <div style={{ width:"30px", height:"17px", borderRadius:"999px", background:C.border, border:`1px solid ${C.borderRose}`, position:"relative" }}>
              <div style={{ position:"absolute", top:"2px", right:"2px", width:"13px", height:"13px", borderRadius:"50%", background:`linear-gradient(135deg,${C.rose},${C.gold})`, transition:"transform 0.3s" }} />
            </div>
            <span style={{ fontSize:"0.9rem" }}>☀️</span>
          </div>

          {/* NOTIFICATIONS */}
          <div style={{ position:"relative" }}>
            <div className="icon-btn-l" onClick={() => { setNotifOpen(p => !p); setProfileOpen(false); }} title="Notifications">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5A1 1 0 003.5 15h13a1 1 0 00.86-1.5L16 11V8a6 6 0 00-6-6z" stroke={notifOpen ? C.rose : C.inkLight} strokeWidth="1.5" fill={notifOpen ? C.roseLight : "none"} />
                <path d="M8 15a2 2 0 004 0" stroke={notifOpen ? C.rose : C.inkLight} strokeWidth="1.4" />
              </svg>
              {unread > 0 && (
                <div style={{ position:"absolute", top:"-4px", right:"-4px", width:"18px", height:"18px", borderRadius:"50%", background:`linear-gradient(135deg,${C.rose},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.58rem", fontWeight:700, color:"#fff", fontFamily:font.body, animation:"notifBounceL 2s ease infinite", border:`2px solid #faf6f0` }}>
                  {unread}
                </div>
              )}
            </div>

            {notifOpen && (
              <div className="notif-dropdown-l">
                <div style={{ height:"2px", background:`linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize:"200%", animation:"gradFlowL 3s linear infinite" }} />
                <div style={{ padding:"1rem 1.2rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontFamily:font.heading, fontSize:"1.1rem", fontWeight:600, fontStyle:"italic", color:C.ink }}>Notifications</div>
                    <div style={{ fontSize:"0.62rem", color:C.inkFaint, letterSpacing:"1px", fontFamily:font.body }}>{unread} unread</div>
                  </div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    {unread > 0 && (
                      <button onClick={markAll} style={{ background:"transparent", border:`1px solid ${C.border}`, color:C.gold, padding:"4px 10px", borderRadius:"6px", fontSize:"0.62rem", fontWeight:600, cursor:"pointer", fontFamily:font.body }}>Mark all read</button>
                    )}
                    <button onClick={clearAll} style={{ background:"transparent", border:`1px solid ${C.borderRose}`, color:C.rose, padding:"4px 10px", borderRadius:"6px", fontSize:"0.62rem", fontWeight:600, cursor:"pointer", fontFamily:font.body }}>Clear all</button>
                  </div>
                </div>
                <div style={{ maxHeight:"280px", overflowY:"auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding:"2.5rem", textAlign:"center", color:C.inkFaint, fontSize:"0.8rem", fontFamily:font.body }}>
                      <div style={{ fontSize:"2rem", marginBottom:"8px", opacity:0.4 }}>🔔</div>
                      No notifications
                    </div>
                  ) : notifications.map((n, i) => {
                    const nc = notifColor(n.type);
                    return (
                      <div key={n.id} onClick={() => markRead(n.id)}
                        style={{ padding:"0.9rem 1.2rem", borderBottom: i < notifications.length - 1 ? `1px solid ${C.border}` : "none", background: n.read ? "transparent" : C.roseLight, cursor:"pointer", transition:"background 0.2s", display:"flex", gap:"10px", alignItems:"flex-start" }}
                        onMouseEnter={e => e.currentTarget.style.background=`rgba(201,132,138,0.1)`}
                        onMouseLeave={e => e.currentTarget.style.background= n.read ? "transparent" : C.roseLight}
                      >
                        <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:nc.bg, border:`1px solid ${nc.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>{notifIcon(n.type)}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"3px" }}>
                            <div style={{ fontSize:"0.78rem", fontWeight:600, color: n.read ? C.inkLight : C.ink, fontFamily:font.body }}>{n.title}</div>
                            {!n.read && <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:C.rose, flexShrink:0 }} />}
                          </div>
                          <div style={{ fontSize:"0.71rem", color:C.inkMid, lineHeight:1.4, marginBottom:"4px", fontFamily:font.body }}>{n.message}</div>
                          <div style={{ fontSize:"0.62rem", color:C.inkFaint, fontFamily:font.body }}>{n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* USER CHIP */}
          <div onClick={() => { setProfileOpen(p => !p); setNotifOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:"8px", padding:"4px 14px 4px 4px", background: isElite ? "rgba(201,132,138,0.07)" : C.roseLight, border:`1px solid ${isElite ? "rgba(201,132,138,0.3)" : C.borderRose}`, borderRadius:"999px", cursor:"pointer", transition:"all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(201,132,138,0.18)"; e.currentTarget.style.borderColor=C.rose; e.currentTarget.style.transform="scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background=C.roseLight; e.currentTarget.style.borderColor=C.borderRose; e.currentTarget.style.transform="scale(1)"; }}
          >
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`linear-gradient(135deg,${C.rose},${C.gold})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.72rem", fontWeight:700, color:"#fff", fontFamily:font.body, flexShrink:0, boxShadow:`0 2px 8px rgba(201,132,138,0.3)` }}>{initials}</div>
            <span style={{ fontSize:"0.82rem", fontWeight:600, color:C.inkMid, fontFamily:font.body }}>{profileUser?.Name?.split(" ")[0] || "Customer"}</span>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#5a9e5a", animation:"pulseG 2s infinite" }} />
          </div>
        </div>
      </nav>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className="slide-right-ntf-l" style={{ position:"fixed", top:"80px", right:"2rem", zIndex:1001, padding:"1rem 1.4rem", borderRadius:"10px", background: notification.type === "success" ? "linear-gradient(135deg,rgba(90,158,90,0.12),rgba(90,158,90,0.06))" : `linear-gradient(135deg,${C.roseLight},rgba(201,132,138,0.06))`, border:`1px solid ${notification.type === "success" ? "rgba(90,158,90,0.3)" : C.borderRose}`, color: notification.type === "success" ? "#5a9e5a" : C.rose, backdropFilter:"blur(16px)", display:"flex", alignItems:"center", gap:"0.8rem", minWidth:"260px" }}>
          <div style={{ width:"30px", height:"30px", borderRadius:"50%", background: notification.type === "success" ? "rgba(90,158,90,0.15)" : C.roseLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>
            {notification.type === "success" ? "✓" : "✕"}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.82rem", marginBottom:"2px", fontFamily:font.body }}>{notification.type === "success" ? "Success" : "Error"}</div>
            <div style={{ opacity:0.8, fontSize:"0.76rem", fontFamily:font.body }}>{notification.message}</div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileOpen && profileUser && (
        <div style={{ position:"fixed", inset:0, background:"rgba(46,34,24,0.4)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) { setProfileOpen(false); setIsEditing(false); } }}
        >
          <div className="slide-up-modal-l" style={{ background:C.bgCard, border:`1px solid ${isElite ? "rgba(201,132,138,0.4)" : C.borderRose}`, borderRadius:"16px", width:"520px", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 30px 100px rgba(46,34,24,0.2)" }}>
            <div style={{ height:"2px", background: isElite ? `linear-gradient(90deg,${C.rose},${C.gold},#fff,${C.gold},${C.rose})` : `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize:"200%", animation:"gradFlowL 3s linear infinite", borderRadius:"16px 16px 0 0" }} />

            {/* HEADER */}
            <div style={{ padding:"1.6rem 2rem", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                {isElite ? (
                  <div className="elite-avatar-wrapper-l"><div className="elite-avatar-inner-l">{initials}</div></div>
                ) : (
                  <div className="normal-avatar-wrapper-l">{initials}</div>
                )}
                <div>
                  <div style={{ fontSize:"0.55rem", letterSpacing:"3px", textTransform:"uppercase", marginBottom:"4px", fontFamily:font.body, fontWeight:600, color: isElite ? C.rose : C.gold }}>
                    {isElite ? "💎 Platinum Shipper" : "📦 Customer Account"}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span className={isElite ? "elite-name-l" : "normal-name-l"}>{profileUser.Name}</span>
                    {isElite && <span className="elite-badge-l">PLATINUM</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => { setProfileOpen(false); setIsEditing(false); }}
                style={{ background:C.bgDeep, border:`1px solid ${C.border}`, color:C.inkLight, width:"34px", height:"34px", borderRadius:"50%", cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background=C.roseLight; e.currentTarget.style.color=C.rose; e.currentTarget.style.borderColor=C.borderRose; }}
                onMouseLeave={e => { e.currentTarget.style.background=C.bgDeep; e.currentTarget.style.color=C.inkLight; e.currentTarget.style.borderColor=C.border; }}
              >✕</button>
            </div>

            <div style={{ padding:"2rem" }}>
              {isElite && (
                <div style={{ marginBottom:"1.4rem", padding:"12px 16px", background:C.roseLight, border:`1px solid ${C.borderRose}`, borderRadius:"10px", display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ fontSize:"1.2rem" }}>💎</span>
                  <div>
                    <div style={{ fontSize:"0.72rem", fontWeight:700, color:C.rose, fontFamily:font.body, marginBottom:"2px" }}>Platinum Shipper Status</div>
                    <div style={{ fontSize:"0.66rem", color:C.inkMid, fontFamily:font.body }}>Top-tier customer · Priority support · Exclusive tracking features</div>
                  </div>
                </div>
              )}

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem", marginBottom:"1.5rem" }}>
                {[
                  { label:"Name",  key:"Name",  type:"text"  },
                  { label:"Email", key:"Email", type:"email" },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"2px", textTransform:"uppercase", color:C.inkFaint, marginBottom:"6px", fontFamily:font.body, fontWeight:600 }}>{field.label}</div>
                    {isEditing ? (
                      <input type={field.type} value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                        style={{ width:"100%", padding:"10px 12px", background:C.bgDeep, border:`1px solid ${C.border}`, borderRadius:"8px", color:C.ink, fontSize:"0.84rem", fontFamily:font.body, boxSizing:"border-box" }} />
                    ) : (
                      <div style={{ fontSize:"0.9rem", color:C.inkMid, fontFamily:font.body, padding:"8px 12px", background:C.bgDeep, borderRadius:"6px", border:`1px solid ${C.border}` }}>{profileUser[field.key] || "—"}</div>
                    )}
                  </div>
                ))}
                {[
                  { label:"Role",   val: profileUser.Role },
                  { label:"Status", val: profileUser.IsActive ? "Active" : "Inactive" },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ fontSize:"0.6rem", letterSpacing:"2px", textTransform:"uppercase", color:C.inkFaint, marginBottom:"6px", fontFamily:font.body, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:"0.9rem", color:C.inkMid, fontFamily:font.body, padding:"8px 12px", background:C.bgDeep, borderRadius:"6px", border:`1px solid ${C.border}`, textTransform:"capitalize" }}>{item.val}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", padding:"1rem 1.2rem", background:C.bgDeep, borderRadius:"8px", marginBottom:"1.5rem", border:`1px solid ${C.border}` }}>
                {[{ label:"Joined", val: profileUser.createdAt }, { label:"Last Updated", val: profileUser.updatedAt }].map((t, i) => (
                  <div key={i}>
                    <div style={{ fontSize:"0.58rem", letterSpacing:"2px", textTransform:"uppercase", color:C.inkFaint, marginBottom:"4px", fontFamily:font.body, fontWeight:600 }}>{t.label}</div>
                    <div style={{ fontSize:"0.78rem", color:C.inkLight, fontFamily:font.body }}>{t.val ? new Date(t.val).toLocaleString() : "—"}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", gap:"10px", justifyContent:"space-between", alignItems:"center" }}>
                <button onClick={handleLogout}
                  style={{ padding:"10px 20px", background:C.roseLight, border:`1px solid ${C.borderRose}`, color:C.rose, borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontFamily:font.body, display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(201,132,138,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background=C.roseLight; }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke={C.rose} strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M10 11l3-3-3-3" stroke={C.rose} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="13" y1="8" x2="6" y2="8" stroke={C.rose} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Logout
                </button>
                <div style={{ display:"flex", gap:"10px" }}>
                  {isEditing ? (
                    <>
                      <button onClick={() => { setIsEditing(false); setEditData({ ...profileUser }); }} className="action-btn-l"
                        style={{ padding:"10px 20px", background:C.bgDeep, border:`1px solid ${C.border}`, color:C.inkMid, borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontFamily:font.body }}
                        onMouseEnter={e => e.currentTarget.style.color=C.ink}
                        onMouseLeave={e => e.currentTarget.style.color=C.inkMid}
                      >Cancel</button>
                      <button onClick={handleUpdate} className="action-btn-l"
                        style={{ padding:"10px 24px", background:`linear-gradient(135deg,${C.rose},${C.gold})`, border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:font.body, boxShadow:`0 4px 20px rgba(201,132,138,0.25)` }}>Save Changes</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="action-btn-l"
                      style={{ padding:"10px 24px", background:`linear-gradient(135deg,${C.rose},${C.gold})`, border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:font.body, boxShadow:`0 4px 20px rgba(201,132,138,0.25)` }}>Edit Profile</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(notifOpen || profileOpen) && (
        <div style={{ position:"fixed", inset:0, zIndex:150 }}
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />
      )}
    </>
  );
}