const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware untuk memverifikasi token JWT (Autentikasi)
const protect = async (req, res, next) => {
  let token;

  // 1. Periksa apakah header Authorization ada dan diawali dengan 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Ambil token dari string 'Bearer <token>'
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token menggunakan secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "camprent_jwt_secret_dev"
      );

      // Cari user berdasarkan ID dari payload token (tanpa password)
      const user = await User.findById(decoded.id);

      if (!user) {
        return res
          .status(401)
          .json({ message: "Pengguna tidak ditemukan" });
      }

      // Pastikan status akun masih aktif
      if (user.status !== "Aktif") {
        return res
          .status(401)
          .json({ message: "Akun Anda berstatus nonaktif" });
      }

      // Simpan data user ke dalam req.user agar dapat diakses oleh controller berikutnya
      req.user = user;
      next();
    } catch (error) {
      // Tangani error token kedaluwarsa atau signature tidak valid
      return res
        .status(401)
        .json({ message: "Token tidak valid atau kedaluwarsa" });
    }
  } else {
    // Jika tidak ada header Authorization atau tidak menggunakan Bearer
    return res
      .status(401)
      .json({ message: "Token tidak ada, akses ditolak" });
  }
};

// Middleware untuk membatasi akses berdasarkan peran pengguna (Otorisasi / RBAC)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Pastikan req.user sudah ada dan role-nya termasuk dalam daftar role yang diizinkan
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: role tidak sesuai" });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
