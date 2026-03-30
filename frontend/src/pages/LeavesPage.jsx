import React, { useState, useEffect } from "react";
import { leaveAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LeavesPage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ date: "", reason: "" });

  const fetchLeaves = async () => {
    try {
      const res = await leaveAPI.list();
      setLeaves(res.data);
    } catch (err) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveAPI.request(requestForm);
      toast.success("Leave requested successfully");
      setShowRequestModal(false);
      setRequestForm({ date: "", reason: "" });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to request leave");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await leaveAPI.updateStatus(id, status);
      toast.success(`Leave ${status} successfully`);
      fetchLeaves();
    } catch (err) {
      toast.error(`Failed to ${status} leave`);
    }
  };

  const deleteLeave = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pending request?")) return;
    try {
      await leaveAPI.delete(id);
      toast.success("Leave deleted");
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to delete leave");
    }
  };

  if (loading) return <div className="p-4">Loading leaves...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Staff Leaves</h1>
          <p style={{ color: "var(--text-muted)", marginTop: '4px' }}>Manage doctor availability and time off</p>
        </div>
        {user.role === 'doctor' && (
          <button className="btn btn-primary shadow-sm hover-lift" onClick={() => setShowRequestModal(true)}>
            + Request Time Off
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {user.role !== 'doctor' && <th>Doctor</th>}
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? leaves.map(l => (
              <tr key={l.id}>
                {user.role !== 'doctor' && (
                  <td><strong>{l.doctor_name}</strong><br/><small className="text-muted">{l.department_name}</small></td>
                )}
                <td>{new Date(l.date).toLocaleDateString()}</td>
                <td>{l.reason}</td>
                <td>
                  <span className={`badge ${l.status === 'approved' ? 'badge-success' : l.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {l.status}
                  </span>
                </td>
                <td>{new Date(l.created_at).toLocaleDateString()}</td>
                <td>
                  {user.role === 'admin' && l.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-sm btn-success" onClick={() => updateStatus(l.id, 'approved')}>Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={() => updateStatus(l.id, 'rejected')}>Reject</button>
                    </div>
                  )}
                  {user.role === 'doctor' && l.status === 'pending' && (
                    <button className="btn btn-sm btn-danger" onClick={() => deleteLeave(l.id)}>Delete</button>
                  )}
                  {l.status !== 'pending' && <span className="text-muted">-</span>}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={user.role !== 'doctor' ? 6 : 5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header d-flex justify-between align-center mb-4">
              <h2>Request Time Off</h2>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRequestSubmit}>
              <div className="form-group mb-3">
                <label>Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]} 
                  className="form-control" 
                  value={requestForm.date} 
                  onChange={e => setRequestForm({...requestForm, date: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group mb-4">
                <label>Reason</label>
                <textarea 
                  className="form-control" 
                  placeholder="Explain your reason for taking time off..." 
                  value={requestForm.reason} 
                  onChange={e => setRequestForm({...requestForm, reason: e.target.value})} 
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesPage;
