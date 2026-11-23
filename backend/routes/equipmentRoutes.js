const express = require("express");
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  getAvailability,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipmentController");
const { protect, authorize } = require("../middleware/auth");

// Rute Publik / Terbuka untuk Customer, Tamu, dan Admin
router.get("/", getEquipment);
router.get("/availability", getAvailability);
router.get("/:id", getEquipmentById);

// Rute Terproteksi Khusus Admin
router.post("/", protect, authorize("admin"), createEquipment);
router.put("/:id", protect, authorize("admin"), updateEquipment);
router.delete("/:id", protect, authorize("admin"), deleteEquipment);

module.exports = router;
