import React, { useState, useEffect } from 'react';
import { aiAPI } from '../api/client';
import toast from 'react-hot-toast';

const COMMON_SYMPTOMS = [
    'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Sore Throat',
    'Body Ache', 'Shortness of Breath', 'Chest Pain', 'Dizziness',
    'Vomiting', 'Diarrhea', 'Runny Nose', 'Sneezing', 'Joint Pain',
    'Abdominal Pain', 'Back Pain', 'Skin Rash', 'Weight Loss', 'Blurred Vision',
    'Swelling', 'Frequent Urination', 'Insomnia', 'Memory Loss', 'Muscle Weakness',
    'Numbness', 'Palpitations', 'Loss of Appetite', 'Excessive Thirst', 'Night Sweats',
];

const AIDiseaseFinder = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [customSymptom, setCustomSymptom] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleSymptom = (sym) => {
        setSelectedSymptoms(prev =>
            prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
        );
        setResult(null);
    };

    const addCustom = () => {
        if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
            setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
            setCustomSymptom('');
        }
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length < 2) { toast.error('Select at least 2 symptoms'); return; }
        setLoading(true);
        try {
            const res = await aiAPI.predictDisease(selectedSymptoms);
            setResult(res.data);
        } catch {
            toast.error('Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div><h1>🔬 AI Disease Finder</h1><p>Input symptoms to predict possible diseases with AI</p></div>
            </div>

            <div className="grid-2">
                <div className="ai-card">
                    <h3 style={{ marginBottom: 16 }}>Select Symptoms</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                        {COMMON_SYMPTOMS.map(sym => (
                            <span key={sym} className={`symptom-tag ${selectedSymptoms.includes(sym) ? 'selected' : ''}`}
                                onClick={() => toggleSymptom(sym)}>
                                {sym}
                                {selectedSymptoms.includes(sym) && <span className="remove">×</span>}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input className="search-input" placeholder="Add custom symptom..."
                            value={customSymptom} onChange={e => setCustomSymptom(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && addCustom()} />
                        <button className="btn btn-secondary" onClick={addCustom}>Add</button>
                    </div>

                    {selectedSymptoms.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <strong>Selected ({selectedSymptoms.length}):</strong>
                            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {selectedSymptoms.map(s => (
                                    <span key={s} className="symptom-tag selected" onClick={() => toggleSymptom(s)}>
                                        {s} <span className="remove">×</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="btn btn-primary btn-block" style={{ marginTop: 20 }}
                        onClick={handlePredict} disabled={loading || selectedSymptoms.length < 2}>
                        {loading ? '🤖 Analyzing...' : '🔍 Predict Diseases'}
                    </button>
                </div>

                <div>
                    {result ? (
                        <div className="ai-card">
                            <h3 style={{ marginBottom: 16 }}>🎯 Prediction Results</h3>
                            {result.predictions?.map((pred, i) => (
                                <div key={i} className="prediction-card">
                                    <h4>
                                        <span>{pred.disease}</span>
                                        <span style={{ color: pred.probability > 60 ? 'var(--danger)' : pred.probability > 30 ? 'var(--warning)' : 'var(--success)' }}>
                                            {pred.probability}%
                                        </span>
                                    </h4>
                                    <div className="prediction-bar">
                                        <div className="prediction-bar-fill" style={{ width: `${pred.probability}%` }} />
                                    </div>
                                    {pred.department && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            🏥 Recommended: <strong>{pred.department}</strong>
                                        </p>
                                    )}
                                    {pred.precautions?.length > 0 && (
                                        <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                            <strong>Precautions:</strong>
                                            <ul style={{ marginTop: 4, paddingLeft: 18 }}>
                                                {pred.precautions.map((p, j) => <li key={j}>{p}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="disclaimer">
                                ⚠️ <strong>Disclaimer:</strong> This is an AI-powered prediction tool and is NOT a medical diagnosis.
                                Always consult a qualified healthcare professional for proper diagnosis and treatment.
                            </div>
                        </div>
                    ) : (
                        <div className="ai-card empty-state">
                            <h3>🤖 AI Disease Finder</h3>
                            <p style={{ marginTop: 8 }}>Select symptoms and click "Predict Diseases" to get AI-powered predictions</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIDiseaseFinder;
