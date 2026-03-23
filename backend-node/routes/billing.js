const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing/billingController");
const { protect, isAdmin, isAdminOrReceptionist } = require("../middleware/auth");

router.use(protect);

router.get("/", isAdminOrReceptionist, billingController.getInvoices);
router.post("/", isAdminOrReceptionist, billingController.createInvoice);
router.post("/:id/add_payment/", isAdminOrReceptionist, billingController.addPayment);
router.get("/payments", isAdminOrReceptionist, billingController.getPayments);

module.exports = router;
