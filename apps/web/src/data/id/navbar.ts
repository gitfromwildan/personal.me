import { navbar as en } from "../navbar";

// The Indonesian pages live under /id.
export const navbar = [
  { ...en[0], href: "/id", label: "Beranda" },
  { ...en[1], href: "/id/blog", label: "Blog" },
] as const;
