import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/users";

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = { heading: "'Cormorant Garamond', serif", body: "'DM Sans', sans-serif", cursive: "'Dancing Script', cursive" };

export default function AdminNavbarLight({ toggleTheme, pageTitle = "Dashboard", pageSubtitle = "Overview" }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [notification, setNotification] = useState(null);
  const [displayText, setDisplayText] = useState("ShipSense");
  const [spelling, setSpelling] = useState(false);

  useEffect(() => {
    const full = "ShipSense";
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
      }, 100);
    }, 12000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProfileUser(d.user);
          setEditData({ ...d.user });
        }
      })
      .catch(() => {});
  }, []);

  const openProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setProfileUser(data.user);
        setEditData({ ...data.user });
        setIsEditing(false);
        setProfileOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/${profileUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        setProfileUser(data.data);
        setIsEditing(false);
        showNotification("success", "Profile updated successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to update profile");
    }
  };
  const handleLogout = async () => {
    try { await fetch("http://localhost:5000/api/auth/logout", { method: "POST", credentials: "include" }); } catch (_) {}
    localStorage.clear();
    navigate("/");
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const roleConfig = (role) => {
    switch (role) {
      case "admin":    return { color: "#8a6a2a", border: "rgba(196,163,90,0.4)",  bg: "rgba(196,163,90,0.12)"  };
      case "supplier": return { color: "#4a7aaa", border: "rgba(74,122,170,0.3)",  bg: "rgba(74,122,170,0.09)"  };
      case "customer": return { color: "#4a8a5a", border: "rgba(74,138,90,0.3)",   bg: "rgba(74,138,90,0.09)"   };
      default:         return { color: C.inkMid,  border: C.border,                bg: C.bgDeep                 };
    }
  };

  const roleIcon = (role) => {
    switch (role) {
      case "admin":    return "👑";
      case "supplier": return "🚢";
      case "customer": return "📦";
      default:         return "👤";
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');

        @keyframes pulseRose    { 0%,100%{opacity:1;box-shadow:0 0 6px rgba(201,132,138,0.4);} 50%{opacity:0.4;box-shadow:none;} }
        @keyframes pulseG       { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes gradFlowL    { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes slideUpL     { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes slideRightL  { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rootTextShiftL    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes rootBadgeShimmerL { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes rootAvatarSpinL   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes rootAvatarPulseL  { 0%,100%{box-shadow:0 0 10px rgba(201,132,138,0.4),0 0 20px rgba(196,163,90,0.2)} 50%{box-shadow:0 0 22px rgba(201,132,138,0.7),0 0 40px rgba(196,163,90,0.35)} }
        @keyframes cursorBlinkL { 0%,100%{opacity:1} 50%{opacity:0} }

        .logo-text-l {
          font-family: ${font.cursive};
          font-size: 1.7rem;
          background: linear-gradient(90deg, ${C.rose}, ${C.gold}, #8a5a3a, ${C.rose});
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShiftL 8s ease infinite;
          transition: opacity 0.2s;
        }
        .logo-text-l:hover { opacity: 0.8; }

        .cursor-l {
          display: inline-block; width: 1.5px; height: 1.4rem;
          background: ${C.rose}; margin-left: 1px; vertical-align: middle;
          animation: cursorBlinkL 0.6s ease infinite;
        }

        .page-title-l {
          font-family: ${font.heading}; font-size: 1.1rem;
          font-weight: 600; font-style: italic; letter-spacing: 1px;
          background: linear-gradient(90deg, ${C.rose}, ${C.gold}, ${C.rose});
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: gradFlowL 3s linear infinite;
        }
        .page-subtitle-l {
          font-size: 0.52rem; letter-spacing: 3px; text-transform: uppercase;
          color: ${C.inkFaint}; font-family: ${font.body}; margin-top: 2px; font-weight: 600;
        }

        .root-avatar-wrapper-lg-l {
          position: relative; width: 48px; height: 48px; flex-shrink: 0;
        }
        .root-avatar-wrapper-lg-l::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(${C.rose}, ${C.gold}, #fff, ${C.gold}, ${C.rose});
          animation: rootAvatarSpinL 2s linear infinite; z-index: 0;
        }
        .root-avatar-inner-lg-l {
          position: absolute; inset: 2px; border-radius: 50%;
          background: linear-gradient(135deg, #f8f0e8, #f0e4d4);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 600; color: ${C.rose};
          font-family: ${font.heading}; font-style: italic; z-index: 1;
          animation: rootAvatarPulseL 2s ease-in-out infinite;
        }

        .root-name-lg-l {
          font-family: ${font.heading}; font-size: 1.6rem;
          font-weight: 600; font-style: italic; letter-spacing: 1px;
          background: linear-gradient(90deg, ${C.rose}, ${C.gold}, #8a5a3a, ${C.rose}, ${C.gold});
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShiftL 3s ease infinite;
        }
        .root-badge-l {
          font-size: 0.55rem; padding: 2px 7px; border-radius: 4px;
          background: linear-gradient(90deg, rgba(201,132,138,0.3), rgba(196,163,90,0.2), rgba(201,132,138,0.3));
          background-size: 200% auto;
          border: 1px solid rgba(201,132,138,0.6);
          color: ${C.rose}; font-weight: 700; letter-spacing: 2px;
          font-family: ${font.body}; text-transform: uppercase;
          animation: rootBadgeShimmerL 2s linear infinite;
          box-shadow: 0 0 8px rgba(201,132,138,0.25), 0 0 16px rgba(196,163,90,0.1);
        }

        .slide-up-modal-nav-l { animation: slideUpL 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .slide-right-nav-l    { animation: slideRightL 0.35s ease forwards; }
        .action-btn-nav-l { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-nav-l:hover { transform: translateY(-2px); }

        input:focus, select:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 4rem",
        background: "rgba(250,246,240,0.98)",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky", top: 0, zIndex: 100, flexShrink: 0
      }}>
        {/* LEFT — Logo */}
        <div onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="logo-text-l">
            {displayText}
            {spelling && <span className="cursor-l" />}
          </div>
        </div>

        {/* CENTER — Page title */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
          <div className="page-title-l">{pageTitle}</div>
          <div className="page-subtitle-l">{pageSubtitle}</div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          {/* LIVE */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px", border: `1px solid ${C.borderRose}`, borderRadius: "999px", background: C.roseLight }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.rose, display: "inline-block", animation: "pulseRose 2s infinite" }} />
            <span style={{ fontSize: "0.65rem", color: C.rose, fontFamily: font.body, fontWeight: 700, letterSpacing: "2px" }}>LIVE</span>
          </div>

          {/* DATE */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: "6px", background: C.goldLight, fontSize: "0.68rem", color: C.inkMid, fontFamily: font.body, fontWeight: 500 }}>
            📅 {new Date().toDateString()}
          </div>

          {/* THEME TOGGLE */}
          <div onClick={toggleTheme}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", border: `1px solid ${C.border}`, borderRadius: "6px", background: C.bgDeep, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderRose; e.currentTarget.style.background = C.roseLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgDeep; }}
          >
            <span style={{ fontSize: "0.9rem" }}>🌙</span>
            <div style={{ width: "30px", height: "17px", borderRadius: "999px", background: C.border, border: `1px solid ${C.borderRose}`, position: "relative" }}>
              <div style={{ position: "absolute", top: "2px", right: "2px", width: "13px", height: "13px", borderRadius: "50%", background: `linear-gradient(135deg,${C.rose},${C.gold})`, transition: "transform 0.3s" }} />
            </div>
            <span style={{ fontSize: "0.9rem" }}>☀️</span>
          </div>

          {/* USER CHIP */}
          <div onClick={openProfile}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 14px 4px 4px", background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "999px", cursor: "pointer", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,132,138,0.22)"; e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.borderColor = C.borderRose; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg,${C.rose},${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#fff", fontFamily: font.body, flexShrink: 0, boxShadow: `0 2px 8px rgba(201,132,138,0.3)` }}>{profileUser?.Name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "AD"}</div>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.inkMid, fontFamily: font.body }}>{profileUser?.Name?.split(" ")[0] || "Admin"}</span>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5a9e5a", animation: "pulseG 2s infinite" }} />
          </div>
        </div>
      </nav>

      {/* NOTIFICATION */}
      {notification && (
        <div className="slide-right-nav-l" style={{
          position: "fixed", top: "80px", right: "2rem", zIndex: 1001,
          padding: "1rem 1.4rem", borderRadius: "10px",
          background: notification.type === "success"
            ? "linear-gradient(135deg, rgba(90,158,90,0.12), rgba(90,158,90,0.06))"
            : `linear-gradient(135deg, ${C.roseLight}, rgba(201,132,138,0.06))`,
          border: `1px solid ${notification.type === "success" ? "rgba(90,158,90,0.3)" : C.borderRose}`,
          color: notification.type === "success" ? "#5a9e5a" : C.rose,
          backdropFilter: "blur(16px)",
          boxShadow: `0 8px 32px rgba(201,132,138,0.1)`,
          display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "260px"
        }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(90,158,90,0.15)" : C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
            {notification.type === "success" ? "✓" : "✕"}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px", fontFamily: font.body }}>{notification.type === "success" ? "Success" : "Error"}</div>
            <div style={{ opacity: 0.8, fontSize: "0.76rem", fontFamily: font.body }}>{notification.message}</div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {profileOpen && profileUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(46,34,24,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) { setProfileOpen(false); setIsEditing(false); } }}
        >
          <div className="slide-up-modal-nav-l" style={{
            background: C.bgCard,
            border: `1px solid rgba(201,132,138,0.4)`,
            borderRadius: "16px", width: "520px", maxHeight: "88vh", overflowY: "auto",
            boxShadow: "0 30px 100px rgba(46,34,24,0.2), 0 0 60px rgba(201,132,138,0.08)"
          }}>
            <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},#fff,${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlowL 3s linear infinite", borderRadius: "16px 16px 0 0" }} />

            {/* HEADER */}
            <div style={{ padding: "1.6rem 2rem", borderBottom: `1px solid rgba(201,132,138,0.2)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div className="root-avatar-wrapper-lg-l">
                  <div className="root-avatar-inner-lg-l">
                    {profileUser.Name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px", fontFamily: font.body, fontWeight: 600, color: C.rose }}>
                    👑 Root Administrator
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="root-name-lg-l">{profileUser.Name}</span>
                    <span className="root-badge-l">ROOT</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {(() => { const rc = roleConfig(profileUser.Role); return (
                  <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" }}>
                    {roleIcon(profileUser.Role)} {profileUser.Role}
                  </span>
                ); })()}
                <button onClick={() => { setProfileOpen(false); setIsEditing(false); }}
                  style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkLight, width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = C.borderRose; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.bgDeep; e.currentTarget.style.color = C.inkLight; e.currentTarget.style.borderColor = C.border; }}
                >✕</button>
              </div>
            </div>

            <div style={{ padding: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                {[
                  { label: "Name",    key: "Name",     type: "text"   },
                  { label: "Email",   key: "Email",    type: "email"  },
                  { label: "Company", key: "Company",  type: "text"   },
                  { label: "Role",    key: "Role",     type: "select", options: ["admin","supplier","customer"] },
                  { label: "Status",  key: "IsActive", type: "select", options: ["true","false"] },
                ].map(field => (
                  <div key={field.key}>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>{field.label}</div>
                    {isEditing ? (
                      field.type === "select" ? (
                        <select value={String(editData[field.key]) || ""} onChange={e => setEditData({ ...editData, [field.key]: field.key === "IsActive" ? e.target.value === "true" : e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }}>
                          {field.options.map(o => <option key={o} value={o} style={{ background: C.bgCard }}>{field.key === "IsActive" ? (o === "true" ? "Active" : "Inactive") : o}</option>)}
                        </select>
                      ) : (
                        <input type={field.type} value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                          style={{ width: "100%", padding: "10px 12px", background: C.bgDeep, border: `1px solid ${C.border}`, borderRadius: "8px", color: C.ink, fontSize: "0.84rem", fontFamily: font.body, boxSizing: "border-box" }} />
                      )
                    ) : (
                      <div style={{ fontSize: "0.9rem", color: C.inkMid, fontFamily: font.body, padding: "8px 12px", background: C.bgDeep, borderRadius: "6px", border: `1px solid ${C.border}` }}>
                        {field.key === "IsActive" ? (profileUser[field.key] ? "Active" : "Inactive") : profileUser[field.key] || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* TIMESTAMPS */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 1.2rem", background: C.bgDeep, borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${C.border}` }}>
                {[{ label: "Joined", val: profileUser.createdAt }, { label: "Last Updated", val: profileUser.updatedAt }].map((t, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>{t.label}</div>
                    <div style={{ fontSize: "0.78rem", color: C.inkLight, fontFamily: font.body }}>{new Date(t.val).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                  <button onClick={handleLogout} className="action-btn-nav-l"
                    style={{ padding:"10px 20px", background:C.roseLight, border:`1px solid ${C.borderRose}`, color:C.rose, borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontFamily:font.body, display:"flex", alignItems:"center", gap:"8px", transition:"all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(201,132,138,0.22)"}
                    onMouseLeave={e => e.currentTarget.style.background=C.roseLight}
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
                      <button onClick={() => { setIsEditing(false); setEditData({ ...profileUser }); }} className="action-btn-nav-l"
                        style={{ padding:"10px 20px", background:C.bgDeep, border:`1px solid ${C.border}`, color:C.inkMid, borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontFamily:font.body }}
                        onMouseEnter={e => e.currentTarget.style.color=C.ink}
                        onMouseLeave={e => e.currentTarget.style.color=C.inkMid}
                      >Cancel</button>
                      <button onClick={handleUpdate} className="action-btn-nav-l"
                        style={{ padding:"10px 24px", background:`linear-gradient(135deg,${C.rose},${C.gold})`, border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:font.body, boxShadow:`0 4px 20px rgba(201,132,138,0.25)` }}>Save Changes</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="action-btn-nav-l"
                      style={{ padding:"10px 24px", background:`linear-gradient(135deg,${C.rose},${C.gold})`, border:"none", color:"#fff", borderRadius:"8px", cursor:"pointer", fontSize:"0.82rem", fontWeight:700, fontFamily:font.body, boxShadow:`0 4px 20px rgba(201,132,138,0.25)` }}>Edit Profile</button>
                  )}
                </div>  
              </div>    
            </div>      
          </div>        
        </div>          
      )}
    </>
  );
}