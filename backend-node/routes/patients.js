const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/auth');

router.use(protect);


// Patient Profile Routes
router.get('/', patientController.getPatients);
router.post('/', patientController.createPatient);
router.get('/me', patientController.getMe);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

// Medical Record Routes
router.get('/:id/records', patientController.getMedicalRecords);
router.post('/:id/records', patientController.createMedicalRecord);

module.exports = router;
