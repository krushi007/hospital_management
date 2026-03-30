import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";
import NotificationBell from "./NotificationBell";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const getRoleAvatar = (role) => {
    switch (role) {
      case 'admin': return 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4';
      case 'doctor': return 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor&backgroundColor=c0aede';
      case 'receptionist': return 'https://api.dicebear.com/7.x/avataaars/svg?seed=receptionist&backgroundColor=ffdfbf';
      case 'pharmacist': return 'https://api.dicebear.com/7.x/avataaars/svg?seed=pharmacist&backgroundColor=d1d4f9';
      case 'patient': return 'https://api.dicebear.com/7.x/avataaars/svg?seed=patient&backgroundColor=b6e3f4';
      default: return 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=e2e8f0';
    }
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const navItems = {
    admin: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "Management" },
      { path: "/doctors", label: "Doctors", icon: "" },
      { path: "/patients", label: "Patients", icon: "" },
      { path: "/appointments", label: "Appointments", icon: "" },
      { path: "/billing", label: "Billing", icon: "" },
      { path: "/departments", label: "Departments", icon: "" },
      { path: "/rooms", label: "Rooms", icon: "" },
      { path: "/leaves", label: "Staff Leaves", icon: "" },
      { path: "/admissions", label: "Admissions", icon: "" },
      { path: "/labs", label: "Lab Tests", icon: "" },
      { path: "/pharmacy", label: "Pharmacy", icon: "" },
    ],
    doctor: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "My Work" },
      { path: "/appointments", label: "My Appointments", icon: "" },
      { path: "/write-prescription", label: "Write Prescription", icon: "" },
      { path: "/leaves", label: "My Leaves", icon: "" },
      { section: "AI Tools" },
      { path: "/ai/disease-finder", label: "Disease Finder", icon: "" },
      { path: "/ai/risk-analysis", label: "Risk Analysis", icon: "" },
      { path: "/ai/diet-planner", label: "Diet Planner", icon: "" },
      { section: "Integrations" },
      { path: "/labs", label: "Lab Tests", icon: "" },
    ],
    receptionist: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "Operations" },
      { path: "/patients", label: "Patients", icon: "" },
      { path: "/appointments", label: "Appointments", icon: "" },
      { path: "/billing", label: "Billing", icon: "" },
      { path: "/rooms", label: "Rooms", icon: "" },
      { path: "/admissions", label: "Admissions", icon: "" },
      { path: "/labs", label: "Lab Tests", icon: "" },
    ],
    pharmacist: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "Pharmacy" },
      { path: "/pharmacy", label: "Prescriptions & Orders", icon: "" },
    ],
    patient: [
      { section: "My Health" },
      { path: "/", label: "My Dashboard", icon: "" },
      { path: "/appointments", label: "My Appointments", icon: "" },
      { path: "/prescriptions", label: "My Prescriptions", icon: "" },
      { path: "/billing", label: "My Bills", icon: "" },
    ],
  };

  const items = navItems[user?.role] || navItems.receptionist;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2>MedCore HMS</h2>
              <small>Hospital Management System</small>
            </div>
            <NotificationBell />
          </div>
        </div>

        <nav className="sidebar-nav">
          {items.map((item, i) =>
            item.section ? (
              <div key={i} className="sidebar-section">
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={isActive(item.path)}
                end={item.path === "/"}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar" style={{ padding: 0, overflow: 'hidden', background: '#e2e8f0' }}>
              <img 
                src={user?.avatar || getRoleAvatar(user?.role)} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div className="user-details">
              <h4>
                {user?.first_name} {user?.last_name}
              </h4>
              <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
            </div>
          </div>
          <button
            className="btn btn-primary btn-block btn-sm"
            onClick={() => setIsChangePasswordOpen(true)}
            style={{ marginTop: 15 }}
          >
            Change Password
          </button>
          <button
            className="btn btn-secondary btn-block btn-sm"
            onClick={logout}
            style={{ marginTop: 10 }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Layout;
