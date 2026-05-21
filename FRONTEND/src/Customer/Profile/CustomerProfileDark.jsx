import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerSidebarDark from "../Components/CustomerSidebarDark";
import CustomerNavbarDark from "../Components/CustomerNavbarDark";

export default function CustomerProfileDark({ toggleTheme }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "saved" | "error"
  const [pwStatus, setPwStatus] = useState(null);
  const [showPwSection, setShowPwSection] = useState(false);
  const [hoveredWidth, setHoveredWidth] = useState(0);

  const [profile, setProfile] = useState({
    name: "Firstname Lastname",
    email: "name@example.com",
    phone: "+91",
    address: "Address",
    status: "active", // "active" | "inactive"
  });

  const [draft, setDraft] = useState({ ...profile });

  const [pw, setPw] = useState({ old: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const hover = { transition: "transform 0.2s, box-shadow 0.2s" };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      await new Promise((r) => setTimeout(r, 900)); // simulate
      setProfile({ ...draft });
      setSaveStatus("saved");
      setEditMode(false);
      setTimeout(() => setSaveStatus(null), 2500);
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
    if (!pw.old || !pw.next || !pw.confirm) {
      setPwError("All fields are required.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwError("New password and confirmation do not match.");
      return;
    }
    if (pw.next.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    setPwStatus("saving");
    await new Promise((r) => setTimeout(r, 900));
    setPwStatus("saved");
    setPw({ old: "", next: "", confirm: "" });
    setTimeout(() => {
      setPwStatus(null);
      setShowPwSection(false);
    }, 2000);
  };

  const inputStyle = (disabled) => ({
    width: "100%",
    background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
    border: `1px solid ${disabled ? "rgba(255,255,255,0.06)" : "rgba(196,30,30,0.35)"}`,
    borderRadius: "4px",
    color: disabled ? "#6a5e5e" : "#e0d8d0",
    fontSize: "0.85rem",
    padding: "0.65rem 0.9rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    cursor: disabled ? "default" : "text",
  });

  const labelStyle = {
    fontSize: "0.62rem",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#4a4040",
    marginBottom: "0.4rem",
    display: "block",
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
        onFocus={(e) => { if (editMode) e.target.style.borderColor = "rgba(240,160,48,0.6)"; }}
        onBlur={(e) => { e.target.style.borderColor = editMode ? "rgba(196,30,30,0.35)" : "rgba(255,255,255,0.06)"; }}
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
        onFocus={(e) => { e.target.style.borderColor = "rgba(240,160,48,0.6)"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(196,30,30,0.35)"; }}
      />
    </div>
  );

  const isActive = profile.status === "active";

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
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* NAVBAR */}
      <CustomerNavbarDark
        toggleTheme={toggleTheme}
        pageTitle="MY PROFILE"
        pageSubtitle="ACCOUNT SETTINGS"
      />

      {/* LAYOUT: Sidebar + Main */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {/* SIDEBAR */}
        <CustomerSidebarDark
          hoveredWidth={hoveredWidth}
          setHoveredWidth={setHoveredWidth}
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
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* AMBIENT ORB */}
          <div
            style={{
              position: "fixed",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(196,30,30,0.14) 0%,rgba(196,30,30,0.05) 50%,transparent 70%)",
              top: "40%",
              left: "30%",
              transform: "translate(-50%,-50%)",
              zIndex: 0,
              pointerEvents: "none",
              animation: "pulseOrb 5s ease-in-out infinite",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
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
                marginBottom: "2.5rem",
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
                  }}
                >
                  MY PROFILE
                </h1>
              </div>

              {/* STATUS BADGE */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.45rem 1.1rem",
                  border: `1px solid ${isActive ? "rgba(240,160,48,0.35)" : "rgba(196,30,30,0.35)"}`,
                  borderRadius: "999px",
                  background: isActive ? "rgba(240,160,48,0.06)" : "rgba(196,30,30,0.06)",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: isActive ? "#f0a030" : "#e63232",
                    display: "inline-block",
                    animation: isActive ? "pulseR 2s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color: isActive ? "#f0a030" : "#e63232",
                  }}
                >
                  {isActive ? "Account Active" : "Account Inactive"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.2rem",
                alignItems: "start",
              }}
            >
              {/* LEFT — PROFILE INFO CARD */}
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(196,30,30,0.18)",
                  borderRadius: "10px",
                  padding: "2rem",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* AVATAR ROW */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                    marginBottom: "2rem",
                    paddingBottom: "1.5rem",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,rgba(196,30,30,0.35),rgba(240,160,48,0.25))",
                      border: "1px solid rgba(240,160,48,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.4rem",
                      color: "#f0a030",
                      flexShrink: 0,
                    }}
                  >
                    {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "1.4rem",
                        background: "linear-gradient(135deg,#ffffff,#c8b0a8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "1.5px",
                      }}
                    >
                      {profile.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#4a4040", letterSpacing: "1px" }}>
                      {profile.email}
                    </div>
                  </div>
                </div>

                {/* SECTION LABEL */}
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg,#e63232,#f0a030)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "1.4rem",
                  }}
                >
                  {editMode ? "EDITING PROFILE" : "PROFILE INFO"}
                </div>

                {fieldBlock("Full Name", "name")}
                {fieldBlock("Email Address", "email", "email")}
                {fieldBlock("Phone Number", "phone", "tel")}

                <div style={{ marginBottom: "1.3rem" }}>
                  <label style={labelStyle}>Address</label>
                  <textarea
                    disabled={!editMode}
                    value={draft.address}
                    onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle(!editMode), resize: "vertical" }}
                    onFocus={(e) => { if (editMode) e.target.style.borderColor = "rgba(240,160,48,0.6)"; }}
                    onBlur={(e) => { e.target.style.borderColor = editMode ? "rgba(196,30,30,0.35)" : "rgba(255,255,255,0.06)"; }}
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: "flex", gap: "0.8rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  {!editMode ? (
                    <button
                      onClick={() => { setDraft({ ...profile }); setEditMode(true); }}
                      style={{
                        background: "linear-gradient(135deg,#e63232,#f0a030)",
                        color: "#fff",
                        border: "none",
                        padding: "0.65rem 1.8rem",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        borderRadius: "3px",
                        ...hover,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(230,50,50,0.35)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      EDIT PROFILE
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === "saving"}
                        style={{
                          background: "linear-gradient(135deg,#e63232,#f0a030)",
                          color: "#fff",
                          border: "none",
                          padding: "0.65rem 1.8rem",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                          borderRadius: "3px",
                          opacity: saveStatus === "saving" ? 0.7 : 1,
                          ...hover,
                        }}
                        onMouseEnter={(e) => { if (saveStatus !== "saving") { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(230,50,50,0.35)"; }}}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {saveStatus === "saving" ? "SAVING..." : "SAVE CHANGES"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          background: "transparent",
                          color: "#6a5e5e",
                          border: "1px solid rgba(255,255,255,0.08)",
                          padding: "0.65rem 1.4rem",
                          fontSize: "0.72rem",
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          borderRadius: "3px",
                          ...hover,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(240,160,48,0.3)"; e.currentTarget.style.color = "#f0a030"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#6a5e5e"; }}
                      >
                        CANCEL
                      </button>
                    </>
                  )}
                </div>

                {/* SAVE STATUS TOAST */}
                {saveStatus === "saved" && (
                  <div style={{ marginTop: "1rem", fontSize: "0.72rem", letterSpacing: "1px", color: "#f0a030", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f0a030", display: "inline-block" }} />
                    Profile updated successfully.
                  </div>
                )}
                {saveStatus === "error" && (
                  <div style={{ marginTop: "1rem", fontSize: "0.72rem", letterSpacing: "1px", color: "#e63232", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e63232", display: "inline-block" }} />
                    Something went wrong. Please try again.
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

                {/* ACCOUNT STATUS CARD */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    padding: "1.8rem",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      background: "linear-gradient(90deg,#e63232,#f0a030)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "1.4rem",
                    }}
                  >
                    Account Status
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.2rem",
                      background: isActive ? "rgba(240,160,48,0.06)" : "rgba(196,30,30,0.06)",
                      border: `1px solid ${isActive ? "rgba(240,160,48,0.2)" : "rgba(196,30,30,0.2)"}`,
                      borderRadius: "6px",
                      marginBottom: "1.2rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.5rem",
                          background: isActive
                            ? "linear-gradient(135deg,#f0a030,#e63232)"
                            : "linear-gradient(135deg,#e63232,#8a2020)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "2px",
                        }}
                      >
                        {isActive ? "ACTIVE" : "INACTIVE"}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#4a4040", letterSpacing: "1px", marginTop: "2px" }}>
                        {isActive ? "Your account is in good standing." : "Your account has been deactivated."}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: isActive ? "#f0a030" : "#e63232",
                        animation: isActive ? "pulseR 2s infinite" : "none",
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  {/* QUICK STATS */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.7rem" }}>
                    {[{ val: "12", label: "Shipments" }, { val: "8", label: "Delivered" }, { val: "4", label: "Active" }].map((m, i) => (
                      <div
                        key={i}
                        style={{
                          textAlign: "center",
                          padding: "0.8rem 0.5rem",
                          background: "rgba(255,255,255,0.02)",
                          borderRadius: "5px",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "1.6rem",
                            background: "linear-gradient(135deg,#e63232,#f0a030)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {m.val}
                        </div>
                        <div style={{ fontSize: "0.58rem", color: "#3a3030", letterSpacing: "1px", textTransform: "uppercase" }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CHANGE PASSWORD CARD */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    backdropFilter: "blur(8px)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    onClick={() => {
                      setShowPwSection((s) => !s);
                      setPwError("");
                      setPwStatus(null);
                      setPw({ old: "", next: "", confirm: "" });
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1.5rem 1.8rem",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      userSelect: "none",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(196,30,30,0.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          letterSpacing: "3px",
                          textTransform: "uppercase",
                          background: "linear-gradient(90deg,#e63232,#f0a030)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          marginBottom: "0.3rem",
                        }}
                      >
                        Security
                      </div>
                      <div
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "1.3rem",
                          background: "linear-gradient(135deg,#ffffff,#c8b0a8)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "2px",
                        }}
                      >
                        CHANGE PASSWORD
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "1rem",
                        color: "#4a4040",
                        transform: showPwSection ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s",
                        display: "inline-block",
                      }}
                    >
                      ▼
                    </span>
                  </div>

                  {showPwSection && (
                    <div style={{ padding: "0 1.8rem 1.8rem", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ height: "1.4rem" }} />
                      {pwField("Current Password", "old")}
                      {pwField("New Password", "next")}
                      {pwField("Confirm New Password", "confirm")}

                      {pwError && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#e63232",
                            letterSpacing: "0.5px",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e63232", display: "inline-block", flexShrink: 0 }} />
                          {pwError}
                        </div>
                      )}

                      {pwStatus === "saved" && (
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#f0a030",
                            letterSpacing: "0.5px",
                            marginBottom: "1rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f0a030", display: "inline-block", flexShrink: 0 }} />
                          Password updated successfully.
                        </div>
                      )}

                      <button
                        onClick={handlePwChange}
                        disabled={pwStatus === "saving"}
                        style={{
                          background: "linear-gradient(135deg,#e63232,#f0a030)",
                          color: "#fff",
                          border: "none",
                          padding: "0.65rem 1.8rem",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          cursor: pwStatus === "saving" ? "not-allowed" : "pointer",
                          borderRadius: "3px",
                          opacity: pwStatus === "saving" ? 0.7 : 1,
                          ...hover,
                        }}
                        onMouseEnter={(e) => { if (pwStatus !== "saving") { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(230,50,50,0.35)"; }}}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        {pwStatus === "saving" ? "UPDATING..." : "UPDATE PASSWORD"}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
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