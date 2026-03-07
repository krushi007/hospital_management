import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

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
      { path: "/admissions", label: "Admissions", icon: "" },
      { path: "/pharmacy", label: "Pharmacy", icon: "" },
    ],
    doctor: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "My Work" },
      { path: "/appointments", label: "My Appointments", icon: "" },
      { path: "/write-prescription", label: "Write Prescription", icon: "" },
      { section: "AI Tools" },
      { path: "/ai/disease-finder", label: "Disease Finder", icon: "" },
      { path: "/ai/risk-analysis", label: "Risk Analysis", icon: "" },
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
    ],
    pharmacist: [
      { section: "Overview" },
      { path: "/", label: "Dashboard", icon: "" },
      { section: "Pharmacy" },
      { path: "/pharmacy", label: "Prescriptions & Orders", icon: "" },
    ],
  };

  const items = navItems[user?.role] || navItems.receptionist;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>MedCore HMS</h2>
          <small>Hospital Management System</small>
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
            <div className="user-avatar">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </div>
            <div className="user-details">
              <h4>
                {user?.first_name} {user?.last_name}
              </h4>
              <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
            </div>
          </div>
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
    </div>
  );
};

export default Layout;
