import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarDark from "../Components/AdminNavbarDark";
import AdminSidebarDark from "../Components/AdminSidebarDark";

const API = "http://localhost:5000/api/users";
const ROLES    = ["All", "admin", "supplier", "customer"];
const STATUSES = ["All", "Active", "Inactive"];

export default function UserManagementPageDark({ toggleTheme }) {
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

  const isRoot = (user) => user.Name === "Arnab Roy" && user.Role === "admin";

  const roleConfig = (role) => {
    switch (role) {
      case "admin":    return { color: "#f0a030", border: "rgba(240,160,48,0.3)",  bg: "rgba(240,160,48,0.08)"  };
      case "supplier": return { color: "#60a5fa", border: "rgba(96,165,250,0.3)",  bg: "rgba(96,165,250,0.08)"  };
      case "customer": return { color: "#4ade80", border: "rgba(74,222,128,0.3)",  bg: "rgba(74,222,128,0.08)"  };
      default:         return { color: "#888",    border: "rgba(136,136,136,0.3)", bg: "rgba(136,136,136,0.08)" };
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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#07060a", color: "#e0d8d0", fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes pulseOrb   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rowIn      { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes gradFlow   { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @keyframes slideRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(40px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pulse      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        @keyframes rootTextShift    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes rootBadgeShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes rootAvatarSpin   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes rootAvatarPulse  { 0%,100%{box-shadow:0 0 10px rgba(240,160,48,0.5),0 0 20px rgba(230,50,50,0.2)} 50%{box-shadow:0 0 22px rgba(240,160,48,0.8),0 0 44px rgba(230,50,50,0.4)} }
        @keyframes rootRowGlow      { 0%,100%{background:linear-gradient(90deg,rgba(240,160,48,0.03),rgba(230,50,50,0.02),rgba(240,160,48,0.03))} 50%{background:linear-gradient(90deg,rgba(240,160,48,0.07),rgba(230,50,50,0.04),rgba(240,160,48,0.07))} }

        .fade-up-um   { animation: fadeUp 0.5s ease forwards; }
        .fade-up-um-1 { animation: fadeUp 0.5s 0.05s ease forwards; opacity: 0; }
        .fade-up-um-2 { animation: fadeUp 0.5s 0.1s ease forwards; opacity: 0; }
        .slide-right-um    { animation: slideRight 0.35s ease forwards; }
        .slide-up-modal-um { animation: slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards; }

        .row-item-um {
          transition: background 0.2s, padding-left 0.2s;
          cursor: pointer; position: relative; overflow: hidden;
        }
        .row-item-um::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: linear-gradient(to bottom, #e63232, #f0a030);
          transition: width 0.25s; border-radius: 0 2px 2px 0;
        }
        .row-item-um:hover::before { width: 3px; }
        .row-item-um:hover { background: rgba(230,50,50,0.04) !important; padding-left: 24px !important; }
        .row-item-um:hover .cell-dim-um  { color: #c8b8b0 !important; }
        .row-item-um:hover .cell-main-um { color: #ffffff !important; }

        .root-row-um {
          animation: rootRowGlow 3s ease-in-out infinite;
          border-left: 2px solid rgba(240,160,48,0.5) !important;
        }
        .root-row-um::before { background: linear-gradient(to bottom, #f0a030, #e63232) !important; }

        .root-avatar-wrapper {
          position: relative; width: 32px; height: 32px; flex-shrink: 0;
        }
        .root-avatar-wrapper::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(#f0a030, #e63232, #ffffff, #e63232, #f0a030);
          animation: rootAvatarSpin 2s linear infinite;
          z-index: 0;
        }
        .root-avatar-inner {
          position: absolute; inset: 2px; border-radius: 50%;
          background: linear-gradient(135deg, #2a1a08, #1a0808);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 800; color: #f0a030;
          font-family: 'Inter', sans-serif; z-index: 1;
          animation: rootAvatarPulse 2s ease-in-out infinite;
        }

        .root-avatar-wrapper-lg {
          position: relative; width: 48px; height: 48px; flex-shrink: 0;
        }
        .root-avatar-wrapper-lg::before {
          content: ''; position: absolute; inset: -2px; border-radius: 50%;
          background: conic-gradient(#f0a030, #e63232, #ffffff, #e63232, #f0a030);
          animation: rootAvatarSpin 2s linear infinite;
          z-index: 0;
        }
        .root-avatar-inner-lg {
          position: absolute; inset: 2px; border-radius: 50%;
          background: linear-gradient(135deg, #2a1a08, #1a0808);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; font-weight: 800; color: #f0a030;
          font-family: 'Bebas Neue', sans-serif; z-index: 1;
          animation: rootAvatarPulse 2s ease-in-out infinite;
        }

        .root-name-um {
          font-size: 0.84rem; font-weight: 800; font-family: 'Inter', sans-serif;
          background: linear-gradient(90deg, #f0a030, #fff, #e63232, #f0a030, #fff, #e63232);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShift 3s ease infinite;
        }
        .root-name-lg {
          font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; letter-spacing: 2px;
          background: linear-gradient(90deg, #f0a030, #fff, #e63232, #f0a030, #fff, #e63232);
          background-size: 300% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: rootTextShift 3s ease infinite;
        }
        .root-badge-um {
          font-size: 0.55rem; padding: 2px 7px; border-radius: 4px;
          background: linear-gradient(90deg, rgba(240,160,48,0.35), rgba(230,50,50,0.25), rgba(240,160,48,0.35));
          background-size: 200% auto;
          border: 1px solid rgba(240,160,48,0.7);
          color: #f0a030; font-weight: 800; letter-spacing: 2px;
          font-family: 'Inter', sans-serif; text-transform: uppercase;
          animation: rootBadgeShimmer 2s linear infinite;
          box-shadow: 0 0 8px rgba(240,160,48,0.3), 0 0 16px rgba(230,50,50,0.1);
        }

        .action-btn-um { transition: all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .action-btn-um:hover { transform: translateY(-2px); }

        .filter-pill-um { transition: all 0.2s; cursor: pointer; }
        .filter-pill-um:hover { color: #c8b8b0 !important; }

        .toggle-btn-um { transition: all 0.2s; cursor: pointer; }
        .toggle-btn-um:hover { transform: scale(1.05); }

        input:focus, select:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(230,50,50,0.25); border-radius: 4px; }

        .spinner-um {
          width: 28px; height: 28px;
          border: 2px solid rgba(230,50,50,0.15);
          border-top-color: #e63232; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

      <AdminNavbarDark toggleTheme={toggleTheme} pageTitle="USER MANAGEMENT" pageSubtitle="MANAGE & CONTROL" />

      <div style={{ display: "flex", flex: 1, overflow: "visible" }}>
        <AdminSidebarDark hoveredWidth={hoveredWidth} setHoveredWidth={setHoveredWidth} />

        <div style={{ marginLeft: `${68 + hoveredWidth}px`, flex: 1, padding: "2rem 2.5rem", transition: "margin-left 0.28s cubic-bezier(0.4,0,0.2,1)", position: "relative", minHeight: "calc(100vh - 64px)" }}>

          <div style={{ position: "fixed", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,50,50,0.1), transparent 70%)", animation: "pulseOrb 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "fixed", bottom: "-150px", left: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,160,48,0.06), transparent 70%)", animation: "pulseOrb 8s ease-in-out infinite reverse", pointerEvents: "none", zIndex: 0 }} />

          {notification && (
            <div className="slide-right-um" style={{
              position: "fixed", top: "80px", right: "2rem", zIndex: 1000,
              padding: "1rem 1.4rem", borderRadius: "10px",
              background: notification.type === "success"
                ? "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(74,222,128,0.06))"
                : "linear-gradient(135deg, rgba(248,113,113,0.12), rgba(248,113,113,0.06))",
              border: `1px solid ${notification.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
              color: notification.type === "success" ? "#4ade80" : "#f87171",
              backdropFilter: "blur(16px)",
              boxShadow: `0 8px 32px ${notification.type === "success" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)"}`,
              display: "flex", alignItems: "center", gap: "0.8rem", minWidth: "260px"
            }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: notification.type === "success" ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>
                {notification.type === "success" ? "✓" : "✕"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "2px" }}>{notification.type === "success" ? "Success" : "Error"}</div>
                <div style={{ opacity: 0.8, fontSize: "0.76rem" }}>{notification.message}</div>
              </div>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="fade-up-um" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", position: "relative", zIndex: 1 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030)", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: "linear-gradient(90deg,#e63232,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Control</span>
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", background: "linear-gradient(135deg,#ffffff 0%,#e0c8c0 50%,#f0a030 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "3px", lineHeight: 1, margin: 0 }}>USER MANAGEMENT</h1>
              <div style={{ fontSize: "0.76rem", color: "#a89888", marginTop: "6px" }}>
                {loading ? "Fetching data..." : `${users.length} user${users.length !== 1 ? "s" : ""} · Click any row to view details`}
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/add-user")}
              style={{ background: "transparent", color: "#e63232", border: "1px solid rgba(230,50,50,0.4)", padding: "12px 28px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(230,50,50,0.08)"; e.currentTarget.style.borderColor = "rgba(230,50,50,0.7)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(230,50,50,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: 300 }}>+</span>
              Add User
            </button>
          </div>

          {/* FILTERS */}
          <div className="fade-up-um-1" style={{ display: "flex", gap: "12px", marginBottom: "16px", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
            <div style={{ flex: 1, position: "relative", minWidth: "200px" }}>
              <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e0d8d0" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Search by name, email or company..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#e0d8d0", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box", transition: "all 0.25s" }}
                onFocus={e => { e.target.style.borderColor = "rgba(230,50,50,0.4)"; e.target.style.background = "rgba(255,255,255,0.05)"; e.target.style.boxShadow = "0 0 0 4px rgba(230,50,50,0.06)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px", borderRadius: "10px" }}>
              {ROLES.map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} className="filter-pill-um"
                  style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "0.72rem", fontWeight: 500, fontFamily: "'Inter',sans-serif", background: roleFilter === r ? "linear-gradient(135deg,rgba(230,50,50,0.18),rgba(240,160,48,0.1))" : "transparent", border: roleFilter === r ? "1px solid rgba(230,50,50,0.35)" : "1px solid transparent", color: roleFilter === r ? "#f0a030" : "#7a6a60", textTransform: "capitalize" }}>{r}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px", borderRadius: "10px" }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className="filter-pill-um"
                  style={{ padding: "6px 12px", borderRadius: "7px", fontSize: "0.72rem", fontWeight: 500, fontFamily: "'Inter',sans-serif", background: statusFilter === s ? "linear-gradient(135deg,rgba(230,50,50,0.18),rgba(240,160,48,0.1))" : "transparent", border: statusFilter === s ? "1px solid rgba(230,50,50,0.35)" : "1px solid transparent", color: statusFilter === s ? "#f0a030" : "#7a6a60" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="fade-up-um-2" style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.015))", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", overflow: "hidden", position: "relative", zIndex: 1 }}>
            <div style={{ height: "2px", background: "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s linear infinite" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 110px 1fr 110px 130px", padding: "12px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["Name", "Email", "Role", "Company", "Status", "Joined"].map(h => (
                <div key={h} style={{ fontSize: "0.6rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "#6a5a50", fontFamily: "'Inter',sans-serif", fontWeight: 700 }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div className="spinner-um" />
                <div style={{ color: "#7a6a60", fontSize: "0.82rem" }}>Fetching users...</div>
              </div>
            ) : users.length === 0 ? (
              <div style={{ padding: "5rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>👥</div>
                <div style={{ color: "#a89888", fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px" }}>No users found</div>
                <div style={{ color: "#6a5a50", fontSize: "0.76rem" }}>Add your first user to get started</div>
              </div>
            ) : (
              users.map((user, i) => {
                const rc = roleConfig(user.Role);
                const root = isRoot(user);
                return (
                  <div key={i}
                    className={`row-item-um${root ? " root-row-um" : ""}`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => { setSelectedUser(user); setEditData({ ...user }); setIsEditing(false); setShowDeleteConfirm(false); }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 110px 1fr 110px 130px", padding: "14px 20px", alignItems: "center", borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", animation: `rowIn 0.3s ${i * 0.04}s ease forwards`, opacity: 0 }}
                  >
                    {/* Name + avatar */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {root ? (
                        <div className="root-avatar-wrapper">
                          <div className="root-avatar-inner">
                            {user.Name?.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg,rgba(230,50,50,0.2),rgba(240,160,48,0.15))", border: "1px solid rgba(230,50,50,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#f0a030", flexShrink: 0, fontFamily: "'Inter',sans-serif" }}>
                          {user.Name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {root ? (
                          <span className="root-name-um">{user.Name}</span>
                        ) : (
                          <div className="cell-main-um" style={{ fontSize: "0.84rem", color: "#d4c4b8", fontWeight: 500, fontFamily: "'Inter',sans-serif", transition: "color 0.15s" }}>{user.Name}</div>
                        )}
                        {root && <span className="root-badge-um">ROOT</span>}
                      </div>
                    </div>

                    <div className="cell-dim-um" style={{ fontSize: "0.82rem", color: "#b0a098", fontFamily: "'Inter',sans-serif", transition: "color 0.15s" }}>{user.Email}</div>
                    <div>
                      <span style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter',sans-serif", background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" }}>
                        <span>{roleIcon(user.Role)}</span>{user.Role}
                      </span>
                    </div>
                    <div className="cell-dim-um" style={{ fontSize: "0.82rem", color: "#b0a098", fontFamily: "'Inter',sans-serif" }}>{user.Company || "—"}</div>
                    <div onClick={e => { e.stopPropagation(); handleToggleActive(user); }}>
                      <span className="toggle-btn-um" style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter',sans-serif", background: user.IsActive ? "rgba(74,222,128,0.08)" : "rgba(136,136,136,0.08)", color: user.IsActive ? "#4ade80" : "#666", border: `1px solid ${user.IsActive ? "rgba(74,222,128,0.25)" : "rgba(136,136,136,0.25)"}`, cursor: "pointer", display: "inline-block" }}>
                        {user.IsActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="cell-dim-um" style={{ fontSize: "0.8rem", color: "#8a7a70", fontFamily: "'Inter',sans-serif" }}>
                      {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                );
              })
            )}
            {!loading && users.length > 0 && (
              <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(240,160,48,0.3),transparent)" }} />
            )}
          </div>

          {/* DETAIL CARD */}
          {selectedUser && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}
              onClick={e => { if (e.target === e.currentTarget) { setSelectedUser(null); setIsEditing(false); setShowDeleteConfirm(false); setPwData({ newPassword: "", confirmPassword: "" }); } }}
            >
              <div className="slide-up-modal-um" style={{ background: "linear-gradient(145deg,#0f0d13,#0a0810)", border: `1px solid ${isRoot(selectedUser) ? "rgba(240,160,48,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: "16px", width: "520px", maxHeight: "88vh", overflowY: "auto", boxShadow: isRoot(selectedUser) ? "0 30px 100px rgba(0,0,0,0.7), 0 0 60px rgba(240,160,48,0.08)" : "0 30px 100px rgba(0,0,0,0.7)" }}>
                <div style={{ height: "2px", background: isRoot(selectedUser) ? "linear-gradient(90deg,#f0a030,#e63232,#fff,#e63232,#f0a030)" : "linear-gradient(90deg,#e63232,#f0a030,#e63232)", backgroundSize: "200%", animation: "gradFlow 3s linear infinite", borderRadius: "16px 16px 0 0" }} />

                {/* Modal header */}
                <div style={{ padding: "1.6rem 2rem", borderBottom: `1px solid ${isRoot(selectedUser) ? "rgba(240,160,48,0.15)" : "rgba(255,255,255,0.05)"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {isRoot(selectedUser) ? (
                      <div className="root-avatar-wrapper-lg">
                        <div className="root-avatar-inner-lg">
                          {selectedUser.Name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg,rgba(230,50,50,0.25),rgba(240,160,48,0.15))", border: "1px solid rgba(230,50,50,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, color: "#f0a030", fontFamily: "'Bebas Neue',sans-serif" }}>
                        {selectedUser.Name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: "0.55rem", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Inter',sans-serif", fontWeight: 600, color: isRoot(selectedUser) ? "#f0a030" : "#7a5a50" }}>
                        {isRoot(selectedUser) ? "👑 Root Administrator" : "User Details"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isRoot(selectedUser) ? (
                          <span className="root-name-lg">{selectedUser.Name}</span>
                        ) : (
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.5rem", background: "linear-gradient(135deg,#fff,#f0a030)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "2px" }}>{selectedUser.Name}</div>
                        )}
                        {isRoot(selectedUser) && <span className="root-badge-um">ROOT</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {(() => { const rc = roleConfig(selectedUser.Role); return (
                      <span style={{ fontSize: "0.72rem", padding: "5px 12px", borderRadius: "999px", fontWeight: 600, fontFamily: "'Inter',sans-serif", background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, display: "inline-flex", alignItems: "center", gap: "5px", textTransform: "capitalize" }}>
                        {roleIcon(selectedUser.Role)} {selectedUser.Role}
                      </span>
                    ); })()}
                    <button onClick={() => { setSelectedUser(null); setIsEditing(false); setShowDeleteConfirm(false); setPwData({ newPassword: "", confirmPassword: "" }); }}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#7a6a60", width: "34px", height: "34px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7a6a60"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >✕</button>
                  </div>
                </div>

                <div style={{ padding: "2rem" }}>
                  {showDeleteConfirm ? (
                    <div style={{ background: "linear-gradient(135deg,rgba(248,113,113,0.07),rgba(248,113,113,0.03))", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "12px", padding: "2.5rem", textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
                      <div style={{ fontSize: "1rem", color: "#e0d8d0", marginBottom: "6px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>Delete {selectedUser.Name}?</div>
                      <div style={{ fontSize: "0.82rem", color: "#7a6a60", marginBottom: "2rem", fontFamily: "'Inter',sans-serif" }}>This action is permanent and cannot be undone.</div>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button onClick={() => setShowDeleteConfirm(false)} className="action-btn-um"
                          style={{ padding: "10px 28px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a89888", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Inter',sans-serif" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "#e0d8d0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "#a89888"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        >Cancel</button>
                        <button onClick={handleDelete} className="action-btn-um"
                          style={{ padding: "10px 28px", background: "linear-gradient(135deg,rgba(248,113,113,0.2),rgba(248,113,113,0.1))", border: "1px solid rgba(248,113,113,0.4)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Inter',sans-serif" }}
                          onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(248,113,113,0.3),rgba(248,113,113,0.15))"}
                          onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,rgba(248,113,113,0.2),rgba(248,113,113,0.1))"}
                        >Yes, Delete</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginBottom: "1.5rem" }}>
                        {[
                          { label: "Name",    key: "Name",    type: "text"   },
                          { label: "Email",   key: "Email",   type: "email"  },
                          { label: "Company", key: "Company", type: "text"   },
                          { label: "Role",    key: "Role",    type: "select", options: ["admin","supplier","customer"] },
                          { label: "Status",  key: "IsActive",type: "select", options: ["true","false"] },
                        ].map(field => (
                          <div key={field.key}>
                            <div style={{ fontSize: "0.6rem", letterSpacing: "2px", textTransform: "uppercase", color: "#6a5a50", marginBottom: "6px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{field.label}</div>
                            {isEditing ? (
                              field.type === "select" ? (
                                <select value={String(editData[field.key]) || ""} onChange={e => setEditData({ ...editData, [field.key]: field.key === "IsActive" ? e.target.value === "true" : e.target.value })}
                                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }}>
                                  {field.options.map(o => <option key={o} value={o} style={{ background: "#0f0d13" }}>{field.key === "IsActive" ? (o === "true" ? "Active" : "Inactive") : o}</option>)}
                                </select>
                              ) : (
                                <input type={field.type} value={editData[field.key] || ""} onChange={e => setEditData({ ...editData, [field.key]: e.target.value })}
                                  style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#e0d8d0", fontSize: "0.84rem", fontFamily: "'Inter',sans-serif", boxSizing: "border-box" }} />
                              )
                            ) : (
                              <div style={{ fontSize: "0.9rem", color: "#d4c4b8", fontFamily: "'Inter',sans-serif", padding: "8px 12px", background: "rgba(255,255,255,0.025)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                {field.key === "IsActive" ? (selectedUser[field.key] ? "Active" : "Inactive") : selectedUser[field.key] || "—"}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem 1.2rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid rgba(255,255,255,0.04)" }}>
                        {[{ label: "Joined", val: selectedUser.createdAt }, { label: "Last Updated", val: selectedUser.updatedAt }].map((t, i) => (
                          <div key={i}>
                            <div style={{ fontSize: "0.58rem", letterSpacing: "2px", textTransform: "uppercase", color: "#5a4a45", marginBottom: "4px", fontFamily: "'Inter',sans-serif", fontWeight: 600 }}>{t.label}</div>
                            <div style={{ fontSize: "0.78rem", color: "#8a7a70", fontFamily: "'Inter',sans-serif" }}>{new Date(t.val).toLocaleString()}</div>
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
                            <button onClick={() => setIsEditing(false)} className="action-btn-um"
                              style={{ padding: "10px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#a89888", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Inter',sans-serif" }}
                              onMouseEnter={e => { e.currentTarget.style.color = "#e0d8d0"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                              onMouseLeave={e => { e.currentTarget.style.color = "#a89888"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                            >Cancel</button>
                            <button onClick={handleUpdate} className="action-btn-um"
                              style={{ padding: "10px 24px", background: "linear-gradient(135deg,#e63232,#f0a030)", border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 20px rgba(230,50,50,0.25)" }}>Save Changes</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleToggleActive(selectedUser)} className="action-btn-um"
                              style={{ padding: "10px 20px", background: selectedUser.IsActive ? "rgba(136,136,136,0.08)" : "rgba(74,222,128,0.08)", border: `1px solid ${selectedUser.IsActive ? "rgba(136,136,136,0.25)" : "rgba(74,222,128,0.25)"}`, color: selectedUser.IsActive ? "#888" : "#4ade80", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Inter',sans-serif" }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >{selectedUser.IsActive ? "Deactivate" : "Activate"}</button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="action-btn-um"
                              style={{ padding: "10px 20px", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Inter',sans-serif" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(248,113,113,0.15)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "rgba(248,113,113,0.07)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)"; }}
                            >Delete</button>
                            <button onClick={() => setIsEditing(true)} className="action-btn-um"
                              style={{ padding: "10px 24px", background: "linear-gradient(135deg,#e63232,#f0a030)", border: "none", color: "#fff", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "'Inter',sans-serif", boxShadow: "0 4px 20px rgba(230,50,50,0.25)" }}>Edit User</button>
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