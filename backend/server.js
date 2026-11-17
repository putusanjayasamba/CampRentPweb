// Muat konfigurasi environment variables di baris paling awal
require("dotenv").config();

// Gunakan resolver DNS publik agar query SRV MongoDB Atlas tidak diblokir ISP/router lokal
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors());
app.use(express.json());

// Fungsi koneksi ke MongoDB (mendukung server lokal & Vercel serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Terhubung ke MongoDB");
  } catch (err) {
    console.error("Gagal terhubung ke MongoDB:", err.message);
  }
};

// Middleware untuk memastikan koneksi database aktif pada setiap request serverless
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Route root untuk health check
app.get("/", (req, res) => {
  res.json({ message: "CampRent API berjalan" });
});

// Route API v1
app.use("/api/v1/auth", require("./routes/authRoutes"));

// Jalankan server HANYA jika dijalankan secara lokal (bukan di lingkungan serverless Vercel)
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  });
}

// Ekspor app agar dapat dieksekusi oleh Vercel Serverless Function
module.exports = app;

