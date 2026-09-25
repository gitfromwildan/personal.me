import { Icons } from "@/components/icons";
import { HomeIcon, PencilLineIcon } from "lucide-react";

export const DATA = {
  name: "Wildan Nursahidan",
  initials: "WNN",
  url: "https://wildan.dev",
  location: "West Java, Indonesia",
  locationLink: "https://www.google.com/maps/place/indonesia",
  description:
    "IT Support 11 Years Exp. Preventive maintenance & troubleshooting for CCTV, alarm, network, and facility management — now full-time on open source project.",
  summary: `Nothing takes a store offline faster than a dead L2TP tunnel between the branch server and the building — POS, CCTV, and alarm go dark at once. That's the infrastructure layer I've owned for 11 years: MikroTik routers, server-to-store links, and the preventive checkups that stop them failing in the first place. Now building [DocuBook](https://github.com/DocuBook) full-time.`,
  avatarUrl: "/me.png",
  skills: {
    "IT Support & Network": [
      {
        name: "Network Troubleshooting",
        description:
          "Tracing link loss from the branch server down to the faulty hop, instead of guessing from the store side.",
        percentage: 92,
      },
      {
        name: "VSAT (XPoll & Repointing)",
        description:
          "XPoll VSAT links for stores with no wired path to the branch: install, point, and keep online — plus repoint after drift or storms, signal check on azimuth and elevation until the link locks again.",
        percentage: 90,
      },
      {
        name: "Preventive Maintenance",
        description:
          "Scheduled checks across stores, catching CCTV, alarm, and network faults before they turn into downtime.",
        percentage: 95,
      },
      {
        name: "CCTV & Alarm Systems",
        description:
          "Install, wire, and repair — plus the first checks when a camera or sensor goes dark.",
        percentage: 90,
      },
      {
        name: "MikroTik",
        description:
          "RouterOS for branch links: routing, tunneling, and remote access.",
        percentage: 90,
      },
      {
        name: "L2TP & Tunneling",
        description:
          "Keeping the server-to-building tunnel up so POS, CCTV, and alarm stay online.",
        percentage: 88,
      },
      {
        name: "Facility Management",
        description: "Electrical and civil upkeep across retail sites.",
        percentage: 85,
      },
    ],
    Software: [
      {
        name: "TypeScript",
        description:
          "Types-first React and Node code, strict mode by default. No `any` unless there is no way out.",
        percentage: 90,
      },
      {
        name: "React",
        description:
          "Component architecture, hooks, and state management for real projects, not demos.",
        percentage: 88,
      },
      {
        name: "Tailwind CSS",
        description:
          "Utility-first styling, from design tokens to dark mode, without orphan CSS files.",
        percentage: 85,
      },
      {
        name: "JavaScript",
        description:
          "The language under everything else, running on both browser and server.",
        percentage: 80,
      },
      {
        name: "Node.js",
        description: "Tooling, scripting, and small backend services.",
        percentage: 75,
      },
      {
        name: "Bun",
        description: "Package manager, runtime, and test runner for local dev.",
        percentage: 65,
      },
    ],
  },
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: PencilLineIcon, label: "Blog" },
  ],
  contact: {
    email: "email@wildan.dev",
    tel: "+6285186666941",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/gitfromwildan",
        icon: Icons.github,
        navbar: true,
      },
      Telegram: {
        name: "Telegram",
        url: "https://www.threads.com/@wildan.nrs",
        icon: Icons.x,
        navbar: false,
      },
      Youtube: {
        name: "Youtube",
        url: "https://www.youtube.com/@wildandotdev",
        icon: Icons.youtube,
        navbar: true,
      },
      Email: {
        name: "Send Email",
        url: "mailto:email@wildan.dev",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "DocuBook",
      href: "https://docu.wildan.dev/",
      badges: [],
      location: "Remote",
      title: "Founder",
      logoUrl: "/icon/docu.svg",
      start: "November 2024",
      end: "Until Now",
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
      description:
        "Actually, until now I am still working under the Indomaret group company. However, my current job is managing and monitoring the network interface from the Indomaret store to the branch server.",
    },
  ],
  // Just a list of repos — title, description, language, stars, and link
  // are fetched from the GitHub API (see src/lib/github.ts).
  projects: [
    "DocuBook/docubook",
    "DocuBook/editor",
    "rustasea/rustasea.github.io",
    "rustasea/framework",
  ],
} as const;
