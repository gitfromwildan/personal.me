// The small labels the components put around the copy, and what assistive technology reads.
// Those with a {name} in them are filled in by vue-i18n: t("ui.skillsCount", { count: 6 }).
export const ui = {
  eyebrows: {
    about: "About",
    work: "Work experience",
    skills: "Skills",
    projects: "Open source",
    contact: "Contact",
  },
  now: "Now",
  skillsCount: "{count} skills",
  commits: {
    label: "GitHub commits",
    unit: "commits, all-time",
    more: "View on GitHub",
    unknown: "An unknown number of",
  },
  projects: { stars: "stars", forks: "forks", lastCommit: "last commit" },
  latest: "Latest",
  ago: { today: "today", days: "{n}d ago", months: "{n}mo ago", years: "{n}y ago" },
  bubble: { pop: "Pop the bubble", gather: "Gather the bubbles" },
  breadcrumb: "Breadcrumb",
  dock: {
    main: "Main",
    theme: "Theme",
    // The language switch is named after the language it leads to.
    language: "Bahasa Indonesia",
    languageCode: "ID",
  },
} as const;
