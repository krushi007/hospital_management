"""
AI Prescription Analyzer
========================
Analyzes prescriptions for drug interactions, dosage issues, and allergy conflicts.
Uses a rule-based approach with a curated drug interaction database.
"""

# Known drug interactions database (common critical interactions)
DRUG_INTERACTIONS = {
    ('warfarin', 'aspirin'): {
        'severity': 'high',
        'description': 'Increased risk of bleeding when warfarin is combined with aspirin.',
        'recommendation': 'Monitor INR closely. Consider alternative pain relief like acetaminophen.'
    },
    ('metformin', 'alcohol'): {
        'severity': 'high',
        'description': 'Increased risk of lactic acidosis.',
        'recommendation': 'Advise patient to limit alcohol consumption.'
    },
    ('lisinopril', 'potassium'): {
        'severity': 'medium',
        'description': 'Risk of hyperkalemia (high potassium levels).',
        'recommendation': 'Monitor serum potassium levels regularly.'
    },
    ('simvastatin', 'erythromycin'): {
        'severity': 'high',
        'description': 'Increased risk of rhabdomyolysis (muscle breakdown).',
        'recommendation': 'Consider alternative antibiotic or switch statin.'
    },
    ('methotrexate', 'ibuprofen'): {
        'severity': 'high',
        'description': 'NSAIDs can increase methotrexate toxicity.',
        'recommendation': 'Avoid concurrent use. Use acetaminophen for pain relief.'
    },
    ('ciprofloxacin', 'antacids'): {
        'severity': 'medium',
        'description': 'Antacids reduce absorption of ciprofloxacin.',
        'recommendation': 'Take ciprofloxacin 2 hours before or 6 hours after antacids.'
    },
    ('ssri', 'maoi'): {
        'severity': 'critical',
        'description': 'Risk of serotonin syndrome, a potentially fatal condition.',
        'recommendation': 'Contraindicated. Allow 14-day washout period between medications.'
    },
    ('digoxin', 'amiodarone'): {
        'severity': 'high',
        'description': 'Amiodarone increases digoxin levels significantly.',
        'recommendation': 'Reduce digoxin dose by 50% and monitor levels.'
    },
    ('clopidogrel', 'omeprazole'): {
        'severity': 'medium',
        'description': 'Omeprazole may reduce the effectiveness of clopidogrel.',
        'recommendation': 'Consider pantoprazole as an alternative PPI.'
    },
    ('insulin', 'beta_blockers'): {
        'severity': 'medium',
        'description': 'Beta-blockers can mask hypoglycemia symptoms.',
        'recommendation': 'Monitor blood glucose more frequently.'
    },
}

# Drug categories (for mapping brand names to generic categories)
DRUG_CATEGORIES = {
    'ssri': ['fluoxetine', 'sertraline', 'paroxetine', 'citalopram', 'escitalopram'],
    'maoi': ['phenelzine', 'tranylcypromine', 'isocarboxazid', 'selegiline'],
    'beta_blockers': ['metoprolol', 'atenolol', 'propranolol', 'bisoprolol', 'carvedilol'],
    'nsaids': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib', 'indomethacin'],
    'antacids': ['aluminum_hydroxide', 'magnesium_hydroxide', 'calcium_carbonate'],
    'statins': ['atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin'],
}

# Dosage ranges for common medications (mg per day)
DOSAGE_RANGES = {
    'metformin': {'min': 500, 'max': 2550, 'unit': 'mg'},
    'lisinopril': {'min': 5, 'max': 40, 'unit': 'mg'},
    'amlodipine': {'min': 2.5, 'max': 10, 'unit': 'mg'},
    'atorvastatin': {'min': 10, 'max': 80, 'unit': 'mg'},
    'omeprazole': {'min': 10, 'max': 40, 'unit': 'mg'},
    'aspirin': {'min': 75, 'max': 325, 'unit': 'mg'},
    'metoprolol': {'min': 25, 'max': 400, 'unit': 'mg'},
    'ibuprofen': {'min': 200, 'max': 1200, 'unit': 'mg'},
    'amoxicillin': {'min': 250, 'max': 3000, 'unit': 'mg'},
    'paracetamol': {'min': 325, 'max': 4000, 'unit': 'mg'},
    'ciprofloxacin': {'min': 250, 'max': 1500, 'unit': 'mg'},
    'warfarin': {'min': 1, 'max': 10, 'unit': 'mg'},
    'prednisone': {'min': 5, 'max': 60, 'unit': 'mg'},
    'gabapentin': {'min': 300, 'max': 3600, 'unit': 'mg'},
}

# Common allergens and their drug mappings
ALLERGY_DRUG_MAP = {
    'penicillin': ['amoxicillin', 'ampicillin', 'penicillin', 'piperacillin'],
    'sulfa': ['sulfamethoxazole', 'sulfasalazine', 'sulfadiazine'],
    'aspirin': ['aspirin', 'ibuprofen', 'naproxen', 'diclofenac'],
    'codeine': ['codeine', 'morphine', 'hydrocodone', 'oxycodone'],
    'latex': [],
    'iodine': [],
}


def _normalize_drug_name(name):
    """Normalize drug name for matching."""
    return name.lower().strip().replace('-', '_').replace(' ', '_')


def _get_drug_category(drug_name):
    """Get the category of a drug, or return the drug name itself."""
    normalized = _normalize_drug_name(drug_name)
    for category, drugs in DRUG_CATEGORIES.items():
        if normalized in drugs:
            return category
    return normalized


def _check_interactions(medications):
    """Check for drug-drug interactions."""
    interactions = []
    drug_names = [_normalize_drug_name(m.get('name', '')) for m in medications]
    drug_categories = [_get_drug_category(name) for name in drug_names]

    for i in range(len(drug_names)):
        for j in range(i + 1, len(drug_names)):
            # Check both drug names and categories
            pairs_to_check = [
                (drug_names[i], drug_names[j]),
                (drug_names[i], drug_categories[j]),
                (drug_categories[i], drug_names[j]),
                (drug_categories[i], drug_categories[j]),
            ]
            for pair in pairs_to_check:
                key1 = (pair[0], pair[1])
                key2 = (pair[1], pair[0])
                interaction = DRUG_INTERACTIONS.get(key1) or DRUG_INTERACTIONS.get(key2)
                if interaction:
                    interactions.append({
                        'drugs': [medications[i].get('name', ''), medications[j].get('name', '')],
                        **interaction
                    })
                    break
    return interactions


def _check_dosages(medications):
    """Check for dosage issues."""
    issues = []
    for med in medications:
        name = _normalize_drug_name(med.get('name', ''))
        dosage_str = med.get('dosage', '')

        if name in DOSAGE_RANGES:
            range_info = DOSAGE_RANGES[name]
            try:
                dosage_value = float(''.join(c for c in dosage_str if c.isdigit() or c == '.'))
                if dosage_value > range_info['max']:
                    issues.append({
                        'drug': med.get('name', ''),
                        'issue': 'high_dosage',
                        'current': f"{dosage_value} {range_info['unit']}",
                        'recommended_range': f"{range_info['min']}-{range_info['max']} {range_info['unit']}/day",
                        'message': f"Dosage of {med.get('name', '')} ({dosage_value}{range_info['unit']}) exceeds maximum recommended daily dose ({range_info['max']}{range_info['unit']})."
                    })
                elif dosage_value < range_info['min']:
                    issues.append({
                        'drug': med.get('name', ''),
                        'issue': 'low_dosage',
                        'current': f"{dosage_value} {range_info['unit']}",
                        'recommended_range': f"{range_info['min']}-{range_info['max']} {range_info['unit']}/day",
                        'message': f"Dosage of {med.get('name', '')} ({dosage_value}{range_info['unit']}) is below minimum effective dose ({range_info['min']}{range_info['unit']})."
                    })
            except (ValueError, TypeError):
                pass
    return issues


def _check_allergies(medications, patient_allergies):
    """Check medications against patient allergies."""
    conflicts = []
    if not patient_allergies:
        return conflicts

    allergy_list = [a.strip().lower() for a in patient_allergies.split(',')]

    for med in medications:
        drug_name = _normalize_drug_name(med.get('name', ''))
        for allergy in allergy_list:
            allergy_normalized = allergy.replace(' ', '_')
            # Direct match
            if allergy_normalized == drug_name:
                conflicts.append({
                    'drug': med.get('name', ''),
                    'allergy': allergy,
                    'severity': 'critical',
                    'message': f"CRITICAL: Patient is allergic to {allergy}. {med.get('name', '')} is contraindicated."
                })
            # Cross-reactivity check
            elif allergy_normalized in ALLERGY_DRUG_MAP:
                if drug_name in ALLERGY_DRUG_MAP[allergy_normalized]:
                    conflicts.append({
                        'drug': med.get('name', ''),
                        'allergy': allergy,
                        'severity': 'high',
                        'message': f"Patient has {allergy} allergy. {med.get('name', '')} may cause cross-reactivity."
                    })
    return conflicts


def analyze_prescription(prescription):
    """
    Main analysis function.
    Args:
        prescription: Prescription model instance
    Returns:
        dict with analysis results
    """
    medications = prescription.medications or []
    patient_allergies = ''
    if hasattr(prescription, 'patient') and hasattr(prescription.patient, 'allergies'):
        patient_allergies = prescription.patient.allergies

    interactions = _check_interactions(medications)
    dosage_issues = _check_dosages(medications)
    allergy_conflicts = _check_allergies(medications, patient_allergies)

    # Overall risk score
    risk_score = 0
    for interaction in interactions:
        if interaction['severity'] == 'critical':
            risk_score += 30
        elif interaction['severity'] == 'high':
            risk_score += 20
        elif interaction['severity'] == 'medium':
            risk_score += 10
    for issue in dosage_issues:
        risk_score += 15 if issue['issue'] == 'high_dosage' else 5
    for conflict in allergy_conflicts:
        risk_score += 30 if conflict['severity'] == 'critical' else 20

    risk_level = 'low'
    if risk_score >= 30:
        risk_level = 'high'
    elif risk_score >= 15:
        risk_level = 'medium'

    return {
        'risk_level': risk_level,
        'risk_score': min(risk_score, 100),
        'interactions': interactions,
        'dosage_issues': dosage_issues,
        'allergy_conflicts': allergy_conflicts,
        'total_issues': len(interactions) + len(dosage_issues) + len(allergy_conflicts),
        'summary': _generate_summary(interactions, dosage_issues, allergy_conflicts),
    }


def _generate_summary(interactions, dosage_issues, allergy_conflicts):
    """Generate human-readable summary."""
    parts = []
    if allergy_conflicts:
        parts.append(f"⚠️ {len(allergy_conflicts)} allergy conflict(s) detected!")
    if interactions:
        parts.append(f"💊 {len(interactions)} drug interaction(s) found.")
    if dosage_issues:
        parts.append(f"📊 {len(dosage_issues)} dosage concern(s) identified.")
    if not parts:
        parts.append("✅ No significant issues detected in this prescription.")
    return ' '.join(parts)
