import React, { useState, useEffect } from 'react';
import { aiAPI, patientAPI, prescriptionAPI } from '../api/client';
import toast from 'react-hot-toast';

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', snacks: '🍪', dinner: '🌙' };
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snacks: 'Snacks', dinner: 'Dinner' };

const AIDietPlanner = () => {
    const [diseases, setDiseases] = useState([]);
    const [selectedDisease, setSelectedDisease] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dietTab, setDietTab] = useState('veg');

    // Patient selection state
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [patientDiagnosis, setPatientDiagnosis] = useState('');
    const [inputMode, setInputMode] = useState('patient'); // 'patient' or 'manual'

    useEffect(() => {
        aiAPI.getDietDiseases()
            .then(r => setDiseases(r.data.diseases || []))
            .catch(() => {});
        patientAPI.list({ my_patients: true })
            .then(r => {
                const data = r.data.results || r.data || [];
                setPatients(data);
            })
            .catch(() => {});
    }, []);

    // When a patient is selected, fetch their latest prescription diagnosis
    const handlePatientSelect = async (patientId) => {
        setSelectedPatient(patientId);
        setPatientDiagnosis('');
        setSelectedDisease('');
        setResult(null);
        if (!patientId) return;

        try {
            const res = await prescriptionAPI.list();
            const allRx = res.data.results || res.data || [];
            // Find prescriptions for this patient
            const patientRx = allRx.filter(rx => rx.patient_id === patientId);
            if (patientRx.length > 0) {
                const latestDiagnosis = patientRx[0].diagnosis || '';
                setPatientDiagnosis(latestDiagnosis);
                setSelectedDisease(latestDiagnosis);
                // Auto-generate diet plan
                if (latestDiagnosis) {
                    setLoading(true);
                    try {
                        const dietRes = await aiAPI.getDietPlan({ disease: latestDiagnosis });
                        setResult(dietRes.data);
                        setDietTab('veg');
                        toast.success(`Diet plan generated for "${latestDiagnosis}"`);
                    } catch {
                        toast.error(`No diet plan found for "${latestDiagnosis}". Try entering the condition manually.`);
                    } finally {
                        setLoading(false);
                    }
                }
            } else {
                toast('No prescriptions found for this patient. Enter condition manually.', { icon: 'ℹ️' });
            }
        } catch {
            toast.error('Failed to fetch patient prescriptions');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDisease) return toast.error('Please enter a condition');
        setLoading(true);
        try {
            const res = await aiAPI.getDietPlan({ disease: selectedDisease });
            setResult(res.data);
            setDietTab('veg');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to get diet plan');
        } finally {
            setLoading(false);
        }
    };

    const getPatientName = (p) => {
        if (p.user?.first_name) return `${p.user.first_name} ${p.user.last_name || ''}`.trim();
        if (p.first_name) return `${p.first_name} ${p.last_name || ''}`.trim();
        return p.name || `Patient #${p._id || p.id}`;
    };

    const renderMealCard = (mealKey, items) => (
        <div key={mealKey} style={{
            background: 'var(--bg-primary)', borderRadius: 'var(--radius)', padding: 20,
            border: '1px solid var(--border)', marginBottom: 16
        }}>
            <h4 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{MEAL_ICONS[mealKey]}</span>
                {MEAL_LABELS[mealKey]}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, i) => (
                    <div key={i} style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '12px 16px',
                        display: 'flex', flexDirection: 'column', gap: 4
                    }}>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {item.item}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--success)', fontStyle: 'italic' }}>
                            ✦ {item.benefit}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>🥗 AI Diet Planner</h1>
                    <p>Get personalized diet plans based on medical conditions</p>
                </div>
            </div>

            <div className="grid-2">
                {/* Left: Input */}
                <div className="ai-card">
                    <h3 style={{ marginBottom: 16 }}>Generate Diet Plan</h3>

                    {/* Mode Toggle */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        <button
                            type="button"
                            onClick={() => { setInputMode('patient'); setResult(null); setSelectedDisease(''); setPatientDiagnosis(''); setSelectedPatient(''); }}
                            className={`btn ${inputMode === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.85rem' }}
                        >
                            👤 By Patient
                        </button>
                        <button
                            type="button"
                            onClick={() => { setInputMode('manual'); setResult(null); setSelectedDisease(''); setSelectedPatient(''); setPatientDiagnosis(''); }}
                            className={`btn ${inputMode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, fontSize: '0.85rem' }}
                        >
                            ✏️ Manual Entry
                        </button>
                    </div>

                    {inputMode === 'patient' ? (
                        <>
                            <div className="form-group">
                                <label>Select Patient</label>
                                <select
                                    value={selectedPatient}
                                    onChange={(e) => handlePatientSelect(e.target.value)}
                                >
                                    <option value="">— Select a patient —</option>
                                    {patients.map((p) => (
                                        <option key={p._id || p.id} value={p._id || p.id}>
                                            {getPatientName(p)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {patientDiagnosis && (
                                <div style={{
                                    background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)',
                                    padding: '10px 14px', marginBottom: 16, fontSize: '0.88rem'
                                }}>
                                    <strong style={{ color: 'var(--accent)' }}>Diagnosis Found:</strong>{' '}
                                    <span style={{ color: 'var(--text-primary)' }}>{patientDiagnosis}</span>
                                </div>
                            )}
                            {selectedPatient && !patientDiagnosis && !loading && (
                                <div style={{
                                    background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)',
                                    padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem', color: 'var(--warning)'
                                }}>
                                    No diagnosis found. You can enter a condition manually below:
                                    <div className="form-group" style={{ marginTop: 10 }}>
                                        <input
                                            type="text"
                                            list="disease-list"
                                            value={selectedDisease}
                                            onChange={(e) => setSelectedDisease(e.target.value)}
                                            placeholder="Type a condition..."
                                        />
                                        <datalist id="disease-list-patient">
                                            {diseases.map((d, i) => (
                                                <option key={i} value={d} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <button type="button" className="btn btn-primary btn-block" disabled={loading || !selectedDisease} onClick={handleSubmit}>
                                        {loading ? '🤖 Generating...' : '🍽️ Get Diet Plan'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Disease / Condition</label>
                                <input
                                    type="text"
                                    list="disease-list"
                                    value={selectedDisease}
                                    onChange={(e) => setSelectedDisease(e.target.value)}
                                    placeholder="Type or select a condition..."
                                    required
                                />
                                <datalist id="disease-list">
                                    {diseases.map((d, i) => (
                                        <option key={i} value={d} />
                                    ))}
                                </datalist>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                {loading ? '🤖 Generating Plan...' : '🍽️ Get Diet Plan'}
                            </button>
                        </form>
                    )}

                    {/* Info cards */}
                    {!result && (
                        <div style={{ marginTop: 24 }}>
                            <div style={{
                                background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)',
                                padding: 16, marginBottom: 12
                            }}>
                                <h4 style={{ color: 'var(--accent)', marginBottom: 6, fontSize: '0.9rem' }}>🥦 Vegetarian Plans</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    Plant-based meals with dal, paneer, vegetables, grains, and Indian superfoods.
                                </p>
                            </div>
                            <div style={{
                                background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)',
                                padding: 16, marginBottom: 12
                            }}>
                                <h4 style={{ color: 'var(--warning)', marginBottom: 6, fontSize: '0.9rem' }}>🍗 Non-Vegetarian Plans</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    Includes lean meats, fish, eggs, and seafood for higher protein and iron needs.
                                </p>
                            </div>
                            <div style={{
                                background: 'var(--success-bg)', borderRadius: 'var(--radius-sm)',
                                padding: 16
                            }}>
                                <h4 style={{ color: 'var(--success)', marginBottom: 6, fontSize: '0.9rem' }}>📊 Evidence-Based</h4>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                                    Recommendations based on clinical nutrition guidelines and real-world dietary data.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Results */}
                <div>
                    {result ? (
                        <div className="ai-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3>Diet Plan: {result.disease}</h3>
                            </div>

                            {/* Veg / Non-Veg Tabs */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                                <button
                                    onClick={() => setDietTab('veg')}
                                    className={`btn ${dietTab === 'veg' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1 }}
                                >
                                    🥦 Vegetarian
                                </button>
                                <button
                                    onClick={() => setDietTab('nonveg')}
                                    className={`btn ${dietTab === 'nonveg' ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ flex: 1 }}
                                >
                                    🍗 Non-Vegetarian
                                </button>
                            </div>

                            {/* Meal Cards */}
                            {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal =>
                                renderMealCard(meal, result[dietTab]?.[meal] || [])
                            )}

                            {/* Foods to Avoid */}
                            <div style={{
                                background: 'var(--danger-bg)', borderRadius: 'var(--radius)',
                                padding: 20, marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)'
                            }}>
                                <h4 style={{ color: 'var(--danger)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    🚫 Foods to Avoid
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(result.foods_to_avoid || []).map((f, i) => (
                                        <span key={i} style={{
                                            background: 'rgba(239,68,68,0.12)', color: '#f87171',
                                            padding: '5px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 500
                                        }}>
                                            ✗ {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hydration */}
                            <div style={{
                                background: 'var(--info-bg)', borderRadius: 'var(--radius)',
                                padding: 20, marginBottom: 16, border: '1px solid rgba(6,182,212,0.2)'
                            }}>
                                <h4 style={{ color: 'var(--info)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    💧 Hydration Tips
                                </h4>
                                {(result.hydration || []).map((h, i) => (
                                    <div key={i} style={{
                                        padding: '6px 0', fontSize: '0.88rem', color: 'var(--text-secondary)',
                                        borderBottom: i < result.hydration.length - 1 ? '1px solid var(--border)' : 'none'
                                    }}>
                                        💦 {h}
                                    </div>
                                ))}
                            </div>

                            {/* Key Nutrients */}
                            <div style={{
                                background: 'var(--success-bg)', borderRadius: 'var(--radius)',
                                padding: 20, marginBottom: 16, border: '1px solid rgba(34,197,94,0.2)'
                            }}>
                                <h4 style={{ color: 'var(--success)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    💊 Key Nutrients to Focus On
                                </h4>
                                {(result.key_nutrients || []).map((n, i) => (
                                    <div key={i} style={{
                                        padding: '8px 12px', background: 'rgba(34,197,94,0.08)',
                                        borderRadius: 'var(--radius-sm)', marginBottom: 6,
                                        fontSize: '0.88rem', color: 'var(--text-secondary)'
                                    }}>
                                        ✅ {n}
                                    </div>
                                ))}
                            </div>

                            {/* Disclaimer */}
                            <div style={{
                                background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)',
                                padding: '12px 16px', fontSize: '0.82rem', color: 'var(--warning)',
                                border: '1px solid rgba(245,158,11,0.2)'
                            }}>
                                ⚠️ <strong>Disclaimer:</strong> {result.disclaimer}
                            </div>
                        </div>
                    ) : (
                        <div className="ai-card empty-state">
                            <h3>🍽️ Diet Recommendations</h3>
                            <p style={{ marginTop: 8 }}>Select a condition and click "Get Diet Plan" to receive personalized meal recommendations</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIDietPlanner;
