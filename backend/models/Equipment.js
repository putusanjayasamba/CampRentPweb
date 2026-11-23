const mongoose = require("mongoose");

// Sub-schema spesifikasi teknis alat (misal: Kapasitas, Berat, Anti air)
const specSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Schema Equipment berdasarkan spesifikasi Swagger (Equipment, EquipmentInput, Category)
const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Tenda", "Sleeping Gear", "Cooking", "Lighting", "Carrier"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    specs: {
      type: [specSchema],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    totalValue: {
      type: Number,
      default: 0, // Nilai alat sebagai dasar perhitungan denda kerusakan/hilang
    },
    image: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Tersedia", "Menipis", "Habis"],
      default: "Tersedia",
    },
  },
  {
    timestamps: true,
  }
);

// Update status ketersediaan otomatis berdasarkan jumlah stok sebelum disimpan
equipmentSchema.pre("save", async function () {
  if (this.stock === 0) {
    this.status = "Habis";
  } else if (this.stock <= 3) {
    this.status = "Menipis";
  } else {
    this.status = "Tersedia";
  }
});

module.exports = mongoose.model("Equipment", equipmentSchema);
