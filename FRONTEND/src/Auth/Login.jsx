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
  orbA:        "rgba(230,50,50,0.1)",
  orbB:        "rgba(240,160,48,0.07)",
  inputBg:     "rgba(255,255,255,0.03)",
  inputBorder: "rgba(255,255,255,0.07)",
  inputColor:  "#e0d8d0",
  inputPh:     "#3a3030",
  inputFocusBorder: "rgba(230,50,50,0.5)",
  inputFocusBg:     "rgba(255,255,255,0.05)",
  inputFocusShadow: "rgba(230,50,50,0.06)",
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
  orbA:        "rgba(201,132,138,0.12)",
  orbB:        "rgba(196,163,90,0.08)",
  inputBg:     "#fff",
  inputBorder: "rgba(196,163,90,0.3)",
  inputColor:  "#2e2218",
  inputPh:     "#d6c9bc",
  inputFocusBorder: "rgba(196,163,90,0.6)",
  inputFocusBg:     "#fff",
  inputFocusShadow: "rgba(196,163,90,0.1)",
  font:        "'DM Sans', sans-serif",
};

export default function Login({ isDark = true }) {
  const T = isDark ? dark : light;
  const navigate = useNavigate();
  const [form, setForm] = useState({ Email: "", Password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!form.Email || !form.Password) { setError("All fields are required."); return; }
    try {
      setLoading(true);
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      localStorage.setItem("role", data.role);
      localStorage.setItem("userName", data.user.Name);
      if (data.role === "admin")         navigate("/admin");
      else if (data.role === "customer") navigate("/customer");
      else if (data.role === "supplier") navigate("/supplier");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.page, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:T.font, position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Dancing+Script:wght@600&display=swap');
        @keyframes pulseOrb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.7} }
        @keyframes gradFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .auth-input-${isDark?"d":"l"} {
          width:100%; padding:13px 16px;
          background:${T.inputBg};
          border:1px solid ${T.inputBorder};
          border-radius:8px; color:${T.inputColor};
          font-size:0.88rem; font-family:${T.font};
          box-sizing:border-box; transition:all 0.25s; outline:none;
        }
        .auth-input-${isDark?"d":"l"}:focus {
          border-color:${T.inputFocusBorder};
          background:${T.inputFocusBg};
          box-shadow:0 0 0 4px ${T.inputFocusShadow};
        }
        .auth-input-${isDark?"d":"l"}::placeholder { color:${T.inputPh}; }
        .auth-btn-${isDark?"d":"l"} {
          width:100%; padding:14px;
          background:${T.btnBg};
          border:none; border-radius:8px; color:#fff;
          font-size:0.82rem; font-weight:700; letter-spacing:2px;
          text-transform:uppercase; cursor:pointer; font-family:${T.font};
          transition:all 0.25s;
        }
        .auth-btn-${isDark?"d":"l"}:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,132,138,0.35); }
        .auth-btn-${isDark?"d":"l"}:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position:"fixed", top:"-100px", right:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:`radial-gradient(circle,${T.orbA},transparent 70%)`, animation:"pulseOrb 6s ease-in-out infinite", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-150px", left:"-100px", width:"500px", height:"500px", borderRadius:"50%", background:`radial-gradient(circle,${T.orbB},transparent 70%)`, animation:"pulseOrb 8s ease-in-out infinite reverse", pointerEvents:"none" }} />

      {/* Card */}
      <div style={{ width:"100%", maxWidth:"420px", background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:"16px", overflow:"hidden", position:"relative", zIndex:1, boxShadow: isDark ? "none" : "0 8px 40px rgba(201,132,138,0.1)" }}>

        <div style={{ height:"2px", background:T.bar, backgroundSize:"200%", animation:"gradFlow 3s ease infinite" }} />

        <div style={{ padding:"2.5rem" }}>
          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <div style={{ fontFamily:T.logoFont, fontSize:T.logoSize, letterSpacing:T.logoSpacing, fontWeight:600, background:T.logo, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {isDark ? "SHIPSENSE" : "ShipSense"}
            </div>
            <div style={{ fontSize:"0.65rem", letterSpacing:"3px", textTransform:"uppercase", color:T.subColor, marginTop:"4px", fontFamily:T.font }}>Supply Chain Intelligence</div>
          </div>

          <h2 style={{ fontFamily:T.headFont, fontSize:T.headSize, fontWeight:600, fontStyle: isDark ? "normal" : "italic", color:T.headColor, letterSpacing:T.headSpacing, marginBottom:"0.4rem" }}>
            {isDark ? "WELCOME BACK" : "Welcome Back"}
          </h2>
          <p style={{ fontSize:"0.78rem", color:T.subColor, marginBottom:"2rem", fontFamily:T.font }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ background:T.errBg, border:`1px solid ${T.errBorder}`, borderRadius:"8px", padding:"10px 14px", marginBottom:"1.2rem", fontSize:"0.8rem", color:T.errColor, fontFamily:T.font }}>
              {error}
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"1.5rem" }}>
            <div>
              <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.labelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>Email</label>
              <input className={`auth-input-${isDark?"d":"l"}`} type="email" placeholder="you@example.com" value={form.Email} onChange={e => setForm({ ...form, Email: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
            <div>
              <label style={{ fontSize:"0.65rem", letterSpacing:"2px", textTransform:"uppercase", color:T.labelColor, display:"block", marginBottom:"6px", fontFamily:T.font }}>Password</label>
              <input className={`auth-input-${isDark?"d":"l"}`} type="password" placeholder="••••••••" value={form.Password} onChange={e => setForm({ ...form, Password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          </div>

          <button className={`auth-btn-${isDark?"d":"l"}`} onClick={handleSubmit} disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

          <p style={{ textAlign:"center", fontSize:"0.78rem", color:T.subColor, marginTop:"1.5rem", fontFamily:T.font }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:T.linkColor, textDecoration:"none", fontWeight:600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}