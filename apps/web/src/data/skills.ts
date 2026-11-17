export const skills = {
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
} as const;
