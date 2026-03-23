import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DoctorsPage from "./pages/DoctorsPage";
import PatientsPage from "./pages/PatientsPage";

import AppointmentsPage from "./pages/AppointmentsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import BillingPage from "./pages/BillingPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import RoomsPage from "./pages/RoomsPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import PharmacyPage from "./pages/PharmacyPage";
import WritePrescriptionPage from "./pages/WritePrescriptionPage";
import AIDiseaseFinder from "./pages/AIDiseaseFinder";
import AIRiskAnalysis from "./pages/AIRiskAnalysis";
import AIDietPlanner from "./pages/AIDietPlanner";

import Layout from "./components/Layout";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // Redirect unauthorized users to dashboard
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  if (user) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
            <Layout>
              <DoctorsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor"]}>
            <Layout>
              <PatientsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor", "patient"]}>
            <Layout>
              <AppointmentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute allowedRoles={["admin", "doctor", "pharmacist", "patient"]}>
            <Layout>
              <PrescriptionsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist", "patient"]}>
            <Layout>
              <BillingPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
            <Layout>
              <DepartmentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
            <Layout>
              <RoomsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admissions"
        element={
          <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor", "patient"]}>
            <Layout>
              <AdmissionsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pharmacy"
        element={
          <ProtectedRoute allowedRoles={["admin", "pharmacist"]}>
            <Layout>
              <PharmacyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/write-prescription"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Layout>
              <WritePrescriptionPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/disease-finder"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Layout>
              <AIDiseaseFinder />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/risk-analysis"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Layout>
              <AIRiskAnalysis />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/diet-planner"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Layout>
              <AIDietPlanner />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
