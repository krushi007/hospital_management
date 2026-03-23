const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai/aiController");
const dietPlannerController = require("../controllers/ai/dietPlannerController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/predict", aiController.predictDisease);
router.get("/symptoms", aiController.getSymptoms);
router.post("/risk-analysis", aiController.analyzeRisk);
router.post("/analyze-prescription", aiController.analyzePrescription);
router.post("/diet-plan", dietPlannerController.getDietPlan);
router.get("/diet-diseases", dietPlannerController.getDiseaseList);

module.exports = router;
