"""
AI Health Risk Analyzer
=======================
Evaluates patient health data to predict risk level and provide recommendations.
Uses a weighted scoring model based on age, BMI, vitals, and medical history.
"""


def analyze_risk(patient_data):
    """
    Analyze patient health risk based on various factors.
    
    Args:
        patient_data: dict with keys:
            - age (int)
            - gender (str)
            - bmi (float, optional)
            - blood_pressure_systolic (int, optional)
            - blood_pressure_diastolic (int, optional)
            - heart_rate (int, optional)
            - blood_sugar (float, optional - fasting glucose mg/dL)
            - cholesterol (float, optional - total mg/dL)
            - smoking (bool)
            - alcohol (bool)
            - exercise_frequency (str: 'none', 'low', 'moderate', 'high')
            - chronic_conditions (list of str, optional)
            - family_history (list of str, optional)
    
    Returns:
        dict with risk assessment
    """
    risk_score = 0
    risk_factors = []
    recommendations = []
    details = {}

    # --- Age Risk ---
    age = patient_data.get('age', 0)
    if age >= 65:
        risk_score += 20
        risk_factors.append({'factor': 'Age', 'detail': f'Age {age} — higher risk group', 'points': 20})
    elif age >= 50:
        risk_score += 12
        risk_factors.append({'factor': 'Age', 'detail': f'Age {age} — moderate risk group', 'points': 12})
    elif age >= 40:
        risk_score += 5
        risk_factors.append({'factor': 'Age', 'detail': f'Age {age} — slightly elevated risk', 'points': 5})

    # --- BMI Risk ---
    bmi = patient_data.get('bmi')
    if bmi:
        details['bmi'] = bmi
        if bmi >= 35:
            risk_score += 20
            risk_factors.append({'factor': 'BMI', 'detail': f'BMI {bmi} — Severe obesity', 'points': 20})
            recommendations.append('Consider a structured weight management program with a dietitian.')
        elif bmi >= 30:
            risk_score += 15
            risk_factors.append({'factor': 'BMI', 'detail': f'BMI {bmi} — Obese', 'points': 15})
            recommendations.append('Aim for gradual weight loss with balanced diet and regular exercise.')
        elif bmi >= 25:
            risk_score += 8
            risk_factors.append({'factor': 'BMI', 'detail': f'BMI {bmi} — Overweight', 'points': 8})
            recommendations.append('Maintain healthy diet and increase physical activity.')
        elif bmi < 18.5:
            risk_score += 10
            risk_factors.append({'factor': 'BMI', 'detail': f'BMI {bmi} — Underweight', 'points': 10})
            recommendations.append('Consult a nutritionist for a healthy weight gain plan.')

    # --- Blood Pressure ---
    systolic = patient_data.get('blood_pressure_systolic')
    diastolic = patient_data.get('blood_pressure_diastolic')
    if systolic:
        details['blood_pressure'] = f"{systolic}/{diastolic}"
        if systolic >= 180 or (diastolic and diastolic >= 120):
            risk_score += 25
            risk_factors.append({'factor': 'Blood Pressure', 'detail': 'Hypertensive crisis', 'points': 25})
            recommendations.append('URGENT: Seek immediate medical attention for blood pressure.')
        elif systolic >= 140 or (diastolic and diastolic >= 90):
            risk_score += 18
            risk_factors.append({'factor': 'Blood Pressure', 'detail': 'Stage 2 Hypertension', 'points': 18})
            recommendations.append('Take antihypertensive medications and reduce sodium intake.')
        elif systolic >= 130 or (diastolic and diastolic >= 80):
            risk_score += 10
            risk_factors.append({'factor': 'Blood Pressure', 'detail': 'Stage 1 Hypertension', 'points': 10})
            recommendations.append('Lifestyle modifications: reduce salt, exercise regularly.')

    # --- Heart Rate ---
    hr = patient_data.get('heart_rate')
    if hr:
        details['heart_rate'] = hr
        if hr > 100:
            risk_score += 10
            risk_factors.append({'factor': 'Heart Rate', 'detail': f'{hr} bpm — Tachycardia', 'points': 10})
            recommendations.append('Monitor heart rate and consult a cardiologist if persistent.')
        elif hr < 50:
            risk_score += 10
            risk_factors.append({'factor': 'Heart Rate', 'detail': f'{hr} bpm — Bradycardia', 'points': 10})

    # --- Blood Sugar ---
    sugar = patient_data.get('blood_sugar')
    if sugar:
        details['blood_sugar_fasting'] = sugar
        if sugar >= 200:
            risk_score += 20
            risk_factors.append({'factor': 'Blood Sugar', 'detail': f'{sugar} mg/dL — Diabetic range', 'points': 20})
            recommendations.append('Consult endocrinologist. Monitor blood sugar daily.')
        elif sugar >= 126:
            risk_score += 15
            risk_factors.append({'factor': 'Blood Sugar', 'detail': f'{sugar} mg/dL — Diabetic range (fasting)', 'points': 15})
            recommendations.append('Manage diet, reduce sugar intake, consider medication.')
        elif sugar >= 100:
            risk_score += 8
            risk_factors.append({'factor': 'Blood Sugar', 'detail': f'{sugar} mg/dL — Pre-diabetic', 'points': 8})
            recommendations.append('Lifestyle changes to prevent diabetes progression.')

    # --- Cholesterol ---
    chol = patient_data.get('cholesterol')
    if chol:
        details['cholesterol_total'] = chol
        if chol >= 240:
            risk_score += 15
            risk_factors.append({'factor': 'Cholesterol', 'detail': f'{chol} mg/dL — High', 'points': 15})
            recommendations.append('Reduce saturated fat. Consider statin therapy.')
        elif chol >= 200:
            risk_score += 8
            risk_factors.append({'factor': 'Cholesterol', 'detail': f'{chol} mg/dL — Borderline high', 'points': 8})
            recommendations.append('Increase fiber and omega-3 intake. Regular monitoring.')

    # --- Lifestyle Risks ---
    if patient_data.get('smoking'):
        risk_score += 15
        risk_factors.append({'factor': 'Smoking', 'detail': 'Active smoker', 'points': 15})
        recommendations.append('Strongly recommended to quit smoking. Consider cessation programs.')

    if patient_data.get('alcohol'):
        risk_score += 8
        risk_factors.append({'factor': 'Alcohol', 'detail': 'Regular alcohol consumption', 'points': 8})
        recommendations.append('Limit alcohol to moderate levels (≤1 drink/day for women, ≤2 for men).')

    exercise = patient_data.get('exercise_frequency') or patient_data.get('exercise', 'none')
    if exercise == 'none':
        risk_score += 10
        risk_factors.append({'factor': 'Exercise', 'detail': 'Sedentary lifestyle', 'points': 10})
        recommendations.append('Start with 30 minutes of moderate exercise, 5 days a week.')
    elif exercise in ('low', 'light'):
        risk_score += 5
        risk_factors.append({'factor': 'Exercise', 'detail': 'Low physical activity', 'points': 5})
        recommendations.append('Gradually increase exercise frequency and intensity.')

    # --- Chronic Conditions ---
    chronic = patient_data.get('chronic_conditions') or patient_data.get('existing_conditions', [])
    if isinstance(chronic, str):
        chronic = [c.strip() for c in chronic.split(',') if c.strip()]
    high_risk_conditions = ['diabetes', 'heart disease', 'cancer', 'kidney disease', 'liver disease', 'copd']
    for condition in chronic:
        if condition.lower() in high_risk_conditions:
            risk_score += 15
            risk_factors.append({
                'factor': 'Chronic Condition',
                'detail': f'Existing condition: {condition}',
                'points': 15
            })

    # --- Family History ---
    family = patient_data.get('family_history', [])
    if isinstance(family, str):
        family = [f.strip() for f in family.split(',') if f.strip()]
    if family:
        risk_score += 5 * min(len(family), 3)
        risk_factors.append({
            'factor': 'Family History',
            'detail': f'Family history of: {", ".join(family[:3])}',
            'points': 5 * min(len(family), 3)
        })
        recommendations.append('Regular screening recommended due to family history.')

    # --- Calculate Risk Level ---
    risk_score = min(risk_score, 100)
    if risk_score >= 60:
        risk_level = 'high'
        level_color = '#ef4444'
        level_description = 'High risk — immediate medical attention recommended.'
    elif risk_score >= 30:
        risk_level = 'medium'
        level_color = '#f59e0b'
        level_description = 'Moderate risk — lifestyle changes and regular monitoring advised.'
    else:
        risk_level = 'low'
        level_color = '#22c55e'
        level_description = 'Low risk — maintain healthy lifestyle and routine check-ups.'

    if not recommendations:
        recommendations.append('Continue current healthy lifestyle and attend routine check-ups.')

    return {
        'risk_level': risk_level,
        'risk_score': risk_score,
        'level_color': level_color,
        'level_description': level_description,
        'risk_factors': risk_factors,
        'recommendations': recommendations,
        'details': details,
        'disclaimer': (
            '⚕️ DISCLAIMER: This risk assessment is for informational purposes only '
            'and is NOT a medical diagnosis. Consult a qualified healthcare professional '
            'for proper evaluation and treatment.'
        ),
    }
