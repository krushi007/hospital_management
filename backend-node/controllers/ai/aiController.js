const axios = require('axios');

const ML_SERVICE_URL = 'http://localhost:8001';

exports.predictDisease = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/disease`, req.body);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Failed to connect to ML service." });
        }
    }
};

exports.getSymptoms = async (req, res) => {
    // A simple mock for now or could call the ML service
    res.json({ symptoms: [
        "itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing", 
        "shivering", "chills", "joint_pain", "stomach_pain"
    ] });
};

exports.analyzeRisk = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/risk`, req.body);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Failed to connect to ML service." });
        }
    }
};

exports.analyzePrescription = async (req, res) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/ml/prescription`, req.body);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: "Failed to connect to ML service." });
        }
    }
};
