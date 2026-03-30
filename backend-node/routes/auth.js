const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Auth Routes
router.post("/login", authController.login);
router.post("/register", authController.register);

// Profile
router.get("/profile", protect, authController.getProfile);
router.post("/change-password", protect, authController.changePassword);

router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
