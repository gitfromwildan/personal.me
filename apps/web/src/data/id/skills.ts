// The skill groups, with the same levels as in ../skills.ts.
export const skills = {
  "IT Support & Jaringan": [
    {
      name: "Troubleshooting Jaringan",
      description:
        "Melacak putusnya link dari server cabang sampai ke hop yang bermasalah, bukan menebak dari sisi toko.",
      percentage: 92,
    },
    {
      name: "VSAT (XPoll & Repointing)",
      description:
        "Link VSAT XPoll untuk toko tanpa jalur kabel ke cabang: pasang, arahkan, dan jaga tetap online — termasuk repoint setelah bergeser atau badai, cek sinyal pada azimut dan elevasi sampai link terkunci lagi.",
      percentage: 90,
    },
    {
      name: "Perawatan Preventif",
      description:
        "Pemeriksaan terjadwal di seluruh toko, menangkap gangguan CCTV, alarm, dan jaringan sebelum menjadi downtime.",
      percentage: 95,
    },
    {
      name: "Sistem CCTV & Alarm",
      description:
        "Pemasangan, pengkabelan, dan perbaikan — termasuk pemeriksaan pertama saat kamera atau sensor mati.",
      percentage: 90,
    },
    {
      name: "MikroTik",
      description:
        "RouterOS untuk link cabang: routing, akses jarak jauh, dan tunneling L2TP — menjaga tunnel server ke gedung tetap hidup agar POS, CCTV, dan alarm tetap online.",
      percentage: 90,
    },
    {
      name: "Pengelolaan Fasilitas",
      description: "Perawatan kelistrikan dan sipil di berbagai lokasi ritel.",
      percentage: 85,
    },
  ],
  Software: [
    {
      name: "TypeScript",
      description:
        "Kode React dan Node yang mengutamakan tipe, strict mode sejak awal. Tanpa `any` kecuali memang tidak ada jalan lain.",
      percentage: 90,
    },
    {
      name: "React",
      description:
        "Arsitektur komponen, hooks, dan pengelolaan state untuk proyek nyata, bukan demo.",
      percentage: 88,
    },
    {
      name: "Tailwind CSS",
      description:
        "Styling utility-first, dari design token sampai dark mode, tanpa file CSS yatim.",
      percentage: 85,
    },
    {
      name: "JavaScript",
      description: "Bahasa di balik semuanya, berjalan di browser maupun server.",
      percentage: 80,
    },
    {
      name: "Node.js",
      description: "Tooling, scripting, dan layanan backend kecil.",
      percentage: 75,
    },
    {
      name: "Bun",
      description: "Package manager, runtime, dan test runner untuk pengembangan lokal.",
      percentage: 65,
    },
  ],
};
