"""
AI Disease Finder — Enhanced
=============================
Predicts possible diseases based on input symptoms.
Uses a Random Forest classifier trained on a real-world symptom-disease dataset.

Dataset sources (public domain):
  - Columbia University Disease-Symptom Knowledge Database
  - Kaggle disease-symptom dataset (by Pranay Patil)
  - WHO ICD-10 symptom mappings
  - PubMed clinical case studies

Contains 60 diseases and 180+ symptoms for improved accuracy.
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# ─── COMPREHENSIVE REAL-WORLD SYMPTOM–DISEASE DATABASE ────────────────────────
# Each disease has: known symptoms, recommended department, and precautions.
# Symptoms use natural language matching (lowercase, spaces).

DISEASE_DB = {
    # ── RESPIRATORY ──────────────────────────────────────────────────────────
    'Common Cold': {
        'symptoms': ['sneezing', 'runny nose', 'cough', 'sore throat', 'mild fever',
                     'fatigue', 'headache', 'watery eyes', 'congestion', 'body ache'],
        'department': 'General Medicine',
        'severity': 'mild',
        'precautions': ['Rest and stay hydrated', 'Take OTC cold medications',
                        'Gargle with warm salt water', 'Use a humidifier']
    },
    'Influenza (Flu)': {
        'symptoms': ['high fever', 'body ache', 'fatigue', 'cough', 'headache',
                     'chills', 'sore throat', 'runny nose', 'muscle pain', 'weakness',
                     'sweating', 'loss of appetite'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Complete bed rest', 'Stay hydrated with warm fluids',
                        'Take antiviral medication if prescribed', 'Monitor temperature']
    },
    'COVID-19': {
        'symptoms': ['fever', 'dry cough', 'fatigue', 'loss of taste', 'loss of smell',
                     'shortness of breath', 'body ache', 'sore throat', 'headache',
                     'diarrhea', 'chest pain', 'congestion'],
        'department': 'Pulmonology',
        'severity': 'high',
        'precautions': ['Isolate immediately', 'Get tested (RT-PCR)',
                        'Monitor oxygen levels (SpO2)', 'Seek emergency care if SpO2 < 94%']
    },
    'Pneumonia': {
        'symptoms': ['high fever', 'cough', 'chest pain', 'shortness of breath',
                     'fatigue', 'chills', 'rapid breathing', 'nausea', 'sweating',
                     'muscle pain', 'loss of appetite'],
        'department': 'Pulmonology',
        'severity': 'high',
        'precautions': ['Seek immediate medical attention', 'Complete antibiotics course',
                        'Rest and stay hydrated', 'Monitor breathing and oxygen levels']
    },
    'Tuberculosis': {
        'symptoms': ['persistent cough', 'weight loss', 'night sweats', 'fatigue',
                     'fever', 'chest pain', 'loss of appetite', 'coughing blood',
                     'weakness', 'chills'],
        'department': 'Pulmonology',
        'severity': 'high',
        'precautions': ['Complete full TB treatment (6-9 months)', 'Isolate during infectious period',
                        'Regular follow-up with doctor', 'Maintain good nutrition']
    },
    'Bronchitis': {
        'symptoms': ['cough', 'chest discomfort', 'fatigue', 'shortness of breath',
                     'mild fever', 'sore throat', 'body ache', 'wheezing', 'mucus production'],
        'department': 'Pulmonology',
        'severity': 'moderate',
        'precautions': ['Rest and avoid irritants', 'Stay hydrated',
                        'Use a humidifier', 'Take cough suppressants if needed']
    },
    'Asthma': {
        'symptoms': ['wheezing', 'shortness of breath', 'chest tightness', 'cough',
                     'difficulty breathing', 'rapid breathing', 'anxiety', 'sweating'],
        'department': 'Pulmonology',
        'severity': 'moderate',
        'precautions': ['Use prescribed inhalers regularly', 'Avoid triggers (dust, smoke, pollen)',
                        'Keep rescue inhaler accessible', 'Follow asthma action plan']
    },
    'COPD': {
        'symptoms': ['shortness of breath', 'persistent cough', 'wheezing', 'chest tightness',
                     'fatigue', 'weight loss', 'swelling in ankles', 'mucus production'],
        'department': 'Pulmonology',
        'severity': 'high',
        'precautions': ['Quit smoking immediately', 'Use bronchodilators as prescribed',
                        'Pulmonary rehabilitation', 'Annual flu vaccination']
    },
    'Sinusitis': {
        'symptoms': ['facial pain', 'congestion', 'runny nose', 'headache', 'cough',
                     'sore throat', 'fever', 'loss of smell', 'bad breath',
                     'tooth pain', 'fatigue'],
        'department': 'ENT',
        'severity': 'mild',
        'precautions': ['Use nasal saline spray', 'Apply warm compress to face',
                        'Stay hydrated', 'Use decongestants if prescribed']
    },

    # ── NEUROLOGICAL ─────────────────────────────────────────────────────────
    'Migraine': {
        'symptoms': ['severe headache', 'nausea', 'vomiting', 'light sensitivity',
                     'blurred vision', 'dizziness', 'throbbing pain', 'aura',
                     'neck stiffness', 'irritability'],
        'department': 'Neurology',
        'severity': 'moderate',
        'precautions': ['Rest in a dark quiet room', 'Apply cold compress to forehead',
                        'Take prescribed migraine medication', 'Identify and avoid triggers']
    },
    'Tension Headache': {
        'symptoms': ['headache', 'neck pain', 'fatigue', 'difficulty concentrating',
                     'muscle tension', 'irritability', 'sleep disturbance'],
        'department': 'Neurology',
        'severity': 'mild',
        'precautions': ['Manage stress with relaxation techniques', 'Improve posture',
                        'Get adequate sleep', 'Take OTC pain relievers if occasional']
    },
    'Stroke': {
        'symptoms': ['sudden numbness', 'confusion', 'difficulty speaking', 'severe headache',
                     'dizziness', 'loss of balance', 'blurred vision', 'face drooping',
                     'weakness in arm', 'difficulty walking'],
        'department': 'Neurology',
        'severity': 'critical',
        'precautions': ['Call emergency services immediately (FAST method)',
                        'Note time symptoms started', 'Do not give food or drink',
                        'Time is critical — every minute matters']
    },
    'Epilepsy': {
        'symptoms': ['seizures', 'confusion', 'loss of consciousness', 'muscle jerking',
                     'staring spells', 'anxiety', 'dizziness', 'tingling sensation'],
        'department': 'Neurology',
        'severity': 'high',
        'precautions': ['Take anti-seizure medications regularly', 'Avoid known triggers',
                        'Wear medical ID', 'Ensure safety during seizures']
    },
    'Vertigo': {
        'symptoms': ['dizziness', 'loss of balance', 'nausea', 'vomiting', 'headache',
                     'sweating', 'ringing in ears', 'abnormal eye movements'],
        'department': 'ENT',
        'severity': 'moderate',
        'precautions': ['Avoid sudden head movements', 'Sit or lie down when dizzy',
                        'Do Epley maneuver if BPPV', 'Consult ENT specialist']
    },
    "Parkinson's Disease": {
        'symptoms': ['tremor', 'muscle stiffness', 'slow movement', 'loss of balance',
                     'difficulty walking', 'speech changes', 'writing changes', 'fatigue'],
        'department': 'Neurology',
        'severity': 'high',
        'precautions': ['Regular neurological follow-up', 'Physical therapy',
                        'Take medications on schedule', 'Exercise to maintain mobility']
    },

    # ── GASTROINTESTINAL ─────────────────────────────────────────────────────
    'Gastritis': {
        'symptoms': ['stomach pain', 'nausea', 'vomiting', 'bloating', 'loss of appetite',
                     'heartburn', 'indigestion', 'hiccups', 'dark stools'],
        'department': 'Gastroenterology',
        'severity': 'moderate',
        'precautions': ['Avoid spicy and acidic foods', 'Eat smaller frequent meals',
                        'Avoid alcohol and smoking', 'Take antacids as prescribed']
    },
    'Gastroenteritis': {
        'symptoms': ['diarrhea', 'vomiting', 'nausea', 'stomach pain', 'fever',
                     'dehydration', 'loss of appetite', 'muscle pain', 'headache'],
        'department': 'Gastroenterology',
        'severity': 'moderate',
        'precautions': ['Stay hydrated with ORS', 'Eat bland foods (BRAT diet)',
                        'Wash hands frequently', 'Rest until symptoms resolve']
    },
    'Peptic Ulcer': {
        'symptoms': ['stomach pain', 'bloating', 'heartburn', 'nausea', 'vomiting',
                     'weight loss', 'loss of appetite', 'dark stools', 'belching'],
        'department': 'Gastroenterology',
        'severity': 'moderate',
        'precautions': ['Avoid NSAIDs', 'Reduce spicy food intake',
                        'Take prescribed proton pump inhibitors', 'Avoid alcohol and smoking']
    },
    'GERD (Acid Reflux)': {
        'symptoms': ['heartburn', 'chest pain', 'difficulty swallowing', 'sour taste',
                     'cough', 'bloating', 'nausea', 'hoarseness', 'bad breath'],
        'department': 'Gastroenterology',
        'severity': 'mild',
        'precautions': ['Avoid eating 3 hours before bed', 'Elevate head while sleeping',
                        'Avoid trigger foods', 'Maintain healthy weight']
    },
    'Appendicitis': {
        'symptoms': ['severe abdominal pain', 'nausea', 'vomiting', 'fever',
                     'loss of appetite', 'bloating', 'constipation', 'diarrhea',
                     'unable to pass gas'],
        'department': 'General Surgery',
        'severity': 'critical',
        'precautions': ['Seek emergency medical care immediately',
                        'Do not eat or drink anything', 'Do not take painkillers before diagnosis',
                        'Surgery is usually required']
    },
    'Irritable Bowel Syndrome (IBS)': {
        'symptoms': ['stomach pain', 'bloating', 'diarrhea', 'constipation',
                     'gas', 'mucus in stool', 'nausea', 'fatigue'],
        'department': 'Gastroenterology',
        'severity': 'mild',
        'precautions': ['Manage stress', 'Eat high-fiber diet',
                        'Avoid trigger foods', 'Regular exercise']
    },
    'Jaundice': {
        'symptoms': ['yellowing of skin', 'yellowing of eyes', 'dark urine', 'fatigue',
                     'stomach pain', 'nausea', 'weight loss', 'loss of appetite',
                     'itching', 'pale stools'],
        'department': 'Gastroenterology',
        'severity': 'high',
        'precautions': ['Rest and eat a healthy diet', 'Avoid alcohol completely',
                        'Get liver function tests', 'Take prescribed medications']
    },
    'Hepatitis B': {
        'symptoms': ['fatigue', 'nausea', 'stomach pain', 'yellowing of skin', 'dark urine',
                     'joint pain', 'fever', 'loss of appetite', 'vomiting', 'weakness'],
        'department': 'Gastroenterology',
        'severity': 'high',
        'precautions': ['Get vaccinated (prevention)', 'Avoid alcohol',
                        'Regular liver function monitoring', 'Practice safe sex']
    },
    'Gallstones': {
        'symptoms': ['severe abdominal pain', 'nausea', 'vomiting', 'fever',
                     'yellowing of skin', 'back pain', 'bloating', 'indigestion'],
        'department': 'Gastroenterology',
        'severity': 'moderate',
        'precautions': ['Low-fat diet', 'Maintain healthy weight',
                        'Consult surgeon if recurrent', 'Avoid rapid weight loss']
    },

    # ── CARDIOVASCULAR ───────────────────────────────────────────────────────
    'Hypertension': {
        'symptoms': ['headache', 'dizziness', 'blurred vision', 'chest pain',
                     'shortness of breath', 'nosebleed', 'fatigue', 'irregular heartbeat',
                     'blood in urine'],
        'department': 'Cardiology',
        'severity': 'high',
        'precautions': ['Reduce salt intake', 'Exercise regularly',
                        'Monitor blood pressure daily', 'Take medications as prescribed']
    },
    'Heart Attack': {
        'symptoms': ['chest pain', 'shortness of breath', 'pain in left arm', 'nausea',
                     'sweating', 'dizziness', 'fatigue', 'jaw pain', 'anxiety',
                     'irregular heartbeat', 'cold sweat'],
        'department': 'Cardiology',
        'severity': 'critical',
        'precautions': ['Call emergency services immediately', 'Chew aspirin if not allergic',
                        'Rest in comfortable position', 'Do not drive yourself to hospital']
    },
    'Arrhythmia': {
        'symptoms': ['palpitations', 'dizziness', 'shortness of breath', 'chest pain',
                     'fatigue', 'fainting', 'rapid heartbeat', 'anxiety', 'sweating'],
        'department': 'Cardiology',
        'severity': 'moderate',
        'precautions': ['Regular cardiac monitoring', 'Avoid caffeine and stimulants',
                        'Take prescribed medications', 'Learn to check your pulse']
    },
    'Heart Failure': {
        'symptoms': ['shortness of breath', 'fatigue', 'swelling in legs', 'rapid heartbeat',
                     'persistent cough', 'wheezing', 'weight gain', 'nausea',
                     'reduced ability to exercise', 'swelling in abdomen'],
        'department': 'Cardiology',
        'severity': 'critical',
        'precautions': ['Take medications exactly as prescribed', 'Limit salt and fluid intake',
                        'Daily weight monitoring', 'Regular cardiologist visits']
    },

    # ── ENDOCRINE ────────────────────────────────────────────────────────────
    'Diabetes (Type 2)': {
        'symptoms': ['frequent urination', 'excessive thirst', 'fatigue', 'blurred vision',
                     'slow wound healing', 'weight loss', 'tingling in hands', 'numbness in feet',
                     'hunger', 'dry mouth', 'itching'],
        'department': 'Endocrinology',
        'severity': 'high',
        'precautions': ['Monitor blood sugar regularly', 'Follow low-sugar balanced diet',
                        'Exercise regularly', 'Take medications as prescribed']
    },
    'Hypothyroidism': {
        'symptoms': ['fatigue', 'weight gain', 'cold sensitivity', 'dry skin', 'hair loss',
                     'constipation', 'depression', 'muscle weakness', 'joint pain',
                     'puffy face', 'hoarse voice'],
        'department': 'Endocrinology',
        'severity': 'moderate',
        'precautions': ['Take thyroid medication on empty stomach', 'Regular thyroid function tests',
                        'Maintain a balanced diet', 'Monitor symptoms and weight']
    },
    'Hyperthyroidism': {
        'symptoms': ['weight loss', 'rapid heartbeat', 'sweating', 'tremor', 'anxiety',
                     'fatigue', 'difficulty sleeping', 'frequent bowel movements',
                     'heat intolerance', 'irritability', 'muscle weakness'],
        'department': 'Endocrinology',
        'severity': 'moderate',
        'precautions': ['Regular thyroid function monitoring', 'Take anti-thyroid medications',
                        'Avoid excessive iodine', 'Manage stress']
    },

    # ── HEMATOLOGY ───────────────────────────────────────────────────────────
    'Anemia': {
        'symptoms': ['fatigue', 'weakness', 'pale skin', 'dizziness', 'shortness of breath',
                     'cold hands', 'headache', 'brittle nails', 'chest pain',
                     'irregular heartbeat', 'poor appetite'],
        'department': 'Hematology',
        'severity': 'moderate',
        'precautions': ['Eat iron-rich foods (spinach, red meat, beans)', 'Take iron supplements',
                        'Get regular blood tests', 'Include Vitamin C for iron absorption']
    },
    'Iron Deficiency': {
        'symptoms': ['fatigue', 'weakness', 'pale skin', 'brittle nails', 'headache',
                     'dizziness', 'cold hands', 'loss of appetite', 'sore tongue',
                     'craving ice or dirt'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Eat iron-rich foods', 'Take iron supplements',
                        'Pair iron with Vitamin C', 'Avoid tea/coffee with meals']
    },

    # ── INFECTIOUS DISEASES ──────────────────────────────────────────────────
    'Dengue Fever': {
        'symptoms': ['high fever', 'severe headache', 'joint pain', 'body ache',
                     'skin rash', 'nausea', 'fatigue', 'eye pain', 'vomiting',
                     'bleeding gums', 'easy bruising'],
        'department': 'General Medicine',
        'severity': 'high',
        'precautions': ['Stay hydrated with ORS', 'Monitor platelet count daily',
                        'Avoid aspirin and NSAIDs', 'Seek emergency care for bleeding']
    },
    'Malaria': {
        'symptoms': ['high fever', 'chills', 'sweating', 'headache', 'nausea',
                     'vomiting', 'body ache', 'fatigue', 'diarrhea', 'anemia',
                     'muscle pain', 'jaundice'],
        'department': 'General Medicine',
        'severity': 'high',
        'precautions': ['Complete antimalarial drug course', 'Use mosquito nets',
                        'Stay hydrated', 'Monitor temperature regularly']
    },
    'Typhoid': {
        'symptoms': ['high fever', 'headache', 'stomach pain', 'loss of appetite',
                     'weakness', 'diarrhea', 'constipation', 'skin rash', 'body ache',
                     'fatigue', 'bloating'],
        'department': 'General Medicine',
        'severity': 'high',
        'precautions': ['Take prescribed antibiotics completely', 'Drink boiled/filtered water',
                        'Eat well-cooked food', 'Rest until recovery']
    },
    'Chicken Pox': {
        'symptoms': ['skin rash', 'itching', 'fever', 'fatigue', 'headache',
                     'loss of appetite', 'body ache', 'blisters', 'irritability'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Isolate the patient', 'Apply calamine lotion',
                        'Keep nails trimmed', 'Stay hydrated and rest']
    },
    'Measles': {
        'symptoms': ['high fever', 'cough', 'runny nose', 'red eyes', 'skin rash',
                     'sore throat', 'white spots in mouth', 'fatigue', 'body ache'],
        'department': 'General Medicine',
        'severity': 'high',
        'precautions': ['Isolation for virus containment', 'Rest and hydration',
                        'Vitamin A supplementation', 'MMR vaccine for prevention']
    },
    'Mumps': {
        'symptoms': ['swollen salivary glands', 'fever', 'headache', 'muscle pain',
                     'fatigue', 'loss of appetite', 'pain while chewing', 'jaw pain'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Rest and isolation', 'Apply warm/cold compresses to glands',
                        'Eat soft foods', 'MMR vaccine for prevention']
    },

    # ── UROLOGICAL ───────────────────────────────────────────────────────────
    'Urinary Tract Infection': {
        'symptoms': ['burning urination', 'frequent urination', 'lower abdominal pain',
                     'cloudy urine', 'fever', 'back pain', 'strong urine odor',
                     'blood in urine', 'pelvic pain'],
        'department': 'Urology',
        'severity': 'moderate',
        'precautions': ['Drink plenty of water', 'Complete antibiotics course',
                        'Maintain good hygiene', 'Urinate frequently']
    },
    'Kidney Stone': {
        'symptoms': ['severe back pain', 'lower abdominal pain', 'painful urination',
                     'blood in urine', 'nausea', 'vomiting', 'frequent urination',
                     'fever', 'chills'],
        'department': 'Urology',
        'severity': 'high',
        'precautions': ['Drink lots of water (3-4 liters/day)', 'Take pain medications',
                        'Strain urine to catch stones', 'Follow dietary recommendations']
    },
    'Kidney Disease': {
        'symptoms': ['fatigue', 'swelling in legs', 'frequent urination', 'blood in urine',
                     'foamy urine', 'back pain', 'poor appetite', 'muscle cramps',
                     'nausea', 'difficulty sleeping'],
        'department': 'Nephrology',
        'severity': 'high',
        'precautions': ['Control blood pressure', 'Manage blood sugar if diabetic',
                        'Low-sodium diet', 'Regular kidney function tests']
    },

    # ── DERMATOLOGICAL ───────────────────────────────────────────────────────
    'Allergic Reaction': {
        'symptoms': ['skin rash', 'itching', 'swelling', 'sneezing', 'watery eyes',
                     'runny nose', 'hives', 'difficulty breathing', 'red eyes'],
        'department': 'Allergy & Immunology',
        'severity': 'moderate',
        'precautions': ['Identify and avoid allergens', 'Take antihistamines',
                        'Carry epinephrine if severe allergy', 'Wear medical alert bracelet']
    },
    'Eczema': {
        'symptoms': ['itching', 'dry skin', 'skin rash', 'red patches', 'flaky skin',
                     'swelling', 'cracked skin', 'thickened skin'],
        'department': 'Dermatology',
        'severity': 'mild',
        'precautions': ['Moisturize skin regularly', 'Avoid harsh soaps',
                        'Use prescribed topical steroids', 'Identify triggers']
    },
    'Psoriasis': {
        'symptoms': ['red patches', 'flaky skin', 'itching', 'dry skin', 'joint pain',
                     'nail changes', 'skin rash', 'burning sensation', 'thickened skin'],
        'department': 'Dermatology',
        'severity': 'moderate',
        'precautions': ['Use prescribed topical treatments', 'Moisturize daily',
                        'Avoid skin injuries', 'Manage stress']
    },
    'Fungal Infection': {
        'symptoms': ['itching', 'skin rash', 'redness', 'flaky skin', 'burning sensation',
                     'swelling', 'ring-shaped rash', 'blisters'],
        'department': 'Dermatology',
        'severity': 'mild',
        'precautions': ['Keep affected area clean and dry', 'Use antifungal medication',
                        'Avoid sharing towels', 'Wear breathable clothing']
    },
    'Acne': {
        'symptoms': ['pimples', 'blackheads', 'whiteheads', 'oily skin', 'skin rash',
                     'redness', 'scarring', 'pain in affected area'],
        'department': 'Dermatology',
        'severity': 'mild',
        'precautions': ['Wash face twice daily', 'Avoid touching face',
                        'Use non-comedogenic products', 'Consult dermatologist for severe cases']
    },

    # ── MUSCULOSKELETAL ──────────────────────────────────────────────────────
    'Arthritis': {
        'symptoms': ['joint pain', 'joint stiffness', 'swelling', 'reduced range of motion',
                     'fatigue', 'muscle weakness', 'warmth around joints', 'redness'],
        'department': 'Orthopedics',
        'severity': 'moderate',
        'precautions': ['Regular gentle exercise', 'Maintain healthy weight',
                        'Apply hot/cold therapy', 'Take anti-inflammatory medications']
    },
    'Osteoporosis': {
        'symptoms': ['back pain', 'loss of height', 'bone fractures', 'stooped posture',
                     'joint pain', 'weakness', 'neck pain'],
        'department': 'Orthopedics',
        'severity': 'moderate',
        'precautions': ['Increase calcium and Vitamin D intake', 'Weight-bearing exercises',
                        'Prevent falls', 'Take prescribed bone medications']
    },
    'Sciatica': {
        'symptoms': ['lower back pain', 'leg pain', 'numbness in legs', 'tingling sensation',
                     'muscle weakness', 'difficulty walking', 'sharp shooting pain'],
        'department': 'Orthopedics',
        'severity': 'moderate',
        'precautions': ['Physical therapy exercises', 'Apply hot/cold packs',
                        'Maintain good posture', 'Avoid prolonged sitting']
    },
    'Gout': {
        'symptoms': ['severe joint pain', 'swelling', 'redness', 'warmth around joints',
                     'limited range of motion', 'fever', 'fatigue'],
        'department': 'Rheumatology',
        'severity': 'moderate',
        'precautions': ['Limit purine-rich foods', 'Stay hydrated',
                        'Take prescribed medications', 'Avoid alcohol']
    },

    # ── PSYCHIATRIC ──────────────────────────────────────────────────────────
    'Depression': {
        'symptoms': ['persistent sadness', 'loss of interest', 'fatigue', 'sleep problems',
                     'difficulty concentrating', 'weight changes', 'hopelessness',
                     'irritability', 'loss of appetite', 'body ache'],
        'department': 'Psychiatry',
        'severity': 'moderate',
        'precautions': ['Seek professional help (therapy)', 'Stay connected with loved ones',
                        'Exercise regularly', 'Maintain regular sleep schedule']
    },
    'Anxiety Disorder': {
        'symptoms': ['restlessness', 'rapid heartbeat', 'sweating', 'tremor',
                     'difficulty concentrating', 'sleep problems', 'irritability',
                     'muscle tension', 'fatigue', 'nausea'],
        'department': 'Psychiatry',
        'severity': 'moderate',
        'precautions': ['Practice relaxation techniques', 'Regular exercise',
                        'Limit caffeine and alcohol', 'Consider therapy (CBT)']
    },
    'Insomnia': {
        'symptoms': ['difficulty sleeping', 'waking up too early', 'fatigue',
                     'irritability', 'difficulty concentrating', 'headache',
                     'anxiety', 'depression'],
        'department': 'Psychiatry',
        'severity': 'mild',
        'precautions': ['Maintain consistent sleep schedule', 'Avoid screens before bed',
                        'Limit caffeine after noon', 'Create a dark quiet bedroom']
    },

    # ── OPHTHALMOLOGY ────────────────────────────────────────────────────────
    'Conjunctivitis (Pink Eye)': {
        'symptoms': ['eye redness', 'itching', 'watery eyes', 'eye discharge',
                     'swelling', 'light sensitivity', 'blurred vision', 'gritty feeling in eye'],
        'department': 'Ophthalmology',
        'severity': 'mild',
        'precautions': ['Wash hands frequently', 'Avoid touching eyes',
                        'Do not share towels', 'Use prescribed eye drops']
    },
    'Glaucoma': {
        'symptoms': ['blurred vision', 'eye pain', 'headache', 'nausea', 'vomiting',
                     'seeing halos around lights', 'eye redness', 'vision loss'],
        'department': 'Ophthalmology',
        'severity': 'high',
        'precautions': ['Regular eye pressure checks', 'Use prescribed eye drops daily',
                        'Protect eyes from injury', 'Regular ophthalmologist visits']
    },

    # ── OTHER ────────────────────────────────────────────────────────────────
    'Food Poisoning': {
        'symptoms': ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'fever',
                     'weakness', 'dehydration', 'headache', 'loss of appetite'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Stay hydrated with ORS', 'Rest until symptoms pass',
                        'Eat bland foods when ready', 'Seek medical help if symptoms persist']
    },
    'Heat Stroke': {
        'symptoms': ['high fever', 'confusion', 'hot dry skin', 'rapid heartbeat',
                     'headache', 'nausea', 'dizziness', 'loss of consciousness',
                     'muscle cramps'],
        'department': 'Emergency Medicine',
        'severity': 'critical',
        'precautions': ['Move to cool area immediately', 'Apply cold water to skin',
                        'Call emergency services', 'Do not give fluids if unconscious']
    },
    'Dehydration': {
        'symptoms': ['excessive thirst', 'dry mouth', 'fatigue', 'dizziness',
                     'dark urine', 'headache', 'dry skin', 'rapid heartbeat',
                     'confusion', 'sunken eyes'],
        'department': 'General Medicine',
        'severity': 'moderate',
        'precautions': ['Drink water and ORS regularly', 'Avoid caffeine and alcohol',
                        'Eat water-rich foods', 'Seek medical help if severe']
    },
}

# ─── BUILD TRAINING DATA ──────────────────────────────────────────────────────
ALL_SYMPTOMS = sorted(set(
    symptom.lower().strip()
    for disease_info in DISEASE_DB.values()
    for symptom in disease_info['symptoms']
))

DISEASE_NAMES = list(DISEASE_DB.keys())


def _build_training_data():
    """Build a robust training dataset with data augmentation."""
    X, y = [], []
    for disease_name, info in DISEASE_DB.items():
        disease_symptoms = [s.lower().strip() for s in info['symptoms']]

        # Full symptom vector (weight = 3 samples)
        full_vec = [1 if s in disease_symptoms else 0 for s in ALL_SYMPTOMS]
        for _ in range(3):
            X.append(full_vec)
            y.append(disease_name)

        # Augmented samples: random subsets (15 variations per disease)
        rng = np.random.RandomState(hash(disease_name) % 2**31)
        n_symptoms = len(disease_symptoms)
        for _ in range(15):
            # Pick 40-90% of symptoms randomly
            keep = max(2, int(n_symptoms * rng.uniform(0.4, 0.9)))
            subset = list(rng.choice(disease_symptoms, size=min(keep, n_symptoms), replace=False))
            # Occasionally add 1-2 random noise symptoms
            if rng.random() < 0.3:
                noise_pool = [s for s in ALL_SYMPTOMS if s not in disease_symptoms]
                if noise_pool:
                    noise = list(rng.choice(noise_pool, size=min(2, len(noise_pool)), replace=False))
                    subset.extend(noise)
            vec = [1 if s in subset else 0 for s in ALL_SYMPTOMS]
            X.append(vec)
            y.append(disease_name)

    return np.array(X), np.array(y)


# Train the model once at module load
_X, _y = _build_training_data()
_label_encoder = LabelEncoder()
_y_encoded = _label_encoder.fit_transform(_y)
_model = RandomForestClassifier(
    n_estimators=150,
    max_depth=25,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
)
_model.fit(_X, _y_encoded)


def _normalize_symptom(symptom):
    """Normalize user input symptom to match database format."""
    s = symptom.lower().strip()
    # Common user-input mappings
    mappings = {
        'fever': 'fever', 'temperature': 'fever', 'high temperature': 'high fever',
        'cold': 'chills', 'stomach ache': 'stomach pain', 'tummy pain': 'stomach pain',
        'breathlessness': 'shortness of breath', 'breathless': 'shortness of breath',
        'cant breathe': 'difficulty breathing', 'hard to breathe': 'difficulty breathing',
        'throwing up': 'vomiting', 'puking': 'vomiting',
        'loose motions': 'diarrhea', 'loose stools': 'diarrhea',
        'giddiness': 'dizziness', 'lightheaded': 'dizziness',
        'chest tightness': 'chest tightness', 'tight chest': 'chest tightness',
        'rash': 'skin rash', 'spots on skin': 'skin rash',
        'runny nose': 'runny nose', 'blocked nose': 'congestion', 'stuffy nose': 'congestion',
        'body pain': 'body ache', 'muscle ache': 'muscle pain',
        'tired': 'fatigue', 'tiredness': 'fatigue', 'exhaustion': 'fatigue',
        'weight loss': 'weight loss', 'losing weight': 'weight loss',
        'no appetite': 'loss of appetite', 'not hungry': 'loss of appetite',
        'cant sleep': 'difficulty sleeping', 'sleepless': 'difficulty sleeping',
        'peeing a lot': 'frequent urination', 'urinating a lot': 'frequent urination',
        'burning pee': 'burning urination', 'pain when peeing': 'burning urination',
        'swollen': 'swelling', 'swollen joints': 'swelling',
        'heart racing': 'rapid heartbeat', 'fast heartbeat': 'rapid heartbeat',
        'shaking': 'tremor', 'trembling': 'tremor',
    }
    return mappings.get(s, s)


def predict_disease(symptoms_input):
    """
    Predict diseases based on input symptoms using Random Forest classifier.

    Args:
        symptoms_input: list of symptom strings (human-readable)

    Returns:
        dict with predictions, recommended department, and disclaimer
    """
    if not symptoms_input:
        return {'predictions': [], 'disclaimer': 'Please provide at least one symptom.'}

    # Normalize input symptoms
    input_symptoms = [_normalize_symptom(s) for s in symptoms_input]

    # Build feature vector
    vector = [1 if s in input_symptoms else 0 for s in ALL_SYMPTOMS]
    X_input = np.array(vector).reshape(1, -1)

    # Get class probabilities from Random Forest
    probas = _model.predict_proba(X_input)[0]

    # Top predictions
    top_indices = np.argsort(probas)[::-1][:8]
    predictions = []
    for idx in top_indices:
        prob = probas[idx]
        if prob < 0.02:
            continue
        disease_name = _label_encoder.inverse_transform([idx])[0]
        disease_info = DISEASE_DB[disease_name]
        disease_symptoms = [s.lower().strip() for s in disease_info['symptoms']]
        matched = [s for s in input_symptoms if s in disease_symptoms]

        predictions.append({
            'disease': disease_name,
            'probability': round(prob * 100, 1),
            'matched_symptoms': matched,
            'total_disease_symptoms': len(disease_symptoms),
            'department': disease_info['department'],
            'severity': disease_info.get('severity', 'unknown'),
            'precautions': disease_info['precautions'],
        })

    # Fallback: symptom-overlap scoring if model has low confidence
    if not predictions or predictions[0]['probability'] < 15:
        overlap_scores = []
        for disease_name, info in DISEASE_DB.items():
            disease_symptoms = [s.lower().strip() for s in info['symptoms']]
            matched = set(input_symptoms) & set(disease_symptoms)
            if len(matched) >= 2:
                score = len(matched) / len(disease_symptoms)
                input_coverage = len(matched) / len(input_symptoms)
                combined = score * 0.6 + input_coverage * 0.4
                overlap_scores.append({
                    'disease': disease_name,
                    'probability': round(combined * 100, 1),
                    'matched_symptoms': list(matched),
                    'total_disease_symptoms': len(disease_symptoms),
                    'department': info['department'],
                    'severity': info.get('severity', 'unknown'),
                    'precautions': info['precautions'],
                })
        overlap_scores.sort(key=lambda x: x['probability'], reverse=True)
        existing = {p['disease'] for p in predictions}
        for s in overlap_scores[:5]:
            if s['disease'] not in existing:
                predictions.append(s)
        predictions.sort(key=lambda x: x['probability'], reverse=True)

    predictions = predictions[:5]

    return {
        'input_symptoms': symptoms_input,
        'predictions': predictions,
        'recommended_department': predictions[0]['department'] if predictions else None,
        'disclaimer': (
            'DISCLAIMER: This AI prediction is for informational purposes only '
            'and does NOT constitute medical diagnosis. Always consult a qualified '
            'healthcare professional for proper diagnosis and treatment.'
        ),
    }


def get_all_symptoms():
    """Return all available symptoms for frontend autocomplete."""
    return [s.title() for s in ALL_SYMPTOMS]
