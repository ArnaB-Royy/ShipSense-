import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

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

// Customer — Components (navbar/sidebar not used as standalone routes)
import CustomerSidebarDark from "./Customer/Components/CustomerSidebarDark"; 
import CustomerNavbarDark from "./Customer/Components/CustomerNavbarDark"; 
import CustomerSidebarLight from "./Customer/Components/CustomerSidebarLight"; 
import CustomerNavbarLight from "./Customer/Components/CustomerNavbarLight";


// Customer — Pages
import CustomerDashboardDark from './Customer/CustomerDashboardDark';
import CustomerDashboardLight from './Customer/CustomerDashboardLight';
import CustomerNotificationsDark from './Customer/Notifications/CustomerNotificationsDark';
import CustomerNotificationsLight from './Customer/Notifications/CustomerNotificationsLight';
import CustomerProfileDark from './Customer/Profile/CustomerProfileDark';
import CustomerProfileLight from './Customer/Profile/CustomerProfileLight';
import CustomerShipmentsDark from './Customer/Shipments/CustomerShipmentsDark';
import CustomerShipmentsLight from './Customer/Shipments/CustomerShipmentsLight';
import CustomerTrackingDark from './Customer/Tracking/CustomerTrackingDark';
import CustomerTrackingLight from './Customer/Tracking/CustomerTrackingLight';

// Global
import GlobalStyles from './GlobalStyles';

function App() {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => setIsLight(prev => !prev);

  return (
    <Router>
      <GlobalStyles />
      <Routes>

        {/* ─── HOME ─── */}
        <Route path="/" element={
          isLight
            ? <HomePageLight toggleTheme={toggleTheme} />
            : <HomePageDark toggleTheme={toggleTheme} />
        } />

        {/* ─── HOME PAGES ─── */}
        <Route path="/about" element={
          isLight
            ? <AboutPageLight toggleTheme={toggleTheme} />
            : <AboutPageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/features" element={
          isLight
            ? <FeaturePageLight toggleTheme={toggleTheme} />
            : <FeaturePageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/partners" element={
          isLight
            ? <PartnersPageLight toggleTheme={toggleTheme} />
            : <PartnersPageLight toggleTheme={toggleTheme} />
        } />

        <Route path="/team" element={
          isLight
            ? <TeamPageLight toggleTheme={toggleTheme} />
            : <TeamPageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/contact" element={
          isLight
            ? <ContactPageLight toggleTheme={toggleTheme} />
            : <ContactPageDark toggleTheme={toggleTheme} />
        } />

        {/* ─── ADMIN ─── */}
        <Route path="/admin" element={
          isLight
            ? <AdminDashboardLight toggleTheme={toggleTheme} />
            : <AdminDashboardDark toggleTheme={toggleTheme} />
        } />

        {/* ─── ADMIN PAGES ─── */}
        <Route path="/admin/shipments" element={
          isLight
            ? <ShipmentsPageLight toggleTheme={toggleTheme} />
            : <ShipmentsPageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/admin/add-shipment" element={
          isLight
            ? <AddShipmentLight toggleTheme={toggleTheme} />
            : <AddShipmentDark toggleTheme={toggleTheme} />
        } />

        <Route path="/admin/delay-codes" element={
          isLight
            ? <DelayCodesPageLight toggleTheme={toggleTheme} />
            : <DelayCodesPageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/admin/add-delay-code" element={
          isLight
            ? <AddDelayCodeLight toggleTheme={toggleTheme} />
            : <AddDelayCodeDark toggleTheme={toggleTheme} />
        } />

        <Route path="/admin/user-management" element={
          isLight
            ? <UserManagementPageLight toggleTheme={toggleTheme} />
            : <UserManagementPageDark toggleTheme={toggleTheme} />
        } />

        <Route path="/admin/add-user" element={
          isLight
            ? <AddUserLight toggleTheme={toggleTheme} />
            : <AddUserDark toggleTheme={toggleTheme} />
        } />


        {/* ─── CUSTOMER PAGES ─── */}
        {/* Each customer page is self-contained with its own navbar (no shared layout wrapper) */}

        <Route path="/customer" element={
          isLight
            ? <CustomerDashboardLight toggleTheme={toggleTheme} />
            : <CustomerDashboardDark toggleTheme={toggleTheme} />
        } />

        <Route path="/customer/notifications" element={
          isLight
            ? <CustomerNotificationsLight toggleTheme={toggleTheme} />
            : <CustomerNotificationsDark toggleTheme={toggleTheme} />
        } />

        <Route path="/customer/profile" element={
          isLight
            ? <CustomerProfileLight toggleTheme={toggleTheme} />
            : <CustomerProfileDark toggleTheme={toggleTheme} />
        } />

        <Route path="/customer/shipments" element={
          isLight
            ? <CustomerShipmentsLight toggleTheme={toggleTheme} />
            : <CustomerShipmentsDark toggleTheme={toggleTheme} />
        } />

        <Route path="/customer/tracking" element={
          isLight
            ? <CustomerTrackingLight toggleTheme={toggleTheme} />
            : <CustomerTrackingDark toggleTheme={toggleTheme} />
        } />
        
        
      </Routes>
    </Router>
  );
}

export default App;