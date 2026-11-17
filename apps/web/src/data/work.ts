// `current` marks the job held now: its end date is shown as "Now".
export const work = [
  {
    company: "DocuBook",
    href: "https://docubook.pro/",
    badges: [],
    location: "Remote",
    title: "Founder",
    logoUrl: "/icon/docu.svg",
    start: "November 2024",
    end: "Until Now",
    current: true,
    description:
      "Open-source tools for creating, managing, and publishing modern developer documentation. — now my full-time work.",
  },
  {
    company: "Addons Sejoli Pro",
    href: "https://addonsejoli.pro/",
    badges: [],
    location: "Remote",
    title: "Freelance User Guides",
    logoUrl: "/addonspro.png",
    start: "January 2022",
    end: "Sept 2026",
    current: false,
    description:
      "Addons Pro is an agency that operates in the field of creating WordPress plugins to complete the functions of the Sejoli plugin. My job is to create product usage documentation related to plugins.",
  },
  {
    company: "PT Albany Corona Lestari",
    href: "#",
    badges: [],
    location: "Remote",
    title: "Maintenance",
    logoUrl: "/acl.png",
    start: "March 2018",
    end: "August 2026",
    current: false,
    description:
      "Tasked with building maintenance and repairs for Indomaret stores including CCTV, alarms and building facilities, both electrical and civil.",
  },
  {
    company: "PT Indomarco Prismatama",
    badges: [],
    href: "#",
    location: "Remote",
    title: "Electronic Data Processing",
    logoUrl: "/indomaret.png",
    start: "July 2015",
    end: "March 2018",
    current: false,
    description:
      "Managed and monitored the network link from Indomaret stores to the branch server: MikroTik routing, L2TP tunnels, and VSAT for stores with no wired path, so POS, CCTV, and alarm stayed connected.",
  },
] as const;
