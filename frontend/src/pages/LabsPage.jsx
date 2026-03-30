import React, { useState, useEffect } from "react";
import { labAPI, patientAPI, doctorAPI } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { generateLabReportPDF } from "../utils/pdfGenerator";

const LabsPage = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'completed'
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(null);

  const [requestForm, setRequestForm] = useState({
    doctor_id: "",
    patient_id: "",
    test_name: "",
    notes: ""
  });

  const [resultForm, setResultForm] = useState({
    result_text: "",
    result_url: "",
    status: "completed"
  });

  useEffect(() => {
    fetchTests();
    // For doctors: pre-fetch only their own patients
    // For admin/receptionist: fetch list of doctors so they can select
    if (user.role === 'doctor') {
      patientAPI.list({ my_patients: true }).then(res => setPatients(res.data.results || res.data)).catch(console.error);
    } else if (user.role === 'admin' || user.role === 'receptionist') {
      doctorAPI.list().then(res => setDoctors(res.data.results || res.data)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    // When an admin selects a doctor, fetch that doctor's patients
    if ((user.role === 'admin' || user.role === 'receptionist')) {
      if (requestForm.doctor_id) {
        patientAPI.list({ doctor_id: requestForm.doctor_id })
          .then(res => setPatients(res.data.results || res.data))
          .catch(console.error);
      } else {
        setPatients([]); // clear patients if no doctor is selected
        setRequestForm(prev => ({...prev, patient_id: ""}));
      }
    }
  }, [requestForm.doctor_id, user.role]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const params = filter !== "all" ? { status: filter } : {};
      const res = await labAPI.list(params);
      setTests(res.data);
    } catch (err) {
      toast.error("Failed to load lab tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [filter]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.patient_id || !requestForm.test_name) {
      toast.error("Patient and Test Name are required");
      return;
    }
    try {
      await labAPI.request(requestForm);
      toast.success("Lab test requested successfully");
      setShowRequestModal(false);
      setRequestForm({ doctor_id: "", patient_id: "", test_name: "", notes: "" });
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to request test");
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await labAPI.update(showResultModal.id, resultForm);
      toast.success("Lab result updated");
      setShowResultModal(null);
      setResultForm({ result_text: "", result_url: "", status: "completed" });
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update result");
    }
  };

  const openResultModal = (test) => {
    setResultForm({
      result_text: test.result_text || "",
      result_url: test.result_url || "",
      status: "completed"
    });
    setShowResultModal(test);
  };

  if (loading && tests.length === 0) return <div className="p-4">Loading labs...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>Lab & Diagnostics</h1>
          <p style={{ color: "var(--text-muted)", marginTop: '4px' }}>Order lab tests and manage diagnostic results</p>
        </div>
        <button className="btn btn-primary shadow-sm hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowRequestModal(true)}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>+</span> Request Lab Test
        </button>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', background: 'var(--bg-card)', borderRadius: '12px', padding: '15px', marginBottom: '28px' }}>
        <button className={`btn ${filter === 'all' ? 'btn-primary shadow-sm' : ''}`} style={filter !== 'all' ? { background: 'var(--bg-input)', color: 'var(--text-secondary)' } : { borderRadius: '20px' }} onClick={() => setFilter('all')}>All Tests</button>
        <button className={`btn ${filter === 'pending' ? 'btn-warning shadow-sm' : ''}`} style={filter !== 'pending' ? { background: 'var(--bg-input)', color: 'var(--text-secondary)' } : { borderRadius: '20px', color: '#fff' }} onClick={() => setFilter('pending')}>Pending</button>
        <button className={`btn ${filter === 'completed' ? 'btn-success shadow-sm' : ''}`} style={filter !== 'completed' ? { background: 'var(--bg-input)', color: 'var(--text-secondary)' } : { borderRadius: '20px' }} onClick={() => setFilter('completed')}>Completed Results</button>
      </div>

      <div className="grid-3">
        {tests.map(test => (
          <div key={test.id} className="card hover-lift" style={{ position: 'relative', borderTop: `5px solid ${test.status === 'completed' ? 'var(--success)' : 'var(--warning)'}`, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
            <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: test.status === 'completed' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(241, 196, 15, 0.15)', color: test.status === 'completed' ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {test.status}
            </span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {test.patient_avatar ? (
                 <img src={test.patient_avatar} alt="Patient" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              ) : (
                 <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid var(--border)' }}>👤</div>
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)' }}>{test.patient_name}</h3>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Req. by <strong>{test.doctor_name}</strong></small>
              </div>
            </div>

            <div style={{ marginBottom: '15px', padding: '12px 15px', background: 'var(--bg-input)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Test Requested</strong>
              <span style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{test.test_name}</span>
            </div>

            {test.notes && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                <em>Notes: {test.notes}</em>
              </p>
            )}

            {test.status === 'completed' ? (
              <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}><strong style={{ color: 'var(--success)' }}>Result:</strong> <br/><span style={{ color: 'var(--text-secondary)' }}>{test.result_text || 'Completed.'}</span></p>
                {test.result_url && (
                  <a href={test.result_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none', marginTop: '5px', transition: 'all 0.2s' }}>📎 View Attachment</a>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Completed on {new Date(test.completed_at).toLocaleDateString()}
                </div>
                <button
                  className="btn btn-sm btn-block"
                  style={{ marginTop: '12px', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 'bold' }}
                  onClick={() => generateLabReportPDF(test)}
                >
                  📄 Download Report
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                 <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Requested on {new Date(test.created_at).toLocaleDateString()}
                 </p>
                 <button className="btn btn-sm btn-block shadow-sm hover-lift" style={{ background: 'var(--info)', color: '#fff', padding: '8px', fontWeight: 'bold', letterSpacing: '0.5px' }} onClick={() => openResultModal(test)}>
                   Upload Result
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {tests.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No lab tests found.
        </div>
      )}

      {/* Request Lab Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Request Lab Test</h2>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}>&times;</button>
            </div>
            <form style={{ padding: '0 24px 24px' }} onSubmit={handleRequestSubmit}>
              {(user.role === 'admin' || user.role === 'receptionist') && (
                <div className="form-group">
                  <label>Select Doctor</label>
                  <select className="form-control" value={requestForm.doctor_id} onChange={e => setRequestForm({...requestForm, doctor_id: e.target.value})} required>
                    <option value="">-- Choose Doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name} ({d.department_name})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Select Patient</label>
                <select className="form-control" value={requestForm.patient_id} onChange={e => setRequestForm({...requestForm, patient_id: e.target.value})} required disabled={(user.role === 'admin' || user.role === 'receptionist') && !requestForm.doctor_id}>
                  <option value="">-- Choose Patient --</option>
                  {patients.filter(p => !tests.some(t => t.status === 'completed' && String(t.patient_id) === String(p.id))).map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Test Name</label>
                <input type="text" className="form-control" placeholder="e.g. Complete Blood Count (CBC)" value={requestForm.test_name} onChange={e => setRequestForm({...requestForm, test_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Doctor Notes (Optional)</label>
                <textarea className="form-control" placeholder="Any specific instructions for the lab..." value={requestForm.notes} onChange={e => setRequestForm({...requestForm, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary btn-block mt-3">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Result Modal */}
      {showResultModal && (
        <div className="modal-overlay" onClick={() => setShowResultModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Upload Lab Result</h2>
              <button className="modal-close" onClick={() => setShowResultModal(null)}>&times;</button>
            </div>
            <div style={{ background: 'var(--bg-body)', padding: '0 24px', marginBottom: '15px' }}>
              <p><strong>Patient:</strong> {showResultModal.patient_name}</p>
              <p><strong>Test:</strong> {showResultModal.test_name}</p>
            </div>
            <form style={{ padding: '0 24px 24px' }} onSubmit={handleResultSubmit}>
              <div className="form-group">
                <label>Result Notes</label>
                <textarea className="form-control" placeholder="Summarize the findings..." value={resultForm.result_text} onChange={e => setResultForm({...resultForm, result_text: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Attachment URL (Optional)</label>
                <input type="text" className="form-control" placeholder="https://link-to-pdf-or-image.com" value={resultForm.result_url} onChange={e => setResultForm({...resultForm, result_url: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-success btn-block mt-3">Mark as Completed</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabsPage;
