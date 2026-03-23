const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
  protect,
  isAdmin,
  isAdminOrReceptionist,
  isAdminOrDoctor,
  isAdminReceptionistOrDoctor,
} = require("../middleware/auth");

router.use(protect);

// Patient Profile Routes
router.get("/", isAdminReceptionistOrDoctor, patientController.getPatients);
router.post("/", isAdminOrReceptionist, patientController.createPatient);
router.get("/me", patientController.getMe); // Allow any logged-in user to check their profile (though mostly for patients)
router.get("/:id", isAdminOrReceptionist, patientController.getPatientById);
router.put("/:id", isAdminOrReceptionist, patientController.updatePatient);
router.delete("/:id", isAdmin, patientController.deletePatient); // Only admin can delete

// Medical Record Routes
router.get(
  "/:id/records",
  isAdminOrDoctor,
  patientController.getMedicalRecords,
);
router.post(
  "/:id/records",
  isAdminOrDoctor,
  patientController.createMedicalRecord,
);

module.exports = router;
