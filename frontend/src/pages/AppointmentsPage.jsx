import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { appointmentAPI, doctorAPI, patientAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AppointmentsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [form, setForm] = useState({
    patient: "",
    manual_patient_name: "",
    doctor: "",
    date: "",
    time_slot: "",
    reason: "",
  });
  const [isManual, setIsManual] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchData = () => {
    appointmentAPI
      .list({
        status: statusFilter || undefined,
        date: dateFilter || undefined,
      })
      .then((res) => setAppointments(res.data.results || res.data))
      .catch(() => toast.error("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    if (["admin", "receptionist"].includes(user?.role)) {
      doctorAPI
        .list()
        .then((r) => setDoctors(r.data.results || r.data))
        .catch(() => {});
      patientAPI
        .list()
        .then((r) => {
          const results = r.data.results || r.data;
          setPatients(results);

          // Check for patientId in URL
          const params = new URLSearchParams(location.search);
          const pid = params.get("patientId");
          if (pid) {
            setForm((prev) => ({ ...prev, patient: pid }));
            setShowModal(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setErrors({});
      const payload = { ...form };
      if (isManual) {
        payload.patient = null;
      } else {
        payload.manual_patient_name = null;
      }
      await appointmentAPI.create(payload);
      toast.success("Appointment booked!");
      setShowModal(false);
      setForm({
        patient: "",
        manual_patient_name: "",
        doctor: "",
        date: "",
        time_slot: "",
        reason: "",
      });
      setIsManual(false);
      setErrors({});
      fetchData();
    } catch (err) {
      const msg = err.response?.data;
      if (typeof msg === "string") {
        toast.error(msg);
      } else if (msg) {
        setErrors(msg);
        toast.error("Please check the form for errors");
      } else {
        toast.error(
          err.response?.data?.error || "Failed to create appointment",
        );
      }
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📅 Appointments</h1>
          <p>Schedule and manage appointments</p>
        </div>
        {["admin", "receptionist", "patient"].includes(user?.role) && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + New Appointment
          </button>
        )}
      </div>

      <div className="toolbar" style={{ display: "flex", gap: 10 }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "9px 14px",
            background: "var(--bg-input)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
        >
          <option value="">All Status</option>
          <option value="booked">Booked</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "8px 14px",
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-primary)",
              fontFamily: "inherit",
            }}
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              style={{
                position: "absolute",
                right: 35,
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              title="Clear date"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>{a.date}</td>
                  <td>{a.time_slot}</td>
                  <td>{a.reason || "—"}</td>
                  <td>
                    <span
                      className={`badge badge-${
                        a.status === "completed"
                          ? "success"
                          : a.status === "cancelled"
                            ? "danger"
                            : a.status === "in_progress"
                              ? "warning"
                              : "info"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {["admin", "doctor"].includes(user?.role) && (
                      <>
                        {a.status === "booked" && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => updateStatus(a.id, "confirmed")}
                              style={{ marginRight: 6 }}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStatus(a.id, "cancelled")}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {a.status === "confirmed" && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => updateStatus(a.id, "in_progress")}
                          >
                            Start
                          </button>
                        )}
                        {a.status === "in_progress" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => updateStatus(a.id, "completed")}
                          >
                            Complete
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>📅 Book Appointment</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <label style={{ marginBottom: 0, fontWeight: 600 }}>
                    Patient Type
                  </label>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isManual ? "var(--text-muted)" : "var(--accent)",
                        fontWeight: isManual ? 400 : 700,
                      }}
                    >
                      Registered Patient
                    </span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isManual}
                        onChange={(e) => setIsManual(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: isManual ? "var(--accent)" : "var(--text-muted)",
                        fontWeight: isManual ? 700 : 400,
                      }}
                    >
                      Manual Name Entry
                    </span>
                  </div>
                </div>

                {isManual ? (
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Enter patient full name..."
                      value={form.manual_patient_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          manual_patient_name: e.target.value,
                        })
                      }
                      required
                      className={
                        errors.manual_patient_name ? "input-error" : ""
                      }
                      style={{
                        borderColor: isManual
                          ? "var(--accent)"
                          : "var(--border)",
                        boxShadow: errors.manual_patient_name
                          ? "none"
                          : "0 0 0 3px var(--accent-light)",
                      }}
                    />
                    <small
                      style={{
                        color: "var(--accent)",
                        fontSize: "0.7rem",
                        position: "absolute",
                        right: 12,
                        top: 11,
                        fontWeight: 600,
                      }}
                    >
                      MANUAL
                    </small>
                    {errors.manual_patient_name && (
                      <span className="error-msg">
                        {Array.isArray(errors.manual_patient_name)
                          ? errors.manual_patient_name[0]
                          : errors.manual_patient_name}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <select
                      value={form.patient}
                      onChange={(e) =>
                        setForm({ ...form, patient: e.target.value })
                      }
                      required
                      className={errors.patient ? "input-error" : ""}
                    >
                      <option value="">Choose registered patient...</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name} ({p.email})
                        </option>
                      ))}
                    </select>
                    {errors.patient && (
                      <span className="error-msg">
                        {Array.isArray(errors.patient)
                          ? errors.patient[0]
                          : errors.patient}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  required
                  className={errors.doctor ? "input-error" : ""}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      Dr. {d.first_name} {d.last_name} — {d.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <span className="error-msg">
                    {Array.isArray(errors.doctor)
                      ? errors.doctor[0]
                      : errors.doctor}
                  </span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className={errors.date ? "input-error" : ""}
                  />
                  {errors.date && (
                    <span className="error-msg">
                      {Array.isArray(errors.date)
                        ? errors.date[0]
                        : errors.date}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Time Slot</label>
                  <select
                    value={form.time_slot}
                    onChange={(e) =>
                      setForm({ ...form, time_slot: e.target.value })
                    }
                    required
                    className={errors.time_slot ? "input-error" : ""}
                  >
                    <option value="">Select Time</option>
                    {[
                      "09:00",
                      "09:30",
                      "10:00",
                      "10:30",
                      "11:00",
                      "11:30",
                      "14:00",
                      "14:30",
                      "15:00",
                      "15:30",
                      "16:00",
                      "16:30",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.time_slot && (
                    <span className="error-msg">
                      {Array.isArray(errors.time_slot)
                        ? errors.time_slot[0]
                        : errors.time_slot}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Describe the reason for visit..."
                  className={errors.reason ? "input-error" : ""}
                />
                {errors.reason && (
                  <span className="error-msg">
                    {Array.isArray(errors.reason)
                      ? errors.reason[0]
                      : errors.reason}
                  </span>
                )}
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
