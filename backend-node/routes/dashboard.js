const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard/dashboardController");
const { protect } = require("../middleware/auth");

router.use(protect);

// Map to /api/dashboard/stats
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
