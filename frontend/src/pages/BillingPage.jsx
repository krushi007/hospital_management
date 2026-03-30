import React, { useState, useEffect } from "react";
import { billingAPI, patientAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "../utils/pdfGenerator";

// ── helpers ──────────────────────────────────────────────────────────────────
const EMPTY_ITEM = { description: "", quantity: 1, unit_price: "" };

const statusBadge = (status) => {
  const map = {
    paid: "success",
    partial: "warning",
    unpaid: "danger",
    cancelled: "secondary",
  };
  return `badge badge-${map[status] || "info"}`;
};

// ── component ─────────────────────────────────────────────────────────────────
const BillingPage = () => {
  const { user } = useAuth();
  const canManage = ["admin", "receptionist"].includes(user?.role);

  // list state
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  // detail / payment state
  const [selected, setSelected] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [payForm, setPayForm] = useState({ amount: "", method: "cash", transaction_id: "" });

  // create invoice state
  const [showCreate, setShowCreate] = useState(false);
  const [patients, setPatients] = useState([]);
  const [createForm, setCreateForm] = useState({
    patient: "",
    items: [{ ...EMPTY_ITEM }],
    tax_percent: 0,
    discount: 0,
    notes: "",
    bill_type: "general",
  });
  const [creating, setCreating] = useState(false);

  // ── fetch invoices ──────────────────────────────────────────────────────────
  const fetchInvoices = () => {
    setLoading(true);
    billingAPI
      .listInvoices(statusFilter ? { status: statusFilter } : {})
      .then((res) => setInvoices(res.data.results || res.data))
      .catch(() => toast.error("Failed to load invoices"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchInvoices, [statusFilter]);

  // ── open create modal ───────────────────────────────────────────────────────
  const openCreate = () => {
    if (!patients.length) {
      patientAPI
        .list()
        .then((res) => setPatients(res.data.results || res.data))
        .catch(() => toast.error("Failed to load patients"));
    }
    setCreateForm({
      patient: "",
      items: [{ ...EMPTY_ITEM }],
      tax_percent: 0,
      discount: 0,
      notes: "",
      bill_type: "general",
    });
    setShowCreate(true);
  };

  // ── item helpers ────────────────────────────────────────────────────────────
  const updateItem = (i, field, value) => {
    const items = [...createForm.items];
    items[i] = { ...items[i], [field]: value };
    setCreateForm({ ...createForm, items });
  };

  const addItem = () =>
    setCreateForm({ ...createForm, items: [...createForm.items, { ...EMPTY_ITEM }] });

  const removeItem = (i) =>
    setCreateForm({
      ...createForm,
      items: createForm.items.filter((_, idx) => idx !== i),
    });

  // ── computed totals (create form) ───────────────────────────────────────────
  const subtotal = createForm.items.reduce(
    (s, it) => s + (parseFloat(it.quantity) || 0) * (parseFloat(it.unit_price) || 0),
    0
  );
  const taxAmt = ((parseFloat(createForm.tax_percent) || 0) / 100) * subtotal;
  const grandTotal = subtotal + taxAmt - (parseFloat(createForm.discount) || 0);

  // ── create invoice submit ───────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.patient) return toast.error("Please select a patient");
    if (createForm.items.some((it) => !it.description || !it.unit_price))
      return toast.error("Fill in all item fields");

    setCreating(true);
    try {
      await billingAPI.createInvoice({
        patient: createForm.patient,
        items: createForm.items,
        tax_percent: parseFloat(createForm.tax_percent) || 0,
        discount: parseFloat(createForm.discount) || 0,
        notes: createForm.notes,
        bill_type: createForm.bill_type,
      });
      toast.success("Invoice created!");
      setShowCreate(false);
      fetchInvoices();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  };

  // ── record payment ──────────────────────────────────────────────────────────
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await billingAPI.addPayment(selected.id, payForm);
      toast.success("Payment recorded!");
      setShowPayment(false);
      setPayForm({ amount: "", method: "cash", transaction_id: "" });
      setSelected(res.data);
      fetchInvoices();
    } catch (err) {
      toast.error(err.response?.data?.error || "Payment failed");
    }
  };

  // ── stats ───────────────────────────────────────────────────────────────────
  const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.paid_amount || 0), 0);
  const totalPending = invoices.reduce(
    (s, i) => s + parseFloat(i.total_amount || 0) - parseFloat(i.paid_amount || 0),
    0
  );

  // ── render ──────────────────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>💰 Billing &amp; Invoices</h1>
          <p>Manage invoices and track payments</p>
        </div>
        {canManage && (
          <button className="btn btn-primary" onClick={openCreate}>
            + Create Invoice
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon green">💵</div>
          <div className="stat-info">
            <h4>Total Collected</h4>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <h4>Pending Amount</h4>
            <div className="stat-value">₹{totalPending.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📄</div>
          <div className="stat-info">
            <h4>Total Invoices</h4>
            <div className="stat-value">{invoices.length}</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="toolbar">
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
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Main split view */}
      <div className="grid-2">
        {/* Invoice list */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Patient</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    style={{
                      cursor: "pointer",
                      background: selected?.id === inv.id ? "var(--bg-hover)" : undefined,
                    }}
                  >
                    <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                    <td>{inv.patient_name}</td>
                    <td>₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                    <td>₹{parseFloat(inv.paid_amount).toLocaleString()}</td>
                    <td>
                      <span className={statusBadge(inv.status)}>{inv.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}
                  >
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Invoice {selected.invoice_number}</h3>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => generateInvoicePDF(selected)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  📄 Download Invoice
                </button>
              </div>
              <p>
                <strong>Patient:</strong> {selected.patient_name}
              </p>
              <p>
                <strong>Type:</strong> {selected.bill_type}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selected.created_at).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={statusBadge(selected.status)}>{selected.status}</span>
              </p>

              {/* Items */}
              <div style={{ marginTop: 16 }}>
                <h4 style={{ marginBottom: 8 }}>Items:</h4>
                {(selected.items || []).length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No items</p>
                ) : (
                  (selected.items || []).map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        background: "var(--bg-primary)",
                        borderRadius: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        {item.description} × {item.quantity}
                      </span>
                      <span>₹{parseFloat(item.total).toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  background: "var(--bg-primary)",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Subtotal</span>
                  <span>₹{parseFloat(selected.subtotal).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>Tax ({selected.tax_percent}%)</span>
                  <span>₹{parseFloat(selected.tax_amount).toLocaleString()}</span>
                </div>
                {parseFloat(selected.discount) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      color: "var(--success)",
                    }}
                  >
                    <span>Discount</span>
                    <span>-₹{parseFloat(selected.discount).toLocaleString()}</span>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    borderTop: "1px solid var(--border)",
                    paddingTop: 8,
                    marginTop: 8,
                  }}
                >
                  <span>Total</span>
                  <span>₹{parseFloat(selected.total_amount).toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    color: "var(--success)",
                  }}
                >
                  <span>Paid</span>
                  <span>₹{parseFloat(selected.paid_amount).toLocaleString()}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 4,
                    color: "var(--danger, #ef4444)",
                    fontWeight: 600,
                  }}
                >
                  <span>Balance Due</span>
                  <span>
                    ₹
                    {(
                      parseFloat(selected.total_amount) - parseFloat(selected.paid_amount)
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment History */}
              {selected.payments?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ marginBottom: 8 }}>Payment History:</h4>
                  {selected.payments.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px",
                        background: "var(--bg-primary)",
                        borderRadius: 6,
                        marginBottom: 4,
                        fontSize: "0.85rem",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        ₹{parseFloat(p.amount).toLocaleString()} via{" "}
                        <strong>{p.method}</strong>
                        {p.transaction_id && ` (${p.transaction_id})`}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>
                        {new Date(p.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Record Payment Button */}
              {selected.status !== "paid" &&
                selected.status !== "cancelled" &&
                canManage && (
                  <button
                    className="btn btn-primary btn-block"
                    style={{ marginTop: 16 }}
                    onClick={() => setShowPayment(true)}
                  >
                    💳 Record Payment
                  </button>
                )}
            </div>
          ) : (
            <div className="card empty-state">
              <h3>Select an invoice</h3>
              <p>Click on an invoice to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Record Payment Modal ───────────────────────────────────────────── */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>💳 Record Payment</h2>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>
                  Amount (Balance: ₹
                  {(
                    parseFloat(selected.total_amount) - parseFloat(selected.paid_amount)
                  ).toLocaleString()}
                  )
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={parseFloat(selected.total_amount) - parseFloat(selected.paid_amount)}
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={payForm.method}
                  onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="insurance">Insurance</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Transaction ID (optional)</label>
                <input
                  type="text"
                  value={payForm.transaction_id}
                  onChange={(e) => setPayForm({ ...payForm, transaction_id: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayment(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Invoice Modal ───────────────────────────────────────────── */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640, width: "100%" }}
          >
            <h2>📄 Create Invoice</h2>
            <form onSubmit={handleCreate}>
              {/* Patient */}
              <div className="form-group">
                <label>Patient *</label>
                <select
                  value={createForm.patient}
                  onChange={(e) => setCreateForm({ ...createForm, patient: e.target.value })}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bill type */}
              <div className="form-group">
                <label>Bill Type</label>
                <select
                  value={createForm.bill_type}
                  onChange={(e) => setCreateForm({ ...createForm, bill_type: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="consultation">Consultation</option>
                  <option value="lab">Lab Tests</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="surgery">Surgery</option>
                  <option value="admission">Admission</option>
                </select>
              </div>

              {/* Items */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>
                  Line Items *
                </label>
                {createForm.items.map((item, i) => (
                  <div
                    key={i}
                    style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 32px", gap: 8, marginBottom: 8 }}
                  >
                    <input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(i, "description", e.target.value)}
                      required
                      style={{
                        padding: "8px 10px",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", e.target.value)}
                      required
                      style={{
                        padding: "8px 10px",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Unit Price"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(i, "unit_price", e.target.value)}
                      required
                      style={{
                        padding: "8px 10px",
                        background: "var(--bg-input)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        color: "var(--text-primary)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      disabled={createForm.items.length === 1}
                      style={{
                        background: "var(--danger, #ef4444)",
                        border: "none",
                        borderRadius: 6,
                        color: "#fff",
                        cursor: createForm.items.length === 1 ? "not-allowed" : "pointer",
                        opacity: createForm.items.length === 1 ? 0.4 : 1,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addItem}
                  style={{ marginTop: 4 }}
                >
                  + Add Item
                </button>
              </div>

              {/* Tax / Discount */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label>Tax (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={createForm.tax_percent}
                    onChange={(e) => setCreateForm({ ...createForm, tax_percent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Discount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={createForm.discount}
                    onChange={(e) => setCreateForm({ ...createForm, discount: e.target.value })}
                  />
                </div>
              </div>

              {/* Grand total preview */}
              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--bg-primary)",
                  borderRadius: 8,
                  marginBottom: 12,
                  fontSize: "0.9rem",
                }}
              >
                <span>Subtotal: ₹{subtotal.toFixed(2)}</span>
                {" | "}
                <span>Tax: ₹{taxAmt.toFixed(2)}</span>
                {" | "}
                <span style={{ fontWeight: 700 }}>Total: ₹{grandTotal.toFixed(2)}</span>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "var(--bg-input)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    color: "var(--text-primary)",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? "Creating…" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
