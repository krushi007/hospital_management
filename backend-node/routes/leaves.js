const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { protect } = require("../middleware/auth");

// Doctor can view their leaves, Admin/Receptionist can view all leaves
router.get("/", protect, leaveController.getLeaves);

// Doctor or Admin can request a leave
router.post("/", protect, leaveController.requestLeave);

// Admin/Receptionist can approve or reject leaves
router.patch("/:id", protect, leaveController.updateLeaveStatus);

// Delete leave (pending only for doctors)
router.delete("/:id", protect, leaveController.deleteLeave);

module.exports = router;
