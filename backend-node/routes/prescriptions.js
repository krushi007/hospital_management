const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptions/prescriptionController');
const { protect } = require('../middleware/auth');

router.use(protect);


router.get('/', prescriptionController.getPrescriptions);
router.post('/', prescriptionController.createPrescription);
router.get('/reports', prescriptionController.getMedicalReports);
router.post('/:id/analyze/', prescriptionController.analyzePrescription);

module.exports = router;
