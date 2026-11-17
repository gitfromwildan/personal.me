export const hero = {
  status: "Available for hire",
  headline: ["IT support that keeps your business online.", "And Dev open-source tools."],
  subhead:
    "Preventive maintenance & troubleshooting for CCTV, alarm, network, and facility management — now full-time on DocuBook, an open-source documentation framework.",
  cta: "See what I'm building",
  // The second button. `icon` is a name from components/ui/icons.ts.
  hire: {
    label: "Hire me",
    url: "https://fastwork.id/user/gitfromwildan?byob=j8P5JPQuQp&source=byob",
    icon: "heart-handshake",
  },
  // The profile strip adds a third fact, "Now", from the first entry in `work`.
  facts: [
    { key: "Role", value: "IT Support → Open source Dev" },
    { key: "In the field", value: "11 years, since 2015" },
  ],
} as const;
