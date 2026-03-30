const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptions/prescriptionController');
const { protect, isDoctor, isAdminOrPharmacist, isAdminReceptionistDoctorOrPatient } = require('../middleware/auth');

router.use(protect);


// Doctors, Pharmacists, and Admins can view prescriptions
router.get('/', prescriptionController.getPrescriptions);
// Only Doctors can create prescriptions
router.post('/', isDoctor, prescriptionController.createPrescription);
router.get('/reports', prescriptionController.getMedicalReports);
// AI analysis can be run by staff or the patient themselves
router.post('/:id/analyze/', isAdminReceptionistDoctorOrPatient, prescriptionController.analyzePrescription);

module.exports = router;
