import { hero as en } from "../hero";

export const hero = {
  ...en,
  status: "Terbuka untuk proyek",
  headline: ["IT support yang menjaga bisnis Anda tetap online.", "Dan perangkat open source."],
  subhead:
    "Perawatan preventif & troubleshooting CCTV, alarm, jaringan, dan pengelolaan fasilitas — kini penuh waktu di DocuBook, framework dokumentasi open source.",
  cta: "Lihat yang sedang saya bangun",
  hire: { ...en.hire, label: "Rekrut saya" },
  facts: [
    { key: "Peran", value: "IT Support → Developer open source" },
    { key: "Di lapangan", value: "11 tahun, sejak 2015" },
  ],
};
