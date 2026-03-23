const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departments/departmentController");
const { protect, isAdmin, isAdminOrReceptionist } = require("../middleware/auth");

router.use(protect);

router.get("/", departmentController.getDepartments); // Open to all logged-in
router.get("/rooms", departmentController.getRooms); // Open to all logged-in
router.get("/admissions", isAdminOrReceptionist, departmentController.getAdmissions);
router.post("/admissions", isAdminOrReceptionist, departmentController.createAdmission);
router.post(
  "/admissions/:id/discharge/",
  isAdminOrReceptionist,
  departmentController.dischargeAdmission,
);
router.get("/admissions/:id/bill", isAdminOrReceptionist, departmentController.downloadBill);

module.exports = router;
