import React, { useState, useEffect } from "react";
import { appointmentAPI, prescriptionAPI, billingAPI, labAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const PatientPortalDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appointmentAPI.list().then(r => setAppointments(r.data.results || r.data)),
      prescriptionAPI.list().then(r => setPrescriptions(r.data.results || r.data)),
      billingAPI.listInvoices().then(r => setInvoices(r.data.results || r.data)),
    ])
      .catch(() => toast.error("Failed to load some data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  const upcoming = appointments.filter(a => ["booked", "confirmed"].includes(a.status));
  const totalDue = invoices.reduce((s, i) => s + (parseFloat(i.total_amount || 0) - parseFloat(i.paid_amount || 0)), 0);

  return (
    <div className="fade-in">
      {/* Welcome header */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.first_name}! 👋</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className="badge badge-info" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>Patient Portal</span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <h4>Upcoming Appointments</h4>
            <div className="stat-value">{upcoming.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💊</div>
          <div className="stat-info">
            <h4>Prescriptions</h4>
            <div className="stat-value">{prescriptions.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">💰</div>
          <div className="stat-info">
            <h4>Balance Due</h4>
            <div className="stat-value">₹{totalDue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="card-header">
            <h3>📅 Upcoming Appointments</h3>
          </div>
          {upcoming.length > 0 ? (
            <div className="table-container">
              <table style={{ margin: 0 }}>
                <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
                <tbody>
                  {upcoming.slice(0, 5).map(a => (
                    <tr key={a.id}>
                      <td>Dr. {a.doctor_name}</td>
                      <td>{a.date}</td>
                      <td>{a.time_slot}</td>
                      <td><span className={`badge badge-${a.status === "confirmed" ? "success" : "info"}`}>{a.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 30 }}>
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="card">
          <div className="card-header">
            <h3>💊 Recent Prescriptions</h3>
          </div>
          {prescriptions.length > 0 ? (
            <div className="table-container">
              <table style={{ margin: 0 }}>
                <thead><tr><th>Doctor</th><th>Diagnosis</th><th>Date</th></tr></thead>
                <tbody>
                  {prescriptions.slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td>{p.doctor_name}</td>
                      <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.diagnosis?.substring(0, 40) || "—"}
                      </td>
                      <td>{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 30 }}>
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No prescriptions yet</p>
            </div>
          )}
        </div>



        {/* Billing Summary */}
        <div className="card">
          <div className="card-header">
            <h3>💰 Billing Summary</h3>
          </div>
          {invoices.length > 0 ? (
            <div className="table-container">
              <table style={{ margin: 0 }}>
                <thead><tr><th>Invoice</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {invoices.slice(0, 5).map(inv => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                      <td>₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${inv.status === "paid" ? "success" : inv.status === "partial" ? "warning" : "danger"}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 30 }}>
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No invoices yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPortalDashboard;
