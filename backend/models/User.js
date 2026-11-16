const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema User berdasarkan spesifikasi Swagger (User, Role, UserCreateRequest)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Tidak disertakan secara default pada query untuk keamanan
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["Aktif", "Nonaktif"],
      default: "Aktif",
    },
  },
  {
    timestamps: true, // Otomatis mengelola createdAt dan updatedAt sesuai spesifikasi User
  }
);

// Hash password otomatis sebelum dokumen disimpan ke database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method untuk memvalidasi kesesuaian password input dengan hash di database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
