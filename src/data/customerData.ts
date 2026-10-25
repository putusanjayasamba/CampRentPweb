export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  codeId: string;
  name: string;
  category: "tenda" | "sleeping" | "cooking" | "lighting" | "carrier";
  categoryLabel: string;
  price: number;
  available: boolean;
  stock: number;
  bgPastel: string;
  image?: string;
  type: "tent" | "sleeping" | "stove" | "light" | "backpack" | "nesting";
  specs: ProductSpec[];
}

export interface BookingRecord {
  code: string;
  items: string;
  shortItems?: string;
  detailItems?: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  total: number;
  status: "Pending" | "Approved" | "Picked Up" | "Completed" | "Cancelled";
  timeline: {
    title: string;
    detail: string;
    done: boolean;
  }[];
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    codeId: "6500a1b2c3d4e5f678905678",
    name: "Tenda Dome 4 Orang",
    category: "tenda",
    categoryLabel: "Tenda",
    price: 75000,
    available: true,
    stock: 3,
    bgPastel: "bg-[#9dc4b1]",
    image: "/TendaDome4orang.jpg",
    type: "tent",
    specs: [
      { label: "Kapasitas", value: "4 orang" },
      { label: "Berat", value: "3,8 kg" },
      { label: "Lapisan", value: "Double layer" },
      { label: "Anti air", value: "3000 mm" },
    ],
  },
  {
    id: "p2",
    codeId: "6500a1b2c3d4e5f678905679",
    name: "Sleeping Bag Mummy",
    category: "sleeping",
    categoryLabel: "Sleeping Gear",
    price: 25000,
    available: true,
    stock: 5,
    bgPastel: "bg-[#ecd292]",
    image: "/SleepingBagMummy.jpg",
    type: "sleeping",
    specs: [
      { label: "Kapasitas", value: "1 orang" },
      { label: "Berat", value: "0,9 kg" },
      { label: "Lapisan", value: "Polar fleece tebal" },
      { label: "Suhu min", value: "10°C" },
    ],
  },
  {
    id: "p3",
    codeId: "6500a1b2c3d4e5f678905680",
    name: "Kompor Portable",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 15000,
    available: false,
    stock: 0,
    bgPastel: "bg-[#f2a99b]",
    image: "/KomporPortabel.jpg",
    type: "stove",
    specs: [
      { label: "Bahan", value: "Stainless Steel" },
      { label: "Berat", value: "450 gram" },
      { label: "Pemantik", value: "Piezo elektrik" },
      { label: "Pelindung", value: "Windproof lotus" },
    ],
  },
  {
    id: "p4",
    codeId: "6500a1b2c3d4e5f678905681",
    name: "Lampu Tenda LED",
    category: "lighting",
    categoryLabel: "Lighting",
    price: 10000,
    available: true,
    stock: 8,
    bgPastel: "bg-[#9fc3d9]",
    image: "/LampuLed.jpg",
    type: "light",
    specs: [
      { label: "Baterai", value: "2400 mAh" },
      { label: "Mode", value: "3 mode cahaya" },
      { label: "Fitur", value: "USB Rechargeable" },
      { label: "Daya tahan", value: "12 jam" },
    ],
  },
  {
    id: "p5",
    codeId: "6500a1b2c3d4e5f678905682",
    name: "Carrier 60L",
    category: "carrier",
    categoryLabel: "Lainnya",
    price: 35000,
    available: true,
    stock: 4,
    bgPastel: "bg-[#c9bfdb]",
    image: "/TasCarrier60L.jpg",
    type: "backpack",
    specs: [
      { label: "Kapasitas", value: "60 Liter" },
      { label: "Berat", value: "1,6 kg" },
      { label: "Rangka", value: "Aluminium alloy" },
      { label: "Fitur", value: "Include Rain Cover" },
    ],
  },
  {
    id: "p6",
    codeId: "6500a1b2c3d4e5f678905683",
    name: "Set Nesting Masak",
    category: "cooking",
    categoryLabel: "Cooking",
    price: 12000,
    available: true,
    stock: 6,
    bgPastel: "bg-[#ccd99f]",
    image: "/SetNestingMasak.jpg",
    type: "nesting",
    specs: [
      { label: "Isi set", value: "2 Panci + 1 Wajan" },
      { label: "Bahan", value: "Anodized aluminium" },
      { label: "Pegangan", value: "Anti-panas lipat" },
      { label: "Kapasitas", value: "3-4 orang" },
    ],
  },
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    code: "BK-0128",
    items: "Tenda Dome 4 Orang, Lampu LED",
    detailItems: "Tenda Dome 4 Orang, Lampu Tenda LED",
    shortItems: "Tenda Dome 4P, Lampu LED",
    period: "28–30 Sep 2026",
    startDate: "28 Sep 2026",
    endDate: "30 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 255000,
    status: "Pending",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "28 Sep 2026, 09:12 · Menunggu konfirmasi admin",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "Menunggu",
        done: false,
      },
      {
        title: "Alat diambil",
        detail: "Menunggu",
        done: false,
      },
      {
        title: "Alat dikembalikan",
        detail: "Menunggu",
        done: false,
      },
    ],
  },
  {
    code: "BK-0121",
    items: "Sleeping Bag Mummy ×2",
    shortItems: "Sleeping Bag Mummy ×2",
    period: "20–22 Sep 2026",
    startDate: "20 Sep 2026",
    endDate: "22 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 100000,
    status: "Approved",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "20 Sep 2026, 10:15 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "20 Sep 2026, 11:30 · Siap diambil di basecamp",
        done: true,
      },
      {
        title: "Alat diambil",
        detail: "Menunggu",
        done: false,
      },
      {
        title: "Alat dikembalikan",
        detail: "Menunggu",
        done: false,
      },
    ],
  },
  {
    code: "BK-0117",
    items: "Carrier 60L",
    shortItems: "Carrier 60L",
    period: "14–17 Sep 2026",
    startDate: "14 Sep 2026",
    endDate: "17 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 105000,
    status: "Picked Up",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "14 Sep 2026, 08:20 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "14 Sep 2026, 09:00 · Terkonfirmasi",
        done: true,
      },
      {
        title: "Alat diambil",
        detail: "14 Sep 2026, 14:00 · Fisik unit lengkap & lulus cek",
        done: true,
      },
      {
        title: "Alat dikembalikan",
        detail: "Menunggu",
        done: false,
      },
    ],
  },
  {
    code: "BK-0102",
    items: "Set Nesting Masak",
    shortItems: "Set Nesting Masak",
    period: "02–04 Sep 2026",
    startDate: "02 Sep 2026",
    endDate: "04 Sep 2026",
    location: "Kantor CampRent, Denpasar",
    total: 36000,
    status: "Completed",
    timeline: [
      {
        title: "Booking dibuat",
        detail: "02 Sep 2026, 09:00 · Berhasil dicatat",
        done: true,
      },
      {
        title: "Disetujui admin",
        detail: "02 Sep 2026, 09:45 · Terkonfirmasi",
        done: true,
      },
      {
        title: "Alat diambil",
        detail: "02 Sep 2026, 13:00 · Selesai serah terima",
        done: true,
      },
      {
        title: "Alat dikembalikan",
        detail: "04 Sep 2026, 17:30 · Unit bersih & deposit kembali",
        done: true,
      },
    ],
  },
];

export function getStoredBookings(): BookingRecord[] {
  if (typeof window !== "undefined") {
    try {
      const data = localStorage.getItem("camprent_bookings");
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_BOOKINGS;
}

export function saveStoredBookings(bookings: BookingRecord[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("camprent_bookings", JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }
}
