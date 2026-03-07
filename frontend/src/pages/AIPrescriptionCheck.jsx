import React, { useState } from 'react';
import { aiAPI } from '../api/client';
import toast from 'react-hot-toast';

const AIPrescriptionCheck = () => {
    const [form, setForm] = useState({
        medications: [{ name: '', dosage: '', frequency: '' }],
        patient_age: '',
        patient_allergies: '',
        existing_conditions: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const addMedication = () => {
        setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '' }] });
    };

    const removeMedication = (idx) => {
        if (form.medications.length <= 1) return;
        setForm({ ...form, medications: form.medications.filter((_, i) => i !== idx) });
    };

    const updateMedication = (idx, field, value) => {
        const meds = [...form.medications];
        meds[idx][field] = value;
        setForm({ ...form, medications: meds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validMeds = form.medications.filter(m => m.name.trim());
        if (validMeds.length === 0) { toast.error('Add at least one medication'); return; }
        setLoading(true);
        try {
            const res = await aiAPI.analyzePrescription({
                medications: validMeds,
                patient_allergies: form.patient_allergies,
                patient_age: form.patient_age,
                existing_conditions: form.existing_conditions,
            });
            setResult(res.data);
        } catch { toast.error('Analysis failed'); }
        finally { setLoading(false); }
    };

    const riskColor = (level) =>
        level === 'high' ? 'var(--danger)' : level === 'medium' ? 'var(--warning)' : 'var(--success)';

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Prescription Analyzer</h1>
                    <p>Check for drug interactions, dosage errors, and allergy conflicts</p>
                </div>
            </div>

            <div className="grid-2">
                <div className="ai-card">
                    <h3 style={{ marginBottom: 16 }}>Prescription Details</h3>
                    <form onSubmit={handleSubmit}>
                        {form.medications.map((med, i) => (
                            <div key={i} style={{ background: 'var(--bg-primary)', padding: 14, borderRadius: 10, marginBottom: 12, position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Medication #{i + 1}</strong>
                                    {form.medications.length > 1 && (
                                        <button type="button" onClick={() => removeMedication(i)}
                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Drug Name</label>
                                    <input type="text" value={med.name} onChange={e => updateMedication(i, 'name', e.target.value)}
                                        placeholder="e.g., Amoxicillin, Metformin, Warfarin" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Dosage</label>
                                        <input type="text" value={med.dosage} onChange={e => updateMedication(i, 'dosage', e.target.value)}
                                            placeholder="e.g., 500mg" />
                                    </div>
                                    <div className="form-group">
                                        <label>Frequency</label>
                                        <input type="text" value={med.frequency} onChange={e => updateMedication(i, 'frequency', e.target.value)}
                                            placeholder="e.g., Twice daily" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button type="button" className="btn btn-secondary btn-block" onClick={addMedication} style={{ marginBottom: 16 }}>
                            + Add Another Medication
                        </button>

                        <div className="form-group">
                            <label>Patient Age</label>
                            <input type="number" value={form.patient_age} onChange={e => setForm({ ...form, patient_age: e.target.value })} placeholder="35" />
                        </div>

                        <div className="form-group">
                            <label>Known Allergies (comma separated)</label>
                            <input type="text" value={form.patient_allergies} onChange={e => setForm({ ...form, patient_allergies: e.target.value })}
                                placeholder="e.g., Penicillin, Sulfa" />
                        </div>

                        <div className="form-group">
                            <label>Existing Conditions</label>
                            <textarea value={form.existing_conditions} onChange={e => setForm({ ...form, existing_conditions: e.target.value })}
                                placeholder="e.g., Diabetes, Kidney disease" />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Analyze Prescription'}
                        </button>
                    </form>
                </div>

                <div>
                    {result ? (
                        <div className="ai-card">
                            <h3 style={{ marginBottom: 16 }}>Analysis Results</h3>

                            <div style={{ textAlign: 'center', padding: 20, background: 'var(--bg-primary)', borderRadius: 12, marginBottom: 20 }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: riskColor(result.risk_level), textTransform: 'uppercase' }}>
                                    {result.risk_level} Risk
                                </div>
                                <div className="risk-meter" style={{ marginTop: 10 }}>
                                    <div className="risk-meter-fill" style={{
                                        width: `${result.risk_score || 0}%`,
                                        background: riskColor(result.risk_level),
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                    {result.total_issues || 0} issue(s) found — Score: {result.risk_score}/100
                                </div>
                            </div>

                            {result.summary && (
                                <p style={{ marginBottom: 16, fontSize: '0.92rem', padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: 8 }}>{result.summary}</p>
                            )}

                            {result.interactions?.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ marginBottom: 10 }}>Drug Interactions</h4>
                                    {result.interactions.map((int, i) => (
                                        <div key={i} style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid var(--danger)' }}>
                                            <strong style={{ color: 'var(--danger)' }}>{int.drugs?.join(' + ')}</strong>
                                            <span className={`badge ${int.severity === 'critical' ? 'badge-danger' : int.severity === 'high' ? 'badge-danger' : 'badge-warning'}`}
                                                style={{ marginLeft: 8, fontSize: '0.72rem' }}>{int.severity}</span>
                                            <p style={{ fontSize: '0.85rem', marginTop: 4, color: 'var(--text-secondary)' }}>{int.description}</p>
                                            {int.recommendation && <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-muted)' }}>Recommendation: {int.recommendation}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result.allergy_conflicts?.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ marginBottom: 10 }}>Allergy Warnings</h4>
                                    {result.allergy_conflicts.map((w, i) => (
                                        <div key={i} style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, marginBottom: 6, borderLeft: '3px solid var(--danger)' }}>
                                            <strong style={{ color: 'var(--danger)' }}>{w.drug}</strong> — {w.message}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result.dosage_issues?.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ marginBottom: 10 }}>Dosage Alerts</h4>
                                    {result.dosage_issues.map((w, i) => (
                                        <div key={i} style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, marginBottom: 6, borderLeft: '3px solid var(--warning)' }}>
                                            <strong style={{ color: 'var(--warning)' }}>{w.drug}</strong> — {w.message}
                                            {w.recommended_range && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>Recommended: {w.recommended_range}</div>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result.interactions?.length === 0 && result.allergy_conflicts?.length === 0 && result.dosage_issues?.length === 0 && (
                                <div style={{ padding: 16, background: 'rgba(34,197,94,0.08)', borderRadius: 8, textAlign: 'center', color: 'var(--success)' }}>
                                    No issues detected in this prescription
                                </div>
                            )}

                            <div className="disclaimer">
                                <strong>Disclaimer:</strong> This AI analysis is for decision support only and does not replace
                                professional pharmaceutical review and clinical judgment.
                            </div>
                        </div>
                    ) : (
                        <div className="ai-card empty-state">
                            <h3>Prescription Analysis</h3>
                            <p style={{ marginTop: 8 }}>Enter medications and patient info to check for potential issues</p>
                            <div style={{ marginTop: 16, fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                                <p><strong>Try these interactions:</strong></p>
                                <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                    <li>Warfarin + Aspirin (bleeding risk)</li>
                                    <li>Metformin + Alcohol (lactic acidosis)</li>
                                    <li>Amoxicillin with Penicillin allergy</li>
                                    <li>Ibuprofen at 2000mg (overdose alert)</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIPrescriptionCheck;
