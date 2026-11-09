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

// Route root untuk health check
app.get("/", (req, res) => {
  res.json({ message: "CampRent API berjalan" });
});

// Koneksi ke MongoDB, jalankan server HANYA jika database berhasil terkoneksi
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });

