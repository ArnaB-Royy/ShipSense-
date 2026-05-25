// Supplier/SupplierDashboardDark.jsx
import { useNavigate } from 'react-router-dom';

const AUTH_API = "http://localhost:5000/api/auth";

export default function SupplierDashboardDark() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${AUTH_API}/logout`, { method: "POST", credentials: "include" });
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07060a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "3rem",
          background: "linear-gradient(135deg, #e63232, #f0a030)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "2rem"
        }}>
          SUPPLIER PORTAL
        </h1>
        <p style={{ color: "#888", marginBottom: "2rem" }}>Coming soon.</p>
        <button onClick={handleLogout} style={{
          background: "linear-gradient(135deg, #e63232, #f0a030)",
          border: "none",
          borderRadius: "8px",
          padding: "0.75rem 2rem",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          cursor: "pointer"
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}