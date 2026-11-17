import { work as en } from "../work";

// The same jobs, in the same order: only what is said about them changes.
const said = [
  {
    location: "Remote",
    title: "Founder",
    start: "November 2024",
    end: "Sampai sekarang",
    description:
      "Perangkat open source untuk membuat, mengelola, dan menerbitkan dokumentasi developer modern — kini pekerjaan penuh waktu saya.",
  },
  {
    location: "Remote",
    title: "Penulis Panduan Pengguna (Freelance)",
    start: "Januari 2022",
    end: "September 2026",
    description:
      "Addons Pro adalah agensi pembuat plugin WordPress yang melengkapi fungsi plugin Sejoli. Tugas saya menulis dokumentasi penggunaan produk untuk plugin-plugin tersebut.",
  },
  {
    location: "Remote",
    title: "Maintenance",
    start: "Maret 2018",
    end: "Agustus 2026",
    description:
      "Bertugas merawat dan memperbaiki bangunan toko Indomaret, termasuk CCTV, alarm, dan fasilitas gedung, baik kelistrikan maupun sipil.",
  },
  {
    location: "Remote",
    title: "Electronic Data Processing",
    start: "Juli 2015",
    end: "Maret 2018",
    description:
      "Sebenarnya sampai sekarang saya masih bekerja di bawah grup perusahaan Indomaret. Pekerjaan saya saat ini adalah mengelola dan memantau antarmuka jaringan dari toko Indomaret ke server cabang.",
  },
];

export const work = en.map((job, i) => ({ ...job, ...said[i] }));
