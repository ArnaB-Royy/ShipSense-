import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    path: "/customer",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill={active ? "#e63232" : hov ? "#f0a030" : "#6a2828"} />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill={active ? "#f0a030" : hov ? "#e63232" : "#6a2828"} />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill={active ? "#f0a030" : hov ? "#e63232" : "#6a2828"} />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill={active ? "#e63232" : hov ? "#f0a030" : "#6a2828"} />
      </svg>
    ),
  },
  {
    label: "My Shipments",
    path: "/customer/shipments",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <defs><linearGradient id="cgs" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e63232"/><stop offset="100%" stopColor="#f0a030"/></linearGradient></defs>
        <rect x="2" y="4" width="12" height="9" rx="1.5" stroke={active || hov ? "url(#cgs)" : "#6a2828"} strokeWidth="1.5"/>
        <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" stroke={active || hov ? "url(#cgs)" : "#6a2828"} strokeWidth="1.5"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke={active || hov ? "url(#cgs)" : "#6a2828"} strokeWidth="1.2"/>
        <line x1="5" y1="10.5" x2="9" y2="10.5" stroke={active || hov ? "url(#cgs)" : "#6a2828"} strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    label: "Track Shipment",
    path: "/customer/tracking",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <defs><linearGradient id="cgt" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e63232"/><stop offset="100%" stopColor="#f0a030"/></linearGradient></defs>
        <circle cx="7" cy="7" r="4.5" stroke={active || hov ? "url(#cgt)" : "#6a2828"} strokeWidth="1.5"/>
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={active || hov ? "url(#cgt)" : "#6a2828"} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="7" r="1.5" fill={active || hov ? "#e63232" : "#6a2828"}/>
      </svg>
    ),
  },
  {
    label: "Profile",
    path: "/customer/profile",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <defs><linearGradient id="cgp" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e63232"/><stop offset="100%" stopColor="#f0a030"/></linearGradient></defs>
        <circle cx="8" cy="5.5" r="2.8" stroke={active || hov ? "url(#cgp)" : "#6a2828"} strokeWidth="1.5"/>
        <path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke={active || hov ? "url(#cgp)" : "#6a2828"} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Notifications",
    path: "/customer/notifications",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <defs><linearGradient id="cgn" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e63232"/><stop offset="100%" stopColor="#f0a030"/></linearGradient></defs>
        <path d="M8 2a5 5 0 00-5 5v2.5L2 11.5A.8.8 0 002.8 13h10.4a.8.8 0 00.72-1L12.5 9.5V7a5 5 0 00-5-5z"
          stroke={active || hov ? "url(#cgn)" : "#6a2828"} strokeWidth="1.4"
          fill={active ? "rgba(230,50,50,0.12)" : "none"} />
        <path d="M6.5 13a1.5 1.5 0 003 0" stroke={active || hov ? "url(#cgn)" : "#6a2828"} strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Support",
    path: "/customer/support",
    icon: (active, hov) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <defs><linearGradient id="cgsu" x1="0" y1="0" x2="16" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e63232"/><stop offset="100%" stopColor="#f0a030"/></linearGradient></defs>
        <path d="M2 5a2 2 0 012-2h8a2 2 0 012 2v5a2 2 0 01-2 2H9l-3 2v-2H4a2 2 0 01-2-2V5z"
          stroke={active || hov ? "url(#cgsu)" : "#6a2828"} strokeWidth="1.5"
          fill={active ? "rgba(230,50,50,0.1)" : "none"} />
        <circle cx="6"  cy="7.5" r="0.8" fill={active || hov ? "#e63232" : "#6a2828"} />
        <circle cx="8"  cy="7.5" r="0.8" fill={active || hov ? "#f0a030" : "#6a2828"} />
        <circle cx="10" cy="7.5" r="0.8" fill={active || hov ? "#e63232" : "#6a2828"} />
      </svg>
    ),
  },
];

export default function CustomerSidebarDark({ hoveredWidth, setHoveredWidth }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ width:"68px", minWidth:"68px", background:"transparent", display:"flex", flexDirection:"column", alignItems:"center", position:"fixed", top:"70px", left:0, bottom:0, zIndex:50, paddingTop:"12px", overflow:"visible" }}>
      <style>{`
        @keyframes fadeLabel {
          from { opacity:0; transform:translateX(8px); }
          to   { opacity:1; transform:translateX(0);   }
        }
        @keyframes iconPop {
          0%   { transform:scale(1);   }
          50%  { transform:scale(1.2); }
          100% { transform:scale(1);   }
        }
        .fade-label-c { animation: fadeLabel 0.2s ease forwards; }
        .icon-pop-c   { animation: iconPop   0.3s ease;          }
      `}</style>

      {/* NAV LINKS */}
      <nav
        onMouseLeave={() => { setHovered(null); setHoveredWidth(0); }}
        style={{ display:"flex", flexDirection:"column", gap:"8px", padding:"0 12px", width:"100%", boxSizing:"border-box", flex:1, justifyContent:"center", alignItems:"center", overflow:"visible" }}
      >
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          const isHov    = hovered === link.label;

          return (
            <div key={link.label} style={{ width:"44px", height:"44px", position:"relative", flexShrink:0 }}>
              <div
                onClick={() => navigate(link.path)}
                onMouseEnter={() => { setHovered(link.label); setHoveredWidth(126); }}
                style={{
                  display:"flex", alignItems:"center",
                  height:"44px", borderRadius:"999px", cursor:"pointer",
                  width: isHov ? "170px" : "44px",
                  position:"absolute", left:0, top:0,
                  zIndex:200, overflow:"hidden",
                  transition:"width 0.35s cubic-bezier(0.34,1.4,0.64,1), background 0.25s, border-color 0.25s, box-shadow 0.35s",
                  border: isActive
                    ? "1px solid rgba(240,160,48,0.6)"
                    : isHov
                    ? "1px solid rgba(230,50,50,0.5)"
                    : "1px solid rgba(150,40,40,0.25)",
                  background: isActive
                    ? "linear-gradient(135deg,rgba(230,50,50,0.25),rgba(240,160,48,0.15))"
                    : isHov
                    ? "linear-gradient(135deg,rgba(230,50,50,0.15),rgba(240,160,48,0.08))"
                    : "rgba(150,40,40,0.08)",
                  boxShadow: isActive
                    ? "0 0 20px rgba(230,50,50,0.3),0 2px 8px rgba(0,0,0,0.3)"
                    : isHov
                    ? "0 0 16px rgba(230,50,50,0.25),0 2px 8px rgba(0,0,0,0.2)"
                    : "none",
                }}
              >
                <div className={isHov ? "icon-pop-c" : ""} style={{ width:"44px", minWidth:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {link.icon(isActive, isHov)}
                </div>
                {isHov && (
                  <span className="fade-label-c" style={{ fontSize:"0.82rem", fontFamily:"'Inter',sans-serif", fontWeight:500, letterSpacing:"0.5px", whiteSpace:"nowrap", paddingRight:"16px", background:"linear-gradient(135deg,#ffffff,#f0c080)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    {link.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div style={{ padding:"0 12px 16px", width:"100%", display:"flex", justifyContent:"center", overflow:"visible" }}>
        <div style={{ width:"44px", height:"44px", position:"relative" }}>
          <div
            onClick={() => { localStorage.removeItem("customerToken"); sessionStorage.removeItem("customerToken"); navigate("/customer/login"); }}
            onMouseEnter={() => { setHovered("logout"); setHoveredWidth(110); }}
            onMouseLeave={() => { setHovered(null); setHoveredWidth(0); }}
            title="Logout"
            style={{
              display:"flex", alignItems:"center",
              height:"44px", borderRadius:"999px", cursor:"pointer",
              width: hovered === "logout" ? "130px" : "44px",
              position:"absolute", left:0, top:0,
              zIndex:200, overflow:"hidden",
              transition:"width 0.35s cubic-bezier(0.34,1.4,0.64,1), background 0.25s, box-shadow 0.35s",
              border: hovered === "logout" ? "1px solid rgba(220,40,40,0.5)" : "1px solid rgba(160,20,20,0.25)",
              background: hovered === "logout" ? "rgba(180,20,20,0.18)" : "rgba(150,20,20,0.08)",
              boxShadow: hovered === "logout" ? "0 0 16px rgba(200,20,20,0.3)" : "none",
            }}
          >
            <div style={{ width:"44px", minWidth:"44px", height:"44px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke={hovered === "logout" ? "#e63232" : "#7a1818"} strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M10 11l3-3-3-3" stroke={hovered === "logout" ? "#e63232" : "#7a1818"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="13" y1="8" x2="6" y2="8" stroke={hovered === "logout" ? "#e63232" : "#7a1818"} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {hovered === "logout" && (
              <span className="fade-label-c" style={{ fontSize:"0.82rem", color:"#e63232", fontFamily:"'Inter',sans-serif", fontWeight:500, whiteSpace:"nowrap", paddingRight:"16px" }}>
                Logout
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}