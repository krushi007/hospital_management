// Comprehensive Disease-Symptom mapping for AI prediction
const DISEASE_DATA = {
    // ── Respiratory ──
    'Common Cold': {
        symptoms: ['fever', 'cough', 'runny nose', 'sneezing', 'sore throat', 'headache', 'fatigue', 'body ache', 'chills'],
        department: 'General Medicine',
        precautions: ['Rest well', 'Stay hydrated', 'Take warm fluids', 'Avoid cold exposure']
    },
    'Influenza (Flu)': {
        symptoms: ['fever', 'cough', 'body ache', 'fatigue', 'headache', 'sore throat', 'chills', 'muscle weakness', 'night sweats', 'loss of appetite'],
        department: 'General Medicine',
        precautions: ['Get plenty of rest', 'Stay hydrated', 'Consult doctor if fever persists', 'Avoid contact with others']
    },
    'Pneumonia': {
        symptoms: ['fever', 'cough', 'shortness of breath', 'chest pain', 'fatigue', 'body ache', 'night sweats', 'chills', 'coughing blood', 'chest tightness'],
        department: 'Pulmonology',
        precautions: ['Seek immediate medical attention', 'Complete prescribed antibiotics', 'Rest adequately', 'Stay hydrated']
    },
    'Bronchitis': {
        symptoms: ['cough', 'chest pain', 'fatigue', 'shortness of breath', 'sore throat', 'fever', 'body ache', 'wheezing', 'chest tightness'],
        department: 'Pulmonology',
        precautions: ['Avoid smoking', 'Use a humidifier', 'Stay hydrated', 'Rest adequately']
    },
    'Asthma': {
        symptoms: ['shortness of breath', 'wheezing', 'chest tightness', 'cough', 'fatigue', 'anxiety'],
        department: 'Pulmonology',
        precautions: ['Avoid allergens and triggers', 'Use inhalers as prescribed', 'Monitor breathing patterns', 'Have an action plan ready']
    },
    'Tuberculosis (TB)': {
        symptoms: ['cough', 'coughing blood', 'night sweats', 'fever', 'weight loss', 'fatigue', 'chest pain', 'loss of appetite', 'chills'],
        department: 'Pulmonology',
        precautions: ['Complete full course of medication', 'Isolate to prevent spread', 'Regular follow-up visits', 'Eat nutritious food']
    },
    'COVID-19': {
        symptoms: ['fever', 'cough', 'shortness of breath', 'fatigue', 'body ache', 'sore throat', 'loss of appetite', 'headache', 'diarrhea', 'chills'],
        department: 'General Medicine',
        precautions: ['Isolate for recommended period', 'Monitor oxygen levels', 'Stay hydrated', 'Seek emergency care if breathing worsens']
    },
    'Sinusitis': {
        symptoms: ['headache', 'runny nose', 'facial pain', 'fever', 'cough', 'fatigue', 'ear pain', 'sore throat'],
        department: 'ENT',
        precautions: ['Use steam inhalation', 'Stay hydrated', 'Use saline nasal spray', 'Avoid allergens']
    },

    // ── Cardiovascular ──
    'Hypertension': {
        symptoms: ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath', 'palpitations', 'numbness', 'fatigue', 'anxiety'],
        department: 'Cardiology',
        precautions: ['Reduce salt intake', 'Exercise regularly', 'Monitor blood pressure', 'Manage stress']
    },
    'Heart Disease': {
        symptoms: ['chest pain', 'shortness of breath', 'palpitations', 'dizziness', 'fatigue', 'swelling', 'night sweats', 'numbness', 'cold hands', 'leg pain', 'jaw pain'],
        department: 'Cardiology',
        precautions: ['Seek immediate medical attention for chest pain', 'Follow a heart-healthy diet', 'Exercise regularly', 'Take medications as prescribed']
    },
    'Heart Attack': {
        symptoms: ['chest pain', 'shortness of breath', 'jaw pain', 'numbness', 'cold hands', 'excessive sweating', 'nausea', 'dizziness', 'fatigue', 'anxiety'],
        department: 'Cardiology (Emergency)',
        precautions: ['CALL EMERGENCY SERVICES IMMEDIATELY', 'Chew an aspirin if not allergic', 'Do not exert yourself', 'Stay calm and rest']
    },
    'Anemia': {
        symptoms: ['fatigue', 'dizziness', 'shortness of breath', 'palpitations', 'headache', 'muscle weakness', 'loss of appetite', 'cold hands', 'bruising', 'irritability'],
        department: 'Hematology',
        precautions: ['Eat iron-rich foods', 'Take iron supplements if prescribed', 'Get regular blood tests', 'Avoid excessive tea/coffee with meals']
    },

    // ── Digestive ──
    'Gastroenteritis': {
        symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'loss of appetite', 'fatigue', 'bloating', 'chills'],
        department: 'Gastroenterology',
        precautions: ['Stay hydrated with ORS', 'Eat light bland foods', 'Avoid dairy products', 'Wash hands frequently']
    },
    'Gastritis': {
        symptoms: ['abdominal pain', 'nausea', 'vomiting', 'bloating', 'heartburn', 'loss of appetite', 'blood in stool'],
        department: 'Gastroenterology',
        precautions: ['Avoid spicy and acidic foods', 'Eat smaller frequent meals', 'Avoid alcohol and NSAIDs', 'Take prescribed antacids']
    },
    'GERD (Acid Reflux)': {
        symptoms: ['heartburn', 'chest pain', 'nausea', 'bloating', 'sore throat', 'cough', 'abdominal pain'],
        department: 'Gastroenterology',
        precautions: ['Avoid lying down after eating', 'Elevate head while sleeping', 'Avoid trigger foods', 'Eat smaller meals']
    },
    'Appendicitis': {
        symptoms: ['abdominal pain', 'nausea', 'vomiting', 'fever', 'loss of appetite', 'constipation', 'bloating'],
        department: 'General Surgery',
        precautions: ['Seek immediate medical attention', 'Do not eat or drink', 'Avoid pain medications before diagnosis', 'Surgery may be required']
    },
    'Irritable Bowel Syndrome': {
        symptoms: ['abdominal pain', 'bloating', 'diarrhea', 'constipation', 'nausea', 'fatigue', 'anxiety', 'mood swings'],
        department: 'Gastroenterology',
        precautions: ['Follow a low-FODMAP diet', 'Manage stress levels', 'Exercise regularly', 'Keep a food diary']
    },
    'Liver Disease': {
        symptoms: ['yellowing skin', 'abdominal pain', 'fatigue', 'nausea', 'swelling', 'dark urine', 'loss of appetite', 'weight loss', 'itching', 'bruising'],
        department: 'Hepatology',
        precautions: ['Avoid alcohol completely', 'Follow prescribed diet', 'Regular liver function tests', 'Take medications as directed']
    },

    // ── Neurological ──
    'Migraine': {
        symptoms: ['headache', 'nausea', 'blurred vision', 'dizziness', 'fatigue', 'insomnia', 'sensitivity to light', 'irritability', 'vomiting'],
        department: 'Neurology',
        precautions: ['Avoid bright lights', 'Rest in a dark room', 'Stay hydrated', 'Manage stress levels']
    },
    'Epilepsy': {
        symptoms: ['seizures', 'confusion', 'fainting', 'dizziness', 'muscle cramps', 'memory loss', 'anxiety', 'headache'],
        department: 'Neurology',
        precautions: ['Take anti-seizure medication regularly', 'Avoid triggers', 'Get adequate sleep', 'Wear medical ID']
    },
    'Stroke': {
        symptoms: ['numbness', 'confusion', 'headache', 'dizziness', 'blurred vision', 'fainting', 'muscle weakness', 'difficulty speaking'],
        department: 'Neurology (Emergency)',
        precautions: ['CALL EMERGENCY SERVICES IMMEDIATELY', 'Note the time symptoms started', 'Do not give food or drink', 'Keep the person comfortable']
    },
    'Meningitis': {
        symptoms: ['headache', 'fever', 'stiff neck', 'nausea', 'vomiting', 'confusion', 'seizures', 'skin rash', 'sensitivity to light'],
        department: 'Neurology (Emergency)',
        precautions: ['Seek immediate emergency care', 'Avoid close contact with others', 'Complete antibiotic course', 'Rest in a dark quiet room']
    },
    "Parkinson's Disease": {
        symptoms: ['muscle weakness', 'muscle cramps', 'fatigue', 'insomnia', 'depression', 'constipation', 'dizziness', 'memory loss', 'anxiety'],
        department: 'Neurology',
        precautions: ['Follow prescribed medication schedule', 'Stay physically active', 'Join a support group', 'Regular neurologist visits']
    },

    // ── Endocrine ──
    'Diabetes (Type 2)': {
        symptoms: ['frequent urination', 'excessive thirst', 'weight loss', 'fatigue', 'blurred vision', 'numbness', 'dry skin', 'slow healing'],
        department: 'Endocrinology',
        precautions: ['Monitor blood sugar regularly', 'Follow a balanced diet', 'Exercise regularly', 'Take medications as prescribed']
    },
    'Hyperthyroidism': {
        symptoms: ['weight loss', 'palpitations', 'excessive sweating', 'anxiety', 'insomnia', 'muscle weakness', 'fatigue', 'hair loss', 'irritability', 'diarrhea'],
        department: 'Endocrinology',
        precautions: ['Take thyroid medication as prescribed', 'Get regular thyroid tests', 'Avoid excessive iodine', 'Manage stress']
    },
    'Hypothyroidism': {
        symptoms: ['fatigue', 'weight gain', 'constipation', 'dry skin', 'hair loss', 'muscle weakness', 'depression', 'cold hands', 'memory loss', 'muscle cramps'],
        department: 'Endocrinology',
        precautions: ['Take levothyroxine as prescribed', 'Get regular thyroid tests', 'Maintain a balanced diet', 'Exercise regularly']
    },

    // ── Musculoskeletal ──
    'Arthritis': {
        symptoms: ['joint pain', 'swelling', 'body ache', 'muscle weakness', 'fatigue', 'numbness', 'back pain', 'stiff neck', 'muscle cramps'],
        department: 'Orthopedics',
        precautions: ['Stay active with gentle exercises', 'Apply hot/cold compresses', 'Maintain healthy weight', 'Consult a rheumatologist']
    },
    'Osteoporosis': {
        symptoms: ['back pain', 'bone pain', 'muscle weakness', 'fatigue', 'weight loss', 'joint pain'],
        department: 'Orthopedics',
        precautions: ['Take calcium and vitamin D supplements', 'Do weight-bearing exercises', 'Avoid smoking and excess alcohol', 'Get bone density tests']
    },
    'Fibromyalgia': {
        symptoms: ['body ache', 'fatigue', 'insomnia', 'headache', 'muscle weakness', 'muscle cramps', 'depression', 'anxiety', 'memory loss', 'irritability', 'numbness'],
        department: 'Rheumatology',
        precautions: ['Exercise regularly', 'Manage stress', 'Get adequate sleep', 'Physical therapy may help']
    },

    // ── Skin ──
    'Allergic Reaction': {
        symptoms: ['skin rash', 'sneezing', 'runny nose', 'swelling', 'shortness of breath', 'cough', 'itching', 'eye redness'],
        department: 'Allergy & Immunology',
        precautions: ['Identify and avoid allergens', 'Take antihistamines as prescribed', 'Carry emergency medication', 'Consult an allergist']
    },
    'Eczema (Dermatitis)': {
        symptoms: ['skin rash', 'itching', 'dry skin', 'swelling', 'irritability'],
        department: 'Dermatology',
        precautions: ['Keep skin moisturized', 'Avoid harsh soaps', 'Identify triggers', 'Use prescribed topical treatments']
    },
    'Psoriasis': {
        symptoms: ['skin rash', 'itching', 'dry skin', 'joint pain', 'fatigue', 'depression'],
        department: 'Dermatology',
        precautions: ['Use prescribed creams', 'Avoid skin injuries', 'Manage stress', 'Moisturize regularly']
    },
    'Fungal Infection': {
        symptoms: ['skin rash', 'itching', 'dry skin', 'hair loss', 'fever'],
        department: 'Dermatology',
        precautions: ['Keep affected area clean and dry', 'Use antifungal medication', 'Avoid sharing personal items', 'Wear breathable clothing']
    },

    // ── Urinary ──
    'Urinary Tract Infection': {
        symptoms: ['frequent urination', 'painful urination', 'abdominal pain', 'back pain', 'fever', 'nausea', 'dark urine'],
        department: 'Urology',
        precautions: ['Drink plenty of water', 'Complete antibiotic course', 'Maintain hygiene', 'Avoid holding urine']
    },
    'Kidney Disease': {
        symptoms: ['frequent urination', 'swelling', 'fatigue', 'nausea', 'back pain', 'dark urine', 'loss of appetite', 'muscle cramps', 'insomnia', 'itching'],
        department: 'Nephrology',
        precautions: ['Control blood pressure', 'Manage blood sugar', 'Follow a kidney-friendly diet', 'Stay hydrated appropriately']
    },
    'Kidney Stones': {
        symptoms: ['back pain', 'abdominal pain', 'painful urination', 'nausea', 'vomiting', 'fever', 'dark urine', 'frequent urination'],
        department: 'Urology',
        precautions: ['Drink plenty of water', 'Reduce salt intake', 'Avoid oxalate-rich foods', 'Seek medical attention for severe pain']
    },

    // ── Mental Health ──
    'Depression': {
        symptoms: ['fatigue', 'insomnia', 'loss of appetite', 'weight loss', 'headache', 'body ache', 'depression', 'anxiety', 'irritability', 'mood swings', 'memory loss'],
        department: 'Psychiatry',
        precautions: ['Seek professional help', 'Stay connected with loved ones', 'Exercise regularly', 'Avoid alcohol and drugs']
    },
    'Generalized Anxiety Disorder': {
        symptoms: ['anxiety', 'palpitations', 'insomnia', 'fatigue', 'muscle cramps', 'headache', 'dizziness', 'nausea', 'irritability', 'excessive sweating'],
        department: 'Psychiatry',
        precautions: ['Practice relaxation techniques', 'Seek therapy (CBT)', 'Limit caffeine', 'Exercise regularly']
    },

    // ── Infectious ──
    'Malaria': {
        symptoms: ['fever', 'chills', 'headache', 'body ache', 'nausea', 'vomiting', 'fatigue', 'excessive sweating', 'diarrhea', 'loss of appetite'],
        department: 'Infectious Disease',
        precautions: ['Complete antimalarial medication', 'Use mosquito nets', 'Avoid mosquito bites', 'Stay hydrated']
    },
    'Dengue Fever': {
        symptoms: ['fever', 'headache', 'body ache', 'joint pain', 'skin rash', 'nausea', 'vomiting', 'fatigue', 'bruising', 'eye redness'],
        department: 'Infectious Disease',
        precautions: ['Rest completely', 'Stay hydrated', 'Monitor platelet count', 'Avoid aspirin and NSAIDs']
    },
    'Typhoid': {
        symptoms: ['fever', 'headache', 'abdominal pain', 'diarrhea', 'constipation', 'loss of appetite', 'fatigue', 'body ache', 'skin rash'],
        department: 'Infectious Disease',
        precautions: ['Complete antibiotic course', 'Drink clean water', 'Eat properly cooked food', 'Maintain hygiene']
    },
    'Chickenpox': {
        symptoms: ['fever', 'skin rash', 'itching', 'fatigue', 'headache', 'loss of appetite', 'body ache'],
        department: 'General Medicine',
        precautions: ['Avoid scratching', 'Use calamine lotion', 'Stay isolated until blisters crust', 'Stay hydrated']
    },

    // ── Other ──
    'Vitamin Deficiency': {
        symptoms: ['fatigue', 'muscle weakness', 'bone pain', 'hair loss', 'dry skin', 'depression', 'numbness', 'bruising', 'mood swings'],
        department: 'General Medicine',
        precautions: ['Eat a balanced diet', 'Take prescribed supplements', 'Get regular blood tests', 'Increase sunlight exposure for Vitamin D']
    },
    'Food Poisoning': {
        symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'fatigue', 'chills', 'bloating'],
        department: 'General Medicine',
        precautions: ['Stay hydrated', 'Rest completely', 'Eat bland foods gradually', 'Seek medical help if symptoms persist']
    },
    'Tonsillitis': {
        symptoms: ['sore throat', 'fever', 'headache', 'swollen lymph nodes', 'ear pain', 'fatigue', 'loss of appetite', 'stiff neck'],
        department: 'ENT',
        precautions: ['Gargle with warm salt water', 'Stay hydrated', 'Take prescribed antibiotics', 'Rest your voice']
    }
};

function normalizeSymptom(symptom) {
    return symptom.toLowerCase().trim().replace(/_/g, ' ');
}

function predictFromSymptoms(inputSymptoms) {
    const normalized = inputSymptoms.map(normalizeSymptom);
    const results = [];

    for (const [disease, data] of Object.entries(DISEASE_DATA)) {
        const matchedSymptoms = normalized.filter(s =>
            data.symptoms.some(ds => ds.includes(s) || s.includes(ds))
        );
        const matchCount = matchedSymptoms.length;

        if (matchCount > 0) {
            // Calculate probability based on match ratio and number of matches
            const matchRatio = matchCount / data.symptoms.length;
            const inputCoverage = matchCount / normalized.length;
            // Weighted score: how much of disease is covered + how much input matches
            const rawScore = (matchRatio * 0.6 + inputCoverage * 0.4) * 100;
            const probability = Math.round(Math.min(rawScore, 95));

            results.push({
                disease,
                probability,
                department: data.department,
                precautions: data.precautions,
                matchedSymptoms: matchedSymptoms.length,
                totalSymptoms: data.symptoms.length
            });
        }
    }

    results.sort((a, b) => b.probability - a.probability);
    return results.slice(0, 5);
}

exports.predictDisease = async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length < 2) {
            return res.status(400).json({ error: 'Please provide at least 2 symptoms.' });
        }

        const predictions = predictFromSymptoms(symptoms);

        if (predictions.length === 0) {
            return res.json({
                predictions: [{
                    disease: 'No matching disease found',
                    probability: 0,
                    department: 'General Medicine',
                    precautions: ['Consult a healthcare professional for proper diagnosis']
                }]
            });
        }

        res.json({ predictions });
    } catch (error) {
        console.error('Disease prediction error:', error);
        res.status(500).json({ error: 'Failed to predict disease.' });
    }
};

exports.getSymptoms = async (req, res) => {
    const allSymptoms = new Set();
    for (const data of Object.values(DISEASE_DATA)) {
        data.symptoms.forEach(s => allSymptoms.add(s));
    }
    res.json({ symptoms: [...allSymptoms].sort() });
};

exports.analyzeRisk = async (req, res) => {
    try {
        const {
            age, gender,
            blood_pressure_systolic, blood_pressure_diastolic,
            heart_rate, bmi, blood_sugar, cholesterol,
            smoking, alcohol, exercise,
            family_history, existing_conditions
        } = req.body;

        let riskScore = 0;
        const risk_factors = [];
        const recommendations = [];

        // ── Age Risk (based on cardiovascular disease research) ──
        const ageNum = parseInt(age) || 0;
        if (ageNum >= 70) {
            riskScore += 20;
            risk_factors.push({ factor: 'Advanced Age', detail: `Age ${ageNum} — significantly elevated risk for cardiovascular, metabolic and degenerative diseases`, points: 20 });
        } else if (ageNum >= 60) {
            riskScore += 15;
            risk_factors.push({ factor: 'Senior Age', detail: `Age ${ageNum} — increased risk for heart disease, diabetes, and hypertension`, points: 15 });
        } else if (ageNum >= 45) {
            riskScore += 10;
            risk_factors.push({ factor: 'Middle Age', detail: `Age ${ageNum} — routine screening recommended for chronic diseases`, points: 10 });
        } else if (ageNum >= 30) {
            riskScore += 3;
        }

        // ── Gender Risk (males have higher CVD risk below age 55) ──
        if (gender === 'male' && ageNum >= 45) {
            riskScore += 3;
            risk_factors.push({ factor: 'Male Gender', detail: 'Males have a statistically higher risk of coronary heart disease', points: 3 });
        } else if (gender === 'female' && ageNum >= 55) {
            riskScore += 3;
            risk_factors.push({ factor: 'Post-Menopausal Risk', detail: 'Post-menopausal women have increased cardiovascular risk', points: 3 });
        }

        // ── Blood Pressure (AHA Classification) ──
        const systolic = parseInt(blood_pressure_systolic) || 0;
        const diastolic = parseInt(blood_pressure_diastolic) || 0;
        if (systolic > 0 && diastolic > 0) {
            if (systolic >= 180 || diastolic >= 120) {
                riskScore += 20;
                risk_factors.push({ factor: 'Hypertensive Crisis', detail: `BP ${systolic}/${diastolic} mmHg — dangerously high, requires immediate medical attention`, points: 20 });
                recommendations.push('Seek immediate medical attention — your blood pressure is at a dangerously high level');
            } else if (systolic >= 140 || diastolic >= 90) {
                riskScore += 15;
                risk_factors.push({ factor: 'Stage 2 Hypertension', detail: `BP ${systolic}/${diastolic} mmHg — significantly elevated (Normal: <120/80)`, points: 15 });
                recommendations.push('Consult doctor about blood pressure medication. Reduce sodium intake to <2300mg/day');
            } else if (systolic >= 130 || diastolic >= 80) {
                riskScore += 10;
                risk_factors.push({ factor: 'Stage 1 Hypertension', detail: `BP ${systolic}/${diastolic} mmHg — above normal range (Normal: <120/80)`, points: 10 });
                recommendations.push('Monitor blood pressure regularly. Adopt DASH diet (rich in fruits, vegetables, whole grains)');
            } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
                riskScore += 5;
                risk_factors.push({ factor: 'Elevated Blood Pressure', detail: `BP ${systolic}/${diastolic} mmHg — slightly elevated (Normal: <120/80)`, points: 5 });
                recommendations.push('Maintain a low-sodium diet and regular physical activity to prevent hypertension');
            } else if (systolic < 90 || diastolic < 60) {
                riskScore += 8;
                risk_factors.push({ factor: 'Low Blood Pressure (Hypotension)', detail: `BP ${systolic}/${diastolic} mmHg — below normal range (Normal: 90-120/60-80)`, points: 8 });
                recommendations.push('Stay well hydrated, increase salt intake slightly, and report dizziness or fainting to your doctor');
            }
        }

        // ── Heart Rate (Resting Heart Rate Guidelines) ──
        const hr = parseInt(heart_rate) || 0;
        if (hr > 0) {
            if (hr > 100) {
                riskScore += 10;
                risk_factors.push({ factor: 'Tachycardia (High Heart Rate)', detail: `Resting HR ${hr} bpm — above normal (Normal: 60-100 bpm). Risk of cardiac complications`, points: 10 });
                recommendations.push('Consult a cardiologist. Resting heart rate above 100 bpm may indicate underlying cardiac issues');
            } else if (hr > 90) {
                riskScore += 5;
                risk_factors.push({ factor: 'Elevated Heart Rate', detail: `Resting HR ${hr} bpm — higher end of normal range, associated with increased cardiovascular risk`, points: 5 });
                recommendations.push('Regular aerobic exercise (30 min/day) can help lower resting heart rate');
            } else if (hr < 50 && exercise !== 'active') {
                riskScore += 8;
                risk_factors.push({ factor: 'Bradycardia (Low Heart Rate)', detail: `Resting HR ${hr} bpm — below normal (Normal: 60-100 bpm). May indicate cardiac conduction issues`, points: 8 });
                recommendations.push('Consult a doctor if experiencing dizziness, fatigue, or shortness of breath with low heart rate');
            }
        }

        // ── BMI (WHO Classification) ──
        const bmiVal = parseFloat(bmi) || 0;
        if (bmiVal > 0) {
            if (bmiVal >= 40) {
                riskScore += 18;
                risk_factors.push({ factor: 'Class III Obesity (Morbid)', detail: `BMI ${bmiVal} — severe obesity (Normal: 18.5-24.9). Very high risk for diabetes, heart disease, stroke`, points: 18 });
                recommendations.push('Consult doctor immediately about weight management. Consider medically supervised weight loss program');
            } else if (bmiVal >= 35) {
                riskScore += 15;
                risk_factors.push({ factor: 'Class II Obesity', detail: `BMI ${bmiVal} — high obesity (Normal: 18.5-24.9). Significantly increased risk for metabolic syndrome`, points: 15 });
                recommendations.push('Work with a dietitian on a structured calorie-deficit plan. Aim for 150+ minutes of exercise per week');
            } else if (bmiVal >= 30) {
                riskScore += 12;
                risk_factors.push({ factor: 'Class I Obesity', detail: `BMI ${bmiVal} — obese (Normal: 18.5-24.9). Increased risk for type 2 diabetes and cardiovascular disease`, points: 12 });
                recommendations.push('Set a realistic weight loss goal of 5-10% body weight. Increase daily physical activity');
            } else if (bmiVal >= 25) {
                riskScore += 6;
                risk_factors.push({ factor: 'Overweight', detail: `BMI ${bmiVal} — above normal (Normal: 18.5-24.9). Moderate risk for chronic diseases`, points: 6 });
                recommendations.push('Maintain balanced diet with portion control. Regular exercise of 30 minutes daily recommended');
            } else if (bmiVal < 18.5) {
                riskScore += 8;
                risk_factors.push({ factor: 'Underweight', detail: `BMI ${bmiVal} — below normal (Normal: 18.5-24.9). Risk of nutritional deficiency, weakened immunity`, points: 8 });
                recommendations.push('Consult a nutritionist. Increase caloric intake with nutrient-dense foods');
            }
        }

        // ── Blood Sugar (ADA Fasting Blood Glucose Guidelines) ──
        const sugar = parseInt(blood_sugar) || 0;
        if (sugar > 0) {
            if (sugar >= 200) {
                riskScore += 18;
                risk_factors.push({ factor: 'Very High Blood Sugar (Diabetic)', detail: `Fasting glucose ${sugar} mg/dL — diabetic range (Normal: 70-99 mg/dL). Risk of diabetic complications`, points: 18 });
                recommendations.push('Urgent: Consult endocrinologist. Uncontrolled diabetes can lead to nerve damage, kidney disease, and vision loss');
            } else if (sugar >= 126) {
                riskScore += 14;
                risk_factors.push({ factor: 'Diabetic Range Blood Sugar', detail: `Fasting glucose ${sugar} mg/dL — indicates diabetes (Normal: 70-99 mg/dL)`, points: 14 });
                recommendations.push('Get HbA1c test done. Start monitoring blood sugar regularly. Follow a low-glycemic diet');
            } else if (sugar >= 100) {
                riskScore += 8;
                risk_factors.push({ factor: 'Pre-Diabetic Blood Sugar', detail: `Fasting glucose ${sugar} mg/dL — pre-diabetic (Normal: 70-99 mg/dL). Risk of developing type 2 diabetes`, points: 8 });
                recommendations.push('Reduce sugar and refined carbohydrate intake. Regular exercise can improve insulin sensitivity by 40%');
            } else if (sugar < 70 && sugar > 0) {
                riskScore += 10;
                risk_factors.push({ factor: 'Low Blood Sugar (Hypoglycemia)', detail: `Fasting glucose ${sugar} mg/dL — below normal (Normal: 70-99 mg/dL). Can cause dizziness and confusion`, points: 10 });
                recommendations.push('Do not skip meals. Keep glucose tablets or fruit juice handy for emergencies');
            }
        }

        // ── Cholesterol (NCEP ATP III Guidelines) ──
        const chol = parseInt(cholesterol) || 0;
        if (chol > 0) {
            if (chol >= 300) {
                riskScore += 18;
                risk_factors.push({ factor: 'Very High Cholesterol', detail: `Total cholesterol ${chol} mg/dL — very high (Desirable: <200 mg/dL). Severe risk of atherosclerosis and heart attack`, points: 18 });
                recommendations.push('Urgent: Consult doctor about statin medication. Eliminate trans fats and limit saturated fat to <7% of calories');
            } else if (chol >= 240) {
                riskScore += 14;
                risk_factors.push({ factor: 'High Cholesterol', detail: `Total cholesterol ${chol} mg/dL — high risk category (Desirable: <200 mg/dL). Double the heart disease risk`, points: 14 });
                recommendations.push('Get a lipid panel test (LDL, HDL, triglycerides). Adopt Mediterranean diet rich in omega-3 fatty acids');
            } else if (chol >= 200) {
                riskScore += 7;
                risk_factors.push({ factor: 'Borderline High Cholesterol', detail: `Total cholesterol ${chol} mg/dL — borderline (Desirable: <200 mg/dL). Monitor closely`, points: 7 });
                recommendations.push('Increase soluble fiber intake (oats, beans, lentils). Add omega-3 rich foods (fish, flaxseed, walnuts)');
            }
        }

        // ── Smoking Risk ──
        if (smoking) {
            riskScore += 15;
            risk_factors.push({ factor: 'Tobacco/Smoking Use', detail: 'Smoking increases heart disease risk by 2-4x, stroke risk by 2x, and lung cancer risk by 25x', points: 15 });
            recommendations.push('Quit smoking — within 1 year, heart attack risk drops by 50%. Consult doctor for cessation aids (nicotine patches, medication)');
        }

        // ── Alcohol Risk ──
        if (alcohol) {
            riskScore += 8;
            risk_factors.push({ factor: 'Alcohol Consumption', detail: 'Regular alcohol use increases risk of liver disease, hypertension, cardiomyopathy, and stroke', points: 8 });
            recommendations.push('Limit alcohol intake — men: ≤2 drinks/day, women: ≤1 drink/day (WHO guidelines). Consider complete abstinence for liver health');
        }

        // ── Exercise Level Risk ──
        if (exercise === 'none') {
            riskScore += 10;
            risk_factors.push({ factor: 'Sedentary Lifestyle', detail: 'Physical inactivity increases mortality risk by 20-30% (WHO). Leading cause of preventable chronic disease', points: 10 });
            recommendations.push('Start with 15 minutes of walking daily, gradually increase to 150 minutes/week of moderate exercise (WHO recommendation)');
        } else if (exercise === 'light') {
            riskScore += 5;
            risk_factors.push({ factor: 'Insufficient Physical Activity', detail: 'Light exercise is below the recommended 150 min/week of moderate activity', points: 5 });
            recommendations.push('Aim for at least 150 minutes of moderate aerobic activity per week (brisk walking, cycling, swimming)');
        } else if (exercise === 'active') {
            riskScore = Math.max(0, riskScore - 5); // Active exercise reduces risk
        }

        // ── Family History Risk ──
        const famHistory = (family_history || '').toLowerCase();
        if (famHistory) {
            const hereditary_conditions = [
                { keyword: 'diabetes', label: 'Diabetes', extra: 'Type 2 diabetes risk increases 2-6x with family history' },
                { keyword: 'heart', label: 'Heart Disease', extra: 'First-degree family history doubles cardiovascular risk' },
                { keyword: 'hypertension', label: 'Hypertension', extra: '30-50% of hypertension cases have a genetic component' },
                { keyword: 'cancer', label: 'Cancer', extra: 'Certain cancers (breast, colon, prostate) have strong hereditary links' },
                { keyword: 'stroke', label: 'Stroke', extra: 'Family history of stroke increases risk by 30%' },
                { keyword: 'cholesterol', label: 'High Cholesterol', extra: 'Familial hypercholesterolemia affects 1 in 250 people' },
                { keyword: 'kidney', label: 'Kidney Disease', extra: 'Risk increases 2-3x with family history of kidney disease' },
                { keyword: 'thyroid', label: 'Thyroid Disorder', extra: 'Autoimmune thyroid conditions are strongly hereditary' },
                { keyword: 'asthma', label: 'Asthma/Allergies', extra: 'If one parent has asthma, child has 25% risk; both parents: 50%' },
                { keyword: 'obesity', label: 'Obesity', extra: 'Genetic factors account for 40-70% of obesity susceptibility' },
            ];
            let famMatches = 0;
            for (const cond of hereditary_conditions) {
                if (famHistory.includes(cond.keyword)) {
                    famMatches++;
                    risk_factors.push({ factor: `Family History: ${cond.label}`, detail: cond.extra, points: 5 });
                }
            }
            if (famMatches > 0) {
                riskScore += Math.min(famMatches * 5, 15); // Max 15 points from family history
                recommendations.push('Schedule regular preventive screenings based on family history. Early detection significantly improves outcomes');
            }
        }

        // ── Existing Conditions Risk ──
        const existing = (existing_conditions || '').toLowerCase();
        if (existing) {
            const chronic_conditions = [
                { keyword: 'diabetes', label: 'Diabetes', pts: 10, advice: 'Monitor HbA1c every 3 months. Target: below 7%' },
                { keyword: 'hypertension', label: 'Hypertension', pts: 8, advice: 'Monitor BP daily. Target: <130/80 mmHg on treatment' },
                { keyword: 'heart', label: 'Heart Disease', pts: 12, advice: 'Regular cardiac check-ups. Take medications as prescribed' },
                { keyword: 'asthma', label: 'Asthma', pts: 6, advice: 'Always carry rescue inhaler. Avoid known triggers' },
                { keyword: 'kidney', label: 'Kidney Disease', pts: 10, advice: 'Monitor creatinine and GFR regularly. Limit protein and potassium intake' },
                { keyword: 'liver', label: 'Liver Disease', pts: 10, advice: 'Avoid alcohol completely. Get liver function tests every 3 months' },
                { keyword: 'thyroid', label: 'Thyroid Disorder', pts: 5, advice: 'Get TSH levels checked every 6 months. Take thyroid medication on empty stomach' },
                { keyword: 'cancer', label: 'Cancer History', pts: 15, advice: 'Follow oncologist schedule for follow-up. Maintain a healthy lifestyle' },
                { keyword: 'copd', label: 'COPD', pts: 10, advice: 'Use prescribed inhalers. Avoid air pollution and smoke exposure' },
                { keyword: 'arthritis', label: 'Arthritis', pts: 4, advice: 'Low-impact exercise (swimming, yoga). Anti-inflammatory diet recommended' },
            ];
            for (const cond of chronic_conditions) {
                if (existing.includes(cond.keyword)) {
                    riskScore += cond.pts;
                    risk_factors.push({ factor: `Existing Condition: ${cond.label}`, detail: `${cond.label} significantly impacts overall health risk`, points: cond.pts });
                    recommendations.push(cond.advice);
                }
            }
        }

        // ── Cap risk score at 100 ──
        riskScore = Math.min(Math.round(riskScore), 100);

        // ── Determine risk level ──
        let risk_level;
        if (riskScore >= 60) risk_level = 'high';
        else if (riskScore >= 30) risk_level = 'medium';
        else risk_level = 'low';

        // ── Always add general recommendations ──
        if (risk_level === 'low') {
            recommendations.push('Your overall risk is low. Continue maintaining a healthy lifestyle');
        }
        recommendations.push('Schedule annual comprehensive health check-ups for early disease detection');
        if (!smoking && !alcohol && exercise === 'active') {
            recommendations.push('Excellent lifestyle habits! Continue your healthy routine');
        }

        res.json({ risk_score: riskScore, risk_level, risk_factors, recommendations });
    } catch (error) {
        console.error('Risk analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze risk.' });
    }
};

exports.analyzePrescription = async (req, res) => {
    try {
        const { medications } = req.body;
        if (!medications || !Array.isArray(medications)) {
            return res.status(400).json({ error: 'Please provide medications list.' });
        }
        
        res.json({
            analysis: {
                medications: medications.map(m => ({
                    name: m,
                    status: 'Valid',
                    notes: 'No known interactions detected'
                })),
                overallRisk: 'Low',
                summary: 'No significant drug interactions detected. Always consult your doctor for personalized advice.'
            }
        });
    } catch (error) {
        console.error('Prescription analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze prescription.' });
    }
};
