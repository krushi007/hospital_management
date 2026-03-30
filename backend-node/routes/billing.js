const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing/billingController");
const { protect, isAdminOrReceptionist, isAdminReceptionistDoctorOrPatient } = require("../middleware/auth");

router.use(protect);

router.get("/", isAdminReceptionistDoctorOrPatient, billingController.getInvoices);
router.post("/", isAdminOrReceptionist, billingController.createInvoice);
router.get("/payments", isAdminOrReceptionist, billingController.getPayments);
router.get("/:id", isAdminOrReceptionist, billingController.getInvoiceById);
router.post("/:id/add_payment/", isAdminOrReceptionist, billingController.addPayment);

module.exports = router;
