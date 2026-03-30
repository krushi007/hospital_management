import React, { useState, useEffect } from 'react';
import { prescriptionAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { generatePrescriptionPDF } from '../utils/pdfGenerator';

const PrescriptionsPage = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        prescriptionAPI.list()
            .then(res => setPrescriptions(res.data.results || res.data))
            .catch(() => toast.error('Failed to load prescriptions'))
            .finally(() => setLoading(false));
    }, []);

    const analyzePrescription = async (id) => {
        try {
            const res = await prescriptionAPI.analyze(id);
            toast.success('Analysis complete!');
            setSelected(res.data);
        } catch { toast.error('Analysis failed'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div>
            <div className="page-header">
                <div><h1>💊 Prescriptions</h1><p>View and manage digital prescriptions</p></div>
            </div>

            <div className="grid-2">
                <div>
                    <div className="table-container">
                        <table>
                            <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Date</th><th>AI</th></tr></thead>
                            <tbody>
                                {prescriptions.length > 0 ? prescriptions.map(p => (
                                    <tr key={p.id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                                        <td>#{p.id}</td>
                                        <td>{p.patient_name}</td>
                                        <td>{p.doctor_name}</td>
                                        <td>{p.diagnosis?.substring(0, 30)}...</td>
                                        <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td>
                                            {p.is_analyzed ? (
                                                <span className={`badge badge-${p.ai_analysis?.risk_level === 'high' ? 'danger' : p.ai_analysis?.risk_level === 'medium' ? 'warning' : 'success'}`}>
                                                    {p.ai_analysis?.risk_level}
                                                </span>
                                            ) : (
                                                <button className="btn btn-sm btn-primary" onClick={(e) => { e.stopPropagation(); analyzePrescription(p.id); }}>Analyze</button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No prescriptions found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    {selected ? (
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <h3 style={{ margin: 0 }}>📋 Prescription Details</h3>
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => generatePrescriptionPDF(selected)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                >
                                    📄 Download PDF
                                </button>
                            </div>
                            {selected.diagnosis && <p><strong>Diagnosis:</strong> {selected.diagnosis}</p>}
                            {selected.medications && (
                                <div style={{ marginTop: 16 }}>
                                    <h4 style={{ marginBottom: 8 }}>Medications:</h4>
                                    {(Array.isArray(selected.medications) ? selected.medications : []).map((m, i) => (
                                        <div key={i} style={{ background: 'var(--bg-primary)', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                                            <strong>{m.name}</strong> — {m.dosage}<br />
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                {m.frequency} for {m.duration} | {m.instructions}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {selected.ai_analysis && Object.keys(selected.ai_analysis).length > 0 && (
                                <div className="ai-result" style={{ marginTop: 16 }}>
                                    <h4>🤖 AI Analysis</h4>
                                    <p style={{ marginTop: 8 }}>{selected.ai_analysis.summary || selected.summary}</p>
                                    <div style={{ marginTop: 8 }}>
                                        <span className={`badge badge-${selected.ai_analysis.risk_level === 'high' ? 'danger' : selected.ai_analysis.risk_level === 'medium' ? 'warning' : 'success'}`}>
                                            Risk: {selected.ai_analysis.risk_level} ({selected.ai_analysis.risk_score}/100)
                                        </span>
                                    </div>
                                    {selected.ai_analysis.interactions?.length > 0 && (
                                        <div style={{ marginTop: 12 }}>
                                            <strong>⚠️ Drug Interactions:</strong>
                                            {selected.ai_analysis.interactions.map((int, i) => (
                                                <div key={i} style={{ background: 'var(--danger-bg)', padding: 10, borderRadius: 6, marginTop: 6, fontSize: '0.85rem' }}>
                                                    <strong>{int.drugs.join(' ↔ ')}</strong>: {int.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card empty-state">
                            <h3>Select a prescription</h3>
                            <p>Click on a prescription to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionsPage;
