const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function untuk generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "camprent_jwt_secret_dev",
    { expiresIn: "7d" }
  );
};

// @desc    Registrasi pengguna baru
// @route   POST /api/v1/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validasi field wajib
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    // Validasi konfirmasi password jika dikirimkan dari frontend
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Konfirmasi password tidak cocok" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password minimal 6 karakter" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Role default "customer", atau sesuai input jika valid ("customer", "admin", "staff")
    const assignedRole = ["customer", "admin", "staff"].includes(role) ? role : "customer";

    // Buat pengguna baru di MongoDB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
    });

    // Kembalikan objek user tanpa password sesuai schema User di Swagger
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

// @desc    Login pengguna & dapatkan token
// @route   POST /api/v1/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi field wajib
    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    // Cari user berdasarkan email dan sertakan field password (karena select: false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Cek status aktif
    if (user.status !== "Aktif") {
      return res.status(401).json({ message: "Akun Anda berstatus nonaktif. Silakan hubungi admin." });
    }

    // Cek kecocokan password dengan hash di database
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // Buat token JWT
    const token = generateToken(user._id, user.role);

    // Kembalikan response sesuai schema LoginResponse di Swagger
    return res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Terjadi kesalahan server" });
  }
};

module.exports = {
  register,
  login,
};
