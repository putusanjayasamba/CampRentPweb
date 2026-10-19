export interface Equipment {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  pricePerDay: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: string[];
  popular?: boolean;
}

export const CATEGORIES = [
  { id: "all", label: "Semua Alat" },
  { id: "tent", label: "Tenda & Shelter" },
  { id: "sleep", label: "Tidur & Matras" },
  { id: "cook", label: "Masak & Makan" },
  { id: "carrier", label: "Carrier & Tas" },
  { id: "light", label: "Penerangan & Tools" },
];

export const EQUIPMENT_LIST: Equipment[] = [
  {
    id: "eq-1",
    name: "Tenda Dome Eiger Guardian 4P",
    category: "tent",
    categoryLabel: "Tenda & Shelter",
    pricePerDay: 45000,
    stock: 8,
    rating: 4.9,
    reviewsCount: 86,
    description: "Tenda kapasitas 4 orang dengan double layer waterproof PU 3000mm, tahan badai dan ventilasi udara nyaman.",
    specs: ["Kapasitas 4 Orang", "Double Layer PU 3000mm", "Frame Fiber Kuat", "Berat 3.8 kg"],
    popular: true,
  },
  {
    id: "eq-2",
    name: "Sleeping Bag Polar Bulu Tebal",
    category: "sleep",
    categoryLabel: "Tidur & Matras",
    pricePerDay: 15000,
    stock: 15,
    rating: 4.8,
    reviewsCount: 112,
    description: "Sleeping bag dengan lapisan dalam bulu polar hangat, nyaman digunakan pada suhu dingin 10°C - 15°C.",
    specs: ["Bahan Polar Fleece", "Suhu Min. 10°C", "Panjang 205 cm", "Termasuk Pouch Kompresi"],
    popular: true,
  },
  {
    id: "eq-3",
    name: "Kompor Portable Windproof Kovar",
    category: "cook",
    categoryLabel: "Masak & Makan",
    pricePerDay: 15000,
    stock: 12,
    rating: 4.9,
    reviewsCount: 94,
    description: "Kompor gas lipat dengan pelindung angin model kelopak teratai, api stabil dan hemat bahan bakar.",
    specs: ["Pelindung Angin Lotus", "Pemantik Piezo Elektrik", "Bahan Stainless Steel", "Berat 450g"],
    popular: true,
  },
  {
    id: "eq-4",
    name: "Carrier Osprey Volt 60 Liter",
    category: "carrier",
    categoryLabel: "Carrier & Tas",
    pricePerDay: 40000,
    stock: 6,
    rating: 5.0,
    reviewsCount: 54,
    description: "Tas gunung ergonomis 60L dengan sistem sirkulasi punggung AirScape, distribusi beban maksimal.",
    specs: ["Kapasitas 60 Liter", "AirScape Backpanel", "Termasuk Rain Cover", "Beban Max 20kg"],
    popular: true,
  },
  {
    id: "eq-5",
    name: "Cooking Set Nesting DS-308 (4 in 1)",
    category: "cook",
    categoryLabel: "Masak & Makan",
    pricePerDay: 20000,
    stock: 10,
    rating: 4.7,
    reviewsCount: 68,
    description: "Set panci dan wajan camping anoda aluminium anti lengket, sudah termasuk mangkok dan spatula mini.",
    specs: ["Bahan Hard Anodized", "2 Panci + 1 Wajan", "Pegangan Lipat Isolasi", "Kapasitas 3-4 Orang"],
  },
  {
    id: "eq-6",
    name: "Lentera Tenda LED Solar & USB Rechargeable",
    category: "light",
    categoryLabel: "Penerangan & Tools",
    pricePerDay: 10000,
    stock: 18,
    rating: 4.8,
    reviewsCount: 75,
    description: "Lampu gantung serbaguna dengan baterai cas USB dan panel surya, cahaya 360 derajat terang merata.",
    specs: ["Baterai 2400mAh", "3 Mode Cahaya", "Fungsi Powerbank", "Tahan Percikan Air"],
  },
  {
    id: "eq-7",
    name: "Matras Angin Ultralight Self-Inflating",
    category: "sleep",
    categoryLabel: "Tidur & Matras",
    pricePerDay: 20000,
    stock: 9,
    rating: 4.8,
    reviewsCount: 43,
    description: "Matras tiup otomatis dengan bantal terintegrasi, ketebalan 5cm untuk isolasi dari tanah dingin berbatu.",
    specs: ["Tebal 5 cm", "Self-Inflating Valve", "Ukuran 190 x 60 cm", "Ultralight 800 gram"],
  },
  {
    id: "eq-8",
    name: "Flysheet Waterproof 3x4 Meter + Pasak",
    category: "tent",
    categoryLabel: "Tenda & Shelter",
    pricePerDay: 20000,
    stock: 11,
    rating: 4.9,
    reviewsCount: 51,
    description: "Kanopi pelindung hujan dan terik matahari serbaguna, 19 titik tali pengikat diperkuat jahitan bartack.",
    specs: ["Ukuran 300 x 400 cm", "Bahan Oxford 210D PU 3000mm", "Termasuk 6 Pasak + Tali", "Anti UV Coating"],
  },
];

export const RENTAL_PACKAGES = [
  {
    id: "pkg-1",
    name: "Paket Solo Camper (1 Orang)",
    price: 65000,
    originalPrice: 85000,
    items: [
      "1x Tenda Dome 2P",
      "1x Sleeping Bag Polar",
      "1x Matras Alumunium",
      "1x Headlamp LED",
    ],
    recommended: false,
  },
  {
    id: "pkg-2",
    name: "Paket Duo Adventure (2 Orang)",
    price: 110000,
    originalPrice: 145000,
    items: [
      "1x Tenda Dome 2-3P Double Layer",
      "2x Sleeping Bag Polar",
      "2x Matras Angin Nyaman",
      "1x Kompor Portable + Gas",
      "1x Lentera Camping LED",
    ],
    recommended: true,
  },
  {
    id: "pkg-3",
    name: "Paket Regu / Group (4 Orang)",
    price: 185000,
    originalPrice: 245000,
    items: [
      "1x Tenda Eiger 4P",
      "4x Sleeping Bag Bulu Tebal",
      "1x Cooking Set Lengkap DS-308",
      "1x Kompor Kovar Windproof",
      "1x Flysheet 3x4m + Pasak",
      "2x Lentera Tenda USB",
    ],
    recommended: false,
  },
];
