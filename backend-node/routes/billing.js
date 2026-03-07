const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing/billingController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", billingController.getInvoices);
router.post("/", billingController.createInvoice);
router.post("/:id/add_payment/", billingController.addPayment);
router.get("/payments", billingController.getPayments);

module.exports = router;
