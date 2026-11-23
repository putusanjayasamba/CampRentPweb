require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Equipment = require("../models/Equipment");

const initialEquipments = [
  {
    name: "Tenda Dome 4 Orang",
    category: "Tenda",
    description: "Tenda dome kapasitas 4 orang dengan lapisan double layer tahan angin dan hujan.",
    tags: ["tenda", "dome", "camping", "waterproof"],
    pricePerDay: 75000,
    stock: 3,
    totalValue: 900000,
    image: "/TendaDome4orang.jpg",
    specs: [
      { label: "Kapasitas", value: "4 orang" },
      { label: "Berat", value: "3,8 kg" },
      { label: "Lapisan", value: "Double layer" },
      { label: "Anti air", value: "3000 mm" },
    ],
  },
  {
    name: "Sleeping Bag Mummy",
    category: "Sleeping Gear",
    description: "Sleeping bag hangat model mummy dengan bahan polar fleece nyaman untuk cuaca dingin.",
    tags: ["sleeping bag", "polar", "mummy", "hangat"],
    pricePerDay: 25000,
    stock: 5,
    totalValue: 300000,
    image: "/SleepingBagMummy.jpg",
    specs: [
      { label: "Kapasitas", value: "1 orang" },
      { label: "Berat", value: "0,9 kg" },
      { label: "Lapisan", value: "Polar fleece tebal" },
      { label: "Suhu min", value: "10°C" },
    ],
  },
  {
    name: "Kompor Portable",
    category: "Cooking",
    description: "Kompor gas portable ringkas dengan pelindung angin lotus dan pemantik elektrik.",
    tags: ["kompor", "portable", "masak", "windproof"],
    pricePerDay: 15000,
    stock: 0,
    totalValue: 180000,
    image: "/KomporPortabel.jpg",
    specs: [
      { label: "Bahan", value: "Stainless Steel" },
      { label: "Berat", value: "450 gram" },
      { label: "Pemantik", value: "Piezo elektrik" },
      { label: "Pelindung", value: "Windproof lotus" },
    ],
  },
  {
    name: "Lampu Tenda LED",
    category: "Lighting",
    description: "Lampu tenda gantung LED baterai isi ulang 2400 mAh dengan 3 pilihan mode pencahayaan.",
    tags: ["lampu", "led", "rechargeable", "tenda"],
    pricePerDay: 10000,
    stock: 8,
    totalValue: 120000,
    image: "/LampuLed.jpg",
    specs: [
      { label: "Baterai", value: "2400 mAh" },
      { label: "Mode", value: "3 mode cahaya" },
      { label: "Fitur", value: "USB Rechargeable" },
      { label: "Daya tahan", value: "12 jam" },
    ],
  },
  {
    name: "Carrier 60L",
    category: "Carrier",
    description: "Tas gunung carrier 60 liter dengan rangka aluminium alloy dan penutup hujan.",
    tags: ["carrier", "tas gunung", "raincover", "outdoor"],
    pricePerDay: 35000,
    stock: 4,
    totalValue: 550000,
    image: "/TasCarrier60L.jpg",
    specs: [
      { label: "Kapasitas", value: "60 Liter" },
      { label: "Berat", value: "1,6 kg" },
      { label: "Rangka", value: "Aluminium alloy" },
      { label: "Fitur", value: "Include Rain Cover" },
    ],
  },
  {
    name: "Set Nesting Masak",
    category: "Cooking",
    description: "Set peralatan masak camping nesting isi 2 panci dan 1 wajan bahan aluminium tahan karat.",
    tags: ["nesting", "panci", "wajan", "masak"],
    pricePerDay: 12000,
    stock: 6,
    totalValue: 150000,
    image: "/SetNestingMasak.jpg",
    specs: [
      { label: "Isi set", value: "2 Panci + 1 Wajan" },
      { label: "Bahan", value: "Anodized aluminium" },
      { label: "Pegangan", value: "Anti-panas lipat" },
      { label: "Kapasitas", value: "3-4 orang" },
    ],
  },
];

const seedEquipment = async () => {
  try {
    console.log("Menghubungkan ke MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Terhubung ke MongoDB.");

    // Hapus data alat lama jika ada agar bersih
    await Equipment.deleteMany({});
    console.log("Data lama dibersihkan.");

    // Masukkan data awal
    for (const item of initialEquipments) {
      await Equipment.create(item);
    }

    console.log(`Berhasil menambahkan ${initialEquipments.length} alat camping ke MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error("Gagal melakukan seeding:", error.message);
    process.exit(1);
  }
};

seedEquipment();
