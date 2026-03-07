import React, { useState, useEffect } from 'react';
import { billingAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BillingPage = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [payForm, setPayForm] = useState({ amount: '', method: 'cash', transaction_id: '' });
    const [statusFilter, setStatusFilter] = useState('');

    const fetchInvoices = () => {
        billingAPI.listInvoices({ status: statusFilter || undefined })
            .then(res => setInvoices(res.data.results || res.data))
            .catch(() => toast.error('Failed to load invoices'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchInvoices(); }, []);
    useEffect(() => { fetchInvoices(); }, [statusFilter]);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const res = await billingAPI.addPayment(selected.id, payForm);
            toast.success('Payment recorded!');
            setShowPayment(false);
            setPayForm({ amount: '', method: 'cash', transaction_id: '' });
            setSelected(res.data);
            fetchInvoices();
        } catch { toast.error('Payment failed'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    const totalRevenue = invoices.reduce((s, inv) => s + parseFloat(inv.paid_amount || 0), 0);
    const totalPending = invoices.reduce((s, inv) => s + parseFloat(inv.total_amount || 0) - parseFloat(inv.paid_amount || 0), 0);

    return (
        <div>
            <div className="page-header">
                <div><h1>💰 Billing & Invoices</h1><p>Manage invoices and track payments</p></div>
            </div>

            <div className="stats-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon green">💵</div>
                    <div className="stat-info"><h4>Total Collected</h4><div className="stat-value">₹{totalRevenue.toLocaleString()}</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon yellow">⏳</div>
                    <div className="stat-info"><h4>Pending Amount</h4><div className="stat-value">₹{totalPending.toLocaleString()}</div></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">📄</div>
                    <div className="stat-info"><h4>Total Invoices</h4><div className="stat-value">{invoices.length}</div></div>
                </div>
            </div>

            <div className="toolbar">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    style={{ padding: '9px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'inherit' }}>
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            <div className="grid-2">
                <div className="table-container">
                    <table>
                        <thead><tr><th>Invoice #</th><th>Patient</th><th>Total</th><th>Paid</th><th>Status</th></tr></thead>
                        <tbody>
                            {invoices.length > 0 ? invoices.map(inv => (
                                <tr key={inv.id} onClick={() => setSelected(inv)} style={{ cursor: 'pointer' }}>
                                    <td style={{ fontWeight: 600 }}>{inv.invoice_number}</td>
                                    <td>{inv.patient_name}</td>
                                    <td>₹{parseFloat(inv.total_amount).toLocaleString()}</td>
                                    <td>₹{parseFloat(inv.paid_amount).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge badge-${inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : inv.status === 'partial' ? 'warning' : 'info'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No invoices found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div>
                    {selected ? (
                        <div className="card">
                            <h3 style={{ marginBottom: 16 }}>Invoice {selected.invoice_number}</h3>
                            <p><strong>Patient:</strong> {selected.patient_name}</p>
                            <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleDateString()}</p>

                            <div style={{ marginTop: 16 }}>
                                <h4 style={{ marginBottom: 8 }}>Items:</h4>
                                {(selected.items || []).map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 6, marginBottom: 4 }}>
                                        <span>{item.description} × {item.quantity}</span>
                                        <span>₹{item.total}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-primary)', borderRadius: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Subtotal</span><span>₹{selected.subtotal}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span>Tax ({selected.tax_percent}%)</span><span>₹{selected.tax_amount}</span></div>
                                {parseFloat(selected.discount) > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: 'var(--success)' }}><span>Discount</span><span>-₹{selected.discount}</span></div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
                                    <span>Total</span><span>₹{parseFloat(selected.total_amount).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: 'var(--success)' }}><span>Paid</span><span>₹{parseFloat(selected.paid_amount).toLocaleString()}</span></div>
                            </div>

                            {selected.payments?.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    <h4 style={{ marginBottom: 8 }}>Payment History:</h4>
                                    {selected.payments.map((p, i) => (
                                        <div key={i} style={{ padding: '8px 12px', background: 'var(--success-bg)', borderRadius: 6, marginBottom: 4, fontSize: '0.85rem' }}>
                                            ₹{p.amount} via {p.method} {p.transaction_id && `(${p.transaction_id})`}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selected.status !== 'paid' && ['admin', 'receptionist'].includes(user?.role) && (
                                <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setShowPayment(true)}>
                                    💳 Record Payment
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="card empty-state"><h3>Select an invoice</h3><p>Click on an invoice to view details</p></div>
                    )}
                </div>
            </div>

            {showPayment && (
                <div className="modal-overlay" onClick={() => setShowPayment(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>💳 Record Payment</h2>
                        <form onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Amount (Balance: ₹{(parseFloat(selected.total_amount) - parseFloat(selected.paid_amount)).toLocaleString()})</label>
                                <input type="number" step="0.01" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Payment Method</label>
                                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}>
                                    <option value="cash">Cash</option>
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Transaction ID (optional)</label>
                                <input type="text" value={payForm.transaction_id} onChange={e => setPayForm({ ...payForm, transaction_id: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPayment(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Record Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingPage;
