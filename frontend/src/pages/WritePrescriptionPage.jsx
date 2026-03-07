import React, { useState, useEffect } from "react";
import { prescriptionAPI, appointmentAPI, pharmacyAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const WritePrescriptionPage = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]); // all statuses for linked appt
  const [inProgressAppointments, setInProgressAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [medSearch, setMedSearch] = useState("");

  const [form, setForm] = useState({
    patient: "",
    appointment: "",
    diagnosis: "",
    notes: "",
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ],
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      prescriptionAPI.list(),
      appointmentAPI.list(), // all appointments → for patient dropdown
      appointmentAPI.list({ status: "in_progress" }), // for linked appointment
      pharmacyAPI.listMedicines(),
    ])
      .then(([rx, allAppt, inProgressAppt, med]) => {
        setPrescriptions(rx.data.results || rx.data || []);

        // Derive unique patients from this doctor's appointments
        const allAppts = allAppt.data.results || allAppt.data || [];
        const uniquePatients = [];
        const seen = new Set();
        allAppts.forEach((a) => {
          const key = a.patient_id || a.manual_patient_name;
          if (key && !seen.has(key)) {
            seen.add(key);
            uniquePatients.push({
              id: a.patient_id,
              manual_name: a.manual_patient_name,
              display_name: a.patient_name,
            });
          }
        });
        setPatients(uniquePatients);

        setAppointments(allAppts);
        setInProgressAppointments(
          inProgressAppt.data.results || inProgressAppt.data || [],
        );
        setMedicines(med.data.results || med.data || []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Check if a medicine is available in pharmacy
  const getMedicineStatus = (name) => {
    if (!name) return null;
    const match = medicines.find((m) =>
      m.name.toLowerCase().includes(name.toLowerCase()),
    );
    if (!match)
      return { found: false, text: "Not in pharmacy", color: "#f59e0b" };
    if (match.stock > 0)
      return {
        found: true,
        text: `✓ Available (${match.stock} in stock) — ₹${parseFloat(match.price)}`,
        color: "#22c55e",
      };
    return { found: true, text: "✗ Out of Stock", color: "#ef4444" };
  };

  const addMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications,
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
    });
  };

  const removeMedication = (index) => {
    if (form.medications.length === 1) return;
    const meds = [...form.medications];
    meds.splice(index, 1);
    setForm({ ...form, medications: meds });
  };

  const updateMedication = (index, field, value) => {
    const meds = [...form.medications];
    meds[index][field] = value;
    setForm({ ...form, medications: meds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.patient ||
      !form.diagnosis ||
      form.medications.every((m) => !m.name)
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const data = {
        patient: form.patient,
        appointment: form.appointment || null,
        diagnosis: form.diagnosis,
        notes: form.notes,
        medications: form.medications.filter((m) => m.name),
      };
      await prescriptionAPI.create(data);
      toast.success("Prescription sent to Pharmacy!");
      setShowModal(false);
      setForm({
        patient: "",
        appointment: "",
        diagnosis: "",
        notes: "",
        medications: [
          {
            name: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: "",
          },
        ],
      });
      fetchData();
    } catch (err) {
      const msg = err.response?.data;
      if (msg) {
        const k = Object.keys(msg)[0];
        toast.error(`${k}: ${Array.isArray(msg[k]) ? msg[k][0] : msg[k]}`);
      } else toast.error("Failed to create prescription");
    }
  };

  // Get medicine suggestions while typing
  const getSuggestions = (query) => {
    if (!query || query.length < 2) return [];
    return medicines
      .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
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
          <h1>Prescriptions</h1>
          <p>Write and manage patient prescriptions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Write Prescription
        </button>
      </div>

      {/* Prescriptions Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Rx #</th>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Medications</th>
              <th>Date</th>
              <th>Pharmacy Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.length > 0 ? (
              prescriptions.map((rx) => (
                <tr key={rx.id}>
                  <td>
                    <strong>Rx-{rx.id}</strong>
                  </td>
                  <td>{rx.patient_name}</td>
                  <td>{rx.diagnosis?.substring(0, 50)}</td>
                  <td>
                    {(rx.medications || []).map((m, i) => {
                      const status = getMedicineStatus(m.name);
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              background: "rgba(59,130,246,0.12)",
                              color: "#3b82f6",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: "0.75rem",
                            }}
                          >
                            {m.name}
                          </span>
                          {status && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                color: status.color,
                                fontWeight: 600,
                              }}
                            >
                              {status.found
                                ? status.text.startsWith("✓")
                                  ? "✓ Available"
                                  : "✗ Out of Stock"
                                : "⚠ Not in pharmacy"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {rx.created_at?.split("T")[0]}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        color: "#22c55e",
                        fontWeight: 600,
                      }}
                    >
                      Sent to Pharmacy
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  No prescriptions yet. Click "+ Write Prescription" to create
                  one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Write Prescription Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 700 }}
          >
            <div className="modal-header">
              <h2>Write Prescription</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
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
                    {patients
                      .filter((p) => {
                        // Exclude patients who already have a prescription from this doctor
                        const alreadyPrescribed = prescriptions.some(
                          (rx) =>
                            rx.patient_id === p.id ||
                            rx.patient_name === p.display_name,
                        );
                        return !alreadyPrescribed;
                      })
                      .map((p, idx) => (
                        <option key={idx} value={p.id || p.manual_name}>
                          {p.display_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Linked Appointment (optional)</label>
                  <select
                    value={form.appointment}
                    onChange={(e) =>
                      setForm({ ...form, appointment: e.target.value })
                    }
                  >
                    <option value="">None</option>
                    {inProgressAppointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.patient_name} — {a.date} {a.time_slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Diagnosis *</label>
                <textarea
                  value={form.diagnosis}
                  onChange={(e) =>
                    setForm({ ...form, diagnosis: e.target.value })
                  }
                  placeholder="e.g., Viral fever with cough"
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ fontWeight: 600, marginBottom: 8, display: "block" }}
                >
                  Medications *
                </label>
                {form.medications.map((med, i) => {
                  const status = getMedicineStatus(med.name);
                  return (
                    <div
                      key={i}
                      style={{
                        background: "var(--bg-primary)",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                          }}
                        >
                          Medicine {i + 1}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {status && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                color: status.color,
                                padding: "2px 8px",
                                borderRadius: 10,
                                background:
                                  status.color === "#22c55e"
                                    ? "rgba(34,197,94,0.12)"
                                    : status.color === "#ef4444"
                                      ? "rgba(239,68,68,0.12)"
                                      : "rgba(245,158,11,0.12)",
                              }}
                            >
                              {status.text}
                            </span>
                          )}
                          {form.medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedication(i)}
                              style={{
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                                padding: "2px 8px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Medicine Dropdown */}
                      <select
                        value={med.name}
                        onChange={(e) =>
                          updateMedication(i, "name", e.target.value)
                        }
                        style={{ marginBottom: 6 }}
                      >
                        <option value="">— Select Medicine —</option>
                        {medicines
                          .filter((m) => m.stock > 0)
                          .map((m) => (
                            <option key={m.id} value={m.name}>
                              {m.name} — ₹{parseFloat(m.price)} ({m.stock} in
                              stock)
                            </option>
                          ))}
                        <option
                          disabled
                          style={{ borderTop: "1px solid #555" }}
                        >
                          ── Out of Stock ──
                        </option>
                        {medicines
                          .filter((m) => m.stock <= 0)
                          .map((m) => (
                            <option
                              key={m.id}
                              value={m.name}
                              style={{ color: "#ef4444" }}
                            >
                              {m.name} — Out of Stock
                            </option>
                          ))}
                      </select>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr",
                          gap: 6,
                        }}
                      >
                        {/* Dosage */}
                        <select
                          value={med.dosage}
                          onChange={(e) =>
                            updateMedication(i, "dosage", e.target.value)
                          }
                        >
                          <option value="">Dosage</option>
                          <option value="50mg">50mg</option>
                          <option value="100mg">100mg</option>
                          <option value="150mg">150mg</option>
                          <option value="200mg">200mg</option>
                          <option value="250mg">250mg</option>
                          <option value="300mg">300mg</option>
                          <option value="400mg">400mg</option>
                          <option value="500mg">500mg</option>
                          <option value="625mg">625mg</option>
                          <option value="650mg">650mg</option>
                          <option value="750mg">750mg</option>
                          <option value="1g">1g</option>
                          <option value="5ml">5ml</option>
                          <option value="10ml">10ml</option>
                          <option value="15ml">15ml</option>
                          <option value="1 puff">1 puff</option>
                          <option value="2 puffs">2 puffs</option>
                          <option value="Apply thin layer">
                            Apply thin layer
                          </option>
                        </select>
                        {/* Frequency */}
                        <select
                          value={med.frequency}
                          onChange={(e) =>
                            updateMedication(i, "frequency", e.target.value)
                          }
                        >
                          <option value="">Frequency</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">
                            Three times daily
                          </option>
                          <option value="Four times daily">
                            Four times daily
                          </option>
                          <option value="Every 6 hours">Every 6 hours</option>
                          <option value="Every 8 hours">Every 8 hours</option>
                          <option value="Every 12 hours">Every 12 hours</option>
                          <option value="Before meals">Before meals</option>
                          <option value="After meals">After meals</option>
                          <option value="At bedtime">At bedtime</option>
                          <option value="As needed (SOS)">
                            As needed (SOS)
                          </option>
                        </select>
                        {/* Duration */}
                        <select
                          value={med.duration}
                          onChange={(e) =>
                            updateMedication(i, "duration", e.target.value)
                          }
                        >
                          <option value="">Duration</option>
                          <option value="1 day">1 day</option>
                          <option value="3 days">3 days</option>
                          <option value="5 days">5 days</option>
                          <option value="7 days">7 days</option>
                          <option value="10 days">10 days</option>
                          <option value="14 days">14 days</option>
                          <option value="15 days">15 days</option>
                          <option value="21 days">21 days</option>
                          <option value="1 month">1 month</option>
                          <option value="2 months">2 months</option>
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={addMedication}
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--accent)",
                    border: "1px dashed var(--border)",
                    padding: "6px 16px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    width: "100%",
                  }}
                >
                  + Add Medicine
                </button>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes for pharmacist..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send to Pharmacy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WritePrescriptionPage;
