const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai/aiController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/predict", aiController.predictDisease);
router.get("/symptoms", aiController.getSymptoms);
router.post("/risk-analysis", aiController.analyzeRisk);
router.post("/analyze-prescription", aiController.analyzePrescription);

module.exports = router;
