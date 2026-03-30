const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments/appointmentController");
const { protect, isDoctor, isAdminOrReceptionist, isAdminReceptionistOrDoctor } = require("../middleware/auth");

router.use(protect);

// Anyone (Admin, Receptionist, Doctor) can view appointments (doctor sees only theirs via controller logic)
router.get("/", appointmentController.getAppointments);
// Receptionist/Admin creates appointments
router.post("/", isAdminOrReceptionist, appointmentController.createAppointment);
// Admin/Receptionist/Doctor can update status (doctors confirm/cancel their own appointments)
router.patch("/:id/update_status/", isAdminReceptionistOrDoctor, appointmentController.updateStatus);
// Only doctors request admission
router.patch("/:id/request_admission/", isDoctor, appointmentController.requestAdmission);

module.exports = router;
