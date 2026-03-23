const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, isAdmin, isAdminOrReceptionist } = require('../middleware/auth');

router.use(protect);


// Admin & Receptionist can view doctors
router.get('/', isAdminOrReceptionist, doctorController.getDoctors);
router.get('/:id', isAdminOrReceptionist, doctorController.getDoctorById);

// Only Admin can create/update/delete doctors
router.post('/', isAdmin, doctorController.createDoctor);
router.put('/:id', isAdmin, doctorController.updateDoctor);
router.delete('/:id', isAdmin, doctorController.deleteDoctor);

module.exports = router;
