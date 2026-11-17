export const about = {
  lead: "A store runs on one link: the L2TP tunnel from its MikroTik router to the branch server. When it drops, POS, CCTV, and alarm drop with it.",
  body: "I have kept that layer up across Indomaret stores for 11 years: routing and remote access on RouterOS, VSAT links where no cable reaches, and scheduled checks on CCTV, alarm, and network before a fault turns into downtime.",
  owned: {
    label: "Owned · 2015–2026",
    systems: [
      "RouterOS routing & L2TP tunnels",
      "VSAT links where cable can't reach",
      "Scheduled CCTV, alarm & network checks",
    ],
    stayedUpLabel: "So these stayed up",
    stayedUp: ["POS", "CCTV", "Alarm"],
  },
} as const;
