// -------------------------------------------------------------
// Ogi Resto - Initial Data & Presets (Model)
// -------------------------------------------------------------

export const INITIAL_MENUS = [
  // 1. KARBOHIDRAT
  { id: "m-1", name: "Nasi 1 Porsi", price: 5000, category: "Karbohidrat" },
  { id: "m-2", name: "Nasi 1/2 Porsi", price: 3000, category: "Karbohidrat" },
  { id: "m-14", name: "Mie goreng", price: 3000, category: "Karbohidrat" },
  { id: "m-36", name: "Kwetiau goreng", price: 3000, category: "Karbohidrat" },
  { id: "m-37", name: "Bihun goreng", price: 3000, category: "Karbohidrat" },
  {
    id: "m-30",
    name: "Sambal goreng kentang",
    price: 3000,
    category: "Karbohidrat",
  },
  { id: "m-31", name: "Kentang mustopa", price: 3000, category: "Karbohidrat" },

  // 2. SAYUR
  { id: "m-3", name: "Oseng tahu", price: 3000, category: "Sayur" },
  { id: "m-4", name: "Oseng kangkung", price: 3000, category: "Sayur" },
  { id: "m-5", name: "Lodeh nangka", price: 3000, category: "Sayur" },
  { id: "m-6", name: "Capcay", price: 3000, category: "Sayur" },
  { id: "m-7", name: "Oseng tahu sawi ijo", price: 3000, category: "Sayur" },
  { id: "m-8", name: "Oseng kacang", price: 3000, category: "Sayur" },
  { id: "m-9", name: "Oseng labu siam", price: 3000, category: "Sayur" },
  { id: "m-10", name: "Oseng tahu toge", price: 3000, category: "Sayur" },
  { id: "m-11", name: "Oseng pare", price: 3000, category: "Sayur" },
  { id: "m-12", name: "Bening bayam", price: 3000, category: "Sayur" },
  { id: "m-13", name: "Sayur sop", price: 3000, category: "Sayur" },
  { id: "m-34", name: "Terong balado", price: 3000, category: "Sayur" },
  { id: "m-35", name: "Semur jengkol", price: 4000, category: "Sayur" },

  // 3. LAUK
  { id: "m-15", name: "Rendang daging", price: 8000, category: "Lauk" },
  { id: "m-16", name: "Orek tempe", price: 3000, category: "Lauk" },
  { id: "m-17", name: "Kikil", price: 3000, category: "Lauk" },
  { id: "m-18", name: "Usus", price: 3000, category: "Lauk" },
  { id: "m-19", name: "Telur balado", price: 4000, category: "Lauk" },
  { id: "m-20", name: "Telur ceplok", price: 4000, category: "Lauk" },
  { id: "m-21", name: "Telur dadar", price: 4000, category: "Lauk" },
  { id: "m-22", name: "Ayam balado", price: 8000, category: "Lauk" },
  { id: "m-23", name: "Ati balado", price: 5000, category: "Lauk" },
  { id: "m-24", name: "Cue tongkol", price: 4000, category: "Lauk" },
  { id: "m-25", name: "Lele goreng", price: 6000, category: "Lauk" },
  { id: "m-26", name: "Bawal goreng", price: 6000, category: "Lauk" },
  { id: "m-27", name: "Bandeng goreng", price: 6000, category: "Lauk" },
  { id: "m-28", name: "Cumi balado", price: 5000, category: "Lauk" },
  { id: "m-29", name: "Teri kering balado", price: 3000, category: "Lauk" },
  { id: "m-32", name: "Tahu bacem", price: 2000, category: "Lauk" },
  { id: "m-33", name: "Tempe bacem", price: 2000, category: "Lauk" },
  { id: "m-38", name: "Ayam kecap", price: 8000, category: "Lauk" },
  { id: "m-25-b", name: "Lele balado", price: 6000, category: "Lauk" },
  { id: "m-39", name: "Bawal balado", price: 6000, category: "Lauk" },
  { id: "m-40", name: "Tumis asin japu", price: 4000, category: "Lauk" },
  { id: "m-41", name: "Rica-rica ayam", price: 5000, category: "Lauk" },
  { id: "m-42", name: "Tahu goreng", price: 2000, category: "Lauk" },
  { id: "m-43", name: "Tempe goreng", price: 2000, category: "Lauk" },
  { id: "m-44", name: "Gorengan", price: 2000, category: "Lauk" },
  { id: "m-46", name: "Opor Ayam", price: 8000, category: "Lauk" },
  { id: "m-47", name: "Ayam Goreng", price: 8000, category: "Lauk" },

  // 4. ALAT MAKAN
  { id: "m-45", name: "Sendok", price: 0, category: "Alat Makan" },
];

export const DAYS_LIST = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

export const PRESET_COMPANIES = ["PT BMT"];

export const PRESET_DIVISIONS = [
  "PMC",
  "FINANCE",
  "BPM",
  "QUALITY",
  "PE",
  "LOGISTIC",
  "PRODUCTION",
  "HR",
  "ME",
  "WAREHOUSE",
  "COTG",
  "MINOS",
];

export const PRESET_LOCATIONS = ["Office", "Lantai 2 Gedung KD"];

export function getMenuIcon(category) {
  if (category === "Lauk") return "🥟";
  if (category === "Karbohidrat") return "🥢";
  if (category === "Sayur") return "🥗";
  if (category === "Alat Makan") return "🥄";
  return "🍽️";
}

export function formatRupiah(num, allowFree = false) {
  if (num === 0 && allowFree) return "Gratis";
  return "Rp " + Number(num || 0).toLocaleString("id-ID");
}

export const CATEGORY_ORDER = {
  Karbohidrat: 1,
  Sayur: 2,
  Lauk: 3,
  "Alat Makan": 4,
};

export function parseMenuId(id) {
  if (typeof id !== "string") return { num: 999999, suffix: "" };
  const match = id.match(/^m-(\d+)(.*)$/i);
  if (match) {
    return {
      num: parseInt(match[1], 10),
      suffix: match[2] || "",
    };
  }
  return { num: 999999, suffix: id };
}

/**
 * Pengurutan Pintar (Natural Category & Numerical ID Sort):
 * 1. Urutkan berdasarkan kelompok kategori: Karbohidrat -> Sayur -> Lauk -> Alat Makan
 * 2. Di dalam kategori yang sama, urutkan berdasarkan angka ID secara alami (contoh: m-3 < m-31)
 */
export function sortMenusNaturally(menuList) {
  if (!Array.isArray(menuList)) return [];
  return [...menuList].sort((a, b) => {
    const catA = CATEGORY_ORDER[a.category] || 99;
    const catB = CATEGORY_ORDER[b.category] || 99;
    if (catA !== catB) {
      return catA - catB;
    }

    const idA = parseMenuId(a.id);
    const idB = parseMenuId(b.id);
    if (idA.num !== idB.num) {
      return idA.num - idB.num;
    }
    return idA.suffix.localeCompare(idB.suffix);
  });
}
