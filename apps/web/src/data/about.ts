export const about = {
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
} as const;
