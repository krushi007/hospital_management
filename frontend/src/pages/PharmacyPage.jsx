import React, { useState, useEffect } from "react";
import { pharmacyAPI, prescriptionAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PharmacyPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("prescriptions");
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medSearch, setMedSearch] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      prescriptionAPI.list(),
      pharmacyAPI.listOrders(),
      pharmacyAPI.listMedicines({ search: medSearch || undefined }),
    ])
      .then(([rx, ord, med]) => {
        setPrescriptions(rx.data.results || rx.data || []);
        setOrders(ord.data.results || ord.data || []);
        setMedicines(med.data.results || med.data || []);
      })
      .catch(() => toast.error("Failed to load pharmacy data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (tab === "medicines") {
      const t = setTimeout(() => {
        pharmacyAPI
          .listMedicines({ search: medSearch || undefined })
          .then((r) => setMedicines(r.data.results || r.data || []));
      }, 300);
      return () => clearTimeout(t);
    }
  }, [medSearch]);

  const handleGenerateOrder = async (prescriptionId) => {
    try {
      await pharmacyAPI.createFromPrescription(prescriptionId);
      toast.success("Pharmacy order generated!");
      fetchData();
      setTab("orders");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to create order";
      toast.error(msg);
    }
  };

  const handleDispense = async (order) => {
    const result = await Swal.fire({
      title: "Dispense Medicines?",
      html: `<p style="color:#94a3b8">Dispense medicines for <strong>${order.patient_name}</strong>?</p>
                   <p style="color:#94a3b8;margin-top:8px">Total Bill: <strong>₹${parseFloat(order.subtotal).toLocaleString()}</strong></p>
                   <p style="color:#64748b;font-size:0.85rem;margin-top:4px">Stock will be reduced and invoice will be auto-created.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Dispense & Bill",
      background: "#1e293b",
      color: "#f1f5f9",
    });
    if (!result.isConfirmed) return;
    try {
      await pharmacyAPI.dispense(order.id);
      toast.success("Medicines dispensed & invoice created!");
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to dispense",
      );
    }
  };

  const handleDeleteOrder = async (order) => {
    const result = await Swal.fire({
      title: "Delete Order?",
      html: `<p style="color:#94a3b8">Delete pharmacy order <strong>PO-${order.id}</strong> for <strong>${order.patient_name}</strong>?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      background: "#1e293b",
      color: "#f1f5f9",
    });
    if (!result.isConfirmed) return;
    try {
      await pharmacyAPI.deleteOrder(order.id);
      toast.success("Order deleted!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete order");
    }
  };

  const handlePrintBill = (order) => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const itemsRows = (order.items || [])
      .map(
        (item, i) => `
            <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">${i + 1}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0">
                    <strong>${item.medicine_name}</strong>
                    ${item.dosage ? `<br><span style="color:#64748b;font-size:0.85rem">${item.dosage} — ${item.frequency || ""} — ${item.duration || ""}</span>` : ""}
                </td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center">${item.quantity || 1}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right">₹${parseFloat(item.unit_price || 0).toFixed(2)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right">₹${parseFloat(item.total || 0).toFixed(2)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center">
                    <span style="color:${item.in_stock ? "#16a34a" : "#dc2626"};font-weight:600">${item.in_stock ? "✓ Available" : "✗ Out of Stock"}</span>
                </td>
            </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
            <html>
            <head>
                <title>Pharmacy Bill — PO-${order.id}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 30px; }
                    .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 16px; margin-bottom: 20px; }
                    .header h1 { color: #3b82f6; font-size: 1.6rem; }
                    .header p { color: #64748b; font-size: 0.9rem; }
                    .bill-title { text-align: center; font-size: 1.1rem; font-weight: 700; background: #f1f5f9; padding: 8px; margin-bottom: 16px; border-radius: 4px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
                    .info-box { background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
                    .info-box h3 { font-size: 0.78rem; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
                    .info-box p { font-size: 0.9rem; margin: 2px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
                    thead th { background: #1e293b; color: #fff; padding: 10px 12px; text-align: left; font-size: 0.82rem; }
                    .total-row td { font-weight: 700; font-size: 1.05rem; padding: 12px; background: #f1f5f9; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 0.8rem; }
                    @media print { body { padding: 15px; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>⚕️ MedCore HMS</h1>
                    <p>Hospital Management System — Pharmacy Division</p>
                </div>
                <div class="bill-title">PHARMACY BILL — PO-${order.id}</div>
                <div class="info-grid">
                    <div class="info-box">
                        <h3>Patient Details</h3>
                        <p><strong>${order.patient_name}</strong></p>
                        <p>Order Date: ${order.created_at?.split("T")[0] || today}</p>
                    </div>
                    <div class="info-box">
                        <h3>Prescribed By</h3>
                        <p><strong>${order.doctor_name}</strong></p>
                        <p>Prescription #: Rx-${order.prescription}</p>
                        <p>Dispensed: ${today}</p>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Medicine</th>
                            <th style="text-align:center">Qty</th>
                            <th style="text-align:right">Unit Price</th>
                            <th style="text-align:right">Total</th>
                            <th style="text-align:center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows}
                        <tr class="total-row">
                            <td colspan="4" style="text-align:right">Grand Total:</td>
                            <td style="text-align:right;color:#16a34a">₹${parseFloat(order.subtotal).toFixed(2)}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <div class="footer">
                    <p>Thank you for choosing MedCore HMS</p>
                    <p style="margin-top:4px">This is a computer-generated bill. No signature required.</p>
                </div>
                <div class="no-print" style="text-align:center;margin-top:20px">
                    <button onclick="window.print()" style="background:#3b82f6;color:#fff;border:none;padding:10px 30px;border-radius:6px;cursor:pointer;font-size:1rem;font-weight:600">
                        🖨️ Print Bill
                    </button>
                </div>
            </body>
            </html>
        `);
    printWindow.document.close();
  };

  const canManage =
    user?.role === "admin" ||
    user?.role === "receptionist" ||
    user?.role === "pharmacist";

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );

  // Stats
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const dispensedOrders = orders.filter((o) => o.status === "dispensed").length;
  const totalRevenue = orders
    .filter((o) => o.status === "dispensed")
    .reduce((s, o) => s + parseFloat(o.subtotal), 0);
  const lowStockMeds = medicines.filter(
    (m) => m.stock > 0 && m.stock <= 10,
  ).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pharmacy</h1>
          <p>Manage prescriptions, medicines & billing</p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Pending Orders
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f59e0b" }}
          >
            {pendingOrders}
          </div>
        </div>
        <div
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Dispensed
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#22c55e" }}
          >
            {dispensedOrders}
          </div>
        </div>
        <div
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Pharmacy Revenue
          </div>
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#22c55e" }}
          >
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            background: "var(--card-bg)",
            padding: 20,
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Low Stock Items
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: lowStockMeds > 0 ? "#ef4444" : "var(--text-primary)",
            }}
          >
            {lowStockMeds}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["prescriptions", "orders", "medicines"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              background: tab === t ? "var(--accent)" : "var(--card-bg)",
              color: tab === t ? "#fff" : "var(--text-muted)",
            }}
          >
            {t === "prescriptions"
              ? "Prescriptions"
              : t === "orders"
                ? "Pharmacy Orders"
                : "Medicine Inventory"}
          </button>
        ))}
      </div>

      {/* Prescriptions Tab */}
      {tab === "prescriptions" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rx #</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Medications</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.length > 0 ? (
                prescriptions.map((rx) => {
                  const hasOrder = orders.some(
                    (o) => o.prescription === rx.id && o.status !== "cancelled",
                  );
                  return (
                    <tr key={rx.id}>
                      <td>
                        <strong>Rx-{rx.id}</strong>
                      </td>
                      <td>{rx.patient_name}</td>
                      <td>{rx.doctor_name}</td>
                      <td>{rx.diagnosis?.substring(0, 40)}</td>
                      <td>
                        {(rx.medications || []).map((m, i) => (
                          <span
                            key={i}
                            style={{
                              display: "inline-block",
                              background: "rgba(59,130,246,0.12)",
                              color: "#3b82f6",
                              padding: "2px 8px",
                              borderRadius: 12,
                              fontSize: "0.75rem",
                              margin: "1px 3px",
                            }}
                          >
                            {m.name}
                          </span>
                        ))}
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>
                        {rx.created_at?.split("T")[0]}
                      </td>
                      <td>
                        {canManage && !hasOrder ? (
                          <button
                            onClick={() => handleGenerateOrder(rx.id)}
                            style={{
                              background: "var(--accent)",
                              color: "#fff",
                              border: "none",
                              padding: "5px 14px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Generate Order
                          </button>
                        ) : hasOrder ? (
                          <span
                            style={{
                              color: "#22c55e",
                              fontSize: "0.82rem",
                              fontWeight: 600,
                            }}
                          >
                            ✓ Order Created
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
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
                    No prescriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Medicines</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>PO-{o.id}</strong>
                    </td>
                    <td>{o.patient_name}</td>
                    <td>{o.doctor_name}</td>
                    <td>
                      {(o.items || []).length === 0 ? (
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.82rem",
                          }}
                        >
                          —
                        </span>
                      ) : (
                        (o.items || []).map((item, i) => {
                          const name = item.medicine_name || item.name || "—";
                          const inStock = item.in_stock;
                          return (
                            <div
                              key={i}
                              style={{
                                fontSize: "0.82rem",
                                marginBottom: 4,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{name}</span>
                              {inStock != null &&
                                (inStock ? (
                                  <span
                                    style={{
                                      color: "#22c55e",
                                      fontSize: "0.72rem",
                                    }}
                                  >
                                    ✓ In Stock
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      color: "#ef4444",
                                      fontSize: "0.72rem",
                                    }}
                                  >
                                    ✗ Out of Stock
                                  </span>
                                ))}
                            </div>
                          );
                        })
                      )}
                    </td>
                    {/* Qty column */}
                    <td style={{ verticalAlign: "top" }}>
                      {(o.items || []).length === 0
                        ? "—"
                        : (o.items || []).map((item, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: "0.82rem",
                                marginBottom: 4,
                                textAlign: "center",
                              }}
                            >
                              {item.quantity ?? 1}
                            </div>
                          ))}
                    </td>
                    {/* Unit Price column */}
                    <td style={{ verticalAlign: "top" }}>
                      {(o.items || []).length === 0
                        ? "—"
                        : (o.items || []).map((item, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: "0.82rem",
                                marginBottom: 4,
                                color: "var(--text-muted)",
                              }}
                            >
                              {item.unit_price != null
                                ? `₹${parseFloat(item.unit_price).toLocaleString()}`
                                : "—"}
                            </div>
                          ))}
                    </td>
                    <td style={{ fontWeight: 700, color: "#22c55e" }}>
                      ₹{parseFloat(o.subtotal).toLocaleString()}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          background:
                            o.status === "pending"
                              ? "rgba(245,158,11,0.15)"
                              : o.status === "dispensed"
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(239,68,68,0.15)",
                          color:
                            o.status === "pending"
                              ? "#f59e0b"
                              : o.status === "dispensed"
                                ? "#22c55e"
                                : "#ef4444",
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        {o.status === "pending" && canManage && (
                          <button
                            onClick={() => handleDispense(o)}
                            style={{
                              background: "#22c55e",
                              color: "#fff",
                              border: "none",
                              padding: "5px 14px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            Dispense
                          </button>
                        )}
                        {o.status === "dispensed" && (
                          <button
                            onClick={() => handlePrintBill(o)}
                            style={{
                              background: "#3b82f6",
                              color: "#fff",
                              border: "none",
                              padding: "5px 14px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            🖨️ Print Bill
                          </button>
                        )}
                        {canManage && (
                          <button
                            onClick={() => handleDeleteOrder(o)}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
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
                    No pharmacy orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Medicines Tab */}
      {tab === "medicines" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <input
              className="search-input"
              placeholder="Search medicines..."
              value={medSearch}
              onChange={(e) => setMedSearch(e.target.value)}
            />
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Generic Name</th>
                  <th>Category</th>
                  <th>Manufacturer</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.name}</strong>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>
                      {m.generic_name || "—"}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {m.category}
                    </td>
                    <td>{m.manufacturer || "—"}</td>
                    <td style={{ fontWeight: 600 }}>
                      ₹{parseFloat(m.price).toLocaleString()}
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            m.stock <= 10 ? "#ef4444" : "var(--text-primary)",
                        }}
                      >
                        {m.stock}
                      </span>{" "}
                      {m.unit}
                    </td>
                    <td>
                      {m.stock > 0 ? (
                        <span style={{ color: "#22c55e", fontWeight: 600 }}>
                          ✓ Available
                        </span>
                      ) : (
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>
                          ✗ Out of Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PharmacyPage;
