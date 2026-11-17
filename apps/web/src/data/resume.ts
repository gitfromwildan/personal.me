export const DATA = {
  name: "Wildan Nursahidan",
  initials: "WNN",
  url: "https://wildan.dev",
  location: "West Java, Indonesia",
  locationLink: "https://www.google.com/maps/place/indonesia",
  description:
    "IT Support 11 Years Exp. Preventive maintenance & troubleshooting for CCTV, alarm, network, and facility management — now full-time on open source project.",
  avatarUrl: "/favicon.ico",
  hero: {
    status: "Available for hire",
    headline: ["IT support that keeps your stores online.", "And open-source tools."],
    subhead:
      "Preventive maintenance & troubleshooting for CCTV, alarm, network, and facility management — now full-time on DocuBook, an open-source documentation framework.",
    cta: "See what I'm building",
    // The profile strip adds a third fact, "Now", from the first entry in `work`.
    facts: [
      { key: "Role", value: "IT Support → Open source" },
      { key: "In the field", value: "11 years, since 2015" },
    ],
  },
  about: {
    lead: "Nothing takes a store offline faster than a dead L2TP tunnel between the branch server and the building — POS, CCTV, and alarm go dark at once.",
    body: "That's the infrastructure layer I've owned for 11 years: MikroTik routers, server-to-store links, and the preventive checkups that stop them failing in the first place.",
    // The chip links to the first entry in `work`.
    now: "Now building DocuBook full-time",
    owned: {
      label: "Owned · 2015–2026",
      systems: ["MikroTik routers", "Server-to-store links", "Preventive checkups"],
      stayedUpLabel: "So these stayed up",
      stayedUp: ["POS", "CCTV", "Alarm"],
    },
  },
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
          "RouterOS for branch links: routing, remote access, and L2TP tunneling — keeping the server-to-building tunnel up so POS, CCTV, and alarm stay online.",
        percentage: 90,
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
        description: "The language under everything else, running on both browser and server.",
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
  // `icon` values are names from components/ui/icons.ts.
  navbar: [
    { href: "/", label: "Home", icon: "house" },
    { href: "/blog", label: "Blog", icon: "pencil-line" },
  ],
  contact: {
    tel: "+6285186666941",
    title: "Get in touch.",
    body: "Want to chat? Send me a direct question on Threads and I'll respond whenever I can. I will ignore all soliciting.",
    cta: "Message me on Threads",
    // Listed in this order in the contact section; `navbar` entries also show in the dock.
    social: {
      Threads: {
        name: "Threads",
        icon: "at-sign",
        handle: "@wildan.nrs",
        url: "https://www.threads.com/@wildan.nrs",
        navbar: false,
      },
      GitHub: {
        name: "GitHub",
        icon: "github-logo",
        handle: "gitfromwildan",
        url: "https://github.com/gitfromwildan",
        navbar: true,
      },
      YouTube: {
        name: "YouTube",
        icon: "youtube-logo",
        handle: "@wildandotdev",
        url: "https://www.youtube.com/@wildandotdev",
        navbar: true,
      },
      Email: {
        name: "Email",
        icon: "mail",
        handle: "email@wildan.dev",
        url: "mailto:email@wildan.dev",
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
  projects: {
    title: "What I'm building",
    sub: "Built and maintained in public — the details come straight from GitHub.",
    // Shown on the first repo, the featured one.
    preview: "/docubook-home.png",
    // Only the names: description, language, stars, forks and last commit come from the GitHub API
    // (composables/useGithub.ts).
    repos: [
      "DocuBook/docubook",
      "DocuBook/editor",
      "rustasea/rustasea.github.io",
      "rustasea/framework",
    ],
  },
} as const;
