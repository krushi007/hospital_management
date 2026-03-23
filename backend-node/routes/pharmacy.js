const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacy/pharmacyController");
const { protect, isAdminOrPharmacist } = require("../middleware/auth");

router.use(protect);

router.get("/medicines", pharmacyController.getMedicines); // Anyone can view
router.post("/medicines", isAdminOrPharmacist, pharmacyController.createMedicine);
router.get("/orders", isAdminOrPharmacist, pharmacyController.getPharmacyOrders);
router.post("/orders", isAdminOrPharmacist, pharmacyController.createPharmacyOrder);
router.post(
  "/orders/create_from_prescription/",
  isAdminOrPharmacist,
  pharmacyController.createPharmacyOrder,
);
router.post("/orders/:id/dispense/", isAdminOrPharmacist, pharmacyController.dispenseOrder);
router.delete("/orders/:id", isAdminOrPharmacist, pharmacyController.deleteOrder);

module.exports = router;
