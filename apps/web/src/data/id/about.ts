import { about as en } from "../about";

export const about = {
  ...en,
  lead: "Tidak ada yang membuat toko offline lebih cepat daripada tunnel L2TP yang mati antara server cabang dan gedung — POS, CCTV, dan alarm padam sekaligus.",
  body: "Itulah lapisan infrastruktur yang saya pegang selama 11 tahun: router MikroTik, jalur server ke toko, dan pemeriksaan preventif yang mencegahnya gagal sejak awal.",
  now: "Kini membangun DocuBook penuh waktu",
  owned: {
    label: "Dipegang · 2015–2026",
    systems: ["Router MikroTik", "Jalur server ke toko", "Pemeriksaan preventif"],
    stayedUpLabel: "Agar ini tetap menyala",
    stayedUp: en.owned.stayedUp,
  },
};
