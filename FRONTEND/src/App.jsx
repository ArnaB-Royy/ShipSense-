import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

/* ---------- PAGE COMPONENTS ---------- */

const cardStyle = {
  background: "white",
  padding: "20px",
  marginTop: "20px",
  borderRadius: "10px",
  borderLeft: "5px solid gold",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};


const Dashboard = () => (
  <div className="page">
    <h1>Lady Whistledown's Logistics Dashboard</h1>
    <p>Welcome to the Royal Supply Chain Tracker.</p>

    <div style={cardStyle}>Total Shipments: 154</div>
    <div style={cardStyle}>Active Deliveries: 32</div>
    <div style={cardStyle}>Delayed Shipments: 5</div>
  </div>
);

const Shipments = () => (
  <div className="page">
    <h1>Royal Shipments Registry</h1>
    <p>View all shipments across the kingdom.</p>
  </div>
);

const CreateShipment = () => (
  <div className="page">
    <h1>Dispatch a New Shipment</h1>
    <p>Create and assign a new delivery order.</p>
  </div>
);

const ETAPrediction = () => (
  <div className="page">
    <h1>ETA Prediction Chamber</h1>
    <p>Consult the royal algorithm for delivery time predictions.</p>
  </div>
);

const Tracking = () => (
  <div className="page">
    <h1>Carriage Tracking</h1>
    <p>Observe your shipment's journey across the realm.</p>
  </div>
);

const DelayAnalytics = () => (
  <div className="page">
    <h1>Delay Scandal Reports</h1>
    <p>Discover the causes of delayed deliveries.</p>
  </div>
);

const Drivers = () => (
  <div className="page">
    <h1>Royal Couriers</h1>
    <p>Manage drivers and transport vehicles.</p>
  </div>
);

const Reports = () => (
  <div className="page">
    <h1>Kingdom Reports</h1>
    <p>Analytics and delivery performance insights.</p>
  </div>
);

const Settings = () => (
  <div className="page">
    <h1>Royal Settings</h1>
    <p>Adjust your account and system preferences.</p>
  </div>
);

/* ---------- SIDEBAR COMPONENT ---------- */

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">BridgerLogicx</h2>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/shipments">Shipments</Link>
        <Link to="/create">Create Shipment</Link>
        <Link to="/eta">ETA Prediction</Link>
        <Link to="/tracking">Tracking</Link>
        <Link to="/delays">Delay Analytics</Link>
        <Link to="/drivers">Drivers</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
};

/* ---------- MAIN APP ---------- */

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/create" element={<CreateShipment />} />
            <Route path="/eta" element={<ETAPrediction />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/delays" element={<DelayAnalytics />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;