import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarLight from "../Components/AdminNavbarLight";
import AdminSidebarLight from "../Components/AdminSidebarLight";

const API = "http://localhost:5000/api/users";
const ROLES    = ["All", "admin", "supplier", "customer"];
const STATUSES = ["All", "Active", "Inactive"];

const C = {
  bg: "#faf6f0", bgDeep: "#f3ede4", bgCard: "rgba(255,250,245,0.85)",
  rose: "#c9848a", gold: "#c4a35a",
  ink: "#2e2218", inkMid: "#6b5744", inkLight: "#a8917a", inkFaint: "#d6c9bc",
  border: "rgba(196,163,90,0.2)", borderRose: "rgba(201,132,138,0.25)",
  roseLight: "rgba(201,132,138,0.12)", goldLight: "rgba(196,163,90,0.12)",
};
const font = { heading: "'Cormorant Garamond', serif", cursive: "'Dancing Script', cursive", body: "'DM Sans', sans-serif" };

export default function UserManagementPageLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [hoveredWidth, setHoveredWidth] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [pwData, setPwData] = useState({ newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => { fetchUsers(); }, [search, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = `${API}?`;
      if (search) url += `search=${search}&`;
      if (roleFilter !== "All") url += `Role=${roleFilter}&`;
      if (statusFilter !== "All") url += `IsActive=${statusFilter === "Active"}`;
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      showNotification("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API}/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedUser(data.data);
        setIsEditing(false);
        fetchUsers();
        showNotification("success", "User updated successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to update user");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/${selectedUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSelectedUser(null);
        setShowDeleteConfirm(false);
        fetchUsers();
        showNotification("success", "User deleted successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to delete user");
    }
  };
  const handlePasswordChange = async () => {
    if (!pwData.newPassword || !pwData.confirmPassword) {
      showNotification("error", "Please fill both password fields!"); return;
    }
    if (pwData.newPassword.length < 6) {
      showNotification("error", "Password must be at least 6 characters!"); return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      showNotification("error", "Passwords don't match!"); return;
    }
    try {
      setPwLoading(true);
      const res = await fetch(`${API}/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Password: pwData.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPwData({ newPassword: "", confirmPassword: "" });
        showNotification("success", "Password changed successfully!");
      }
    } catch (err) {
      showNotification("error", "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };
  const handleToggleActive = async (user) => {
    try {
      const res = await fetch(`${API}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IsActive: !user.IsActive }),
      });
      const data = await res.json();
      if (data.success) {
        if (selectedUser?._id === user._id) setSelectedUser(data.data);
        fetchUsers();
        showNotification("success", `User ${data.data.IsActive ? "activated" : "deactivated"} successfully!`);
      }
    } catch (err) {
      showNotification("error", "Failed to update user status");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const isRoot = (user) => user.Name === "Juhi Thakur" && user.Role === "admin";

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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');

        @keyframes pulseOrb   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn      { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow   { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        @keyframes rootTextShiftL    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes rootBadgeShimmerL { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes rootAvatarSpinL   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes rootAvatarPulseL  { 0%,100%{box-shadow:0 0 10px rgba(201,132,138,0.4),0 0 20px rgba(196,163,90,0.2)} 50%{box-shadow:0 0 22px rgba(201,132,138,0.7),0 0 40px rgba(196,163,90,0.35)} }
        @keyframes rootRowGlowL      { 0%,100%{background:linear-gradient(90deg,rgba(201,132,138,0.04),rgba(196,163,90,0.02),rgba(201,132,138,0.04))} 50%{background:linear-gradient(90deg,rgba(201,132,138,0.09),rgba(196,163,90,0.05),rgba(201,132,138,0.09))} }

        .fade-up-uml   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-uml-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .fade-up-uml-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
        .slide-right-uml    { animation: slideRight 0.35s ease forwards; }
        .slide-up-modal-uml { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .row-item-uml {
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .row-item-uml::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: linear-gradient(to bottom, ${C.rose}, ${C.gold});
          transition: width 0.25s; border-radius: 0 2px 2px 0;
        }
        .row-item-uml:hover::before { width: 3px; }
        .row-item-uml:hover { background: rgba(201,132,138,0.05) !important; padding-left: 24px !important; }
        .row-item-uml:hover .cell-dim-uml  { color: ${C.inkMid} !important; }
        .row-item-uml:hover .cell-main-uml { color: ${C.ink} !important; }

        .root-row-uml {
          animation: rootRowGlowL 3s ease-in-out infinite;
          border-left: 2px solid rgba(201,132,138,0.5) !important;
        }
        .root-row-uml::before { background: linear-gradient(to bottom, ${C.rose}, ${C.gold}) !important; }

        .root-avatar-wrapper-l {
          position: relative; width: 32px; height: 32px; flex-shrink: 0;
        }
        .root-avatar-wrapper-l::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(${C.rose}, ${C.gold}, #fff, ${C.gold}, ${C.rose});
          animation: rootAvatarSpinL 2s linear infinite;
          z-index: 0;
        }
        .root-avatar-inner-l {
          position: absolute; inset: 2px; border-radius: 50%;
          background: linear-gradient(135deg, #f8f0e8, #f0e4d4);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: ${C.rose};
          font-family: ${font.heading}; font-style: italic; z-index: 1;
          animation: rootAvatarPulseL 2s ease-in-out infinite;
        }

        .root-avatar-wrapper-lg-l {
          position: relative; width: 48px; height: 48px; flex-shrink: 0;
        }
        .root-avatar-wrapper-lg-l::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(${C.rose}, ${C.gold}, #fff, ${C.gold}, ${C.rose});
          animation: rootAvatarSpinL 2s linear infinite;
          z-index: 0;
        }
        .root-avatar-inner-lg-l {
          position: absolute; inset: 2px; border-radius: 50%;
          background: linear-gradient(135deg, #f8f0e8, #f0e4d4);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 600; color: ${C.rose};
          font-family: ${font.heading}; font-style: italic; z-index: 1;
          animation: rootAvatarPulseL 2s ease-in-out infinite;
        }

        .root-name-uml {
          font-size: 0.84rem; font-weight: 700;
          font-family: ${font.heading}; font-style: italic;
          background: linear-gradient(90deg, ${C.rose}, ${C.gold}, #8a5a3a, ${C.rose}, ${C.gold});
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShiftL 3s ease infinite;
        }
        .root-name-lg-l {
          font-family: ${font.heading}; font-size: 1.6rem;
          font-weight: 600; font-style: italic; letter-spacing: 1px;
          background: linear-gradient(90deg, ${C.rose}, ${C.gold}, #8a5a3a, ${C.rose}, ${C.gold});
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShiftL 3s ease infinite;
        }
        .root-badge-uml {
          font-size: 0.55rem; padding: 2px 7px; border-radius: 4px;
          background: linear-gradient(90deg, rgba(201,132,138,0.3), rgba(196,163,90,0.2), rgba(201,132,138,0.3));
          background-size: 200% auto;
          border: 1px solid rgba(201,132,138,0.6);
          color: ${C.rose}; font-weight: 700; letter-spacing: 2px;
          font-family: ${font.body}; text-transform: uppercase;
          animation: rootBadgeShimmerL 2s linear infinite;
          box-shadow: 0 0 8px rgba(201,132,138,0.25), 0 0 16px rgba(196,163,90,0.1);
        }

        .action-btn-uml { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-uml:hover { transform: translateY(-2px); }

        .filter-pill-uml { transition: all 0.2s; cursor: pointer; }
        .filter-pill-uml:hover { color: ${C.inkMid} !important; }

        .toggle-btn-uml { transition: all 0.2s; cursor: pointer; }
        .toggle-btn-uml:hover { transform: scale(1.05); }

        input:focus, select:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,132,138,0.3); border-radius: 4px; }

        .spinner-uml {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,132,138,0.2);
          border-top-color: ${C.rose}; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <AdminNavbarLight toggleTheme={toggleTheme} pageTitle="User Management" pageSubtitle="Manage & Control" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarLight hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, rgba(201,132,138,0.12), transparent 70%)`, animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(196,163,90,0.08), transparent 70%)`, animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {notification && (
            <div className="slide-right-uml" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
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

          {/* PAGE HEADER */}
          <div className="fade-up-uml" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, fontFamily: font.body }}>Control</span>
              </div>
              <h1 style={{ fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600, color: C.ink, letterSpacing: "1px", lineHeight: 1, margin: 0 }}>User Management</h1>
              <div style={{ fontSize: "0.76rem", color: C.inkLight, marginTop: "6px", fontFamily: font.body }}>
                {loading ? "Fetching data..." : `${users.length} user${users.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/add-user")}
              style={{ background: "transparent", color: C.rose, border: `1px solid rgba(201,132,138,0.4)`, padding: "12px 28px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: font.body, display: "flex", alignItems: "center", gap: "8px", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.borderColor = C.borderRose; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(201,132,138,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(201,132,138,0.4)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>+</span>
              Add User
            </button>
          </div>

          {/* FILTERS */}
          <div className="fade-up-uml-1" style={{ display: "flex", gap: "12px", marginBottom: "16px", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
            <div style={{ flex: 1, position: "relative", minWidth: "200px" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkMid} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search by name, email or company..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.ink, fontSize: "0.85rem", fontFamily: font.body, boxSizing: "border-box", transition: "all 0.25s" }}
                onFocus={e => { e.target.style.borderColor = C.borderRose; e.target.style.boxShadow = `0 0 0 4px rgba(201,132,138,0.08)`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "flex", gap: "4px", background: C.bgDeep, border: `1px solid ${C.border}`, padding: "4px", borderRadius: "10px" }}>
              {ROLES.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} className="filter-pill-uml"
                  style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "0.72rem", fontWeight: 500, fontFamily: font.body, background: roleFilter === r ? `linear-gradient(135deg,${C.roseLight},${C.goldLight})` : "transparent", border: roleFilter === r ? `1px solid ${C.borderRose}` : "1px solid transparent", color: roleFilter === r ? C.rose : C.inkLight, textTransform: "capitalize" }}>{r}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "4px", background: C.bgDeep, border: `1px solid ${C.border}`, padding: "4px", borderRadius: "10px" }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill-uml"
                  style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "0.72rem", fontWeight: 500, fontFamily: font.body, background: statusFilter === s ? `linear-gradient(135deg,${C.roseLight},${C.goldLight})` : "transparent", border: statusFilter === s ? `1px solid ${C.borderRose}` : "1px solid transparent", color: statusFilter === s ? C.rose : C.inkLight }}>{s}</button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="fade-up-uml-2" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", position: "relative", zIndex: 1, boxShadow: "0 4px 24px rgba(201,132,138,0.07)" }}>
            <div style={{ height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 110px 1fr 110px 130px", padding: "12px 20px", background: C.bgDeep, borderBottom: `1px solid ${C.border}` }}>
              {["Name", "Email", "Role", "Company", "Status", "Joined"].map(h => (
                <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: C.inkFaint, fontFamily: font.body, fontWeight: 700 }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div className="spinner-uml" />
                <div style={{ color: C.inkLight, fontSize: "0.82rem", fontFamily: font.body }}>Fetching users...</div>
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>👥</div>
                <div style={{ color: C.inkMid, fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px", fontFamily: font.body }}>No users found</div>
                <div style={{ color: C.inkLight, fontSize: "0.76rem", fontFamily: font.body }}>Add your first user to get started</div>
              </div>
            ) : (
              users.map((user, i) => {
                const rc = roleConfig(user.Role);
                const root = isRoot(user);
                return (
                  <div key={i}
                    className={`row-item-uml${root ? " root-row-uml" : ""}`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => { setSelectedUser(user); setEditData({ ...user }); setIsEditing(false); setShowDeleteConfirm(false); }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 110px 1fr 110px 130px", padding: "14px 20px", alignItems: "center", borderBottom: i < users.length - 1 ? `1px solid ${C.border}` : "none", animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0 }}
                  >
                    {/* Name + avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {root ? (
                        <div className="root-avatar-wrapper-l">
                          <div className="root-avatar-inner-l">
                            {user.Name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: C.rose, flexShrink: 0, fontFamily: font.body }}>
                          {user.Name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {root ? (
                          <span className="root-name-uml">{user.Name}</span>
                        ) : (
                          <div className="cell-main-uml" style={{ fontSize: "0.84rem", color: C.inkMid, fontWeight: 500, fontFamily: font.body, transition: "color 0.15s" }}>{user.Name}</div>
                        )}
                        {root && <span className="root-badge-uml">ROOT</span>}
                      </div>
                    </div>

                    <div className="cell-dim-uml" style={{ fontSize: "0.82rem", color: C.inkLight, fontFamily: font.body, transition: "color 0.15s" }}>{user.Email}</div>
                    <div>
                      <span style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" }}>
                        <span>{roleIcon(user.Role)}</span>{user.Role}
                      </span>
                    </div>
                    <div className="cell-dim-uml" style={{ fontSize: "0.82rem", color: C.inkLight, fontFamily: font.body }}>{user.Company || "—"}</div>
                    <div onClick={e => { e.stopPropagation(); handleToggleActive(user); }}>
                      <span className="toggle-btn-uml" style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: user.IsActive ? "rgba(90,158,90,0.09)" : C.bgDeep, color: user.IsActive ? "#5a9e5a" : C.inkFaint, border: `1px solid ${user.IsActive ? "rgba(90,158,90,0.3)" : C.border}`, cursor: "pointer", display: "inline-block" }}>
                        {user.IsActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="cell-dim-uml" style={{ fontSize: "0.8rem", color: C.inkLight, fontFamily: font.body }}>
                      {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                );
              })
            )}
            {!loading && users.length > 0 && (
              <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,rgba(196,163,90,0.3),transparent)` }} />
            )}
          </div>

          {/* DETAIL CARD */}
          {selectedUser && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(46,34,24,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
              onClick={e => { if (e.target === e.currentTarget) { setSelectedUser(null); setIsEditing(false); setShowDeleteConfirm(false); setPwData({ newPassword: "", confirmPassword: "" }); } }}
            >
              <div className="slide-up-modal-uml" style={{ background: C.bgCard, border: `1px solid ${isRoot(selectedUser) ? "rgba(201,132,138,0.4)" : C.borderRose}`, borderRadius: "16px", width: "520px", maxHeight: "88vh", overflowY: "auto", boxShadow: isRoot(selectedUser) ? "0 30px 100px rgba(46,34,24,0.2), 0 0 60px rgba(201,132,138,0.08)" : "0 30px 100px rgba(46,34,24,0.2)" }}>
                <div style={{ height: "2px", background: isRoot(selectedUser) ? `linear-gradient(90deg,${C.rose},${C.gold},#fff,${C.gold},${C.rose})` : `linear-gradient(90deg,${C.rose},${C.gold},${C.rose})`, backgroundSize: "200%", animation: "gradFlow 3s linear infinite", borderRadius: "16px 16px 0 0" }} />

                {/* Modal header */}
                <div style={{ padding: "1.6rem 2rem", borderBottom: `1px solid ${isRoot(selectedUser) ? "rgba(201,132,138,0.2)" : C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {isRoot(selectedUser) ? (
                      <div className="root-avatar-wrapper-lg-l">
                        <div className="root-avatar-inner-lg-l">
                          {selectedUser.Name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `linear-gradient(135deg,${C.roseLight},${C.goldLight})`, border: `1px solid ${C.borderRose}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: 700, color: C.rose, fontFamily: font.heading, fontStyle: "italic" }}>
                        {selectedUser.Name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px", fontFamily: font.body, fontWeight: 600, color: isRoot(selectedUser) ? C.rose : C.inkFaint }}>
                        {isRoot(selectedUser) ? "👑 Root Administrator" : "User Details"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isRoot(selectedUser) ? (
                          <span className="root-name-lg-l">{selectedUser.Name}</span>
                        ) : (
                          <div style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.ink},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{selectedUser.Name}</div>
                        )}
                        {isRoot(selectedUser) && <span className="root-badge-uml">ROOT</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {(() => { const rc = roleConfig(selectedUser.Role); return (
                      <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: font.body, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" }}>
                        {roleIcon(selectedUser.Role)} {selectedUser.Role}
                      </span>
                    ); })()}
                    <button onClick={() => { setSelectedUser(null); setIsEditing(false); setShowDeleteConfirm(false); setPwData({ newPassword: "", confirmPassword: "" }); }}
                      style={{ background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkLight, width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.roseLight; e.currentTarget.style.color = C.rose; e.currentTarget.style.borderColor = C.borderRose; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.bgDeep; e.currentTarget.style.color = C.inkLight; e.currentTarget.style.borderColor = C.border; }}
                    >✕</button>
                  </div>
                </div>

                <div style={{ padding: "2rem" }}>
                  {showDeleteConfirm ? (
                    <div style={{ background: C.roseLight, border: `1px solid ${C.borderRose}`, borderRadius: "12px", padding: "2.5rem", textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                      <div style={{ fontSize: "1rem", color: C.ink, marginBottom: "6px", fontFamily: font.body, fontWeight: 600 }}>Delete {selectedUser.Name}?</div>
                      <div style={{ fontSize: "0.82rem", color: C.inkMid, marginBottom: "2rem", fontFamily: font.body }}>This action is permanent and cannot be undone.</div>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={() => setShowDeleteConfirm(false)} className="action-btn-uml"
                          style={{ padding: "10px 28px", background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkMid, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                          onMouseEnter={e => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderColor = C.borderRose; }}
                          onMouseLeave={e => { e.currentTarget.style.color = C.inkMid; e.currentTarget.style.borderColor = C.border; }}
                        >Cancel</button>
                        <button onClick={handleDelete} className="action-btn-uml"
                          style={{ padding: "10px 28px", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,132,138,0.25)"}
                          onMouseLeave={e => e.currentTarget.style.background = C.roseLight}
                        >Yes, Delete</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                        {[
                          { label: "Name",    key: "Name",     type: "text"  },
                          { label: "Email",   key: "Email",    type: "email" },
                          { label: "Company", key: "Company",  type: "text"  },
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
                                {field.key === "IsActive" ? (selectedUser[field.key] ? "Active" : "Inactive") : selectedUser[field.key] || "—"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 1.2rem", background: C.bgDeep, borderRadius: "8px", marginBottom: "1.5rem", border: `1px solid ${C.border}` }}>
                        {[{ label: "Joined", val: selectedUser.createdAt }, { label: "Last Updated", val: selectedUser.updatedAt }].map((t, i) => (
                          <div key={i}>
                            <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: C.inkFaint, marginBottom: "4px", fontFamily: font.body, fontWeight: 600 }}>{t.label}</div>
                            <div style={{ fontSize: "0.78rem", color: C.inkLight, fontFamily: font.body }}>{new Date(t.val).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                      {/* CHANGE PASSWORD SECTION */}
                      {!showDeleteConfirm && (
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.5rem" }}>
                          <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "1rem", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>Change Password</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                            <div>
                              <div style={{ fontSize: "0.58rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "6px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>New Password</div>
                              <input type="password" placeholder="Min 6 characters" value={pwData.newPassword}
                                onChange={e => setPwData({ ...pwData, newPassword: e.target.value })}
                                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.58rem", letterSpacing: "1.5px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "6px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Confirm Password</div>
                              <input type="password" placeholder="Repeat password" value={pwData.confirmPassword}
                                onChange={e => setPwData({ ...pwData, confirmPassword: e.target.value })}
                                style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
                            </div>
                          </div>
                          <button onClick={handlePasswordChange} disabled={pwLoading}
                            style={{ padding: "9px 20px", background: pwData.newPassword && pwData.confirmPassword ? "linear-gradient(135deg,#e63232,#f0a030)" : "rgba(255,255,255,0.03)", border: pwData.newPassword && pwData.confirmPassword ? "none" : "1px solid rgba(255,255,255,0.06)", color: pwData.newPassword && pwData.confirmPassword ? "#fff" : "#4a3a35", borderRadius: "8px", cursor: pwData.newPassword && pwData.confirmPassword ? "pointer" : "not-allowed", fontSize: "0.78rem", fontWeight: 700, fontFamily: "'Inter',sans-serif", letterSpacing: "1px" }}>
                            {pwLoading ? "Saving..." : "Set New Password"}
                          </button>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => setIsEditing(false)} className="action-btn-uml"
                              style={{ padding: "10px 20px", background: C.bgDeep, border: `1px solid ${C.border}`, color: C.inkMid, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                              onMouseEnter={e => e.currentTarget.style.color = C.ink}
                              onMouseLeave={e => e.currentTarget.style.color = C.inkMid}
                            >Cancel</button>
                            <button onClick={handleUpdate} className="action-btn-uml"
                              style={{ padding: "10px 24px", background: `linear-gradient(135deg,${C.rose},${C.gold})`, border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body, boxShadow: `0 4px 20px rgba(201,132,138,0.25)` }}>Save Changes</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleToggleActive(selectedUser)} className="action-btn-uml"
                              style={{ padding: "10px 20px", background: selectedUser.IsActive ? C.bgDeep : "rgba(90,158,90,0.09)", border: `1px solid ${selectedUser.IsActive ? C.border : "rgba(90,158,90,0.3)"}`, color: selectedUser.IsActive ? C.inkFaint : "#5a9e5a", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >{selectedUser.IsActive ? "Deactivate" : "Activate"}</button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="action-btn-uml"
                              style={{ padding: "10px 20px", background: C.roseLight, border: `1px solid ${C.borderRose}`, color: C.rose, borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: font.body }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,132,138,0.25)"}
                              onMouseLeave={e => e.currentTarget.style.background = C.roseLight}
                            >Delete</button>
                            <button onClick={() => setIsEditing(true)} className="action-btn-uml"
                              style={{ padding: "10px 24px", background: `linear-gradient(135deg,${C.rose},${C.gold})`, border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: font.body, boxShadow: `0 4px 20px rgba(201,132,138,0.25)` }}>Edit User</button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}