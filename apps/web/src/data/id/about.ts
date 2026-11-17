import { about as en } from "../about";

export const about = {
  ...en,
  lead: "Satu toko bergantung pada satu jalur: tunnel L2TP dari router MikroTik ke server cabang. Begitu putus, POS, CCTV, dan alarm ikut putus.",
  body: "Lapisan itu yang saya jaga di toko-toko Indomaret selama 11 tahun: routing dan remote access di RouterOS, link VSAT untuk toko yang tidak terjangkau kabel, dan pemeriksaan terjadwal CCTV, alarm, dan jaringan sebelum gangguan berubah jadi downtime.",
  owned: {
    label: "Dipegang · 2015–2026",
    systems: [
      "Routing & tunnel L2TP di RouterOS",
      "Link VSAT untuk toko tanpa jalur kabel",
      "Pemeriksaan terjadwal CCTV, alarm & jaringan",
    ],
    stayedUpLabel: "Agar ini tetap menyala",
    stayedUp: en.owned.stayedUp,
  },
};
