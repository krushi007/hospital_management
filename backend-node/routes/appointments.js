const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments/appointmentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", appointmentController.getAppointments);
router.post("/", appointmentController.createAppointment);
router.patch("/:id/update_status/", appointmentController.updateStatus);
router.patch("/:id/request_admission/", appointmentController.requestAdmission);

module.exports = router;
