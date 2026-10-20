export interface BookingItem {
  kode: string;
  customer: string;
  alat: string;
  periode: string;
  total: number;
  pembayaran: "Belum bayar" | "Lunas";
  status: "Pending" | "Approved" | "Picked Up" | "Completed" | "Cancelled";
}

export interface EquipmentStockItem {
  idDoc: string;
  name: string;
  category: "Tenda" | "Sleeping Gear" | "Cooking" | "Lighting";
  stock: number;
  pricePerDay: number;
  totalValue: number;
  description?: string;
  tags?: string[];
  status: "Tersedia" | "Menipis" | "Habis";
  iconType: "tent" | "sleeping" | "matras" | "stove" | "light";
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Admin" | "Staff";
  status: "Aktif" | "Nonaktif";
}

export const INITIAL_BOOKINGS: BookingItem[] = [
  {
    kode: "BK-0128",
    customer: "Kadek Ayu",
    alat: "Tenda Dome 4P, Lampu LED",
    periode: "28–30 Sep",
    total: 255000,
    pembayaran: "Belum bayar",
    status: "Pending",
  },
  {
    kode: "BK-0127",
    customer: "Rian Pratama",
    alat: "Sleeping Bag ×2",
    periode: "24–25 Sep",
    total: 100000,
    pembayaran: "Lunas",
    status: "Approved",
  },
  {
    kode: "BK-0117",
    customer: "Wayan Dita",
    alat: "Carrier 60L",
    periode: "14–17 Sep",
    total: 105000,
    pembayaran: "Lunas",
    status: "Picked Up",
  },
  {
    kode: "BK-0102",
    customer: "Bagus Arya",
    alat: "Set Nesting Masak",
    periode: "02–04 Sep",
    total: 36000,
    pembayaran: "Lunas",
    status: "Completed",
  },
];

export const INITIAL_STOCK_ITEMS: EquipmentStockItem[] = [
  {
    idDoc: "6500a1b2c3d4...5678",
    name: "Tenda Dome 4 Orang",
    category: "Tenda",
    stock: 3,
    pricePerDay: 75000,
    totalValue: 950000,
    description: "Tenda luas untuk keluarga, double layer, anti air 3000 mm.",
    tags: ["family", "waterproof"],
    status: "Menipis",
    iconType: "tent",
  },
  {
    idDoc: "6500a1b2c3d4...5679",
    name: "Tenda Dome 2 Orang",
    category: "Tenda",
    stock: 6,
    pricePerDay: 45000,
    totalValue: 550000,
    description: "Tenda praktis 2 orang, ringan dibawa mendaki.",
    tags: ["compact", "waterproof"],
    status: "Tersedia",
    iconType: "tent",
  },
  {
    idDoc: "6500a1b2c3d4...5680",
    name: "Sleeping Bag Mummy",
    category: "Sleeping Gear",
    stock: 12,
    pricePerDay: 25000,
    totalValue: 300000,
    description: "Bahan polar hangat tahan suhu hingga 10°C.",
    tags: ["warm", "polar"],
    status: "Tersedia",
    iconType: "sleeping",
  },
  {
    idDoc: "6500a1b2c3d4...5681",
    name: "Matras Gulung",
    category: "Sleeping Gear",
    stock: 2,
    pricePerDay: 10000,
    totalValue: 120000,
    description: "Matras busa empuk penahan dingin tanah.",
    tags: ["lightweight"],
    status: "Menipis",
    iconType: "matras",
  },
  {
    idDoc: "6500a1b2c3d4...5682",
    name: "Kompor Portable",
    category: "Cooking",
    stock: 0,
    pricePerDay: 15000,
    totalValue: 180000,
    description: "Kompor mini windproof pemantik piezo elektrik.",
    tags: ["portable", "windproof"],
    status: "Habis",
    iconType: "stove",
  },
  {
    idDoc: "6500a1b2c3d4...5683",
    name: "Lampu Tenda LED",
    category: "Lighting",
    stock: 9,
    pricePerDay: 10000,
    totalValue: 90000,
    description: "Lampu LED gantung recharge USB baterai 2400 mAh.",
    tags: ["rechargeable", "bright"],
    status: "Tersedia",
    iconType: "light",
  },
];

export const INITIAL_USERS: UserItem[] = [
  {
    id: "u1",
    name: "Kadek Ayu",
    email: "kadek@mail.com",
    role: "Customer",
    status: "Aktif",
  },
  {
    id: "u2",
    name: "Ida Bagus",
    email: "idabagus@mail.com",
    role: "Admin",
    status: "Aktif",
  },
  {
    id: "u3",
    name: "Putu Sanjaya",
    email: "putu@mail.com",
    role: "Staff",
    status: "Aktif",
  },
  {
    id: "u4",
    name: "Rian Pratama",
    email: "rian@mail.com",
    role: "Customer",
    status: "Aktif",
  },
];
