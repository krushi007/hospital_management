const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/pharmacy/pharmacyController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/medicines", pharmacyController.getMedicines);
router.get("/orders", pharmacyController.getPharmacyOrders);
router.post("/orders", pharmacyController.createPharmacyOrder);
router.post(
  "/orders/create_from_prescription/",
  pharmacyController.createPharmacyOrder,
);
router.post("/orders/:id/dispense/", pharmacyController.dispenseOrder);
router.delete("/orders/:id", pharmacyController.deleteOrder);

module.exports = router;
