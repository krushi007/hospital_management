import React, { useState } from 'react';
import { aiAPI } from '../api/client';
import toast from 'react-hot-toast';

const AIRiskAnalysis = () => {
    const [form, setForm] = useState({
        age: '', gender: 'male', blood_pressure_systolic: '', blood_pressure_diastolic: '',
        heart_rate: '', bmi: '', blood_sugar: '', cholesterol: '',
        smoking: false, alcohol: false, exercise: 'moderate',
        family_history: '', existing_conditions: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await aiAPI.analyzeRisk(form);
            setResult(res.data);
        } catch { toast.error('Analysis failed'); }
        finally { setLoading(false); }
    };

    const riskColor = (level) =>
        level === 'high' ? 'var(--danger)' : level === 'medium' ? 'var(--warning)' : 'var(--success)';

    return (
        <div>
            <div className="page-header">
                <div><h1>📈 AI Health Risk Analysis</h1><p>Evaluate patient data to predict health risk levels</p></div>
            </div>

            <div className="grid-2">
                <div className="ai-card">
                    <h3 style={{ marginBottom: 16 }}>Patient Health Data</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Age</label>
                                <input type="number" name="age" value={form.age} onChange={handleChange} required min="1" max="120" />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={form.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Systolic BP</label>
                                <input type="number" name="blood_pressure_systolic" value={form.blood_pressure_systolic} onChange={handleChange} placeholder="120" />
                            </div>
                            <div className="form-group">
                                <label>Diastolic BP</label>
                                <input type="number" name="blood_pressure_diastolic" value={form.blood_pressure_diastolic} onChange={handleChange} placeholder="80" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Heart Rate (bpm)</label>
                                <input type="number" name="heart_rate" value={form.heart_rate} onChange={handleChange} placeholder="72" />
                            </div>
                            <div className="form-group">
                                <label>BMI</label>
                                <input type="number" step="0.1" name="bmi" value={form.bmi} onChange={handleChange} placeholder="24.5" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Blood Sugar (mg/dL)</label>
                                <input type="number" name="blood_sugar" value={form.blood_sugar} onChange={handleChange} placeholder="100" />
                            </div>
                            <div className="form-group">
                                <label>Cholesterol (mg/dL)</label>
                                <input type="number" name="cholesterol" value={form.cholesterol} onChange={handleChange} placeholder="200" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input type="checkbox" name="smoking" checked={form.smoking} onChange={handleChange} style={{ width: 'auto' }} />
                                <label style={{ marginBottom: 0 }}>🚬 Smoking</label>
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <input type="checkbox" name="alcohol" checked={form.alcohol} onChange={handleChange} style={{ width: 'auto' }} />
                                <label style={{ marginBottom: 0 }}>🍺 Alcohol</label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Exercise Level</label>
                            <select name="exercise" value={form.exercise} onChange={handleChange}>
                                <option value="none">None / Sedentary</option>
                                <option value="light">Light</option>
                                <option value="moderate">Moderate</option>
                                <option value="active">Active</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Family Medical History</label>
                            <textarea name="family_history" value={form.family_history} onChange={handleChange}
                                placeholder="e.g., Father had diabetes, mother had hypertension" />
                        </div>

                        <div className="form-group">
                            <label>Existing Conditions</label>
                            <textarea name="existing_conditions" value={form.existing_conditions} onChange={handleChange}
                                placeholder="e.g., Type 2 diabetes, asthma" />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? '🤖 Analyzing...' : '📊 Analyze Health Risk'}
                        </button>
                    </form>
                </div>

                <div>
                    {result ? (
                        <div className="ai-card">
                            <h3 style={{ marginBottom: 16 }}>🎯 Risk Assessment</h3>
                            <div style={{ textAlign: 'center', padding: 24, background: 'var(--bg-primary)', borderRadius: 12, marginBottom: 20 }}>
                                <div style={{ fontSize: '3rem', fontWeight: 800, color: riskColor(result.risk_level) }}>
                                    {result.risk_score}/100
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: riskColor(result.risk_level), textTransform: 'uppercase', marginTop: 4 }}>
                                    {result.risk_level} Risk
                                </div>
                                <div className="risk-meter" style={{ marginTop: 12 }}>
                                    <div className="risk-meter-fill" style={{ width: `${result.risk_score}%`, background: riskColor(result.risk_level) }} />
                                </div>
                            </div>

                            {result.risk_factors?.length > 0 && (
                                <div style={{ marginBottom: 20 }}>
                                    <h4 style={{ marginBottom: 10 }}>Risk Factors</h4>
                                    {result.risk_factors.map((f, i) => (
                                        <div key={i} style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, marginBottom: 6, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                            <strong style={{ color: 'var(--warning)' }}>{typeof f === 'string' ? f : f.factor}</strong>
                                            {typeof f !== 'string' && <span> — {f.detail} (+{f.points} pts)</span>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result.recommendations?.length > 0 && (
                                <div>
                                    <h4 style={{ marginBottom: 10 }}>💡 Recommendations</h4>
                                    {result.recommendations.map((r, i) => (
                                        <div key={i} style={{ padding: '10px 14px', background: 'var(--success-bg)', borderRadius: 8, marginBottom: 6, fontSize: '0.88rem', color: 'var(--success)' }}>
                                            ✅ {r}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="disclaimer">
                                ⚠️ <strong>Disclaimer:</strong> This AI risk analysis is for informational purposes only.
                                It does not replace professional medical evaluation.
                            </div>
                        </div>
                    ) : (
                        <div className="ai-card empty-state">
                            <h3>📊 Risk Assessment</h3>
                            <p style={{ marginTop: 8 }}>Fill in patient health data and click "Analyze" to get AI risk prediction</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIRiskAnalysis;
