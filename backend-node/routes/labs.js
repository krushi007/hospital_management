const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const { protect, isAdminOrReceptionist, isAdminReceptionistOrDoctor, isAdminReceptionistDoctorOrPatient } = require("../middleware/auth");

router.use(protect);

router.get("/", isAdminReceptionistDoctorOrPatient, labController.getLabTests);
router.post("/", isAdminReceptionistOrDoctor, labController.requestLabTest);
router.patch("/:id", isAdminOrReceptionist, labController.updateLabTest);
router.delete("/:id", isAdminOrReceptionist, labController.deleteLabTest);

module.exports = router;
