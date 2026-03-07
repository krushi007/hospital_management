from flask import Flask, request, jsonify
from ai_engine.disease_finder import predict_disease
from ai_engine.risk_analyzer import analyze_risk
from ai_engine.prescription_analyzer import analyze_prescription
import sys
import os

app = Flask(__name__)

@app.route('/ml/disease', methods=['POST'])
def predict():
    data = request.json
    symptoms = data.get('symptoms', [])
    if not symptoms:
        return jsonify({'error': 'Please provide at least one symptom.'}), 400
    try:
        result = predict_disease(symptoms)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ml/risk', methods=['POST'])
def risk():
    patient_data = request.json
    if not patient_data:
        return jsonify({'error': 'Please provide patient data.'}), 400
    try:
        result = analyze_risk(patient_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ml/prescription', methods=['POST'])
def prescription():
    data = request.json
    medications = data.get('medications', [])
    allergies = data.get('allergies', '')
    
    class MockPrescription:
        def __init__(self, meds, algs):
            self.medications = meds
            self.patient = type('obj', (object,), {'allergies': algs})()
            
    try:
        mock = MockPrescription(medications, allergies)
        result = analyze_prescription(mock)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8001, debug=True)
