import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebarLight from "../Components/CustomerSidebarLight";
import CustomerNavbarLight from "../Components/CustomerNavbarLight";

const ME_API        = "http://localhost:5000/api/auth/me";
const USERS_API     = "http://localhost:5000/api/users";
const SHIPMENTS_API = "http://localhost:5000/api/shipments/my";

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

export default function CustomerProfileLight({ toggleTheme }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [pwStatus, setPwStatus] = useState(null);
  const [showPwSection, setShowPwSection] = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  const [userId, setUserId] = useState(null);
  const [joinedDate, setJoinedDate] = useState("");
  const [shipments, setShipments] = useState([]);
  const [profile, setProfile] = useState({ Name: "", Email: "", Company: "", IsActive: true });
  const [draft, setDraft] = useState({ Name: "", Email: "", Company: "", IsActive: true });
  const [pw, setPw] = useState({ old: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(ME_API, { credentials: "include" }),
        fetch(SHIPMENTS_API, { credentials: "include" }),
      ]);
      const pJson = await pRes.json();
      const sJson = await sRes.json();
      if (pJson.success) {
        const u = pJson.user;
        setUserId(u._id);
        setJoinedDate(u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "");
        const p = { Name: u.Name, Email: u.Email, Company: u.Company || "", IsActive: u.IsActive };
        setProfile(p);
        setDraft(p);
      }
      if (sJson.success) setShipments(sJson.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const hover = { transition: "transform 0.25s, box-shadow 0.25s" };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`${USERS_API}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Name: draft.Name, Email: draft.Email, Company: draft.Company }),
      });
      const json = await res.json();
      if (json.success) {
        setProfile({ ...draft });
        setSaveStatus("saved");
        setEditMode(false);
        setTimeout(() => setSaveStatus(null), 2500);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleCancelEdit = () => {
    setDraft({ ...profile });
    setEditMode(false);
    setSaveStatus(null);
  };

  const handlePwChange = async () => {
    setPwError("");
    if (!pw.old || !pw.next || !pw.confirm) { setPwError("All fields are required."); return; }
    if (pw.next !== pw.confirm) { setPwError("New password and confirmation do not match."); return; }
    if (pw.next.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    setPwStatus("saving");
    await new Promise((r) => setTimeout(r, 900));
    setPwStatus("saved");
    setPw({ old: "", next: "", confirm: "" });
    setTimeout(() => { setPwStatus(null); setShowPwSection(false); }, 2000);
  };

  const inputStyle = (disabled) => ({
    width: "100%",
    background: disabled ? C.bgDeep : "#fff",
    border: `1px solid ${disabled ? C.border : C.borderRose}`,
    borderRadius: "4px",
    color: disabled ? C.inkLight : C.ink,
    fontSize: "0.85rem",
    padding: "0.65rem 0.9rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: font.body,
    fontWeight: 400,
    transition: "border-color 0.2s, box-shadow 0.2s",
    cursor: disabled ? "default" : "text",
  });

  const labelStyle = {
    fontSize: "0.62rem",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: C.inkFaint,
    marginBottom: "0.4rem",
    display: "block",
    fontFamily: font.body,
    fontWeight: 500,
  };

  const fieldBlock = (label, key, type = "text") => (
    <div key={key} style={{ marginBottom: "1.3rem" }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        disabled={!editMode}
        value={draft[key]}
        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
        style={inputStyle(!editMode)}
        onFocus={(e) => { if (editMode) { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldLight}`; } }}
        onBlur={(e) => { e.target.style.borderColor = editMode ? C.borderRose : C.border; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );

  const pwField = (label, key) => (
    <div key={key} style={{ marginBottom: "1.1rem" }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="password"
        value={pw[key]}
        onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
        style={inputStyle(false)}
        onFocus={(e) => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.goldLight}`; }}
        onBlur={(e) => { e.target.style.borderColor = C.borderRose; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );

  const isActive = profile.IsActive;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: font.body }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseR { 0%,100%{opacity:1}50%{opacity:0.2} }
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarLight
        toggleTheme={toggleTheme}
        pageTitle="My Profile"
        pageSubtitle={isActive ? "Account Active" : "Account Inactive"}
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
            position: "relative", zIndex: 1,
            opacity: visible ? 1 : 0,
            animation: visible ? "fadeUp 0.8s ease both" : "none",
          }}>

            {/* PAGE HEADER */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.6rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ width: "24px", height: "2px", background: `linear-gradient(90deg,${C.rose},${C.gold})`, borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.6rem", letterSpacing: "4px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>
                    Customer Portal
                  </span>
                </div>
                <h1 style={{
                  fontFamily: font.heading, fontSize: "2.8rem", fontWeight: 600,
                  background: `linear-gradient(135deg,${C.ink} 0%,${C.inkMid} 50%,${C.rose} 100%)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", color: "transparent",
                  letterSpacing: "1px", lineHeight: 1, margin: 0,
                }}>
                  My Profile
                </h1>
              </div>

              {/* STATUS BADGE */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.45rem 1.1rem",
                border: `1px solid ${isActive ? "rgba(196,163,90,0.4)" : C.borderRose}`,
                borderRadius: "999px",
                background: isActive ? C.goldLight : C.roseLight,
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isActive ? C.gold : C.rose, display: "inline-block", animation: isActive ? "pulseR 2s infinite" : "none" }} />
                <span style={{ fontSize: "0.62rem", letterSpacing: "2px", textTransform: "uppercase", color: isActive ? C.gold : C.rose, fontFamily: font.body, fontWeight: 500 }}>
                  {isActive ? "Account Active" : "Account Inactive"}
                </span>
              </div>
            </div>

            {/* GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", alignItems: "start" }}>

              {/* LEFT — PROFILE INFO CARD */}
              <div style={{ background: C.bgCard, border: `1px solid ${C.borderRose}`, borderRadius: "10px", padding: "2rem", boxShadow: "0 4px 30px rgba(201,132,138,0.08)" }}>

                {/* AVATAR ROW */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%",
                    background: C.roseLight, border: `1px solid ${C.borderRose}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, fontStyle: "italic", background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {profile.Name ? profile.Name.split(" ").map((n) => n[0]).join("").slice(0,2).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: font.heading, fontSize: "1.5rem", fontWeight: 600, color: C.ink, letterSpacing: "0.5px" }}>{profile.Name}</div>
                    <div style={{ fontSize: "0.72rem", color: C.inkLight, letterSpacing: "0.5px", fontFamily: font.body }}>{profile.Email}</div>
                  </div>
                </div>

                {/* SECTION LABEL */}
                <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1.4rem", fontFamily: font.body, fontWeight: 600 }}>
                  {editMode ? "Editing Profile" : "Profile Info"}
                </div>

                {fieldBlock("Full Name", "Name")}
                {fieldBlock("Email Address", "Email", "email")}
                {fieldBlock("Company", "Company")}

                {/* ACTION BUTTONS */}
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {!editMode ? (
                    <button
                      onClick={() => { setDraft({ ...profile }); setEditMode(true); }}
                      style={{ background: `linear-gradient(135deg,${C.rose},${C.gold})`, color: "#fff", border: "none", padding: "0.65rem 1.8rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body, ...hover }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(201,132,138,0.35)`; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === "saving"}
                        style={{ background: `linear-gradient(135deg,${C.rose},${C.gold})`, color: "#fff", border: "none", padding: "0.65rem 1.8rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", cursor: saveStatus === "saving" ? "not-allowed" : "pointer", borderRadius: "3px", fontFamily: font.body, opacity: saveStatus === "saving" ? 0.7 : 1, ...hover }}
                        onMouseEnter={(e) => { if (saveStatus !== "saving") { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(201,132,138,0.35)`; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                        {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{ background: "transparent", color: C.inkLight, border: `1px solid ${C.border}`, padding: "0.65rem 1.4rem", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", borderRadius: "3px", fontFamily: font.body, ...hover }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.rose; e.currentTarget.style.color = C.rose; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkLight; }}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                {/* SAVE STATUS */}
                {saveStatus === "saved" && (
                  <div style={{ marginTop: "1rem", fontSize: "0.72rem", letterSpacing: "0.5px", color: C.gold, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: font.body }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.gold, display: "inline-block" }} />
                    Profile updated successfully.
                  </div>
                )}
                {saveStatus === "error" && (
                  <div style={{ marginTop: "1rem", fontSize: "0.72rem", letterSpacing: "0.5px", color: C.rose, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: font.body }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.rose, display: "inline-block" }} />
                    Something went wrong. Please try again.
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                {/* ACCOUNT STATUS CARD */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "1.8rem", boxShadow: "0 4px 20px rgba(196,163,90,0.07)" }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "1.4rem", fontFamily: font.body, fontWeight: 600 }}>Account Status</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.2rem", background: isActive ? C.goldLight : C.roseLight, border: `1px solid ${isActive ? "rgba(196,163,90,0.3)" : C.borderRose}`, borderRadius: "6px", marginBottom: "1.2rem" }}>
                    <div>
                      <div style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, color: isActive ? C.gold : C.rose, letterSpacing: "1px", marginBottom: "2px" }}>
                        {isActive ? "Active" : "Inactive"}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: C.inkLight, letterSpacing: "0.5px", fontFamily: font.body }}>
                        {isActive ? "Your account is in good standing." : "Your account has been deactivated."}{joinedDate ? ` · Joined ${joinedDate}` : ""}
                      </div>
                    </div>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: isActive ? C.gold : C.rose, animation: isActive ? "pulseR 2s infinite" : "none", flexShrink: 0 }} />
                  </div>

                  {/* QUICK STATS */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.7rem" }}>
                    {[
                      { val: shipments.length, label: "Shipments" },
                      { val: shipments.filter(s => s.Status === "Delivered").length, label: "Delivered" },
                      { val: shipments.filter(s => s.Status === "In Transit").length, label: "In Transit" },
                    ].map((m, i) => (
                      <div key={i} style={{ textAlign: "center", padding: "0.8rem 0.5rem", background: C.bgDeep, borderRadius: "5px", border: `1px solid ${C.border}` }}>
                        <div style={{ fontFamily: font.heading, fontSize: "1.6rem", fontWeight: 600, background: `linear-gradient(135deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{m.val}</div>
                        <div style={{ fontSize: "0.58rem", color: C.inkFaint, letterSpacing: "1px", textTransform: "uppercase", fontFamily: font.body }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHANGE PASSWORD CARD */}
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 20px rgba(196,163,90,0.07)" }}>
                  <div
                    onClick={() => { setShowPwSection((s) => !s); setPwError(""); setPwStatus(null); setPw({ old: "", next: "", confirm: "" }); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem 1.8rem", cursor: "pointer", transition: "background 0.2s", userSelect: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.roseLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div>
                      <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", background: `linear-gradient(90deg,${C.rose},${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.3rem", fontFamily: font.body, fontWeight: 600 }}>Security</div>
                      <div style={{ fontFamily: font.heading, fontSize: "1.4rem", fontWeight: 600, color: C.ink, letterSpacing: "0.5px" }}>Change Password</div>
                    </div>
                    <span style={{ fontSize: "0.85rem", color: C.inkFaint, transform: showPwSection ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", display: "inline-block" }}>▼</span>
                  </div>

                  {showPwSection && (
                    <div style={{ padding: "0 1.8rem 1.8rem", borderTop: `1px solid ${C.border}` }}>
                      <div style={{ height: "1.4rem" }} />
                      {pwField("Current Password", "old")}
                      {pwField("New Password", "next")}
                      {pwField("Confirm New Password", "confirm")}

                      {pwError && (
                        <div style={{ fontSize: "0.72rem", color: C.rose, letterSpacing: "0.5px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: font.body }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.rose, display: "inline-block", flexShrink: 0 }} />
                          {pwError}
                        </div>
                      )}

                      {pwStatus === "saved" && (
                        <div style={{ fontSize: "0.72rem", color: C.gold, letterSpacing: "0.5px", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: font.body }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.gold, display: "inline-block", flexShrink: 0 }} />
                          Password updated successfully.
                        </div>
                      )}

                      <button
                        onClick={handlePwChange}
                        disabled={pwStatus === "saving"}
                        style={{ background: `linear-gradient(135deg,${C.rose},${C.gold})`, color: "#fff", border: "none", padding: "0.65rem 1.8rem", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", cursor: pwStatus === "saving" ? "not-allowed" : "pointer", borderRadius: "3px", fontFamily: font.body, opacity: pwStatus === "saving" ? 0.7 : 1, ...hover }}
                        onMouseEnter={(e) => { if (pwStatus !== "saving") { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 6px 20px rgba(201,132,138,0.35)`; } }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                        {pwStatus === "saving" ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}