import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5000/api/auth";

const dark = {
  page:        "#07060a",
  card:        "linear-gradient(145deg,rgba(255,255,255,0.025),rgba(230,50,50,0.015))",
  cardBorder:  "rgba(255,255,255,0.07)",
  bar:         "linear-gradient(90deg,#e63232,#f0a030,#e63232)",
  logo:        "linear-gradient(90deg,#e63232,#f0a030)",
  logoFont:    "'Bebas Neue',sans-serif",
  logoSize:    "2rem",
  logoSpacing: "6px",
  subColor:    "#4a3a3a",
  headColor:   "#e0d8d0",
  headFont:    "'Bebas Neue',sans-serif",
  headSize:    "1.8rem",
  headSpacing: "3px",
  labelColor:  "#6a5a50",
  linkColor:   "#f0a030",
  btnBg:       "linear-gradient(135deg,#e63232,#f0a030)",
  errBg:       "rgba(248,113,113,0.08)",
  errBorder:   "rgba(248,113,113,0.2)",
  errColor:    "#f87171",
  successBg:   "rgba(74,222,128,0.08)",
  successBorder:"rgba(74,222,128,0.2)",
  successColor: "#4ade80",
  orbA:        "rgba(230,50,50,0.1)",
  orbB:        "rgba(240,160,48,0.07)",
  inputBg:     "rgba(255,255,255,0.03)",
  inputBorder: "rgba(255,255,255,0.07)",
  inputColor:  "#e0d8d0",
  inputPh:     "#3a3030",
  inputFocusBorder: "rgba(230,50,50,0.5)",
  inputFocusBg:     "rgba(255,255,255,0.05)",
  inputFocusShadow: "rgba(230,50,50,0.06)",
  selectBg:    "#0f0d13",
  selectColor: "#e0d8d0",
  adminLabelColor: "#f87171",
  adminBorder: "rgba(248,113,113,0.3)",
  adminFocusBorder: "rgba(248,113,113,0.6)",
  adminWarning: "#6a3a3a",
  arrowColor:  "#6a5a50",
  font:        "'Inter',sans-serif",
};

const light = {
  page:        "#faf6f0",
  card:        "rgba(255,250,245,0.92)",
  cardBorder:  "rgba(201,132,138,0.25)",
  bar:         "linear-gradient(90deg,#c9848a,#c4a35a,#c9848a)",
  logo:        "linear-gradient(90deg,#c9848a,#c4a35a)",
  logoFont:    "'Dancing Script', cursive",
  logoSize:    "2.4rem",
  logoSpacing: "1px",
  subColor:    "#a8917a",
  headColor:   "#2e2218",
  headFont:    "'Cormorant Garamond', serif",
  headSize:    "2rem",
  headSpacing: "1px",
  labelColor:  "#a8917a",
  linkColor:   "#c4a35a",
  btnBg:       "linear-gradient(135deg,#c9848a,#c4a35a)",
  errBg:       "rgba(201,132,138,0.08)",
  errBorder:   "rgba(201,132,138,0.25)",
  errColor:    "#a85f65",
  successBg:   "rgba(138,158,122,0.1)",
  successBorder:"rgba(138,158,122,0.3)",
  successColor: "#5a7a4a",
  orbA:        "rgba(201,132,138,0.12)",
  orbB:        "rgba(196,163,90,0.08)",
  inputBg:     "#fff",
  inputBorder: "rgba(196,163,90,0.3)",
  inputColor:  "#2e2218",
  inputPh:     "#d6c9bc",
  inputFocusBorder: "rgba(196,163,90,0.6)",
  inputFocusBg:     "#fff",
  inputFocusShadow: "rgba(196,163,90,0.1)",
  selectBg:    "#faf6f0",
  selectColor: "#2e2218",
  adminLabelColor: "#a85f65",
  adminBorder: "rgba(201,132,138,0.35)",
  adminFocusBorder: "rgba(201,132,138,0.6)",
  adminWarning: "#a8917a",
  arrowColor:  "#a8917a",
  font:        "'DM Sans', sans-serif",
};

export default function Register({ isDark = true }) {
  const T = isDark ? dark : light;
  const cls = isDark ? "d" : "l";
  const navigate = useNavigate();
  const [form, setForm] = useState({ Name: "", Email: "", Password: "", Role: "customer", Company: "", adminSecret: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.Name || !form.Email || !form.Password || !form.Role) { setError("All fields are required."); return; }
    if (form.Role === "admin" && !form.adminSecret) { setError("Admin secret key is required."); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.page, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T.font, position:"relative", overflow:"hidden", padding:"2rem 0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseOrb { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes gradFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .auth-input-${cls} {
          width:100%; padding:13px 16px;
          background:${T.inputBg};
          border:1px solid ${T.inputBorder};
          border-radius:8px; color:${T.inputColor};
          font-size:0.88rem; font-family:${T.font};
          box-sizing:border-box; transition:all 0.25s; outline:none;
        }
        .auth-input-${cls}:focus {
          border-color:${T.inputFocusBorder};
          background:${T.inputFocusBg};
          box-shadow:0 0 0 4px ${T.inputFocusShadow};
        }
        .auth-input-${cls}::placeholder { color:${T.inputPh}; }
        .auth-select-${cls} {
          width:100%; padding:13px 16px;
          background:${T.inputBg};
          border:1px solid ${T.inputBorder};
          border-radius:8px; color:${T.inputColor};
          font-size:0.88rem; font-family:${T.font};
          box-sizing:border-box; transition:all 0.25s; outline:none;
          cursor:pointer; appearance:none;
        }
        .auth-select-${cls}:focus {
          border-color:${T.inputFocusBorder};
          background:${T.inputFocusBg};
          box-shadow:0 0 0 4px ${T.inputFocusShadow};
        }
        .auth-select-${cls} option { background:${T.selectBg}; color:${T.selectColor}; }
        .auth-btn-${cls} {
          width:100%; padding:14px;
          background:${T.btnBg};
          border:none; border-radius:8px; color:#fff;
          font-size:0.82rem; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; cursor:pointer; font-family:${T.font};
          transition:all 0.25s;
        }
        .auth-btn-${cls}:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,132,138,0.35); }
        .auth-btn-${cls}:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
      `}</style>

      <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:`radial-gradient(circle,${T.orbA},transparent 70%)`, animation:"pulseOrb 6s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-150px", left:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:`radial-gradient(circle,${T.orbB},transparent 70%)`, animation:"pulseOrb 8s ease-in-out infinite reverse", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"440px", background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"16px", overflow:"hidden", position:"relative", zIndex:1, boxShadow: isDark ? "none" : "0 8px 40px rgba(201,132,138,0.1)" }}>
        <div style={{ height:"2px", background:T.bar, backgroundSize:"200%", animation:"gradFlow 3s ease infinite" }} />

        <div style={{ padding:"2.5rem" }}>
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <div style={{ fontFamily:T.logoFont, fontSize:T.logoSize, letterSpacing:T.logoSpacing, fontWeight:600, background:T.logo, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {isDark ? "SHIPSENSE" : "ShipSense"}
            </div>
            <div style={{ fontSize:"0.65rem", letterSpacing:"3px", textTransform:"uppercase", color:T.subColor, marginTop:"4px", fontFamily:T.font }}>Supply Chain Intelligence</div>
          </div>

          <h2 style={{ fontFamily:T.headFont, fontSize:T.headSize, fontWeight:600, fontStyle: isDark ? "normal" : "italic", color:T.headColor, letterSpacing:T.headSpacing, marginBottom:"0.4rem" }}>
            {isDark ? "CREATE ACCOUNT" : "Create Account"}
          </h2>
          <p style={{ fontSize:"0.78rem", color:T.subColor, marginBottom:"2rem", fontFamily:T.font }}>Join ShipSense to track your supply chain</p>

          {error && (
            <div style={{ background:T.errBg, border:`1px solid ${T.errBorder}`, borderRadius:"8px", padding:"10px 14px", marginBottom:"1.2rem", fontSize:"0.8rem", color:T.errColor, fontFamily:T.font }}>{error}</div>
          )}
          {success && (
            <div style={{ background:T.successBg, border:`1px solid ${T.successBorder}`, borderRadius:"8px", padding:"10px 14px", marginBottom:"1.2rem", fontSize:"0.8rem", color:T.successColor, fontFamily:T.font }}>{success}</div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"1.5rem" }}>
            {[
              { label:"Full Name",  key:"Name",     type:"text",     ph:"John Doe"          },
              { label:"Email",      key:"Email",    type:"email",    ph:"you@example.com"   },
              { label:"Password",   key:"Password", type:"password", ph:"••••••••"          },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.labelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>{f.label}</label>
                <input className={`auth-input-${cls}`} type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}

            {/* Role */}
            <div>
              <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.labelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>Role</label>
              <div style={{ position:"relative" }}>
                <select className={`auth-select-${cls}`} value={form.Role} onChange={e => setForm({ ...form, Role: e.target.value, adminSecret: "" })}>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="admin">Admin</option>
                </select>
                <div style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:T.arrowColor, fontSize:"0.7rem" }}>▼</div>
              </div>
            </div>

            {/* Company — supplier only */}
            {form.Role === "supplier" && (
              <div>
                <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.labelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>Company Name</label>
                <input className={`auth-input-${cls}`} type="text" placeholder="Your company" value={form.Company} onChange={e => setForm({ ...form, Company: e.target.value })} />
              </div>
            )}

            {/* Admin secret — admin only */}
            {form.Role === "admin" && (
              <div>
                <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.adminLabelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>Admin Secret Key</label>
                <input
                  className={`auth-input-${cls}`} type="password"
                  placeholder="Enter admin secret key"
                  value={form.adminSecret}
                  onChange={e => setForm({ ...form, adminSecret: e.target.value })}
                  style={{ borderColor:T.adminBorder }}
                  onFocus={e => e.target.style.borderColor = T.adminFocusBorder}
                  onBlur={e => e.target.style.borderColor = T.adminBorder}
                />
                <div style={{ fontSize:"0.68rem", color:T.adminWarning, marginTop:"5px", fontFamily:T.font }}>⚠️ Only authorized personnel can create admin accounts.</div>
              </div>
            )}
          </div>

          <button className={`auth-btn-${cls}`} onClick={handleSubmit} disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <p style={{ textAlign:"center", fontSize:"0.78rem", color:T.subColor, marginTop:"1.5rem", fontFamily:T.font }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color:T.linkColor, textDecoration:"none", fontWeight:600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}