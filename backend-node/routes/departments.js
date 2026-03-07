const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departments/departmentController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", departmentController.getDepartments);
router.get("/rooms", departmentController.getRooms);
router.get("/admissions", departmentController.getAdmissions);
router.post("/admissions", departmentController.createAdmission);
router.post(
  "/admissions/:id/discharge/",
  departmentController.dischargeAdmission,
);

module.exports = router;
