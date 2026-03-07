import React, { useState, useEffect } from "react";
import { admissionAPI, patientAPI, roomAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AdmissionsPage = () => {
  const { user } = useAuth();
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    patient: "",
    room: "",
    admit_date: "",
    reason: "",
    notes: "",
  });

  const fetchAll = () => {
    Promise.all([
      admissionAPI.list({ status: filter || undefined }),
      patientAPI.list(),
      roomAPI.list({ available: "true" }),
    ])
      .then(([adm, pat, rm]) => {
        setAdmissions(adm.data.results || adm.data || []);
        setPatients(pat.data.results || pat.data || []);
        setRooms(rm.data.results || rm.data || []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, [filter]);

  const today = new Date().toISOString().split("T")[0];

  const handleAdmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, admit_date: form.admit_date || today };
      await admissionAPI.create(data);
      toast.success("Patient admitted!");
      setShowModal(false);
      setForm({ patient: "", room: "", admit_date: "", reason: "", notes: "" });
      fetchAll();
    } catch (err) {
      const msg = err.response?.data;
      if (msg) {
        const k = Object.keys(msg)[0];
        toast.error(`${k}: ${Array.isArray(msg[k]) ? msg[k][0] : msg[k]}`);
      } else toast.error("Failed to admit patient");
    }
  };

  const handleDischarge = async (admission) => {
    const result = await Swal.fire({
      title: "Discharge Patient?",
      html: `<p style="color:#94a3b8">Discharge <strong>${admission.patient_name}</strong> from Room <strong>${admission.room_number}</strong>?</p>
                   <p style="color:#94a3b8;margin-top:8px">Total: <strong>${admission.total_days} days × ₹${admission.rate_per_day} = ₹${admission.total_amount.toLocaleString()}</strong></p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Discharge",
      background: "#1e293b",
      color: "#f1f5f9",
    });
    if (!result.isConfirmed) return;
    try {
      await admissionAPI.discharge(admission.id, { discharge_date: today });
      toast.success(
        `${admission.patient_name} discharged! Bill: ₹${admission.total_amount.toLocaleString()}`,
      );
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to discharge");
    }
  };

  const canManage = user?.role === "admin" || user?.role === "receptionist";

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );

  // Stats
  const admitted = admissions.filter((a) => a.status === "admitted");
  const totalBilling = admissions.reduce(
    (sum, a) => sum + (a.total_amount || 0),
    0,
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admissions</h1>
          <p>Track patient room assignments and billing</p>
        </div>
        {canManage && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Admit Patient
          </button>
        )}
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          className="stat-card"
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Currently Admitted
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {admitted.length}
          </div>
        </div>
        <div
          className="stat-card"
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Total Admissions
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            {admissions.length}
          </div>
        </div>
        <div
          className="stat-card"
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Total Billing
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#22c55e" }}
          >
            ₹{totalBilling.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 16 }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">All Admissions</option>
          <option value="admitted">Currently Admitted</option>
          <option value="discharged">Discharged</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Room</th>
              <th>Type</th>
              <th>Department</th>
              <th>Admitted</th>
              <th>Discharged</th>
              <th>Days</th>
              <th>Rate/Day</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.length > 0 ? (
              admissions.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.patient_name}</strong>
                  </td>
                  <td>{a.room_number}</td>
                  <td>{a.room_type}</td>
                  <td>{a.department_name}</td>
                  <td>{a.admit_date}</td>
                  <td>{a.discharge_date || "—"}</td>
                  <td>
                    <strong>{a.total_days || 0}</strong>
                  </td>
                  <td>₹{parseFloat(a.rate_per_day || 0).toLocaleString()}</td>
                  <td style={{ fontWeight: 700, color: "#22c55e" }}>
                    ₹{(a.total_amount || 0).toLocaleString()}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        background:
                          a.status === "admitted"
                            ? "rgba(59,130,246,0.15)"
                            : "rgba(34,197,94,0.15)",
                        color: a.status === "admitted" ? "#3b82f6" : "#22c55e",
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status === "admitted" && canManage && (
                      <button
                        onClick={() => handleDischarge(a)}
                        style={{
                          background: "#22c55e",
                          color: "#fff",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        Discharge
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  No admissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Admit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Admit Patient</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAdmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select
                  value={form.patient}
                  onChange={(e) =>
                    setForm({ ...form, patient: e.target.value })
                  }
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} — {p.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Room * (available only)</label>
                <select
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.room_number} — {r.department_name} (
                      {r.room_type === "general"
                        ? "General"
                        : r.room_type === "private"
                          ? "Private"
                          : r.room_type === "icu"
                            ? "ICU"
                            : r.room_type}
                      ) — ₹{parseFloat(r.rate_per_day).toLocaleString()}/day —{" "}
                      {r.capacity - r.occupied} beds free
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Admit Date</label>
                  <input
                    type="date"
                    value={form.admit_date || today}
                    onChange={(e) =>
                      setForm({ ...form, admit_date: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Reason</label>
                  <input
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                    placeholder="e.g., Surgery, Observation"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Admit Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsPage;
