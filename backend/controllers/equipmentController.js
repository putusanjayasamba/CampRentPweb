const Equipment = require("../models/Equipment");

// @desc    Daftar alat (pencarian, filter kategori/harga/ketersediaan, sorting, pagination)
// @route   GET /api/v1/equipment
const getEquipment = async (req, res) => {
  try {
    const { q, category, maxPrice, available, sort, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Filter pencarian berdasarkan nama atau kategori
    if (q) {
      filter.$or = [
        { name: { $regex: q.trim(), $options: "i" } },
        { category: { $regex: q.trim(), $options: "i" } },
      ];
    }

    // Filter kategori spesifik
    if (category) {
      filter.category = category;
    }

    // Filter harga sewa per hari maksimum
    if (maxPrice) {
      filter.pricePerDay = { $lte: Number(maxPrice) };
    }

    // Filter ketersediaan stok
    if (available === "true" || available === true) {
      filter.stock = { $gt: 0 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting (default terbaru)
    let sortBy = { createdAt: -1 };
    if (sort) {
      if (sort.startsWith("-")) {
        sortBy = { [sort.substring(1)]: -1 };
      } else {
        sortBy = { [sort]: 1 };
      }
    }

    const total = await Equipment.countDocuments(filter);
    const data = await Equipment.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    // Format response sesuai schema inline_response_200 di Swagger
    return res.status(200).json({
      data,
      page: pageNum,
      limit: limitNum,
      total,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Gagal mengambil data alat" });
  }
};

// @desc    Detail satu alat berdasarkan ID
// @route   GET /api/v1/equipment/:id
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Alat tidak ditemukan" });
    }
    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Gagal mengambil detail alat" });
  }
};

// @desc    Cek ketersediaan alat pada rentang tanggal
// @route   GET /api/v1/equipment/availability
const getAvailability = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Parameter tanggal 'start' dan 'end' wajib diisi" });
    }

    const equipments = await Equipment.find({});

    // Hitung stok yang tersedia (dapat diintegrasikan dengan modul Booking aktif)
    const availabilityData = equipments.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        availableStock: doc.stock,
      };
    });

    return res.status(200).json(availabilityData);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Gagal memeriksa ketersediaan alat" });
  }
};

// @desc    Tambah alat baru (Khusus Admin)
// @route   POST /api/v1/equipment
const createEquipment = async (req, res) => {
  try {
    const { name, category, pricePerDay, stock, specs, description, totalValue, tags, image } = req.body;

    // Validasi field wajib
    if (!name || !category || pricePerDay === undefined || stock === undefined) {
      return res.status(400).json({
        message: "Field 'name', 'category', 'pricePerDay', dan 'stock' wajib diisi",
      });
    }

    // Tentukan status ketersediaan awal
    let status = "Tersedia";
    if (Number(stock) === 0) {
      status = "Habis";
    } else if (Number(stock) <= 3) {
      status = "Menipis";
    }

    const equipment = await Equipment.create({
      name: name.trim(),
      category,
      pricePerDay: Number(pricePerDay),
      stock: Number(stock),
      specs: specs || [],
      description: description ? description.trim() : "",
      totalValue: totalValue ? Number(totalValue) : 0,
      tags: tags || [],
      image: image || "",
      status,
    });

    return res.status(201).json(equipment);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Gagal membuat data alat" });
  }
};

// @desc    Ubah data alat (Khusus Admin)
// @route   PUT /api/v1/equipment/:id
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Alat tidak ditemukan" });
    }

    const { name, category, pricePerDay, stock, specs, description, totalValue, tags, image, status } = req.body;

    if (name) equipment.name = name.trim();
    if (category) equipment.category = category;
    if (pricePerDay !== undefined) equipment.pricePerDay = Number(pricePerDay);
    if (specs) equipment.specs = specs;
    if (description !== undefined) equipment.description = description.trim();
    if (totalValue !== undefined) equipment.totalValue = Number(totalValue);
    if (tags) equipment.tags = tags;
    if (image !== undefined) equipment.image = image;

    if (stock !== undefined) {
      equipment.stock = Number(stock);
      // Sinkronkan status otomatis jika stok berubah
      if (equipment.stock === 0) {
        equipment.status = "Habis";
      } else if (equipment.stock <= 3) {
        equipment.status = "Menipis";
      } else {
        equipment.status = "Tersedia";
      }
    } else if (status) {
      equipment.status = status;
    }

    const updated = await equipment.save();
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Gagal memperbarui data alat" });
  }
};

// @desc    Hapus alat (Khusus Admin)
// @route   DELETE /api/v1/equipment/:id
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: "Alat tidak ditemukan" });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Alat berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Gagal menghapus alat" });
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  getAvailability,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
