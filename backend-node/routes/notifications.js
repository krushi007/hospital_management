const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/notificationController");

router.get("/", protect, ctrl.getNotifications);
router.patch("/read-all", protect, ctrl.markAllRead);
router.patch("/:id/read", protect, ctrl.markAsRead);

module.exports = router;
