import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Auth
import Login from './Auth/Login';
import Register from './Auth/Register';

// Home
import HomePageDark from './Home/HomePageDark';
import HomePageLight from './Home/HomePageLight';

// Home Pages
import AboutPageDark from './Home/AboutPageDark';
import AboutPageLight from './Home/AboutPageLight';
import FeaturePageDark from './Home/FeaturePageDark';
import FeaturePageLight from './Home/FeaturePageLight';
import PartnersPageDark from './Home/PartnersPageDark';
import PartnersPageLight from './Home/PartnersPageLight';
import TeamPageDark from './Home/TeamPageDark';
import TeamPageLight from './Home/TeamPageLight';
import ContactPageDark from './Home/ContactPageDark';
import ContactPageLight from './Home/ContactPageLight';

// Admin
import AdminDashboardDark from './Admin/AdminDashboardDark';
import AdminDashboardLight from './Admin/AdminDashboardLight';
import ShipmentsPageDark from './Admin/Shipments/ShipmentsPageDark';
import ShipmentsPageLight from './Admin/Shipments/ShipmentsPageLight';
import AddShipmentDark from './Admin/Shipments/AddShipmentDark';
import AddShipmentLight from './Admin/Shipments/AddShipmentLight';
import DelayCodesPageDark from './Admin/DelayCodes/DelayCodesPageDark';
import DelayCodesPageLight from './Admin/DelayCodes/DelayCodesPageLight';
import AddDelayCodeDark from './Admin/DelayCodes/AddDelayCodeDark';
import AddDelayCodeLight from './Admin/DelayCodes/AddDelayCodeLight';
import UserManagementPageDark from './Admin/Users/UserManagementPageDark';
import UserManagementPageLight from './Admin/Users/UserManagementPageLight';
import AddUserDark from './Admin/Users/AddUserDark';
import AddUserLight from './Admin/Users/AddUserLight';
import ReportsPageDark from './Admin/Reports/ReportsPageDark';
import ReportsPageLight from './Admin/Reports/ReportsPageLight';

// Customer
import CustomerDashboardDark from './Customer/CustomerDashboardDark';
import CustomerDashboardLight from './Customer/CustomerDashboardLight';
import CustomerProfileDark from './Customer/Profile/CustomerProfileDark';
import CustomerProfileLight from './Customer/Profile/CustomerProfileLight';
import CustomerShipmentsDark from './Customer/Shipments/CustomerShipmentsDark';
import CustomerShipmentsLight from './Customer/Shipments/CustomerShipmentsLight';
import CustomerInvoicePageDark from './Customer/Invoice/CustomerInvoicePageDark';
import CustomerInvoicePageLight from './Customer/Invoice/CustomerInvoicePageLight';
import CustomerHelpPageDark from './Customer/Help/CustomerHelpPageDark';
import CustomerHelpPageLight from './Customer/Help/CustomerHelpPageLight';

// Supplier
import SupplierDashboardDark from './Supplier/SupplierDashboardDark';

// Global
import GlobalStyles from './GlobalStyles';

// ── Unauthorized Screen ───────────────────────────────────
const Unauthorized = ({ currentRole }) => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "3rem 2.5rem",
        maxWidth: "420px",
        width: "90%",
        textAlign: "center",
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)"
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.75rem" }}>
          Access Denied
        </h2>
        <p style={{ color: "#555", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          You're logged in as <strong>{currentRole}</strong>. You don't have the privileges to access this page.
        </p>
        <button
          onClick={() => navigate(`/${currentRole}`)}
          style={{
            background: "linear-gradient(135deg, #e63232, #f0a030)",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer"
          }}
        >
          Back to my dashboard
        </button>
      </div>
    </div>
  );
};

// ── Protected Route ───────────────────────────────────────
const ProtectedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem("role");
  if (!role) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Unauthorized currentRole={role} />;
  return children;
};

// ── Redirect if already logged in ────────────────────────
const RedirectIfLoggedIn = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role === "admin")    return <Navigate to="/admin" replace />;
  if (role === "customer") return <Navigate to="/customer" replace />;
  if (role === "supplier") return <Navigate to="/supplier" replace />;
  return children;
};

function App() {
  const [isLight, setIsLight] = useState(false);
  const toggleTheme = () => setIsLight(prev => !prev);

  return (
    <Router>
      <GlobalStyles />
      <Routes>

        {/* ─── AUTH ─── */}
        <Route path="/login"    element={<RedirectIfLoggedIn><Login    isDark={!isLight} /></RedirectIfLoggedIn>} />
        <Route path="/register" element={<RedirectIfLoggedIn><Register isDark={!isLight} /></RedirectIfLoggedIn>} />

        {/* ─── HOME ─── */}
        <Route path="/" element={
          isLight ? <HomePageLight toggleTheme={toggleTheme} /> : <HomePageDark toggleTheme={toggleTheme} />
        } />

        {/* ─── HOME PAGES ─── */}
        <Route path="/about" element={
          isLight ? <AboutPageLight toggleTheme={toggleTheme} /> : <AboutPageDark toggleTheme={toggleTheme} />
        } />
        <Route path="/features" element={
          isLight ? <FeaturePageLight toggleTheme={toggleTheme} /> : <FeaturePageDark toggleTheme={toggleTheme} />
        } />
        <Route path="/partners" element={
          isLight ? <PartnersPageLight toggleTheme={toggleTheme} /> : <PartnersPageLight toggleTheme={toggleTheme} />
        } />
        <Route path="/team" element={
          isLight ? <TeamPageLight toggleTheme={toggleTheme} /> : <TeamPageDark toggleTheme={toggleTheme} />
        } />
        <Route path="/contact" element={
          isLight ? <ContactPageLight toggleTheme={toggleTheme} /> : <ContactPageDark toggleTheme={toggleTheme} />
        } />

        {/* ─── ADMIN — protected ─── */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <AdminDashboardLight toggleTheme={toggleTheme} /> : <AdminDashboardDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/shipments" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <ShipmentsPageLight toggleTheme={toggleTheme} /> : <ShipmentsPageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/add-shipment" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <AddShipmentLight toggleTheme={toggleTheme} /> : <AddShipmentDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/delay-codes" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <DelayCodesPageLight toggleTheme={toggleTheme} /> : <DelayCodesPageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/add-delay-code" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <AddDelayCodeLight toggleTheme={toggleTheme} /> : <AddDelayCodeDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/user-management" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <UserManagementPageLight toggleTheme={toggleTheme} /> : <UserManagementPageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/add-user" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <AddUserLight toggleTheme={toggleTheme} /> : <AddUserDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRole="admin">
            {isLight ? <ReportsPageLight toggleTheme={toggleTheme} /> : <ReportsPageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />

        {/* ─── CUSTOMER — protected ─── */}
        <Route path="/customer" element={
          <ProtectedRoute allowedRole="customer">
            {isLight ? <CustomerDashboardLight toggleTheme={toggleTheme} /> : <CustomerDashboardDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/customer/profile" element={
          <ProtectedRoute allowedRole="customer">
            {isLight ? <CustomerProfileLight toggleTheme={toggleTheme} /> : <CustomerProfileDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/customer/shipments" element={
          <ProtectedRoute allowedRole="customer">
            {isLight ? <CustomerShipmentsLight toggleTheme={toggleTheme} /> : <CustomerShipmentsDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/customer/invoice" element={
          <ProtectedRoute allowedRole="customer">
            {isLight ? <CustomerInvoicePageLight toggleTheme={toggleTheme} /> : <CustomerInvoicePageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />
        <Route path="/customer/help" element={
          <ProtectedRoute allowedRole="customer">
            {isLight ? <CustomerHelpPageLight toggleTheme={toggleTheme} /> : <CustomerHelpPageDark toggleTheme={toggleTheme} />}
          </ProtectedRoute>
        } />

        {/* ─── SUPPLIER — protected ─── */}
        <Route path="/supplier" element={
          <ProtectedRoute allowedRole="supplier">
            <SupplierDashboardDark />
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;